import { io } from "socket.io-client";

const URL = "http://localhost:3000";

function connect() {
  return new Promise((resolve) => {
    const s = io(URL, { path: "/socket.io", transports: ["websocket"] });
    s.on("connect", () => resolve(s));
  });
}
function emit(socket, event, payload) {
  return new Promise((resolve) => socket.emit(event, payload, resolve));
}
function makeClient(socket, name) {
  const client = { socket, name, public: null, private: null };
  socket.on("state:public", (s) => (client.public = s));
  socket.on("state:private", (s) => (client.private = s));
  socket.on("room:error", (e) => console.log(`  [${name}] room:error`, e.errorCode));
  return client;
}
function waitFor(client, predicate, timeoutMs = 8000, label = "") {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const iv = setInterval(() => {
      if (client.public && predicate(client.public)) {
        clearInterval(iv);
        resolve(client.public);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(iv);
        reject(new Error(`timeout waiting for ${label}. phase=${client.public?.phase} day=${client.public?.day}`));
      }
    }, 30);
  });
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
// 自然解決を少し待ち、間に合わなければホストの「強制進行」操作にフォールバックする。
// (実際のホストも、反応がない参加者を待たずにこれらのボタンを押せるので、テストとしても妥当)
async function waitOrForce(hostClient, predicate, forceEvent, { softTimeout = 3000, hardTimeout = 10000, label = "" } = {}) {
  try {
    return await waitFor(hostClient, predicate, softTimeout, label);
  } catch {
    if (forceEvent) hostClient.socket.emit(forceEvent, {});
    return await waitFor(hostClient, predicate, hardTimeout, label + " (after force fallback)");
  }
}
function nameFor(i) {
  return "P" + (i + 1);
}

// 投票により追放が決定すると "最後の一言"(last_words) -> "生存決選投票"(appeal_vote) を
// 経由するようになった。汎用進行ループでは誰も決選投票をしないまま
// host:forceResolveAppealVote で締め切り、「同数はタイなので処刑」ルールにより
// 元々投票で決まった対象がそのまま処刑される(=旧来のexecution_resultへの直行と同じ結果になる)。
// なお、決選投票の結果ハンターが実際に処刑された場合はそのままハンターの道連れ待ちに
// 一時停止する(awaitingHunterRevengeはphaseとは独立したフラグ)ため、ここでも解消する。
async function autoResolveExecutionFlow(clients, hostClient) {
  if (hostClient.public.phase === "last_words") {
    hostClient.socket.emit("lastWords:proceed", {});
    await waitOrForce(
      hostClient,
      (s) => s.phase === "appeal_vote" || s.phase === "execution_result" || s.phase === "game_over",
      null,
      { label: "appeal_vote after last_words" }
    );
  }
  if (hostClient.public.phase === "appeal_vote") {
    hostClient.socket.emit("host:forceResolveAppealVote", {});
    await waitFor(
      hostClient,
      (s) => s.phase === "execution_result" || s.phase === "game_over" || !!s.awaitingHunterRevenge,
      5000,
      "execution_result after appeal_vote"
    );
  }
  if (hostClient.public.awaitingHunterRevenge) {
    const hId = hostClient.public.awaitingHunterRevenge.hunterId;
    const hClient = clients.find((c) => c.private?.self?.id === hId);
    hClient?.socket.emit("hunter:revenge", { targetId: null });
    await waitOrForce(hostClient, (s) => !s.awaitingHunterRevenge, "host:skipHunterRevenge", {
      label: "hunter revenge cleared(appeal loop)",
    });
    await waitFor(
      hostClient,
      (s) => s.phase === "execution_result" || s.phase === "game_over",
      5000,
      "execution_result after hunter revenge(appeal loop)"
    );
  }
}

async function runOneGame(set) {
  const { n, settings, tag } = set;
  const names = Array.from({ length: n }, (_, i) => nameFor(i));
  const sockets = await Promise.all(names.map(() => connect()));
  const clients = sockets.map((s, i) => makeClient(s, names[i]));
  try {
    return await playGame({ n, settings, tag }, clients);
  } finally {
    // 失敗時もソケットを必ず閉じる(閉じ忘れが後続セットの接続数を圧迫し、
    // 別の原因不明のタイムアウトを誘発しないようにするため)
    for (const c of clients) c.socket.close();
  }
}

async function playGame({ n, settings, tag }, clients) {
  const hostRes = await emit(clients[0].socket, "room:create", { playerName: clients[0].name });
  if (!hostRes.ok) throw new Error("create failed: " + hostRes.errorCode);
  const code = hostRes.code;
  for (let i = 1; i < clients.length; i++) {
    const r = await emit(clients[i].socket, "room:join", { code, playerName: clients[i].name });
    if (!r.ok) throw new Error("join failed: " + r.errorCode);
  }
  await waitFor(clients[0], (s) => s.players.length === n, 5000, "joined");
  // 人数に応じたおすすめ配役をそのまま使う(自動生成、手動編集なし)
  await sleep(150);
  if (clients[0].public.totalSeats !== n) {
    throw new Error(`suggested composition doesn't sum to ${n}: got ${clients[0].public.totalSeats}`);
  }

  clients[0].socket.emit("room:updateSettings", { settings });
  await sleep(150);
  const appliedSettings = clients[0].public.settings;
  for (const [k, v] of Object.entries(settings)) {
    if (appliedSettings[k] !== v) throw new Error(`setting ${k} did not apply: expected ${v}, got ${appliedSettings[k]}`);
  }

  const startRes = await emit(clients[0].socket, "room:start", {});
  if (!startRes.ok) throw new Error("start failed: " + startRes.errorCode + " " + JSON.stringify(startRes.issues));
  await waitFor(clients[0], (s) => s.phase === "role_reveal", 5000, "role_reveal");

  const byRole = {};
  for (const c of clients) {
    const role = c.private?.self?.role;
    c.role = role;
    byRole[role] = byRole[role] || [];
    byRole[role].push(c);
  }
  // 夜アクション持ちの役職(werewolf/seer/bodyguard)は役職確認時点で確定しているので、
  // 各夜フェーズで毎回 privateState.pendingNightAction の到着を待たず、ここで固定して使う
  // (大人数だとブロードキャストの到着タイミングにばらつきが出て、レースになりうるため)。
  const NIGHT_ACTION_ROLES = new Set(["werewolf", "seer", "bodyguard"]);
  const nightActors = clients.filter((c) => NIGHT_ACTION_ROLES.has(c.role));
  const isAlive = (c) => !!c.public.players.find((p) => p.id === c.private?.self?.id)?.alive;

  // --- 役職確認のack待ちゲート: 全員が確認するまで自動でも進まないことを検証 ---
  // 1) 誰かが古いクライアントのつもりでhost:advanceを送っても無視されるはず
  clients[0].socket.emit("host:advance", { to: "discussion" });
  await sleep(200);
  if (clients[0].public.phase !== "role_reveal") {
    throw new Error("REGRESSION: host:advance bypassed the role-ack gate before anyone confirmed");
  }

  // 2) 予言者がいて早期占い設定がONなら、最初にひとつだけ占っておく
  const seer = (byRole["seer"] || [])[0];
  if (settings.seerFirstNightDivine && seer) {
    const target = clients.find((c) => c !== seer);
    seer.socket.emit("seer:earlyDivine", { targetId: target.private.self.id });
    await waitFor(seer, () => !!seer.private?.seerResult && seer.private.seerResult.day === 0, 3000, "early divine result");
    if (seer.private.seerResult.targetId !== target.private.self.id) {
      throw new Error("early divine result target mismatch");
    }
  }

  // 3) 最後の1人以外が確認 -> まだ進まないはず
  for (let i = 0; i < clients.length - 1; i++) {
    clients[i].socket.emit("role:ack", {});
  }
  await sleep(250);
  if (clients[0].public.phase !== "role_reveal") {
    throw new Error("REGRESSION: advanced to discussion before everyone acked their role");
  }
  const progressBefore = clients[0].public.progress;
  if (!progressBefore || progressBefore.submitted !== n - 1 || progressBefore.total !== n) {
    throw new Error("role_reveal progress counter incorrect: " + JSON.stringify(progressBefore));
  }

  // 4) 最後の1人も確認 -> 自動的に最初の話し合い(day0)へ進むはず(ホスト操作なし)
  clients[clients.length - 1].socket.emit("role:ack", {});
  await waitFor(clients[0], (s) => s.phase === "discussion" && s.day === 0, 5000, "auto-advance to day0 after full ack");

  // --- 本当の夜(day1)へ ---
  clients[0].socket.emit("host:advance", { to: "night" });
  await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");

  const wolves = byRole["werewolf"] || [];
  const villagers = byRole["villager"] || [];
  const attackTarget = villagers[0] || clients.find((c) => !wolves.includes(c) && c !== seer);
  for (const w of wolves) {
    w.socket.emit("night:submit", { targetId: attackTarget.private.self.id });
  }
  // 他の夜アクション持ち(予言者・ボディーガード)は全員スキップ(null)submit。
  // 役職は role_reveal 時点で確定済みのnightActorsを使い、pendingNightActionの到着待ちレースを避ける。
  for (const c of nightActors) {
    if (wolves.includes(c)) continue;
    c.socket.emit("night:submit", { targetId: null });
  }
  await waitOrForce(
    clients[0],
    (s) => s.phase === "day_result" || s.phase === "game_over" || !!s.awaitingHunterRevenge,
    "host:forceResolveNight",
    { label: "day_result after night1" }
  );
  // 襲撃対象がハンターだった場合(村人が0人の配役でホスト自身がハンターになるケースなど)、
  // 夜1の解決がハンターの道連れ待ちで一時停止することがある。round-loop側と同様にここでも解消する。
  if (clients[0].public.awaitingHunterRevenge) {
    const hId = clients[0].public.awaitingHunterRevenge.hunterId;
    const hClient = clients.find((c) => c.private?.self?.id === hId);
    hClient?.socket.emit("hunter:revenge", { targetId: null });
    await waitOrForce(clients[0], (s) => !s.awaitingHunterRevenge, "host:skipHunterRevenge", {
      label: "hunter revenge cleared(night1)",
    });
    await waitFor(
      clients[0],
      (s) => s.phase === "day_result" || s.phase === "game_over",
      5000,
      "day_result after night1 hunter revenge"
    );
  }

  if (!settings.allowFirstNightKill) {
    // 「最初の夜は人狼が殺せない」設定: 襲撃対象は生きているはず
    const stillAlive = clients[0].public.players.find((p) => p.id === attackTarget.private.self.id)?.alive;
    if (!stillAlive) {
      throw new Error("REGRESSION: allowFirstNightKill=false but the attack target died on night1");
    }
    const deaths = clients[0].public.lastDeaths ?? [];
    if (deaths.some((d) => d.cause === "attack")) {
      throw new Error("REGRESSION: allowFirstNightKill=false but an attack-caused death was recorded on night1");
    }
  }

  // --- ゲーム終了まで汎用ループで進行(最大25ラウンド) ---
  let rounds = 0;
  const cap = Math.max(25, n * 2);
  while (clients[0].public.phase !== "game_over" && rounds < cap) {
    rounds++;
    if (clients[0].public.phase === "day_result") {
      clients[0].socket.emit("host:advance", { to: "discussion" });
      await waitFor(clients[0], (s) => s.phase === "discussion" || s.phase === "game_over", 5000, "discussion(loop)");
    }
    if (clients[0].public.phase === "discussion") {
      clients[0].socket.emit("host:advance", { to: "vote" });
      await waitFor(clients[0], (s) => s.phase === "vote" || s.phase === "game_over", 5000, "vote(loop)");
    }
    if (clients[0].public.phase === "vote") {
      const aliveVoters = clients.filter((c) => isAlive(c));
      // 同数タイの決選投票中は、対象がrunoffCandidateIdsに限定されているのでそれに合わせる
      const runoffIds = clients[0].public.runoffCandidateIds;
      const targetId = runoffIds && runoffIds.length > 0 ? runoffIds[0] : aliveVoters[0].private.self.id;
      for (const c of aliveVoters) {
        c.socket.emit("vote:submit", { targetId });
      }
      await waitOrForce(
        clients[0],
        (s) => s.phase === "last_words" || s.phase === "execution_result" || s.phase === "game_over",
        "host:forceResolveVote",
        { label: "vote resolved(loop)" }
      );
      await autoResolveExecutionFlow(clients, clients[0]);
    }
    if (clients[0].public.phase === "execution_result") {
      clients[0].socket.emit("host:advance", { to: "night" });
      await waitFor(clients[0], (s) => s.phase === "night" || s.phase === "game_over", 5000, "night(loop)");
    }
    if (clients[0].public.phase === "night") {
      // pendingNightActionの到着待ちレースを避けるため、役職固定のnightActorsに対して
      // 生存確認だけ行い、全員null(見送り)を送信する。
      for (const c of nightActors) {
        if (isAlive(c)) c.socket.emit("night:submit", { targetId: null });
      }
      await waitOrForce(
        clients[0],
        (s) => s.phase !== "night" || s.phase === "game_over",
        "host:forceResolveNight",
        { label: "resolve night(loop)" }
      );
      if (clients[0].public.awaitingHunterRevenge) {
        const hId = clients[0].public.awaitingHunterRevenge.hunterId;
        const hClient = clients.find((c) => c.private?.self?.id === hId);
        hClient?.socket.emit("hunter:revenge", { targetId: null });
        await waitOrForce(clients[0], (s) => !s.awaitingHunterRevenge, "host:skipHunterRevenge", { label: "hunter revenge cleared(loop)" });
      }
    }
  }

  if (clients[0].public.phase !== "game_over") {
    throw new Error(`game did not conclude within ${cap} rounds (n=${n})`);
  }
  const winner = clients[0].public.winner;
  if (!winner || !["village", "werewolf", "draw"].includes(winner.primary)) {
    throw new Error("invalid winner info: " + JSON.stringify(winner));
  }
  if (winner.allRoles.length !== n) {
    throw new Error(`allRoles length mismatch: expected ${n}, got ${winner.allRoles.length}`);
  }
  if (settings.revealRoleOnDeath) {
    const anyRevealed = (clients[0].public.lastDeaths ?? []).some((d) => !!d.revealedRole);
    // 最終ラウンドで死者がいないケースもあるため、これは情報ログのみ(必須アサーションにはしない)
    if (!anyRevealed) console.log(`  (note: revealRoleOnDeath=true but final round had no deaths to check)`);
  }

  return { tag, n, rounds, winner: winner.primary };
}

const MATRIX = [
  { tag: "n4-default", n: 4, settings: { revealRoleOnDeath: false, allowFirstNightKill: true, allowFirstVoteExecution: true, seerFirstNightDivine: false } },
  { tag: "n4-revealOnDeath", n: 4, settings: { revealRoleOnDeath: true, allowFirstNightKill: true, allowFirstVoteExecution: true, seerFirstNightDivine: false } },
  { tag: "n5-earlyDivine", n: 5, settings: { revealRoleOnDeath: false, allowFirstNightKill: true, allowFirstVoteExecution: true, seerFirstNightDivine: true } },
  { tag: "n5-noFirstNightKill", n: 5, settings: { revealRoleOnDeath: false, allowFirstNightKill: false, allowFirstVoteExecution: true, seerFirstNightDivine: false } },
  { tag: "n5-noFirstVoteExecution", n: 5, settings: { revealRoleOnDeath: false, allowFirstNightKill: true, allowFirstVoteExecution: false, seerFirstNightDivine: false } },
  { tag: "n6-default", n: 6, settings: { revealRoleOnDeath: false, allowFirstNightKill: true, allowFirstVoteExecution: true, seerFirstNightDivine: false } },
  { tag: "n6-noFirstNightKill+reveal", n: 6, settings: { revealRoleOnDeath: true, allowFirstNightKill: false, allowFirstVoteExecution: true, seerFirstNightDivine: false } },
  { tag: "n7-earlyDivine+noFirstNightKill", n: 7, settings: { revealRoleOnDeath: false, allowFirstNightKill: false, allowFirstVoteExecution: true, seerFirstNightDivine: true } },
  { tag: "n7-noFirstNightKill+noFirstVoteExecution", n: 7, settings: { revealRoleOnDeath: false, allowFirstNightKill: false, allowFirstVoteExecution: false, seerFirstNightDivine: false } },
  { tag: "n8-default", n: 8, settings: { revealRoleOnDeath: false, allowFirstNightKill: true, allowFirstVoteExecution: true, seerFirstNightDivine: false } },
  { tag: "n9-earlyDivine", n: 9, settings: { revealRoleOnDeath: false, allowFirstNightKill: true, allowFirstVoteExecution: true, seerFirstNightDivine: true } },
  { tag: "n10-default", n: 10, settings: { revealRoleOnDeath: false, allowFirstNightKill: true, allowFirstVoteExecution: true, seerFirstNightDivine: false } },
  { tag: "n10-noFirstVoteExecution+reveal", n: 10, settings: { revealRoleOnDeath: true, allowFirstNightKill: true, allowFirstVoteExecution: false, seerFirstNightDivine: false } },
  { tag: "n12-revealOnDeath", n: 12, settings: { revealRoleOnDeath: true, allowFirstNightKill: true, allowFirstVoteExecution: true, seerFirstNightDivine: false } },
  { tag: "n13-default", n: 13, settings: { revealRoleOnDeath: false, allowFirstNightKill: true, allowFirstVoteExecution: true, seerFirstNightDivine: false } },
  { tag: "n16-earlyDivine", n: 16, settings: { revealRoleOnDeath: false, allowFirstNightKill: true, allowFirstVoteExecution: true, seerFirstNightDivine: true } },
  { tag: "n20-max", n: 20, settings: { revealRoleOnDeath: false, allowFirstNightKill: true, allowFirstVoteExecution: true, seerFirstNightDivine: false } },
];

async function main() {
  console.log(`Running ${MATRIX.length} E2E sets across player counts/settings...\n`);
  const results = [];
  for (const set of MATRIX) {
    process.stdout.write(`[${set.tag}] n=${set.n} settings=${JSON.stringify(set.settings)} ... `);
    const start = Date.now();
    try {
      const r = await runOneGame(set);
      const ms = Date.now() - start;
      console.log(`OK (${ms}ms, ${r.rounds} extra rounds, winner=${r.winner})`);
      results.push({ ...set, ok: true });
    } catch (err) {
      console.log(`FAILED: ${err.message}`);
      results.push({ ...set, ok: false, error: err.message });
    }
  }

  console.log("\n=== SUMMARY ===");
  const failed = results.filter((r) => !r.ok);
  for (const r of results) {
    console.log(`${r.ok ? "✓" : "✗"} ${r.tag}`);
  }
  if (failed.length > 0) {
    console.log(`\n❌ ${failed.length}/${results.length} sets FAILED`);
    for (const f of failed) console.log(`  - ${f.tag}: ${f.error}`);
    process.exit(1);
  } else {
    console.log(`\n✅ ALL ${results.length} E2E SETS PASSED`);
    process.exit(0);
  }
}

main().catch((err) => {
  console.error("\n❌ FATAL:", err);
  process.exit(1);
});
