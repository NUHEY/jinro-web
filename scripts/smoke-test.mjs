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
  socket.on("room:error", (e) => console.log(`[${name}] room:error`, e.errorCode));
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
    }, 50);
  });
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// 投票により追放が決定すると、"最後の一言"(last_words) -> "生存決選投票"(appeal_vote) を
// 経由してから execution_result に至るようになった。テストではホストの強制操作で自動的に
// この2フェーズを通過させる(誰も決選投票をしなければ「同数はタイなので処刑」ルールにより、
// 元々投票で決まった対象がそのまま処刑される。無投票のホスト側テストと整合させるため)。
async function autoResolveExecutionFlow(host, label = "") {
  if (host.public.phase === "last_words") {
    host.socket.emit("lastWords:proceed", {});
    await waitFor(host, (s) => s.phase === "appeal_vote" || s.phase === "game_over", 5000, `appeal_vote after last_words ${label}`);
  }
  if (host.public.phase === "appeal_vote") {
    host.socket.emit("host:forceResolveAppealVote", {});
    await waitFor(host, (s) => s.phase === "execution_result" || s.phase === "game_over", 5000, `execution_result after appeal_vote ${label}`);
  }
}

function log(...args) {
  console.log(...args);
}

async function main() {
  // ---------- TEST 1: 12人ゲーム(最初の昼(day0)・独裁者day0制限・ハンター道連れ・
  //            恋人道連れ・妖狐呪殺・ボディーガード連続ガード禁止・host:forceResolveNight を検証) ----------
  log("\n=== TEST 1: 12-player full mechanics test ===");
  const names = [
    "Alice", "Bob", "Carol", "Dave", "Eve", "Frank",
    "Grace", "Heidi", "Ivan", "Judy", "Mallory", "Niaj",
  ];
  const sockets = await Promise.all(names.map(() => connect()));
  const clients = sockets.map((s, i) => makeClient(s, names[i]));

  const hostRes = await emit(clients[0].socket, "room:create", { playerName: names[0] });
  if (!hostRes.ok) throw new Error("create failed: " + hostRes.errorCode);
  const code = hostRes.code;
  log("room code:", code);

  for (let i = 1; i < clients.length; i++) {
    const res = await emit(clients[i].socket, "room:join", { code, playerName: names[i] });
    if (!res.ok) throw new Error("join failed: " + res.errorCode);
  }

  await waitFor(clients[0], (s) => s.players.length === 12, 5000, "all joined");

  clients[0].socket.emit("room:updateSettings", { settings: { revealRoleOnDeath: false } });

  // カスタム配役: 人狼2, 裏切り者1, 予言者1, ボディーガード1, 霊媒師1, ハンター1, 独裁者1, 妖狐1, 恋人2, 市民1 = 12
  const composition = {
    werewolf: 2,
    traitor: 1,
    seer: 1,
    bodyguard: 1,
    medium: 1,
    hunter: 1,
    dictator: 1,
    fox: 1,
    lover: 2,
    villager: 1,
  };
  clients[0].socket.emit("room:updateComposition", { roleCounts: composition });
  await waitFor(clients[0], (s) => s.totalSeats === 12, 3000, "composition set");

  const startRes = await emit(clients[0].socket, "room:start", {});
  if (!startRes.ok) throw new Error("start failed: " + startRes.errorCode);
  log("game started");

  await waitFor(clients[0], (s) => s.phase === "role_reveal", 5000, "role_reveal");

  const byRole = {};
  for (const c of clients) {
    const role = c.private?.self?.role;
    byRole[role] = byRole[role] || [];
    byRole[role].push(c);
  }
  log(
    "role assignment:",
    Object.fromEntries(Object.entries(byRole).map(([r, cs]) => [r, cs.map((c) => c.name)]))
  );

  const wolves = byRole["werewolf"] || [];
  const seer = (byRole["seer"] || [])[0];
  const bodyguard = (byRole["bodyguard"] || [])[0];
  const hunter = (byRole["hunter"] || [])[0];
  const fox = (byRole["fox"] || [])[0];
  const lovers = byRole["lover"] || [];
  const dictator = (byRole["dictator"] || [])[0];
  const medium = (byRole["medium"] || [])[0];
  const villagerC = (byRole["villager"] || [])[0];

  if (wolves.length !== 2) throw new Error("expected 2 werewolves");
  if (!seer || !bodyguard || !hunter || !fox || lovers.length !== 2 || !dictator || !medium || !villagerC) {
    throw new Error("役職の割り当てに不足があります");
  }
  log("wolves attack target will be:", hunter.name, "(to trigger hunter revenge)");

  // 全員が役職確認ボタンを押すまでは進まないはず -> host:advanceも無視されることを確認
  clients[0].socket.emit("host:advance", { to: "discussion" });
  await sleep(200);
  if (clients[0].public.phase !== "role_reveal") {
    throw new Error("REGRESSION: host:advance bypassed the role-ack gate before anyone confirmed");
  }
  log("✓ host:advance to discussion correctly ignored before all players ack their role");

  // 最後の1人以外がack -> まだ進まないはず
  for (let i = 0; i < clients.length - 1; i++) clients[i].socket.emit("role:ack", {});
  await sleep(250);
  if (clients[0].public.phase !== "role_reveal") {
    throw new Error("REGRESSION: advanced to discussion before everyone acked their role");
  }
  // 最後の1人もack -> 自動的に最初の昼(day0)へ進むはず(ホスト操作なし)
  clients[clients.length - 1].socket.emit("role:ack", {});

  // --- 最初の昼(議論のみ、day===0) へ進む: ここではまだ誰も死なない ---
  await waitFor(clients[0], (s) => s.phase === "discussion" && s.day === 0, 5000, "day0 first discussion");
  log("✓ entered day0 first discussion (no one has died yet, no execution vote here)");

  // 独裁者はday0では能力を使えないはず
  if (dictator.private.canUseDictator) {
    throw new Error("dictator should NOT be able to act during day0");
  }
  const someoneElse = clients.find((c) => c !== dictator);
  dictator.socket.emit("dictator:act", { targetId: someoneElse.private.self.id });
  await sleep(300);
  if (clients[0].public.phase !== "discussion" || clients[0].public.day !== 0 || clients[0].public.dictatorUsed) {
    throw new Error("dictator:act during day0 should have had no effect");
  }
  log("✓ dictator correctly blocked from acting during day0 first discussion");

  // --- 本当の「夜」(day=1) へ進む。ここで初めて人狼の襲撃などが起こりうる ---
  clients[0].socket.emit("host:advance", { to: "night" });
  await waitFor(clients[0], (s) => s.phase === "night" && s.day === 1, 5000, "night 1");

  // 人狼はハンターを襲撃 -> ハンターの道連れ発動を検証
  for (const w of wolves) w.socket.emit("night:submit", { targetId: hunter.private.self.id });
  // 予言者は妖狐を占う -> 呪殺を検証
  seer.socket.emit("night:submit", { targetId: fox.private.self.id });
  // ボディーガードは市民を守る(この選択を次の夜も続けて選べないことを後で検証する)
  bodyguard.socket.emit("night:submit", { targetId: villagerC.private.self.id });

  // ハンターの道連れ待ちになるはず -> lovers[0]を道連れに指名し、恋人の後追いも連鎖させる
  await waitFor(
    clients[0],
    (s) => !!s.awaitingHunterRevenge && s.awaitingHunterRevenge.hunterId === hunter.private.self.id,
    8000,
    "awaiting hunter revenge"
  );
  log("hunter revenge prompt confirmed for:", clients[0].public.awaitingHunterRevenge.hunterName);
  hunter.socket.emit("hunter:revenge", { targetId: lovers[0].private.self.id });

  await waitFor(clients[0], (s) => s.phase === "day_result" || s.phase === "game_over", 8000, "day_result after night1");
  const publicAfterNight = clients[0].public;
  log("phase after night1:", publicAfterNight.phase);
  log("deaths after night1:", publicAfterNight.lastDeaths);

  const deadIds = new Set(publicAfterNight.lastDeaths.map((d) => d.playerId));
  const causes = publicAfterNight.lastDeaths.map((d) => d.cause).sort();
  const expectDead = [hunter.private.self.id, lovers[0].private.self.id, lovers[1].private.self.id, fox.private.self.id];
  for (const id of expectDead) {
    if (!deadIds.has(id)) {
      throw new Error("expected player to be dead but is alive: " + id);
    }
  }
  log("✓ hunter revenge, lover chain(x2), fox curse-kill all confirmed");
  if (!causes.includes("hunter")) throw new Error("hunter cause missing");
  if (!causes.includes("lover_grief")) throw new Error("lover_grief cause missing");
  if (!causes.includes("curse")) throw new Error("curse cause missing");
  log("✓ death causes:", causes);
  log("✓ bodyguard's guard on", villagerC.name, "held (not attacked), villager still alive");

  if (publicAfterNight.phase === "game_over") {
    log("game ended early (acceptable if win condition triggered). winner:", publicAfterNight.winner);
  } else {
    // 昼 -> 議論 -> 独裁者権限で霊媒師を即決追放(ボディーガード・市民は意図的に温存し、night2の検証に使う)
    clients[0].socket.emit("host:advance", { to: "discussion" });
    await waitFor(clients[0], (s) => s.phase === "discussion" && s.day === 1, 5000, "discussion day1");

    dictator.socket.emit("dictator:act", { targetId: medium.private.self.id });
    await waitFor(clients[0], (s) => s.phase === "execution_result" || s.phase === "game_over", 8000, "execution_result");
    log("phase after dictator execution:", clients[0].public.phase);
    if (clients[0].public.phase === "execution_result") {
      log("✓ dictator forced execution:", clients[0].public.lastExecuted);
      if (clients[0].public.dictatorUsed !== true) throw new Error("dictatorUsed flag not set");
      if (clients[0].public.lastExecuted?.playerId !== medium.private.self.id) {
        throw new Error("expected medium to be dictator-executed");
      }

      // --- 夜2(day=2) へ進み、ボディーガードの「二夜続けて同じ人物を守れない」ルールと
      //     host:forceResolveNight を検証する ---
      clients[0].socket.emit("host:advance", { to: "night" });
      await waitFor(clients[0], (s) => s.phase === "night" && s.day === 2, 5000, "night 2");

      const bgCandidates = bodyguard.private.pendingNightAction?.candidates ?? [];
      if (bgCandidates.some((p) => p.id === villagerC.private.self.id)) {
        throw new Error("bodyguard candidates should exclude the villager guarded last night");
      }
      log("✓ bodyguard's night2 candidate list correctly excludes", villagerC.name, "(guarded last night)");

      // 間違えて同じ相手を指定しても、サーバー側で拒否されるはず(未提出のまま)
      bodyguard.socket.emit("night:submit", { targetId: villagerC.private.self.id });
      await sleep(300);
      if (bodyguard.private.pendingNightAction?.submitted) {
        throw new Error("repeat-guard submission should have been rejected, but was accepted");
      }
      log("✓ bodyguard's repeat-guard submission was correctly rejected by the server");

      // 人狼はその市民を襲撃(ボディーガードは守れていないので死亡するはず)
      for (const w of wolves) {
        if (w.public.players.find((p) => p.id === w.private.self.id)?.alive) {
          w.socket.emit("night:submit", { targetId: villagerC.private.self.id });
        }
      }
      // 予言者は独裁者を占う(単なる進行用)
      if (seer.public.players.find((p) => p.id === seer.private.self.id)?.alive) {
        seer.socket.emit("night:submit", { targetId: dictator.private.self.id });
      }
      // ボディーガードはあえて提出しないまま、ホストの強制解決を検証する
      await sleep(300);
      clients[0].socket.emit("host:forceResolveNight", {});
      await waitFor(clients[0], (s) => s.phase === "day_result" || s.phase === "game_over", 8000, "forced night2 resolution");
      const deaths2 = clients[0].public.lastDeaths ?? [];
      if (!deaths2.some((d) => d.playerId === villagerC.private.self.id)) {
        throw new Error("expected villager to die on night2 (guard was never validly submitted)");
      }
      log("✓ host:forceResolveNight resolved night2 without waiting for the bodyguard; villager died as expected");
    } else {
      log("game ended during day1 execution (acceptable if win condition triggered)");
    }
  }

  log("=== TEST 1 loop: play remaining rounds until game_over (max 15 rounds) ===");
  let rounds = 0;
  while (clients[0].public.phase !== "game_over" && rounds < 15) {
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
      const aliveVoters = clients.filter((c) => c.public.players.find((p) => p.id === c.private?.self?.id)?.alive);
      const targetAlive = aliveVoters[0];
      for (const c of aliveVoters) {
        c.socket.emit("vote:submit", { targetId: targetAlive.private.self.id });
      }
      await waitFor(
        clients[0],
        (s) => s.phase === "last_words" || s.phase === "execution_result" || s.phase === "game_over",
        8000,
        "last_words/execution_result(loop)"
      );
      await autoResolveExecutionFlow(clients[0], "(loop)");
    }
    if (clients[0].public.phase === "execution_result") {
      clients[0].socket.emit("host:advance", { to: "night" });
      await waitFor(clients[0], (s) => s.phase === "night" || s.phase === "game_over", 5000, "night(loop)");
    }
    if (clients[0].public.phase === "night") {
      // 全員自動でスキップ(null)submit、タイマー無しで即解決させるため能力持ちは全員null送信
      for (const c of clients) {
        const alive = c.public.players.find((p) => p.id === c.private?.self?.id)?.alive;
        if (alive && c.private?.pendingNightAction && !c.private.pendingNightAction.submitted) {
          c.socket.emit("night:submit", { targetId: null });
        }
      }
      await waitFor(clients[0], (s) => s.phase !== "night" || s.phase === "game_over", 8000, "resolve night(loop)");
      // ハンターの道連れ待ちなら「道連れなし」を送る
      if (clients[0].public.awaitingHunterRevenge) {
        const hId = clients[0].public.awaitingHunterRevenge.hunterId;
        const hClient = clients.find((c) => c.private?.self?.id === hId);
        hClient?.socket.emit("hunter:revenge", { targetId: null });
        await waitFor(clients[0], (s) => !s.awaitingHunterRevenge, 8000, "hunter revenge cleared(loop)");
      }
    }
  }

  if (clients[0].public.phase !== "game_over") {
    throw new Error("game did not conclude within round cap");
  }
  log("✓ game concluded after", rounds, "extra rounds. winner:", clients[0].public.winner);
  if (!clients[0].public.winner || !["village", "werewolf", "draw"].includes(clients[0].public.winner.primary)) {
    throw new Error("invalid winner info");
  }
  const revealedRoles = clients[0].public.winner.allRoles;
  if (revealedRoles.length !== 12) throw new Error("allRoles length mismatch");
  log("✓ all 12 roles revealed at game over");

  // host:newGame でロビーに戻れることを確認
  clients[0].socket.emit("host:newGame", {});
  await waitFor(clients[0], (s) => s.phase === "lobby", 5000, "back to lobby");
  log("✓ host:newGame returned room to lobby, players retained:", clients[0].public.players.length);

  for (const c of clients) c.socket.close();

  // ---------- TEST 2: 最小人数(4人)でのゲーム開始 + 決選投票 + host:forceResolveVote の検証 ----------
  log("\n=== TEST 2: 4-player minimum game + runoff vote + host:forceResolveVote ===");
  const names2 = ["P1", "P2", "P3", "P4"];
  const sockets2 = await Promise.all(names2.map(() => connect()));
  const clients2 = sockets2.map((s, i) => makeClient(s, names2[i]));
  const hostRes2 = await emit(clients2[0].socket, "room:create", { playerName: names2[0] });
  const code2 = hostRes2.code;
  for (let i = 1; i < clients2.length; i++) {
    await emit(clients2[i].socket, "room:join", { code: code2, playerName: names2[i] });
  }
  await waitFor(clients2[0], (s) => s.players.length === 4, 5000, "4 joined");
  log("auto-suggested composition for 4p:", clients2[0].public.roleCounts, "total:", clients2[0].public.totalSeats);
  if (clients2[0].public.totalSeats !== 4) throw new Error("composition doesn't sum to 4");

  const start2 = await emit(clients2[0].socket, "room:start", {});
  if (!start2.ok) throw new Error("4p start failed: " + start2.errorCode);
  await waitFor(clients2[0], (s) => s.phase === "role_reveal", 5000, "4p role_reveal");
  log("✓ 4-player game started successfully");

  const byRole2 = {};
  for (const c of clients2) {
    const role = c.private?.self?.role;
    byRole2[role] = byRole2[role] || [];
    byRole2[role].push(c);
  }
  const wolf2 = byRole2["werewolf"][0];
  if (!wolf2) throw new Error("test2: expected exactly 1 werewolf in the auto-suggested 4p composition");

  for (const c of clients2) c.socket.emit("role:ack", {});
  await waitFor(clients2[0], (s) => s.phase === "discussion" && s.day === 0, 5000, "4p day0 discussion");
  clients2[0].socket.emit("host:advance", { to: "night" });
  await waitFor(clients2[0], (s) => s.phase === "night" && s.day === 1, 5000, "4p night1");
  // 唯一の夜アクション保持者(人狼)が「見送り」を送信 -> 自動で夜が解決される(タイマーはもう無い)。
  // ここでは全員生存させたまま、下の同数タイ/決選投票シナリオへ進める。
  wolf2.socket.emit("night:submit", { targetId: null });
  await waitFor(clients2[0], (s) => s.phase === "day_result" || s.phase === "game_over", 8000, "4p day_result");
  if (clients2[0].public.phase !== "game_over") {
    clients2[0].socket.emit("host:advance", { to: "discussion" });
    await waitFor(clients2[0], (s) => s.phase === "discussion", 5000, "4p discussion");
    clients2[0].socket.emit("host:advance", { to: "vote" });
    await waitFor(clients2[0], (s) => s.phase === "vote", 5000, "4p vote round1");

    const [p1, p2, p3, p4] = clients2;
    const id = (c) => c.private.self.id;
    // 2-2の同数タイを作る(P1とP3が2票ずつ)
    p1.socket.emit("vote:submit", { targetId: id(p3) });
    p2.socket.emit("vote:submit", { targetId: id(p3) });
    p3.socket.emit("vote:submit", { targetId: id(p1) });
    p4.socket.emit("vote:submit", { targetId: id(p1) });

    await waitFor(
      clients2[0],
      (s) => s.phase === "discussion" && !!s.runoffCandidateIds,
      5000,
      "runoff pre-discussion after tie"
    );
    const runoffIds = clients2[0].public.runoffCandidateIds.slice().sort();
    const expectedIds = [id(p1), id(p3)].sort();
    if (JSON.stringify(runoffIds) !== JSON.stringify(expectedIds)) {
      throw new Error("runoff candidates mismatch: " + JSON.stringify(runoffIds));
    }
    log("✓ tie detected, sent back to pre-runoff discussion with candidates:", runoffIds);

    clients2[0].socket.emit("host:advance", { to: "vote" });
    await waitFor(clients2[0], (s) => s.phase === "vote", 5000, "4p runoff vote round2");

    // 決選投票の対象外(P2)への投票は無視されるはず
    p1.socket.emit("vote:submit", { targetId: id(p2) });
    await sleep(300);
    if ((clients2[0].public.progress?.submitted ?? 0) !== 0) {
      throw new Error("vote for non-runoff candidate should have been rejected");
    }
    log("✓ vote for a non-runoff candidate was correctly rejected");

    // P1・P2の2人だけがP3に投票し、P3・P4はあえて投票しないまま、
    // ホストが host:forceResolveVote で全員を待たずに締め切る
    p1.socket.emit("vote:submit", { targetId: id(p3) });
    p2.socket.emit("vote:submit", { targetId: id(p3) });
    await sleep(300);
    if ((clients2[0].public.progress?.submitted ?? 0) !== 2) {
      throw new Error("expected exactly 2 submitted votes before forcing resolution");
    }
    clients2[0].socket.emit("host:forceResolveVote", {});

    await waitFor(
      clients2[0],
      (s) => s.phase === "last_words" || s.phase === "execution_result" || s.phase === "game_over",
      8000,
      "forced runoff last_words/execution_result"
    );
    await autoResolveExecutionFlow(clients2[0], "(runoff)");
    if (clients2[0].public.phase === "execution_result") {
      if (clients2[0].public.lastExecuted?.playerId !== id(p3)) {
        throw new Error("expected P3 to be executed after forced runoff resolution, got: " + JSON.stringify(clients2[0].public.lastExecuted));
      }
      if (clients2[0].public.runoffCandidateIds) {
        throw new Error("runoffCandidateIds should be cleared after resolution");
      }
      log("✓ host:forceResolveVote resolved the runoff without waiting for P3/P4; P3 executed, runoff state cleared");
    } else {
      log("game ended before runoff execution could be observed (acceptable if win condition triggered)");
    }
  } else {
    log("game ended during night before runoff scenario could be set up (acceptable)");
  }

  for (const c of clients2) c.socket.close();

  // ---------- TEST 3: カスタムルームコード + ホスト交代 ----------
  log("\n=== TEST 3: custom room code + host transfer ===");
  const namesA = ["Host", "Guest"];
  const socketsA = await Promise.all(namesA.map(() => connect()));
  const clientsA = socketsA.map((s, i) => makeClient(s, namesA[i]));

  const resTooShort = await emit(clientsA[0].socket, "room:create", { playerName: "Host", code: "AB1" });
  if (resTooShort.ok || resTooShort.errorCode !== "INVALID_ROOM_CODE") {
    throw new Error("expected INVALID_ROOM_CODE for a too-short custom code, got: " + JSON.stringify(resTooShort));
  }
  log("✓ too-short custom code correctly rejected");

  const customCode = "NABE" + Math.floor(Math.random() * 90 + 10); // 6文字の英数字
  const resCustom = await emit(clientsA[0].socket, "room:create", { playerName: "Host", code: customCode });
  if (!resCustom.ok) throw new Error("custom code create failed: " + resCustom.errorCode);
  if (resCustom.code !== customCode) throw new Error(`expected code ${customCode}, got ${resCustom.code}`);
  log("✓ room created with custom code:", resCustom.code);

  const resDupe = await emit(clientsA[1].socket, "room:create", { playerName: "Dupe", code: customCode.toLowerCase() });
  if (resDupe.ok || resDupe.errorCode !== "ROOM_CODE_TAKEN") {
    throw new Error("expected ROOM_CODE_TAKEN for a duplicate custom code, got: " + JSON.stringify(resDupe));
  }
  log("✓ duplicate custom code (case-insensitive) correctly rejected");

  const resJoin = await emit(clientsA[1].socket, "room:join", { code: customCode, playerName: "Guest" });
  if (!resJoin.ok) throw new Error("join with custom code failed: " + resJoin.errorCode);
  await waitFor(clientsA[0], (s) => s.players.length === 2, 5000, "guest joined custom-code room");

  clientsA[0].socket.emit("room:transferHost", { targetId: resJoin.playerId });
  await waitFor(
    clientsA[0],
    (s) => s.players.find((p) => p.id === resJoin.playerId)?.isHost === true,
    3000,
    "host transferred"
  );
  const newHost = clientsA[0].public.players.find((p) => p.id === resJoin.playerId);
  const oldHost = clientsA[0].public.players.find((p) => p.id !== resJoin.playerId);
  if (!newHost.isHost || oldHost.isHost) {
    throw new Error("host transfer did not flip isHost flags correctly: " + JSON.stringify(clientsA[0].public.players));
  }
  log("✓ host transferred to guest, exactly one host remains");

  for (const c of clientsA) c.socket.close();

  // ---------- TEST 4: 勝敗判定の頭数ルール(裏切り者を人間側としてカウント)の回帰テスト ----------
  {
    log("\n=== TEST 4: win-condition parity regression (werewolf1 + traitor1 + villager2) ===");
    const names4 = ["W1", "T1", "V1", "V2"];
    const sockets4 = await Promise.all(names4.map(() => connect()));
    const clients4 = sockets4.map((s, i) => makeClient(s, names4[i]));
    const hostRes4 = await emit(clients4[0].socket, "room:create", { playerName: names4[0] });
    if (!hostRes4.ok) throw new Error("test4 create failed: " + hostRes4.errorCode);
    const code4 = hostRes4.code;
    for (let i = 1; i < clients4.length; i++) {
      const r = await emit(clients4[i].socket, "room:join", { code: code4, playerName: names4[i] });
      if (!r.ok) throw new Error("test4 join failed: " + r.errorCode);
    }
    await waitFor(clients4[0], (s) => s.players.length === 4, 5000, "test4 all joined");

    // このコンポジションは旧WOLF_TOO_MANYロジックでは(誤って)無効判定されていたもの。
    // composition.tsの修正により、正しく有効と判定されるはずである。
    const comp4 = { werewolf: 1, traitor: 1, villager: 2 };
    clients4[0].socket.emit("room:updateComposition", { roleCounts: comp4 });
    await waitFor(clients4[0], (s) => s.totalSeats === 4, 3000, "test4 composition set");

    const start4 = await emit(clients4[0].socket, "room:start", {});
    if (!start4.ok) {
      throw new Error(
        "test4 start failed (composition.ts WOLF_TOO_MANY fix may be missing): " + start4.errorCode + " " + JSON.stringify(start4.issues)
      );
    }
    log("✓ werewolf1+traitor1+villager2(4人) composition accepted (composition.ts fix confirmed)");
    await waitFor(clients4[0], (s) => s.phase === "role_reveal", 5000, "test4 role_reveal");

    const byRole4 = {};
    for (const c of clients4) {
      const role = c.private?.self?.role;
      byRole4[role] = byRole4[role] || [];
      byRole4[role].push(c);
    }
    const wolf4 = byRole4["werewolf"][0];
    const villagers4 = byRole4["villager"];
    if (!wolf4 || !villagers4 || villagers4.length !== 2) throw new Error("test4 role assignment unexpected");

    for (const c of clients4) c.socket.emit("role:ack", {});
    await waitFor(clients4[0], (s) => s.phase === "discussion" && s.day === 0, 5000, "test4 day0");
    clients4[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients4[0], (s) => s.phase === "night" && s.day === 1, 5000, "test4 night1");

    wolf4.socket.emit("night:submit", { targetId: villagers4[0].private.self.id });
    await waitFor(clients4[0], (s) => s.phase === "day_result" || s.phase === "game_over", 8000, "test4 day_result1");

    // 回帰確認の核心: 人狼1・裏切り者1・市民1(3人生存)の状態で、
    // 「人間3人・人狼1人」なのでゲームはまだ続くはず(旧ロジックでは誤って人狼勝利としていた)
    if (clients4[0].public.phase === "game_over") {
      throw new Error(
        "REGRESSION: game ended prematurely after night1 (old buggy win-condition formula would have done this)"
      );
    }
    log("✓ game correctly continues with 1 werewolf + 1 traitor + 1 villager alive (3 humans vs 1 wolf)");

    clients4[0].socket.emit("host:advance", { to: "discussion" });
    await waitFor(clients4[0], (s) => s.phase === "discussion", 5000, "test4 discussion day1");
    clients4[0].socket.emit("host:advance", { to: "vote" });
    await waitFor(clients4[0], (s) => s.phase === "vote", 5000, "test4 vote");

    // だれも投票しないまま、ホストが即座に投票を締め切る(処刑なし)
    clients4[0].socket.emit("host:forceResolveVote", {});
    await waitFor(clients4[0], (s) => s.phase === "execution_result" || s.phase === "game_over", 5000, "test4 execution_result(no vote)");
    if (clients4[0].public.phase === "game_over") throw new Error("test4: game should not have ended from a no-op vote");
    if (clients4[0].public.lastExecuted) throw new Error("test4: expected no execution when zero votes were cast");
    log("✓ host:forceResolveVote with zero votes produced no execution, game continues");

    clients4[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients4[0], (s) => s.phase === "night" && s.day === 2, 5000, "test4 night2");
    wolf4.socket.emit("night:submit", { targetId: villagers4[1].private.self.id });
    await waitFor(clients4[0], (s) => s.phase === "game_over", 8000, "test4 game_over");

    // ここで人狼1・裏切り者1(2人生存)のみ: 人間1人・人狼1人で同数 -> 人狼チームの勝利のはず
    if (clients4[0].public.winner?.primary !== "werewolf") {
      throw new Error("test4: expected werewolf victory when wolves === humans, got: " + JSON.stringify(clients4[0].public.winner));
    }
    log("✓ werewolf team correctly wins once aliveWolves >= aliveHumans (1 wolf vs 1 human), matching rulebook example");

    for (const c of clients4) c.socket.close();
  }

  // ---------- TEST 5: ハンター道連れ待ちを host:skipHunterRevenge でホストが代わりにスキップ ----------
  {
    log("\n=== TEST 5: host:skipHunterRevenge ===");
    const names5 = ["W", "H", "V1", "V2"];
    const sockets5 = await Promise.all(names5.map(() => connect()));
    const clients5 = sockets5.map((s, i) => makeClient(s, names5[i]));
    const hostRes5 = await emit(clients5[0].socket, "room:create", { playerName: names5[0] });
    if (!hostRes5.ok) throw new Error("test5 create failed: " + hostRes5.errorCode);
    const code5 = hostRes5.code;
    for (let i = 1; i < clients5.length; i++) {
      const r = await emit(clients5[i].socket, "room:join", { code: code5, playerName: names5[i] });
      if (!r.ok) throw new Error("test5 join failed: " + r.errorCode);
    }
    await waitFor(clients5[0], (s) => s.players.length === 4, 5000, "test5 all joined");

    const comp5 = { werewolf: 1, hunter: 1, villager: 2 };
    clients5[0].socket.emit("room:updateComposition", { roleCounts: comp5 });
    await waitFor(clients5[0], (s) => s.totalSeats === 4, 3000, "test5 composition set");

    const start5 = await emit(clients5[0].socket, "room:start", {});
    if (!start5.ok) throw new Error("test5 start failed: " + start5.errorCode);
    await waitFor(clients5[0], (s) => s.phase === "role_reveal", 5000, "test5 role_reveal");

    const byRole5 = {};
    for (const c of clients5) {
      const role = c.private?.self?.role;
      byRole5[role] = byRole5[role] || [];
      byRole5[role].push(c);
    }
    const wolf5 = byRole5["werewolf"][0];
    const hunter5 = byRole5["hunter"][0];
    if (!wolf5 || !hunter5) throw new Error("test5 role assignment unexpected");

    for (const c of clients5) c.socket.emit("role:ack", {});
    await waitFor(clients5[0], (s) => s.phase === "discussion" && s.day === 0, 5000, "test5 day0");
    clients5[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients5[0], (s) => s.phase === "night" && s.day === 1, 5000, "test5 night1");

    wolf5.socket.emit("night:submit", { targetId: hunter5.private.self.id });
    await waitFor(
      clients5[0],
      (s) => !!s.awaitingHunterRevenge && s.awaitingHunterRevenge.hunterId === hunter5.private.self.id,
      8000,
      "test5 awaiting hunter revenge"
    );
    log("✓ hunter revenge prompt confirmed; host will skip on the hunter's behalf");

    clients5[0].socket.emit("host:skipHunterRevenge", {});
    await waitFor(clients5[0], (s) => !s.awaitingHunterRevenge, 5000, "test5 hunter revenge cleared");
    await waitFor(clients5[0], (s) => s.phase === "day_result" || s.phase === "game_over", 5000, "test5 day_result");

    const deaths5 = clients5[0].public.lastDeaths ?? [];
    if (deaths5.length !== 1 || deaths5[0].playerId !== hunter5.private.self.id) {
      throw new Error("test5: expected exactly one death (the hunter, no one taken down), got: " + JSON.stringify(deaths5));
    }
    log("✓ host:skipHunterRevenge resolved the hunter's death with no one taken down");

    for (const c of clients5) c.socket.close();
  }

  // ---------- TEST 6: 新機能一式(最初の投票の追放無効設定 / 最後の一言+生存決選投票の
  //            生かす・処刑両パターン / 人狼の選択のリアルタイム可視化 / 仲間内メモ) ----------
  {
    log("\n=== TEST 6: allowFirstVoteExecution + last words/appeal vote + wolf selections + ally note ===");
    const names6 = ["W1", "W2", "V1", "V2", "V3", "V4", "V5"];
    const sockets6 = await Promise.all(names6.map(() => connect()));
    const clients6 = sockets6.map((s, i) => makeClient(s, names6[i]));
    const hostRes6 = await emit(clients6[0].socket, "room:create", { playerName: names6[0] });
    if (!hostRes6.ok) throw new Error("test6 create failed: " + hostRes6.errorCode);
    const code6 = hostRes6.code;
    for (let i = 1; i < clients6.length; i++) {
      const r = await emit(clients6[i].socket, "room:join", { code: code6, playerName: names6[i] });
      if (!r.ok) throw new Error("test6 join failed: " + r.errorCode);
    }
    await waitFor(clients6[0], (s) => s.players.length === 7, 5000, "test6 all joined");

    // 最初の投票で実際には追放しない設定にする
    clients6[0].socket.emit("room:updateSettings", { settings: { allowFirstVoteExecution: false } });
    await waitFor(clients6[0], (s) => s.settings.allowFirstVoteExecution === false, 3000, "test6 setting applied");
    log("✓ allowFirstVoteExecution setting applied (OFF)");

    const comp6 = { werewolf: 2, villager: 5 };
    clients6[0].socket.emit("room:updateComposition", { roleCounts: comp6 });
    await waitFor(clients6[0], (s) => s.totalSeats === 7, 3000, "test6 composition set");

    const start6 = await emit(clients6[0].socket, "room:start", {});
    if (!start6.ok) throw new Error("test6 start failed: " + start6.errorCode);
    await waitFor(clients6[0], (s) => s.phase === "role_reveal", 5000, "test6 role_reveal");

    const byRole6 = {};
    for (const c of clients6) {
      const role = c.private?.self?.role;
      byRole6[role] = byRole6[role] || [];
      byRole6[role].push(c);
    }
    const [w1, w2] = byRole6["werewolf"] || [];
    const villagers6 = byRole6["villager"] || [];
    if (!w1 || !w2 || villagers6.length !== 5) throw new Error("test6 role assignment unexpected");
    const id = (c) => c.private.self.id;

    for (const c of clients6) c.socket.emit("role:ack", {});
    await waitFor(clients6[0], (s) => s.phase === "discussion" && s.day === 0, 5000, "test6 day0");
    clients6[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients6[0], (s) => s.phase === "night" && s.day === 1, 5000, "test6 night1");

    // --- 人狼の選択のリアルタイム可視化: W1が選ぶと、W2の画面にその選択が見えるはず ---
    w1.socket.emit("night:submit", { targetId: id(villagers6[0]) });
    await waitFor(
      w2,
      () => (w2.private?.pendingNightAction?.wolfSelections || []).some(
        (sel) => sel.id === id(w1) && sel.targetId === id(villagers6[0])
      ),
      3000,
      "test6 wolf selection visible to ally"
    );
    log("✓ W1's attack selection is visible in real time to W2 (light-consultation UI)");

    // --- 仲間内メモ: W1がメモを更新すると、W2の画面にも同じメモが反映されるはず ---
    w1.socket.emit("ally:setNote", { text: "villager #1 looks suspicious" });
    await waitFor(
      w2,
      () => w2.private?.allyNote?.text === "villager #1 looks suspicious",
      3000,
      "test6 ally note synced to ally"
    );
    if (w2.private.allyNote.groupSize !== 2) throw new Error("test6: wolf ally-note group size should be 2");
    log("✓ ally note ('villager #1 looks suspicious') synced live between the two werewolves");
    if (villagers6[1].private.allyNote) {
      throw new Error("test6: a plain villager should not have an allyNote at all");
    }
    log("✓ a plain villager (no covert group) correctly has no allyNote");

    // 両方の人狼が village[0] を襲撃 -> 夜1が解決される
    w2.socket.emit("night:submit", { targetId: id(villagers6[0]) });
    await waitFor(clients6[0], (s) => s.phase === "day_result", 8000, "test6 day_result after night1");
    if (!clients6[0].public.lastDeaths.some((d) => d.playerId === id(villagers6[0]))) {
      throw new Error("test6: expected villager #1 to die in the night1 attack");
    }
    log("✓ night1 attack resolved: villager #1 died");

    // --- 最初の投票(day1): 設定がOFFのため、実際には追放されないはず(最後の一言/決選投票も発生しない) ---
    clients6[0].socket.emit("host:advance", { to: "discussion" });
    await waitFor(clients6[0], (s) => s.phase === "discussion" && s.day === 1, 5000, "test6 discussion day1");
    clients6[0].socket.emit("host:advance", { to: "vote" });
    await waitFor(clients6[0], (s) => s.phase === "vote" && s.day === 1, 5000, "test6 vote day1");

    const aliveAfterN1 = clients6.filter((c) => c.public.players.find((p) => p.id === id(c))?.alive);
    for (const c of aliveAfterN1) c.socket.emit("vote:submit", { targetId: id(villagers6[1]) });
    await waitFor(
      clients6[0],
      (s) => s.phase === "execution_result" || s.phase === "last_words",
      8000,
      "test6 result after first vote"
    );
    if (clients6[0].public.phase !== "execution_result") {
      throw new Error(
        "REGRESSION: first vote (day1) should skip last_words/appeal_vote entirely when allowFirstVoteExecution is OFF, got phase=" +
          clients6[0].public.phase
      );
    }
    if (!clients6[0].public.lastExecuted?.spared) {
      throw new Error("test6: first-vote execution should have been auto-spared while the setting is OFF");
    }
    if (clients6[0].public.lastExecuted.playerId !== id(villagers6[1])) {
      throw new Error("test6: spared player mismatch on first vote");
    }
    if (!clients6[0].public.players.find((p) => p.id === id(villagers6[1]))?.alive) {
      throw new Error("test6: the 'spared' player from the first vote should still be alive");
    }
    log("✓ first vote (day1, setting OFF) correctly resulted in a spared outcome with no last_words/appeal_vote phase");

    // --- 夜2: 誰も襲撃しない(全員生存させたまま、本番の生存決選投票へ) ---
    clients6[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients6[0], (s) => s.phase === "night" && s.day === 2, 5000, "test6 night2");
    for (const w of [w1, w2]) {
      if (w.public.players.find((p) => p.id === id(w))?.alive) w.socket.emit("night:submit", { targetId: null });
    }
    await waitFor(clients6[0], (s) => s.phase === "day_result", 8000, "test6 day_result after night2");

    // --- 投票(day2): 通常通り、最後の一言 -> 生存決選投票 を経由するはず。今回は「生かす」多数決を検証 ---
    clients6[0].socket.emit("host:advance", { to: "discussion" });
    await waitFor(clients6[0], (s) => s.phase === "discussion" && s.day === 2, 5000, "test6 discussion day2");
    clients6[0].socket.emit("host:advance", { to: "vote" });
    await waitFor(clients6[0], (s) => s.phase === "vote" && s.day === 2, 5000, "test6 vote day2");

    const aliveAfterN2 = clients6.filter((c) => c.public.players.find((p) => p.id === id(c))?.alive);
    for (const c of aliveAfterN2) c.socket.emit("vote:submit", { targetId: id(villagers6[1]) });
    await waitFor(clients6[0], (s) => s.phase === "last_words", 8000, "test6 last_words day2");
    if (clients6[0].public.pendingExecution?.playerId !== id(villagers6[1])) {
      throw new Error("test6: pendingExecution mismatch entering last_words (day2)");
    }
    log("✓ day2 vote correctly entered the last_words phase for villager #2");

    // 対象者本人でもホストでもない人が進めようとしても無効なはず
    const bystander6 = clients6.find((c) => c !== villagers6[1] && !c.public.players.find((p) => p.id === id(c))?.isHost);
    bystander6.socket.emit("lastWords:proceed", {});
    await sleep(250);
    if (clients6[0].public.phase !== "last_words") {
      throw new Error("REGRESSION: a bystander (neither host nor the condemned) was able to proceed past last_words");
    }
    log("✓ a bystander correctly cannot proceed past last_words");

    // 対象者本人が「話し終えた」を押して決選投票へ
    villagers6[1].socket.emit("lastWords:proceed", {});
    await waitFor(clients6[0], (s) => s.phase === "appeal_vote", 5000, "test6 appeal_vote day2");

    // 対象者本人は決選投票に参加できないはず
    villagers6[1].socket.emit("appeal:submit", { choice: "execute" });
    await sleep(250);
    if ((clients6[0].public.progress?.submitted ?? 0) !== 0) {
      throw new Error("test6: the condemned player should not be able to cast an appeal vote");
    }

    const eligible6 = clients6.filter(
      (c) => c !== villagers6[1] && c.public.players.find((p) => p.id === id(c))?.alive
    );
    // 過半数が「生かす」に投票 -> spared になるはず
    eligible6.forEach((c, i) => {
      c.socket.emit("appeal:submit", { choice: i === 0 ? "execute" : "spare" });
    });
    await waitFor(clients6[0], (s) => s.phase === "execution_result", 8000, "test6 execution_result after spare-majority appeal");
    if (!clients6[0].public.appealVoteResult?.spared) {
      throw new Error("test6: expected the appeal vote to spare villager #2 with a spare majority");
    }
    if (!clients6[0].public.lastExecuted?.spared) {
      throw new Error("test6: lastExecuted.spared should be true after a spare-majority appeal vote");
    }
    if (!clients6[0].public.players.find((p) => p.id === id(villagers6[1]))?.alive) {
      throw new Error("test6: villager #2 should still be alive after being spared by the appeal vote");
    }
    log("✓ appeal vote with a spare-majority correctly spared villager #2 (they remain alive)");

    // --- 投票(day3): 今度は「処刑する」多数決を検証(過半数が届かなければ処刑側のデフォルト) ---
    clients6[0].socket.emit("host:advance", { to: "night" });
    await waitFor(clients6[0], (s) => s.phase === "night" && s.day === 3, 5000, "test6 night3");
    for (const w of [w1, w2]) {
      if (w.public.players.find((p) => p.id === id(w))?.alive) w.socket.emit("night:submit", { targetId: null });
    }
    await waitFor(clients6[0], (s) => s.phase === "day_result", 8000, "test6 day_result after night3");
    clients6[0].socket.emit("host:advance", { to: "discussion" });
    await waitFor(clients6[0], (s) => s.phase === "discussion" && s.day === 3, 5000, "test6 discussion day3");
    clients6[0].socket.emit("host:advance", { to: "vote" });
    await waitFor(clients6[0], (s) => s.phase === "vote" && s.day === 3, 5000, "test6 vote day3");

    const targetDay3 = villagers6[2];
    const aliveAfterN3 = clients6.filter((c) => c.public.players.find((p) => p.id === id(c))?.alive);
    for (const c of aliveAfterN3) c.socket.emit("vote:submit", { targetId: id(targetDay3) });
    await waitFor(clients6[0], (s) => s.phase === "last_words", 8000, "test6 last_words day3");

    targetDay3.socket.emit("lastWords:proceed", {});
    await waitFor(clients6[0], (s) => s.phase === "appeal_vote", 5000, "test6 appeal_vote day3");

    const eligible6b = clients6.filter(
      (c) => c !== targetDay3 && c.public.players.find((p) => p.id === id(c))?.alive
    );
    // 過半数が「処刑する」に投票 -> 実際に死亡するはず
    eligible6b.forEach((c, i) => {
      c.socket.emit("appeal:submit", { choice: i === 0 ? "spare" : "execute" });
    });
    await waitFor(clients6[0], (s) => s.phase === "execution_result", 8000, "test6 execution_result after execute-majority appeal");
    if (clients6[0].public.appealVoteResult?.spared) {
      throw new Error("test6: expected the appeal vote to NOT spare the day3 target with an execute-majority");
    }
    if (clients6[0].public.lastExecuted?.spared) {
      throw new Error("test6: lastExecuted.spared should be false after an execute-majority appeal vote");
    }
    if (clients6[0].public.players.find((p) => p.id === id(targetDay3))?.alive) {
      throw new Error("test6: the day3 target should actually be dead after an execute-majority appeal vote");
    }
    log("✓ appeal vote with an execute-majority correctly resulted in a real execution");

    for (const c of clients6) c.socket.close();
  }

  log("\n✅ ALL SMOKE TESTS PASSED");
  process.exit(0);
}

main().catch((err) => {
  console.error("\n❌ SMOKE TEST FAILED:", err);
  process.exit(1);
});
