// 回帰テスト: 人狼の襲撃合意ロジック(Task #27)と、決選投票を経ていないのに
// 「決選投票の結果、生かされました」と表示されてしまうバグ(Task #28)の再発防止用。
// smoke-test.mjs / e2e-matrix.mjs とは別の観点(合意形成・生存決選投票の理由づけ・
// 同数タイの決選投票フロー)にフォーカスした恒久テストスクリプト。
//
// 実行前提: `npx tsx server.ts` が http://localhost:3000 で起動していること。
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
  const c = { socket, name, public: null, private: null };
  socket.on("state:public", (s) => (c.public = s));
  socket.on("state:private", (s) => (c.private = s));
  return c;
}
function waitFor(client, pred, timeoutMs = 8000, label = "") {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const iv = setInterval(() => {
      if (client.public && pred(client.public)) {
        clearInterval(iv);
        resolve(client.public);
      } else if (Date.now() - start > timeoutMs) {
        clearInterval(iv);
        reject(new Error(`timeout: ${label} phase=${client.public?.phase}`));
      }
    }, 50);
  });
}
function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
async function makeRoom(names, roleCounts, settings) {
  const sockets = await Promise.all(names.map(() => connect()));
  const clients = sockets.map((s, i) => makeClient(s, names[i]));
  const hostRes = await emit(clients[0].socket, "room:create", { playerName: "Host" });
  const code = hostRes.code;
  for (let i = 1; i < clients.length; i++) await emit(clients[i].socket, "room:join", { code, playerName: names[i] });
  await waitFor(clients[0], (s) => s.players.length === names.length, 5000, "joined");
  if (settings) {
    clients[0].socket.emit("room:updateSettings", { settings });
    await sleep(150);
  }
  clients[0].socket.emit("room:updateComposition", { roleCounts });
  const total = Object.values(roleCounts).reduce((a, b) => a + b, 0);
  await waitFor(clients[0], (s) => s.totalSeats === total, 3000, "composition");
  const start = await emit(clients[0].socket, "room:start", {});
  if (!start.ok) throw new Error("start failed " + start.errorCode);
  await waitFor(clients[0], (s) => s.phase === "role_reveal", 5000, "role_reveal");
  for (const c of clients) c.socket.emit("role:ack", {});
  await waitFor(clients[0], (s) => s.phase === "discussion" && s.day === 0, 5000, "day0");
  return { clients, code };
}
function byRole(clients, role) {
  return clients.filter((c) => c.private?.self?.role === role);
}
function assert(cond, msg) {
  if (!cond) throw new Error("ASSERTION FAILED: " + msg);
}

async function testWolfConsensus() {
  console.log("\n=== GROUP: wolf attack consensus (2 wolves, disagreement blocks, convergence resolves) ===");
  const { clients } = await makeRoom(
    ["Host", "W1", "W2", "V1", "V2", "V3", "V4", "V5", "V6"],
    { werewolf: 2, villager: 7 }
  );
  clients[0].socket.emit("host:advance", { to: "night" });
  await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
  const [w1, w2] = byRole(clients, "werewolf");
  const villagers = byRole(clients, "villager");

  w1.socket.emit("night:submit", { targetId: villagers[0].private.self.id });
  w2.socket.emit("night:submit", { targetId: villagers[1].private.self.id });
  await sleep(800);
  assert(clients[0].public.phase === "night", "night must NOT resolve while wolves disagree");
  assert(w1.private.pendingNightAction.wolfConsensusReached === false, "wolfConsensusReached must be false on disagreement");
  console.log("PASS: disagreement blocks auto-resolution; wolfConsensusReached=false");

  w2.socket.emit("night:submit", { targetId: villagers[0].private.self.id });
  await waitFor(clients[0], (s) => s.phase === "day_result", 5000, "day_result after consensus");
  assert(
    clients[0].public.lastDeaths.some((d) => d.playerId === villagers[0].private.self.id),
    "the agreed-upon target must have died"
  );
  console.log("PASS: convergence on the same target auto-resolves the night correctly");

  // 通常の1日目投票(誰も処刑対象にせず票を割って全滅回避)を経てから夜2へ進める
  clients[0].socket.emit("host:advance", { to: "discussion" });
  await waitFor(clients[0], (s) => s.phase === "discussion" && s.day === 1, 5000, "discussion1");
  clients[0].socket.emit("host:advance", { to: "vote" });
  await waitFor(clients[0], (s) => s.phase === "vote", 5000, "vote1");
  const alive1 = clients.filter((c) => c.public.players.find((p) => p.id === c.private.self.id)?.alive);
  const voteTarget = villagers.find((v) => v.public.players.find((p) => p.id === v.private.self.id)?.alive);
  for (const c of alive1) c.socket.emit("vote:submit", { targetId: voteTarget.private.self.id });
  await waitFor(clients[0], (s) => s.phase === "last_words" || s.phase === "execution_result", 5000, "post-vote1");
  if (clients[0].public.phase === "last_words") {
    voteTarget.socket.emit("lastWords:proceed", {});
    await waitFor(clients[0], (s) => s.phase === "appeal_vote", 5000, "appeal_vote1");
    const eligible1 = clients.filter(
      (c) => c.public.players.find((p) => p.id === c.private.self.id)?.alive && c.private.self.id !== voteTarget.private.self.id
    );
    for (const c of eligible1) c.socket.emit("appeal:submit", { choice: "execute" });
    await waitFor(clients[0], (s) => s.phase === "execution_result", 5000, "execution_result1");
  }
  clients[0].socket.emit("host:advance", { to: "night" });
  await waitFor(clients[0], (s) => s.phase === "night" && s.day === 2, 5000, "night2");
  const aliveVillagers2 = villagers.filter((v) => v.public.players.find((p) => p.id === v.private.self.id)?.alive);
  w1.socket.emit("night:submit", { targetId: aliveVillagers2[0].private.self.id });
  w2.socket.emit("night:submit", { targetId: aliveVillagers2[1].private.self.id });
  await sleep(500);
  assert(clients[0].public.phase === "night", "night2 must still be blocked before forcing");
  clients[0].socket.emit("host:forceResolveNight", {});
  await waitFor(clients[0], (s) => s.phase !== "night", 5000, "forced resolve");
  console.log("PASS: host:forceResolveNight bypasses the consensus gate as an intentional escape hatch");

  for (const c of clients) c.socket.disconnect();
}

async function testAppealVoteSparedReason() {
  console.log("\n=== GROUP: appeal-vote spare -> sparedReason='appeal_vote' ===");
  const { clients } = await makeRoom(["Host", "W1", "V1", "V2", "V3", "V4", "V5", "V6"], { werewolf: 1, villager: 7 });
  clients[0].socket.emit("host:advance", { to: "night" });
  await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
  const w1 = byRole(clients, "werewolf")[0];
  const villagers = byRole(clients, "villager");
  w1.socket.emit("night:submit", { targetId: null });
  await waitFor(clients[0], (s) => s.phase === "day_result", 5000, "day_result1");
  clients[0].socket.emit("host:advance", { to: "discussion" });
  await waitFor(clients[0], (s) => s.phase === "discussion" && s.day === 1, 5000, "discussion1");
  clients[0].socket.emit("host:advance", { to: "vote" });
  await waitFor(clients[0], (s) => s.phase === "vote", 5000, "vote1");
  const alive1 = clients.filter((c) => c.public.players.find((p) => p.id === c.private.self.id)?.alive);
  const target = villagers.find((v) => v.public.players.find((p) => p.id === v.private.self.id)?.alive);
  for (const c of alive1) c.socket.emit("vote:submit", { targetId: target.private.self.id });
  await waitFor(clients[0], (s) => s.phase === "last_words", 5000, "last_words1");
  target.socket.emit("lastWords:proceed", {});
  await waitFor(clients[0], (s) => s.phase === "appeal_vote", 5000, "appeal_vote1");
  const eligible = clients.filter(
    (c) => c.public.players.find((p) => p.id === c.private.self.id)?.alive && c.private.self.id !== target.private.self.id
  );
  for (const c of eligible) c.socket.emit("appeal:submit", { choice: "spare" });
  await waitFor(clients[0], (s) => s.phase === "execution_result", 5000, "execution_result1");
  assert(clients[0].public.lastExecuted?.spared === true, "target must have been spared (unanimous spare vote)");
  assert(
    clients[0].public.lastExecuted?.sparedReason === "appeal_vote",
    "sparedReason must be 'appeal_vote' after a real appeal vote, got: " + clients[0].public.lastExecuted?.sparedReason
  );
  console.log("PASS: sparedReason correctly 'appeal_vote' after a real appeal vote");
  for (const c of clients) c.socket.disconnect();
}

async function testFirstVoteRuleSparedReason() {
  console.log("\n=== GROUP: first-vote-rule spare -> sparedReason='first_vote_rule', no appeal_vote phase ===");
  const { clients } = await makeRoom(
    ["Host", "W1", "V1", "V2", "V3", "V4"],
    { werewolf: 1, villager: 5 },
    { allowFirstVoteExecution: false }
  );
  clients[0].socket.emit("host:advance", { to: "night" });
  await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
  const w1 = byRole(clients, "werewolf")[0];
  const villagers = byRole(clients, "villager");
  w1.socket.emit("night:submit", { targetId: null });
  await waitFor(clients[0], (s) => s.phase === "day_result", 5000, "day_result1");
  clients[0].socket.emit("host:advance", { to: "discussion" });
  await waitFor(clients[0], (s) => s.phase === "discussion" && s.day === 1, 5000, "discussion1");
  clients[0].socket.emit("host:advance", { to: "vote" });
  await waitFor(clients[0], (s) => s.phase === "vote", 5000, "vote1");
  const alive1 = clients.filter((c) => c.public.players.find((p) => p.id === c.private.self.id)?.alive);
  const target = villagers.find((v) => v.public.players.find((p) => p.id === v.private.self.id)?.alive);
  let sawLastWordsOrAppeal = false;
  const watcher = (s) => {
    if (s.phase === "last_words" || s.phase === "appeal_vote") sawLastWordsOrAppeal = true;
  };
  clients[0].socket.on("state:public", watcher);
  for (const c of alive1) c.socket.emit("vote:submit", { targetId: target.private.self.id });
  await waitFor(clients[0], (s) => s.phase === "execution_result", 8000, "execution_result1");
  clients[0].socket.off("state:public", watcher);
  assert(!sawLastWordsOrAppeal, "first-vote-rule spare must NOT go through last_words/appeal_vote at all");
  assert(clients[0].public.lastExecuted?.spared === true, "must be spared under first-vote-rule");
  assert(
    clients[0].public.lastExecuted?.sparedReason === "first_vote_rule",
    "sparedReason must be 'first_vote_rule', got: " + clients[0].public.lastExecuted?.sparedReason
  );
  console.log("PASS: sparedReason correctly 'first_vote_rule' with no appeal vote phase visited");
  for (const c of clients) c.socket.disconnect();
}

async function testTieRunoffVote() {
  console.log("\n=== GROUP: tied day-vote enters a restricted runoff before executing ===");
  const { clients } = await makeRoom(["Host", "W1", "V1", "V2", "V3", "V4", "V5", "V6"], { werewolf: 1, villager: 7 });
  clients[0].socket.emit("host:advance", { to: "night" });
  await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
  const w1 = byRole(clients, "werewolf")[0];
  w1.socket.emit("night:submit", { targetId: null });
  await waitFor(clients[0], (s) => s.phase === "day_result", 5000, "day_result1");
  clients[0].socket.emit("host:advance", { to: "discussion" });
  await waitFor(clients[0], (s) => s.phase === "discussion" && s.day === 1, 5000, "discussion1");
  clients[0].socket.emit("host:advance", { to: "vote" });
  await waitFor(clients[0], (s) => s.phase === "vote", 5000, "vote1");
  const alive1 = clients.filter((c) => c.public.players.find((p) => p.id === c.private.self.id)?.alive);
  assert(alive1.length % 2 === 0, "test setup expects an even alive count to force an exact tie");
  const [a, b] = alive1.slice(0, 2);
  const half = alive1.length / 2;
  alive1.forEach((c, i) => c.socket.emit("vote:submit", { targetId: (i < half ? a : b).private.self.id }));
  await waitFor(clients[0], (s) => s.phase === "discussion" && s.runoffCandidateIds?.length > 1, 5000, "runoff-discussion");
  console.log("PASS: tie sent voters back to discussion with runoff candidates:", clients[0].public.runoffCandidateIds);
  clients[0].socket.emit("host:advance", { to: "vote" });
  await waitFor(clients[0], (s) => s.phase === "vote", 5000, "runoff-vote");
  const offCandidate = alive1.find((c) => ![a.private.self.id, b.private.self.id].includes(c.private.self.id));
  // vote:submit にはack callbackが無いため emit() (ack待ち)ではなく直接emitする。
  // サーバーは runoffCandidateIds 外への投票を黙って無視するだけなので、
  // 実際に反映されていないことを票数不足(自動解決されない)で確認する
  offCandidate.socket.emit("vote:submit", { targetId: offCandidate.private.self.id });
  await sleep(300);
  assert(clients[0].public.phase === "vote", "an off-runoff-list vote must be ignored, not resolve the vote");
  for (const c of alive1) c.socket.emit("vote:submit", { targetId: a.private.self.id });
  await waitFor(clients[0], (s) => s.phase === "last_words" || s.phase === "execution_result", 5000, "post-runoff-vote");
  console.log("PASS: runoff vote resolved to a single winner without re-entering the tie branch");
  for (const c of clients) c.socket.disconnect();
}

// どこかで想定外にハングした場合でも無限に待たず、必ず失敗として終了させる安全弁
const watchdog = setTimeout(() => {
  console.error("\n❌ LOGIC REGRESSION TEST FAILED: global watchdog timeout (120s) - a step never resolved");
  process.exit(1);
}, 120000);
watchdog.unref?.();

async function testProfileUpdate() {
  console.log("\n=== GROUP: optional display name + avatar photo updates (Task: profile customization) ===");
  const socket = await connect();
  const c1 = makeClient(socket, "Host");
  const tinyAvatar =
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=";

  const res = await emit(c1.socket, "room:create", { playerName: "Alice", avatarUrl: tinyAvatar });
  assert(res.ok, "room:create should succeed");
  await waitFor(c1, (s) => s.players.length === 1, 5000, "created");
  assert(c1.public.players[0].avatarUrl === tinyAvatar, "avatarUrl must be set at room:create time");
  console.log("PASS: avatarUrl accepted at room:create");

  c1.socket.emit("player:updateProfile", { name: "Alice2" });
  await waitFor(c1, (s) => s.players[0].name === "Alice2", 5000, "renamed");
  assert(c1.public.players[0].avatarUrl === tinyAvatar, "a name-only update must not clear the existing avatar");
  console.log("PASS: name-only update preserves the existing avatar");

  c1.socket.emit("player:updateProfile", { avatarUrl: null });
  await waitFor(c1, (s) => s.players[0].avatarUrl === null, 5000, "avatar cleared");
  assert(c1.public.players[0].name === "Alice2", "an avatar-only update must not clear the existing name");
  console.log("PASS: avatar removed via explicit null, name preserved");

  const oversized = "data:image/png;base64," + "A".repeat(250_000);
  c1.socket.emit("player:updateProfile", { avatarUrl: oversized });
  await sleep(300);
  assert(c1.public.players[0].avatarUrl === null, "an oversized avatar payload must be rejected server-side");
  console.log("PASS: oversized avatar payload rejected server-side (previous value kept)");

  c1.socket.disconnect();
}

// Task #36で追加した6つの拡張設定が、実際にサーバー側の挙動を切り替えることを
// エンドツーエンドで検証する(UIのトグル表示だけでなく、ゲームロジックへの反映まで確認)。
async function testExpandedSettings() {
  console.log("\n=== GROUP: expanded settings (Task #36) actually change server behavior ===");

  // --- allowSelfVote: false は自分自身への投票を拒否する ---
  {
    const { clients } = await makeRoom(
      ["Host", "W1", "V1", "V2", "V3", "V4"],
      { werewolf: 1, villager: 5 },
      { allowSelfVote: false }
    );
    clients[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
    byRole(clients, "werewolf")[0].socket.emit("night:submit", { targetId: null });
    await waitFor(clients[0], (s) => s.phase === "day_result", 5000, "day_result1");
    clients[0].socket.emit("host:advance", { to: "discussion" });
    await waitFor(clients[0], (s) => s.phase === "discussion" && s.day === 1, 5000, "discussion1");
    clients[0].socket.emit("host:advance", { to: "vote" });
    await waitFor(clients[0], (s) => s.phase === "vote", 5000, "vote1");
    const v1 = byRole(clients, "villager")[0];
    v1.socket.emit("vote:submit", { targetId: v1.private.self.id });
    await sleep(300);
    assert(clients[0].public.progress.submitted === 0, "allowSelfVote=false must reject a self-targeted vote");
    v1.socket.emit("vote:submit", { targetId: byRole(clients, "villager")[1].private.self.id });
    await sleep(300);
    assert(clients[0].public.progress.submitted === 1, "a valid non-self vote must still be accepted");
    console.log("PASS: allowSelfVote=false rejects self-votes but accepts normal votes");
    for (const c of clients) c.socket.disconnect();
  }

  // --- allowSelfVote: true (デフォルト) は自分自身への投票を許可する ---
  {
    const { clients } = await makeRoom(["Host", "W1", "V1", "V2", "V3", "V4"], { werewolf: 1, villager: 5 });
    clients[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
    byRole(clients, "werewolf")[0].socket.emit("night:submit", { targetId: null });
    await waitFor(clients[0], (s) => s.phase === "day_result", 5000, "day_result1");
    clients[0].socket.emit("host:advance", { to: "discussion" });
    await waitFor(clients[0], (s) => s.phase === "discussion" && s.day === 1, 5000, "discussion1");
    clients[0].socket.emit("host:advance", { to: "vote" });
    await waitFor(clients[0], (s) => s.phase === "vote", 5000, "vote1");
    const v1 = byRole(clients, "villager")[0];
    v1.socket.emit("vote:submit", { targetId: v1.private.self.id });
    await sleep(300);
    assert(clients[0].public.progress.submitted === 1, "allowSelfVote=true (default) must accept a self-targeted vote");
    console.log("PASS: allowSelfVote=true (default) accepts self-votes");
    for (const c of clients) c.socket.disconnect();
  }

  // --- revealVoteChoices: true は投票内容をリアルタイムで公開する ---
  {
    const { clients } = await makeRoom(
      ["Host", "W1", "V1", "V2", "V3"],
      { werewolf: 1, villager: 4 },
      { revealVoteChoices: true }
    );
    clients[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
    byRole(clients, "werewolf")[0].socket.emit("night:submit", { targetId: null });
    await waitFor(clients[0], (s) => s.phase === "day_result", 5000, "day_result1");
    clients[0].socket.emit("host:advance", { to: "discussion" });
    await waitFor(clients[0], (s) => s.phase === "discussion" && s.day === 1, 5000, "discussion1");
    clients[0].socket.emit("host:advance", { to: "vote" });
    await waitFor(clients[0], (s) => s.phase === "vote", 5000, "vote1");
    const [v1, v2] = byRole(clients, "villager");
    v1.socket.emit("vote:submit", { targetId: v2.private.self.id });
    await sleep(300);
    const choice = clients[0].public.voteChoices?.find((c) => c.voterId === v1.private.self.id);
    assert(!!choice, "revealVoteChoices=true must expose the voter's choice in public state");
    assert(choice.targetId === v2.private.self.id, "the revealed choice must point at the correct target");
    console.log("PASS: revealVoteChoices=true exposes live vote choices with correct voter/target");
    for (const c of clients) c.socket.disconnect();
  }

  // --- secondTieExecutesRandomly: false は決選投票でも同数タイなら誰も処刑しない ---
  {
    const { clients } = await makeRoom(
      ["Host", "W1", "V1", "V2", "V3", "V4", "V5", "V6"],
      { werewolf: 1, villager: 7 },
      { secondTieExecutesRandomly: false }
    );
    clients[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
    byRole(clients, "werewolf")[0].socket.emit("night:submit", { targetId: null });
    await waitFor(clients[0], (s) => s.phase === "day_result", 5000, "day_result1");
    clients[0].socket.emit("host:advance", { to: "discussion" });
    await waitFor(clients[0], (s) => s.phase === "discussion" && s.day === 1, 5000, "discussion1");
    clients[0].socket.emit("host:advance", { to: "vote" });
    await waitFor(clients[0], (s) => s.phase === "vote", 5000, "vote1");
    const alive1 = clients.filter((c) => c.public.players.find((p) => p.id === c.private.self.id)?.alive);
    const [a, b] = alive1.slice(0, 2);
    const half = alive1.length / 2;
    alive1.forEach((c, i) => c.socket.emit("vote:submit", { targetId: (i < half ? a : b).private.self.id }));
    await waitFor(clients[0], (s) => s.phase === "discussion" && s.runoffCandidateIds?.length > 1, 5000, "runoff-discussion");
    clients[0].socket.emit("host:advance", { to: "vote" });
    await waitFor(clients[0], (s) => s.phase === "vote", 5000, "runoff-vote");
    // 決選投票でも同じ人数で再度タイにする
    alive1.forEach((c, i) => c.socket.emit("vote:submit", { targetId: (i < half ? a : b).private.self.id }));
    await waitFor(clients[0], (s) => s.phase === "execution_result", 5000, "execution_result-after-second-tie");
    assert(clients[0].public.lastExecuted === null, "secondTieExecutesRandomly=false must result in nobody executed");
    const aStillAlive = clients[0].public.players.find((p) => p.id === a.private.self.id)?.alive;
    const bStillAlive = clients[0].public.players.find((p) => p.id === b.private.self.id)?.alive;
    assert(aStillAlive && bStillAlive, "both tied candidates must remain alive when nobody is executed");
    console.log("PASS: secondTieExecutesRandomly=false spares everyone on a repeated runoff tie");
    for (const c of clients) c.socket.disconnect();
  }

  // --- allowBodyguardSelfGuard: true はボディーガードの自己護衛を許可する ---
  {
    const { clients } = await makeRoom(
      ["Host", "W1", "BG1", "V1", "V2", "V3"],
      { werewolf: 1, bodyguard: 1, villager: 4 },
      { allowBodyguardSelfGuard: true }
    );
    clients[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
    const bg = byRole(clients, "bodyguard")[0];
    bg.socket.emit("night:submit", { targetId: bg.private.self.id });
    await sleep(300);
    assert(bg.private.pendingNightAction?.submitted === true, "allowBodyguardSelfGuard=true must accept a self-guard submission");
    console.log("PASS: allowBodyguardSelfGuard=true accepts a self-targeted guard");
    for (const c of clients) c.socket.disconnect();
  }

  // --- allowBodyguardSelfGuard: false (デフォルト) は自己護衛を拒否する ---
  {
    const { clients } = await makeRoom(["Host", "W1", "BG1", "V1", "V2", "V3"], { werewolf: 1, bodyguard: 1, villager: 4 });
    clients[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
    const bg = byRole(clients, "bodyguard")[0];
    bg.socket.emit("night:submit", { targetId: bg.private.self.id });
    await sleep(300);
    assert(
      !bg.private.pendingNightAction?.submitted,
      "allowBodyguardSelfGuard=false (default) must reject a self-guard submission"
    );
    console.log("PASS: allowBodyguardSelfGuard=false (default) rejects a self-targeted guard");
    for (const c of clients) c.socket.disconnect();
  }

  // --- dictatorCanTargetSelf: false は独裁者の自己処刑を拒否する ---
  {
    const { clients } = await makeRoom(
      ["Host", "W1", "D1", "V1", "V2", "V3"],
      { werewolf: 1, dictator: 1, villager: 4 },
      { dictatorCanTargetSelf: false }
    );
    clients[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
    byRole(clients, "werewolf")[0].socket.emit("night:submit", { targetId: null });
    await waitFor(clients[0], (s) => s.phase === "day_result", 5000, "day_result1");
    clients[0].socket.emit("host:advance", { to: "discussion" });
    await waitFor(clients[0], (s) => s.phase === "discussion" && s.day === 1, 5000, "discussion1");
    const dictator = byRole(clients, "dictator")[0];
    dictator.socket.emit("dictator:act", { targetId: dictator.private.self.id });
    await sleep(300);
    assert(clients[0].public.dictatorUsed === false, "dictatorCanTargetSelf=false must reject a self-targeted decree");
    console.log("PASS: dictatorCanTargetSelf=false rejects a self-targeted decree");
    for (const c of clients) c.socket.disconnect();
  }

  // --- dictatorCanTargetSelf: true (デフォルト) は独裁者の自己処刑を許可する ---
  {
    const { clients } = await makeRoom(["Host", "W1", "D1", "V1", "V2", "V3"], { werewolf: 1, dictator: 1, villager: 4 });
    clients[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
    byRole(clients, "werewolf")[0].socket.emit("night:submit", { targetId: null });
    await waitFor(clients[0], (s) => s.phase === "day_result", 5000, "day_result1");
    clients[0].socket.emit("host:advance", { to: "discussion" });
    await waitFor(clients[0], (s) => s.phase === "discussion" && s.day === 1, 5000, "discussion1");
    const dictator = byRole(clients, "dictator")[0];
    dictator.socket.emit("dictator:act", { targetId: dictator.private.self.id });
    await waitFor(clients[0], (s) => s.dictatorUsed === true, 5000, "dictator self-execution");
    const stillAlive = clients[0].public.players.find((p) => p.id === dictator.private.self.id)?.alive;
    assert(!stillAlive, "dictatorCanTargetSelf=true (default) must let the dictator execute themselves");
    console.log("PASS: dictatorCanTargetSelf=true (default) allows a self-targeted decree");
    for (const c of clients) c.socket.disconnect();
  }

  // --- ハンターの道連れ(cause="hunter")は、設定に関わらず連鎖しない(仕様として固定) ---
  // hunterRevengeOnAnyDeath 設定は、標準の1人ハンター構成では絶対に効果を持たない
  // (呪殺は妖狐だけ、後追いは恋人だけが対象になる死因のため)という理由で撤去された。
  // 撤去後も、道連れによる死亡(cause="hunter")自体は今まで通り連鎖しないことを確認する。
  {
    const { clients } = await makeRoom(["Host", "W1", "H1", "H2", "V1", "V2"], { werewolf: 1, hunter: 2, villager: 3 });
    clients[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
    const [h1, h2] = byRole(clients, "hunter");
    byRole(clients, "werewolf")[0].socket.emit("night:submit", { targetId: h1.private.self.id });
    await waitFor(
      clients[0],
      (s) => !!s.awaitingHunterRevenge && s.awaitingHunterRevenge.hunterId === h1.private.self.id,
      5000,
      "h1 awaiting revenge"
    );
    h1.socket.emit("hunter:revenge", { targetId: h2.private.self.id });
    await waitFor(clients[0], (s) => s.phase === "day_result", 5000, "day_result (no chain)");
    assert(!clients[0].public.awaitingHunterRevenge, "a cause='hunter' death must never chain a second revenge");
    const h2Alive = clients[0].public.players.find((p) => p.id === h2.private.self.id)?.alive;
    assert(!h2Alive, "h2 must still have died from h1's revenge itself");
    console.log("PASS: hunter revenge deaths (cause='hunter') never chain into a second revenge");
    for (const c of clients) c.socket.disconnect();
  }

  // --- allowWolfFriendlyFire: true は人狼が仲間の人狼を襲撃対象にできるようにする ---
  // ターゲット自身の人狼は「自分を攻撃対象にする」ことはできない(自己攻撃は別ルールで常に禁止)ため、
  // 生き残っているもう一方の人狼だけが目標に合意する形になり、厳密な全員一致の合意には至らない。
  // これは友軍撃ちが絡む場面としては現実的な状況で、ホストの強制進行で解決するのが正しい使い方。
  {
    const { clients } = await makeRoom(
      ["Host", "W1", "W2", "V1", "V2", "V3"],
      { werewolf: 2, villager: 4 },
      { allowWolfFriendlyFire: true }
    );
    clients[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
    const [w1, w2] = byRole(clients, "werewolf");
    w1.socket.emit("night:submit", { targetId: w2.private.self.id });
    await sleep(300);
    assert(w1.private.pendingNightAction?.submitted === true, "allowWolfFriendlyFire=true must accept an attack targeting a fellow werewolf");
    clients[0].socket.emit("host:forceResolveNight", {});
    await waitFor(clients[0], (s) => s.phase === "day_result", 5000, "day_result after forced friendly-fire attack");
    const w2Alive = clients[0].public.players.find((p) => p.id === w2.private.self.id)?.alive;
    assert(!w2Alive, "allowWolfFriendlyFire=true must let werewolves kill a fellow werewolf");
    console.log("PASS: allowWolfFriendlyFire=true allows werewolves to attack each other");
    for (const c of clients) c.socket.disconnect();
  }

  // --- allowWolfFriendlyFire: false (デフォルト) は仲間の人狼を襲撃対象にできない ---
  {
    const { clients } = await makeRoom(["Host", "W1", "W2", "V1", "V2", "V3"], { werewolf: 2, villager: 4 });
    clients[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night1");
    const [w1, w2] = byRole(clients, "werewolf");
    w1.socket.emit("night:submit", { targetId: w2.private.self.id });
    await sleep(300);
    assert(
      !w1.private.pendingNightAction?.submitted,
      "allowWolfFriendlyFire=false (default) must reject an attack targeting a fellow werewolf"
    );
    console.log("PASS: allowWolfFriendlyFire=false (default) rejects attacking a fellow werewolf");
    for (const c of clients) c.socket.disconnect();
  }
}

async function main() {
  await testWolfConsensus();
  await testAppealVoteSparedReason();
  await testFirstVoteRuleSparedReason();
  await testTieRunoffVote();
  await testProfileUpdate();
  await testExpandedSettings();
  console.log("\n✅ ALL LOGIC REGRESSION TESTS PASSED");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ LOGIC REGRESSION TEST FAILED:", err);
  process.exit(1);
});
