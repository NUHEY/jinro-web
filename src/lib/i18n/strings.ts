import type { RoleId, Team, NightActionType } from "@/lib/game/roles";
import type { DeathCause } from "@/lib/game/types";

export type Locale = "ja" | "en" | "ko";
export const LOCALES: Locale[] = ["ja", "en", "ko"];

interface RoleText {
  name: string;
  short: string;
  detail: string;
}

export type ValidationIssue =
  | { code: "SEAT_MISMATCH"; total: number; playerCount: number }
  | { code: "NO_WEREWOLF" }
  | { code: "MASON_ODD" }
  | { code: "LOVER_INVALID" }
  | { code: "WOLF_TOO_MANY" };

export type ErrorCode =
  | "ROOM_NOT_FOUND"
  | "GAME_ALREADY_STARTED"
  | "ROOM_FULL"
  | "REJOIN_FAILED"
  | "PLAYER_NOT_FOUND"
  | "NOT_HOST"
  | "ALREADY_STARTED"
  | "NOT_IN_ROOM"
  | "MIN_PLAYERS"
  | "KICKED"
  | "INVALID_ROOM_CODE"
  | "ROOM_CODE_TAKEN";

interface Strings {
  meta: { title: string; description: string };
  common: {
    host: string;
    connected: string;
    disconnected: string;
    reconnecting: string;
    connecting: string;
    kicked: string;
    seconds: (n: number) => string;
    timeRemaining: string;
    close: string;
    cancel: string;
    people: (n: number) => string;
    listSeparator: string;
    confirmProceed: string;
    transitioning: string;
    on: string;
    off: string;
    themeToggleToLight: string;
    themeToggleToDark: string;
  };
  entry: {
    title: string;
    subtitle: string;
    cardTitle: string;
    cardDesc: string;
    tabCreate: string;
    tabJoin: string;
    nameLabel: string;
    namePlaceholder: string;
    createButton: string;
    codeLabel: string;
    codePlaceholder: string;
    joinButton: string;
    footerNote: string;
    helpButton: string;
    customCodeLabel: string;
    customCodePlaceholder: string;
    customCodeHint: string;
    avatarLabel: string;
    avatarAddButton: string;
    avatarChangeButton: string;
    avatarRemoveButton: string;
    avatarTooLarge: string;
    avatarUnsupported: string;
  };
  profile: {
    editButton: string;
    title: string;
    desc: string;
    nameLabel: string;
    avatarLabel: string;
    saveButton: string;
    savedToast: string;
    closeButton: string;
  };
  lobby: {
    codeLabel: string;
    copyCode: string;
    copyLink: string;
    copyCodeToast: string;
    copyLinkToast: string;
    copyErrorToast: string;
    participants: (n: number) => string;
    waitingForMorePlayers: (n: number) => string;
    composition: string;
    compositionReadonly: string;
    compositionReadonlyDesc: (wolves: number, total: number) => string;
    compositionEmpty: string;
    roomInfoButton: string;
    roomInfoTitle: string;
    suggest: string;
    seatTotal: string;
    seatTotalOf: (total: number, count: number) => string;
    soloGroupLabel: string;
    startButton: string;
    waitingHost: string;
    leaveButton: string;
    settingsTitle: string;
    revealOnDeath: string;
    allowFirstNightKill: string;
    allowFirstNightKillDesc: string;
    allowFirstVoteExecution: string;
    allowFirstVoteExecutionDesc: string;
    seerFirstNightDivine: string;
    seerFirstNightDivineDesc: string;
    allowSelfVote: string;
    revealVoteChoices: string;
    revealVoteChoicesDesc: string;
    hunterRevengeOnAnyDeath: string;
    hunterRevengeOnAnyDeathDesc: string;
    allowBodyguardSelfGuard: string;
    secondTieExecutesRandomly: string;
    secondTieExecutesRandomlyDesc: string;
    dictatorCanTargetSelf: string;
    settingsPacingNote: string;
    kick: string;
    makeHost: string;
    makeHostConfirmTitle: string;
    makeHostConfirmDesc: (name: string) => string;
    makeHostConfirmAction: string;
  };
  roleReveal: {
    label: string;
    tapToReveal: string;
    privacyHint: string;
    allies: string;
    allRoles: string;
    waitingOthers: string;
    confirmButton: string;
    progress: (submitted: number, total: number) => string;
    earlyDivineTitle: string;
    earlyDivineDesc: string;
    earlyDivineButton: string;
    earlyDivineSkipNote: string;
    earlyDivineDone: string;
  };
  night: {
    tag: (day: number) => string;
    deadNotice: string;
    dormant: string;
    dormantDesc: string;
    progress: (submitted: number, total: number) => string;
    submitButton: string;
    resubmitButton: string;
    previousSeerResult: (day: number) => string;
    seerResultLine: (name: string, isBlack: boolean) => string;
    actions: Record<Exclude<NightActionType, "none">, { title: string; desc: string; skip: string }>;
    firstNightKillDisabledNotice: string;
    forceAdvanceButton: string;
    wolfSelectionsTitle: string;
    wolfSelectionsEmpty: string;
    wolfSelectionsLine: (name: string, targetName: string | null) => string;
    wolfConsensusNeeded: string;
    wolfConsensusReached: string;
  };
  hunterRevenge: {
    title: string;
    waitingFor: (name: string) => string;
    youAre: string;
    skip: string;
    submit: string;
    submitted: string;
    hostSkipButton: string;
  };
  dayResult: {
    tag: (day: number) => string;
    noDeaths: string;
    seerResult: string;
    continueButton: string;
    waitingHost: string;
  };
  discussion: {
    tag: (day: number) => string;
    firstRoundTag: string;
    firstRoundNotice: string;
    proceedToNightButton: string;
    survivors: string;
    dictatorButton: string;
    dictatorConfirmTitle: string;
    dictatorConfirmDesc: string;
    dictatorConfirmAction: string;
    skipButton: string;
    waitingHost: string;
    runoffNotice: string;
    runoffCandidatesLabel: string;
  };
  vote: {
    tag: (day: number) => string;
    runoffTag: (day: number) => string;
    cannotVote: string;
    instructions: string;
    runoffNotice: string;
    submitButton: string;
    submittedButton: string;
    progress: (submitted: number, total: number) => string;
    forceAdvanceButton: string;
    voteChoicesTitle: string;
    voteChoicesLine: (voterName: string, targetName: string) => string;
  };
  executionResult: {
    tag: (day: number) => string;
    executed: (name: string) => string;
    spared: (name: string) => string;
    sparedFirstVoteRule: (name: string) => string;
    noExecution: string;
    mediumResult: string;
    mediumResultLine: (name: string, isBlack: boolean) => string;
    continueButton: string;
    waitingHost: string;
  };
  lastWords: {
    tag: (day: number) => string;
    title: string;
    waitingFor: (name: string) => string;
    youAreTitle: string;
    youAreDesc: string;
    proceedButton: string;
    waitingHost: string;
  };
  appealVote: {
    tag: (day: number) => string;
    instructions: (name: string) => string;
    cannotVote: string;
    executeOption: string;
    spareOption: string;
    submitButton: string;
    submittedButton: string;
    progress: (submitted: number, total: number) => string;
    forceAdvanceButton: string;
  };
  allyNote: {
    title: string;
    placeholder: string;
    hint: string;
    groupSize: (n: number) => string;
  };
  gameOver: {
    primary: Record<"village" | "werewolf" | "draw", string>;
    extra: Record<"fox" | "god" | "lover", string>;
    allRoles: string;
    eliminated: string;
    newGameButton: string;
    waitingHost: string;
    leaveButton: string;
  };
  confirm: {
    advanceTitle: string;
    advanceDesc: string;
    advanceAction: string;
    forceResolveTitle: string;
    forceResolveDesc: string;
    forceResolveAction: string;
    newGameTitle: string;
    newGameDesc: string;
    newGameAction: string;
    skipHunterRevengeTitle: string;
    skipHunterRevengeDesc: string;
    skipHunterRevengeAction: string;
  };
  help: {
    button: string;
    title: string;
    tldr: string;
    tabFlow: string;
    tabWin: string;
    tabRoles: string;
    intro: string;
    flowTitle: string;
    flowSteps: Array<{ title: string; desc: string }>;
    winTitle: string;
    winIntro: string;
    winVillage: string;
    winWerewolf: string;
    winFox: string;
    winGod: string;
    winLover: string;
    rolesTitle: string;
    rolesIntro: string;
    close: string;
  };
  myRole: {
    button: string;
    title: string;
    dayLabel: (day: number) => string;
    seerHistoryTitle: string;
    seerHistoryEmpty: string;
    mediumHistoryTitle: string;
    mediumHistoryEmpty: string;
    noRoleYet: string;
    close: string;
  };
  team: Record<Team, string>;
  deathCause: Record<DeathCause, string>;
  roles: Record<RoleId, RoleText>;
  errors: Record<ErrorCode, string>;
  validation: (issue: ValidationIssue) => string;
}

const ja: Strings = {
  meta: {
    title: "人狼DX オンライン",
    description: "会話型心理ゲーム「人狼DX 新装版」のオンライン進行アプリ。集まったメンバーでスマホ片手に遊べます。",
  },
  common: {
    host: "ホスト",
    connected: "接続中",
    disconnected: "切断",
    reconnecting: "再接続中…",
    connecting: "接続しています…",
    kicked: "ホストによって部屋から退出させられました。",
    seconds: (n) => `${n}秒`,
    timeRemaining: "残り時間",
    close: "閉じる",
    cancel: "キャンセル",
    people: (n) => `${n}人`,
    listSeparator: "、",
    confirmProceed: "進める",
    transitioning: "次の場面へ移ります…",
    on: "ON",
    off: "OFF",
    themeToggleToLight: "ライトモードに切り替え",
    themeToggleToDark: "ダークモードに切り替え",
  },
  entry: {
    title: "人狼DX オンライン",
    subtitle: "「会話型心理ゲーム 人狼DX 新装版」13役職対応。どこからでもスマホ片手に遊べます。",
    cardTitle: "はじめる",
    cardDesc: "部屋を作るか、合言葉コードで参加してください。",
    tabCreate: "部屋を作る",
    tabJoin: "部屋に入る",
    nameLabel: "ニックネーム",
    namePlaceholder: "例: たろう",
    createButton: "部屋を作成する",
    codeLabel: "合言葉コード",
    codePlaceholder: "例: AB3XZ",
    joinButton: "参加する",
    footerNote: "※このアプリにチャット機能はありません。会話しながら遊んでください。",
    helpButton: "遊び方・ルールを見る",
    customCodeLabel: "ルームコード(任意)",
    customCodePlaceholder: "空欄なら自動生成されます",
    customCodeHint: "半角英数字5〜8文字。指定しない場合は自動で発行されます。",
    avatarLabel: "プロフィール写真(任意)",
    avatarAddButton: "写真を追加",
    avatarChangeButton: "写真を変更",
    avatarRemoveButton: "写真を削除",
    avatarTooLarge: "画像のサイズが大きすぎます(8MBまで)",
    avatarUnsupported: "画像ファイルを選択してください",
  },
  profile: {
    editButton: "プロフィールを編集",
    title: "プロフィール編集",
    desc: "表示名とプロフィール写真はいつでも変更できます。",
    nameLabel: "ニックネーム",
    avatarLabel: "プロフィール写真",
    saveButton: "保存する",
    savedToast: "プロフィールを更新しました",
    closeButton: "閉じる",
  },
  lobby: {
    codeLabel: "合言葉コード",
    copyCode: "コードをコピー",
    copyLink: "招待リンクをコピー",
    copyCodeToast: "コードをコピーしました",
    copyLinkToast: "招待リンクをコピーしました",
    copyErrorToast: "コピーに失敗しました",
    participants: (n) => `参加者 (${n}人)`,
    waitingForMorePlayers: (n) => `あと${n}人集まるとゲームを開始できます`,
    composition: "役職構成",
    compositionReadonly: "役職構成(ホストが設定中)",
    compositionReadonlyDesc: (wolves, total) => `人狼 ${wolves}人を含む、合計 ${total}人分の役職が設定されています。`,
    compositionEmpty: "まだ役職が設定されていません。",
    roomInfoButton: "配役・設定",
    roomInfoTitle: "今回の配役・ゲーム設定",
    suggest: "おすすめ配役",
    seatTotal: "役職の合計",
    seatTotalOf: (total, count) => `${total} / ${count} 人`,
    soloGroupLabel: "単独陣営",
    startButton: "ゲームを開始する",
    waitingHost: "ホストの開始を待っています…",
    leaveButton: "退出する",
    settingsTitle: "ゲーム設定",
    revealOnDeath: "死亡時に役職を公開する",
    allowFirstNightKill: "最初の夜、人狼は襲撃できる",
    allowFirstNightKillDesc: "オフにすると、最初の夜(1日目の夜)だけ人狼が誰を襲撃しても死にません。人狼DXに慣れていないメンバーが多い場合におすすめの設定です。2日目以降の夜は通常通り襲撃が有効になります。",
    allowFirstVoteExecution: "最初の投票で、実際に追放できる",
    allowFirstVoteExecutionDesc: "オフにすると、最初の投票(1日目の投票)で誰が選ばれても実際には追放されず、生かされます。2日目以降の投票は通常通り追放が有効になります。",
    seerFirstNightDivine: "予言者は役職確認のときに1人占える(発展ルール)",
    seerFirstNightDivineDesc: "説明書11ページの発展ルールです。役職確認のタイミングで、予言者が1人を占うことができます(7人以上でのプレイ推奨)。占うかどうかは予言者が自由に選べます。",
    allowSelfVote: "投票で自分自身に投票できる",
    revealVoteChoices: "投票内容を全員に公開する",
    revealVoteChoicesDesc: "ONにすると、投票フェーズ中に「誰が誰に投票しているか」がリアルタイムで全員に見えるようになります。OFFの場合は今まで通り、票数の集計のみが公開されます。",
    hunterRevengeOnAnyDeath: "ハンターの道連れを、あらゆる死因で発動させる",
    hunterRevengeOnAnyDeathDesc: "標準ルールでは、ハンターの道連れは襲撃・処刑で死亡した時のみ発動します。ONにすると、呪殺や恋人の後追いなど他の死因でも発動するようになります。",
    allowBodyguardSelfGuard: "ボディーガードが自分自身を護衛できる",
    secondTieExecutesRandomly: "決選投票でも同数タイの場合、ランダムに処刑する",
    secondTieExecutesRandomlyDesc: "OFFにすると、決選投票でも決着がつかなかった場合は誰も処刑されずにその日が終わります。",
    dictatorCanTargetSelf: "独裁者が自分自身を処刑対象にできる",
    settingsPacingNote: "このアプリに自動タイマーはありません。それぞれの画面はホストの操作、または全員の行動がそろったタイミングで進みます。自分たちのペースでどうぞ。",
    kick: "退出させる",
    makeHost: "ホストにする",
    makeHostConfirmTitle: "ホストを交代しますか？",
    makeHostConfirmDesc: (name) => `${name}さんを新しいホストにします。あなたはホスト権限を失い、進行操作などができなくなります。`,
    makeHostConfirmAction: "交代する",
  },
  roleReveal: {
    label: "あなたの役職",
    tapToReveal: "タップして確認",
    privacyHint: "周りの人に見られないように確認してください",
    allies: "あなたの仲間",
    allRoles: "全プレイヤーの役職",
    waitingOthers: "確認しました。全員の確認が終わると、自動的に最初の話し合いへ進みます。",
    confirmButton: "確認しました",
    progress: (s, t) => `確認済み: ${s} / ${t} 人`,
    earlyDivineTitle: "予言者の力を今すぐ使う(任意)",
    earlyDivineDesc: "役職確認のタイミングで、1人を占うことができます。使わずに進めても構いません。",
    earlyDivineButton: "この人を占う",
    earlyDivineSkipNote: "占わずに「確認しました」を押して進めることもできます。",
    earlyDivineDone: "占い済みです。結果は以下の通りです。",
  },
  night: {
    tag: (day) => `夜 ${day}日目`,
    deadNotice: "あなたは既に脱落しています。夜が明けるのを静かに見守りましょう…",
    dormant: "夜が更けています…",
    dormantDesc: "能力を持つ人が行動を終えるまでお待ちください。",
    progress: (s, t) => `行動完了: ${s} / ${t} 人`,
    submitButton: "決定する",
    resubmitButton: "送信済み(変更する)",
    previousSeerResult: (day) => `前回の占い結果(${day}日目)`,
    seerResultLine: (name, isBlack) => `${name}さんは${isBlack ? "【黒(人狼)】" : "【白】"}でした`,
    actions: {
      attack: { title: "誰を襲撃しますか？", desc: "仲間の人狼と相談して、今夜襲う相手を選んでください。", skip: "今夜は襲撃しない" },
      guard: { title: "誰を守りますか？", desc: "人狼の襲撃から守る相手を選んでください。自分は守れません。また、前回の夜に守った相手は選べません。", skip: "今夜は誰も守らない" },
      divine: { title: "誰を占いますか？", desc: "相手が人狼かどうかを占います。", skip: "今夜は占わない" },
    },
    firstNightKillDisabledNotice: "設定により、最初の夜(1日目)は誰を襲撃しても死にません。2日目以降の夜は通常通り効果があります。",
    forceAdvanceButton: "全員の行動を待たずに進める(ホスト操作)",
    wolfSelectionsTitle: "仲間の人狼が選んでいる相手(相談用)",
    wolfSelectionsEmpty: "まだ誰も選んでいません",
    wolfSelectionsLine: (name, targetName) => `${name}さん: ${targetName ?? "未選択"}`,
    wolfConsensusNeeded: "人狼全員が同じ相手(または全員「襲撃しない」)を選ぶまで、夜は終わりません。話し合って1人に決めましょう。",
    wolfConsensusReached: "全員の意見が一致しました。",
  },
  hunterRevenge: {
    title: "ハンターの正体が明らかに！",
    waitingFor: (name) => `${name}さんが道連れにする相手を選んでいます…`,
    youAre: "あなたはハンターです。道連れにする相手をひとり選べます(選ばなくても構いません)。",
    skip: "誰も道連れにしない",
    submit: "決定する",
    submitted: "送信済み",
    hostSkipButton: "ハンターの代わりに「道連れなし」にする(ホスト操作)",
  },
  dayResult: {
    tag: (day) => `朝 ${day}日目`,
    noDeaths: "昨夜は誰も犠牲になりませんでした。平和な朝です。",
    seerResult: "占いの結果",
    continueButton: "議論タイムへ進む",
    waitingHost: "ホストが議論タイムへ進めるのを待っています…",
  },
  discussion: {
    tag: (day) => `議論タイム ${day}日目`,
    firstRoundTag: "最初の話し合い",
    firstRoundNotice: "役職確認を終えたばかりの、最初の話し合いです。まだ誰も襲われていません。ここでは追放の投票も行いません。自由に話し合ったら、ホストの操作で本当の「夜」へ進みます。",
    proceedToNightButton: "話し合いを終えて夜へ進む",
    survivors: "生存者",
    dictatorButton: "独裁者の権限を発動する",
    dictatorConfirmTitle: "独裁者の権限を発動しますか？",
    dictatorConfirmDesc: "議論を強制終了し、投票なしで指定した人を独断で追放します。この能力はゲーム中1度しか使えません。",
    dictatorConfirmAction: "この人を追放する",
    skipButton: "話し合いを終えて投票へ進む",
    waitingHost: "ホストが次へ進めるのを待っています。時間の制限はないので、納得いくまで話し合いましょう。",
    runoffNotice: "投票が同数だったため、決選投票の前の話し合いです。それでも決まらない場合はランダムで決まります。",
    runoffCandidatesLabel: "決選投票の対象",
  },
  vote: {
    tag: (day) => `投票タイム ${day}日目`,
    runoffTag: (day) => `決選投票 ${day}日目`,
    cannotVote: "あなたは投票できません。結果を見守りましょう。",
    instructions: "追放する人をひとり選んでください",
    runoffNotice: "同数だったため、対象を絞った決選投票です。それでも決まらない場合はランダムで決まります。",
    submitButton: "投票する",
    submittedButton: "投票済み(変更する)",
    progress: (s, t) => `投票完了: ${s} / ${t} 人`,
    forceAdvanceButton: "全員の投票を待たずに締め切る(ホスト操作)",
    voteChoicesTitle: "投票状況(公開設定がONのため全員に見えています)",
    voteChoicesLine: (voter, target) => `${voter} → ${target}`,
  },
  executionResult: {
    tag: (day) => `追放結果 ${day}日目`,
    executed: (name) => `${name}さんが追放されました`,
    spared: (name) => `決選投票の結果、${name}さんは生かされました`,
    sparedFirstVoteRule: (name) =>
      `「最初の投票では実際には追放しない」設定のため、${name}さんは決選投票なしで生かされました`,
    noExecution: "投票の結果、誰も追放されませんでした。",
    mediumResult: "霊媒結果",
    mediumResultLine: (name, isBlack) => `${name}さんは${isBlack ? "【黒(人狼)】" : "【白】"}でした`,
    continueButton: "次の夜へ進む",
    waitingHost: "ホストが次の夜へ進めるのを待っています…",
  },
  lastWords: {
    tag: (day) => `最後の一言 ${day}日目`,
    title: "投票の結果、追放が決まりました",
    waitingFor: (name) => `${name}さんの最後の一言を聞きましょう`,
    youAreTitle: "あなたが追放先に選ばれました",
    youAreDesc: "最後に伝えたいことがあれば、みんなに話してください。話し終えたら下のボタンで進めます。",
    proceedButton: "話し終えた(決選投票へ進む)",
    waitingHost: "本人またはホストが次へ進めるのを待っています…",
  },
  appealVote: {
    tag: (day) => `生存決選投票 ${day}日目`,
    instructions: (name) => `${name}さんを本当に追放しますか？それとも生かしますか？`,
    cannotVote: "あなたはこの決選投票に参加できません(追放対象のため)。結果を見守りましょう。",
    executeOption: "追放する",
    spareOption: "生かす",
    submitButton: "決定する",
    submittedButton: "投票済み(変更する)",
    progress: (s, t) => `投票完了: ${s} / ${t} 人`,
    forceAdvanceButton: "全員の投票を待たずに締め切る(ホスト操作)",
  },
  allyNote: {
    title: "仲間だけのメモ",
    placeholder: "仲間だけに伝わる短いメモ(例: 3番の人を狙う)",
    hint: "周りに気づかれないよう、短い言葉でそっと伝え合いましょう。チャットではなく1枚のメモとして共有されます。",
    groupSize: (n) => `${n}人で共有中`,
  },
  gameOver: {
    primary: {
      village: "市民陣営の勝利！",
      werewolf: "人狼陣営の勝利！",
      draw: "引き分け",
    },
    extra: {
      fox: "妖狐も生き残り、単独勝利！",
      god: "神様も生き残り、単独勝利！",
      lover: "恋人も2人とも生き残り、勝利！",
    },
    allRoles: "全員の役職",
    eliminated: "脱落",
    newGameButton: "同じメンバーでもう一度",
    waitingHost: "ホストが次のゲームを開始するのを待っています…",
    leaveButton: "退出する",
  },
  confirm: {
    advanceTitle: "次へ進みますか?",
    advanceDesc: "全員の準備ができていることを確認してから進めてください。この操作は取り消せません。",
    advanceAction: "次へ進む",
    forceResolveTitle: "強制的に進めますか?",
    forceResolveDesc: "まだ行動・投票していない人がいる場合、その人の分はスキップされます。",
    forceResolveAction: "強制的に進める",
    newGameTitle: "同じメンバーで新しいゲームを始めますか?",
    newGameDesc: "現在の結果はリセットされ、役職の再配布から始まります。",
    newGameAction: "新しいゲームを始める",
    skipHunterRevengeTitle: "道連れの機会をスキップしますか?",
    skipHunterRevengeDesc: "スキップすると、狩人は誰も道連れにできません。",
    skipHunterRevengeAction: "スキップする",
  },
  help: {
    button: "遊び方",
    title: "遊び方・ルール",
    tldr: "ひとことで言うと: 隠れている「人狼」を、市民たちが話し合いで見つけ出して追放するゲームです。",
    tabFlow: "流れ",
    tabWin: "勝利条件",
    tabRoles: "役職",
    intro:
      "人狼DXは、正体を隠した「人狼」を「市民」たちが会話と推理で見つけ出す心理ゲームです。このアプリで役職確認・夜の行動・投票を行います。「昼(議論・投票)」と「夜(能力行動)」を繰り返し、どちらかの陣営が条件を満たすと決着します。このアプリに自動タイマーはなく、各画面はホストの操作か全員の行動がそろったタイミングで進みます。自分たちのペースで遊んでください。",
    flowTitle: "ゲームの流れ",
    flowSteps: [
      { title: "役職確認", desc: "全員が自分だけの役職をこっそり確認し、「確認しました」を押します。周りに見られないように注意しましょう。全員が押し終えるまで次には進みません。" },
      { title: "最初の話し合い", desc: "役職確認の直後に行う、投票なしの話し合いです。まだ誰も襲われていません。自己紹介がてら軽く話したら、ホストの操作で本当の「夜」へ進みます。" },
      { title: "夜", desc: "人狼・予言者・ボディーガードなど、能力を持つ役職だけがこっそり行動します。能力を持たない人は何もせず待機します。ここで初めて人狼の襲撃が発生する可能性があります(設定でオフにすることもできます)。" },
      { title: "朝(結果発表)", desc: "夜に何が起きたか(誰が犠牲になったか)が発表されます。" },
      { title: "議論", desc: "誰が人狼か話し合って推理します。" },
      { title: "投票", desc: "追放する人をひとり選んで投票します。最多票の人が追放され、同数の場合は決選投票になります。" },
      { title: "くり返し", desc: "「夜→朝→議論→投票」を、どちらかの陣営が勝利するまでくり返します。" },
    ],
    winTitle: "勝利条件",
    winIntro: "決着のつき方は陣営によって異なります。複数の陣営が同時に勝利することもあります。",
    winVillage: "市民陣営: 人狼をすべて追放すると勝利。",
    winWerewolf: "人狼陣営: 人狼の数が人狼以外の生存者数以上になると勝利。",
    winFox: "妖狐: ゲーム終了時に生きていれば、単独で勝利(村・人狼の勝敗とは別)。",
    winGod: "神様: ゲーム終了時に生きていれば、単独で勝利。",
    winLover: "恋人: ゲーム終了時に2人とも生きていれば、2人で勝利。",
    rolesTitle: "役職一覧(13種)",
    rolesIntro: "自分の役職の説明は、画面上部の「自分の役職」ボタンからゲーム中いつでも確認できます。",
    close: "閉じる",
  },
  myRole: {
    button: "自分の役職",
    title: "あなたの役職",
    dayLabel: (day) => `${day}日目`,
    seerHistoryTitle: "今まで占った人",
    seerHistoryEmpty: "まだ誰も占っていません。",
    mediumHistoryTitle: "今まで判定した人",
    mediumHistoryEmpty: "まだ判定した人はいません。",
    noRoleYet: "まだ役職が確認されていません。",
    close: "閉じる",
  },
  team: {
    village: "市民陣営",
    werewolf: "人狼陣営",
    fox: "妖狐(単独陣営)",
    god: "神様(単独陣営)",
    lover: "恋人(単独陣営)",
  },
  deathCause: {
    attack: "人狼に襲撃された",
    execution: "追放された",
    curse: "予言者に占われ、呪い殺された",
    hunter: "ハンターに道連れにされた",
    lover_grief: "恋人の後を追った",
  },
  roles: {
    villager: {
      name: "市民",
      short: "特別な能力を持たない村人",
      detail: "あなたは市民です。特別な能力はありません。会話と推理だけを頼りに、人狼を見つけ出して追放しましょう。",
    },
    seer: {
      name: "予言者",
      short: "毎晩ひとりを占い、人狼かどうかを知る",
      detail:
        "あなたは予言者です。毎晩、誰かひとりを占うことができます。その人が「人狼」であれば黒、それ以外なら白と分かります。なお、あなたが妖狐を占うと、妖狐はその夜に呪い殺されます。",
    },
    bodyguard: {
      name: "ボディーガード",
      short: "毎晩ひとりを人狼の襲撃から守る",
      detail:
        "あなたはボディーガードです。毎晩、誰かひとり(自分以外)を選んで人狼の襲撃から守ることができます。守った相手が襲撃対象だった場合、その人は生き残ります。",
    },
    medium: {
      name: "霊媒師",
      short: "追放された人が人狼だったか分かる",
      detail: "あなたは霊媒師です。昼に追放されたプレイヤーが「人狼」であったかどうかを、その夜に知ることができます。",
    },
    hunter: {
      name: "ハンター",
      short: "自分が死ぬとき、ひとり道連れにできる",
      detail:
        "あなたはハンターです。あなたが「追放」または「人狼に襲撃」されて死亡するとき、誰かひとりを道連れに指名して一緒に葬ることができます。",
    },
    mason: {
      name: "共有者",
      short: "2人以上でお互いを知っている村人",
      detail: "あなたは共有者です。他の共有者が誰かを知っています。特別な能力はありませんが、互いを信頼して村を導きましょう。",
    },
    dictator: {
      name: "独裁者",
      short: "1度だけ議論を打ち切り、独断で追放者を決められる",
      detail:
        "あなたは独裁者です。ゲーム中1度だけ、昼の議論中に正体を明かして議論を強制終了させ、投票を行わずに追放者を独断で決定できます。使いどころは慎重に。",
    },
    werewolf: {
      name: "人狼",
      short: "毎晩ひとりを襲撃する。他の人狼が分かる",
      detail:
        "あなたは人狼です。仲間の人狼が誰か分かります。毎晩、仲間と相談して誰かひとりを襲撃してください。正体を隠し通し、市民を人狼と同数まで減らせば勝利です。",
    },
    traitor: {
      name: "裏切り者",
      short: "人狼陣営だが人狼が誰かは分からない村人のふり",
      detail:
        "あなたは裏切り者です。人狼陣営の勝利があなたの勝利になりますが、誰が人狼かは分かりません。占い・霊媒では「白」と判定されます。市民のふりをして人狼陣営を助けましょう。",
    },
    insider: {
      name: "内通者",
      short: "人狼が誰かを知っている人狼陣営の協力者",
      detail:
        "あなたは内通者です。人狼が誰かを知っています。占い・霊媒では「白」と判定されるため、人狼陣営の中でも特に立ち回りやすい存在です。露骨な擁護は避けましょう。",
    },
    fox: {
      name: "妖狐",
      short: "人狼に襲撃されても死なない単独陣営。占われると死ぬ",
      detail:
        "あなたは妖狐です。村・人狼のどちらにも属さない単独陣営で、人狼に襲撃されても死にません。ただし予言者に占われると、その夜のうちに呪い殺されてしまいます。ゲーム終了時に生存していればあなたの勝利です。",
    },
    god: {
      name: "神様",
      short: "全員の役職を知っている単独陣営。生き残れば勝利",
      detail:
        "あなたは神様です。ゲーム開始時から全プレイヤーの役職を知っています。占い・霊媒では「白」と判定されます。村・人狼どちらの勝敗にも関わらず、ゲーム終了時に生存していればあなたの勝利です。",
    },
    lover: {
      name: "恋人",
      short: "2人1組。もう片方が死ぬと自分も死ぬ単独陣営",
      detail:
        "あなたは恋人です。もうひとりの恋人が誰か知っています。どちらか一方が追放や襲撃で死亡すると、もう一方も後を追って死亡します。ゲーム終了時に2人とも生存していれば恋人の勝利です。",
    },
  },
  errors: {
    ROOM_NOT_FOUND: "部屋が見つかりません。合言葉コードを確認してください。",
    GAME_ALREADY_STARTED: "すでにゲームが開始されているため参加できません。",
    ROOM_FULL: "参加人数の上限に達しています。",
    REJOIN_FAILED: "再接続に失敗しました。",
    PLAYER_NOT_FOUND: "プレイヤー情報が見つかりません。",
    NOT_HOST: "この操作はホストのみ行えます。",
    ALREADY_STARTED: "すでに開始しています。",
    NOT_IN_ROOM: "部屋に参加していません。",
    MIN_PLAYERS: "参加人数が足りません。",
    KICKED: "ホストによって部屋から退出させられました。",
    INVALID_ROOM_CODE: "ルームコードは半角英数字5〜8文字で入力してください。",
    ROOM_CODE_TAKEN: "そのルームコードは既に使われています。別のコードを試してください。",
  },
  validation: (issue) => {
    switch (issue.code) {
      case "SEAT_MISMATCH":
        return `役職の合計人数(${issue.total}人)が参加人数(${issue.playerCount}人)と一致していません。`;
      case "NO_WEREWOLF":
        return "人狼が最低1人は必要です。";
      case "MASON_ODD":
        return "共有者は2人1組で設定してください。";
      case "LOVER_INVALID":
        return "恋人は2人1組で設定してください。";
      case "WOLF_TOO_MANY":
        return "人狼陣営の人数が多すぎます。村人陣営が最初から不利になります。";
    }
  },
};

const en: Strings = {
  meta: {
    title: "Jinro DX Online",
    description:
      "An online companion app for the party game 'Jinro DX' (Werewolf, 13-role deluxe edition). Play together, each on your own phone.",
  },
  common: {
    host: "Host",
    connected: "Connected",
    disconnected: "Disconnected",
    reconnecting: "Reconnecting…",
    connecting: "Connecting…",
    kicked: "You were removed from the room by the host.",
    seconds: (n) => `${n}s`,
    timeRemaining: "Time remaining",
    close: "Close",
    cancel: "Cancel",
    people: (n) => `${n}`,
    listSeparator: ", ",
    confirmProceed: "Proceed",
    transitioning: "Moving to the next scene…",
    on: "ON",
    off: "OFF",
    themeToggleToLight: "Switch to light mode",
    themeToggleToDark: "Switch to dark mode",
  },
  entry: {
    title: "Jinro DX Online",
    subtitle: "An online companion for 'Jinro DX' (Werewolf), 13-role deluxe edition. Play from anywhere, right from your phone.",
    cardTitle: "Get started",
    cardDesc: "Create a room, or join one with a room code.",
    tabCreate: "Create room",
    tabJoin: "Join room",
    nameLabel: "Nickname",
    namePlaceholder: "e.g. Alex",
    createButton: "Create room",
    codeLabel: "Room code",
    codePlaceholder: "e.g. AB3XZ",
    joinButton: "Join",
    footerNote: "Note: this app has no chat feature. Talk it out as you play.",
    helpButton: "How to play / rules",
    customCodeLabel: "Room code (optional)",
    customCodePlaceholder: "Leave blank to auto-generate",
    customCodeHint: "5-8 letters/numbers. If left blank, one will be generated for you.",
    avatarLabel: "Profile photo (optional)",
    avatarAddButton: "Add photo",
    avatarChangeButton: "Change photo",
    avatarRemoveButton: "Remove photo",
    avatarTooLarge: "That image is too large (8MB max)",
    avatarUnsupported: "Please choose an image file",
  },
  profile: {
    editButton: "Edit profile",
    title: "Edit profile",
    desc: "You can change your display name and profile photo at any time.",
    nameLabel: "Nickname",
    avatarLabel: "Profile photo",
    saveButton: "Save",
    savedToast: "Profile updated",
    closeButton: "Close",
  },
  lobby: {
    codeLabel: "Room code",
    copyCode: "Copy code",
    copyLink: "Copy invite link",
    copyCodeToast: "Code copied",
    copyLinkToast: "Invite link copied",
    copyErrorToast: "Copy failed",
    participants: (n) => `Players (${n})`,
    waitingForMorePlayers: (n) => `Need ${n} more player${n === 1 ? "" : "s"} to start`,
    composition: "Role setup",
    compositionReadonly: "Role setup (host is configuring)",
    compositionReadonlyDesc: (wolves, total) => `${wolves} werewolves configured, ${total} roles in total.`,
    compositionEmpty: "No roles have been configured yet.",
    roomInfoButton: "Setup & rules",
    roomInfoTitle: "This game's role setup & settings",
    suggest: "Suggest roles",
    seatTotal: "Total roles",
    seatTotalOf: (total, count) => `${total} / ${count}`,
    soloGroupLabel: "Solo factions",
    startButton: "Start game",
    waitingHost: "Waiting for the host to start…",
    leaveButton: "Leave room",
    settingsTitle: "Game settings",
    revealOnDeath: "Reveal role on death",
    allowFirstNightKill: "Werewolves can attack on the first night",
    allowFirstNightKillDesc: "Turn this off to make the first night (night 1) attack-proof — whoever the werewolves attack survives. From night 2 onward, attacks work normally. Recommended if most players are new to Jinro DX.",
    allowFirstVoteExecution: "The first vote can result in a real execution",
    allowFirstVoteExecutionDesc: "Turn this off to make the first vote (day 1) execution-proof — whoever is chosen is spared instead of executed. From day 2 onward, votes work normally.",
    seerFirstNightDivine: "Seer can investigate one player during role reveal (advanced rule)",
    seerFirstNightDivineDesc: "An advanced rule from the rulebook (p.11): the Seer may investigate one player right at role reveal. Recommended for 7+ players. Using it is optional.",
    allowSelfVote: "Allow voting for yourself",
    revealVoteChoices: "Reveal everyone's votes live",
    revealVoteChoicesDesc: "When on, everyone can see who's voting for whom in real time during the vote phase. When off (default), only the total counts are shown as before.",
    hunterRevengeOnAnyDeath: "Let the Hunter's revenge trigger on any death",
    hunterRevengeOnAnyDeathDesc: "By the standard rules, the Hunter's revenge only triggers on death by attack or execution. Turning this on also triggers it for other causes, like being cursed or following a lover in death.",
    allowBodyguardSelfGuard: "Allow the Bodyguard to guard themselves",
    secondTieExecutesRandomly: "Pick randomly if the runoff vote is still tied",
    secondTieExecutesRandomlyDesc: "Turn this off and a still-tied runoff vote means no one is executed that day.",
    dictatorCanTargetSelf: "Allow the Dictator to target themselves",
    settingsPacingNote: "There are no automatic timers in this app. Every screen advances only when the host acts, or once everyone has finished their action. Play at your own pace.",
    kick: "Remove",
    makeHost: "Make host",
    makeHostConfirmTitle: "Hand over host to this player?",
    makeHostConfirmDesc: (name) => `${name} will become the new host. You'll lose host controls, including running the game.`,
    makeHostConfirmAction: "Hand over",
  },
  roleReveal: {
    label: "Your role",
    tapToReveal: "Tap to reveal",
    privacyHint: "Make sure no one else can see your screen",
    allies: "Your allies",
    allRoles: "Everyone's roles",
    waitingOthers: "Confirmed. Once everyone has confirmed their role, the first discussion begins automatically.",
    confirmButton: "I've confirmed my role",
    progress: (s, t) => `Confirmed: ${s} / ${t}`,
    earlyDivineTitle: "Use your Seer power now (optional)",
    earlyDivineDesc: "You may investigate one player right now, during role reveal. Feel free to skip this.",
    earlyDivineButton: "Investigate this player",
    earlyDivineSkipNote: "You can also skip this and just tap \"I've confirmed my role\".",
    earlyDivineDone: "You've already investigated. Here's the result.",
  },
  night: {
    tag: (day) => `Night ${day}`,
    deadNotice: "You have been eliminated. Watch quietly as the night unfolds…",
    dormant: "Night is falling…",
    dormantDesc: "Waiting for players with abilities to act.",
    progress: (s, t) => `Actions done: ${s} / ${t}`,
    submitButton: "Confirm",
    resubmitButton: "Submitted (tap to change)",
    previousSeerResult: (day) => `Last investigation (night ${day})`,
    seerResultLine: (name, isBlack) => `${name} was ${isBlack ? "【Black - Werewolf】" : "【White】"}`,
    actions: {
      attack: { title: "Who will you attack?", desc: "Coordinate with your fellow werewolves and choose tonight's target.", skip: "Don't attack tonight" },
      guard: { title: "Who will you protect?", desc: "Choose someone to protect from the werewolves' attack. You can't protect yourself, and you can't protect the same person you protected last night.", skip: "Don't protect anyone tonight" },
      divine: { title: "Who will you investigate?", desc: "Find out whether they are a werewolf.", skip: "Don't investigate tonight" },
    },
    firstNightKillDisabledNotice: "House rule: on the first night, whoever the werewolves attack survives. Attacks work normally from night 2 onward.",
    forceAdvanceButton: "Close this night without waiting for everyone (host)",
    wolfSelectionsTitle: "What your fellow werewolves are picking (for quiet coordination)",
    wolfSelectionsEmpty: "No one has picked yet",
    wolfSelectionsLine: (name, targetName) => `${name}: ${targetName ?? "not chosen yet"}`,
    wolfConsensusNeeded:
      "The night won't end until every werewolf picks the same target (or everyone picks \"don't attack\"). Talk it over and agree on one person.",
    wolfConsensusReached: "Everyone agrees.",
  },
  hunterRevenge: {
    title: "The Hunter's true identity is revealed!",
    waitingFor: (name) => `${name} is choosing someone to take down with them…`,
    youAre: "You are the Hunter. You may name one player to die alongside you (or choose no one).",
    skip: "Take no one down",
    submit: "Confirm",
    submitted: "Submitted",
    hostSkipButton: "Choose \"no one\" on the Hunter's behalf (host)",
  },
  dayResult: {
    tag: (day) => `Morning ${day}`,
    noDeaths: "No one fell victim last night. A peaceful morning.",
    seerResult: "Investigation result",
    continueButton: "Continue to discussion",
    waitingHost: "Waiting for the host to continue to discussion…",
  },
  discussion: {
    tag: (day) => `Discussion — Day ${day}`,
    firstRoundTag: "First discussion",
    firstRoundNotice: "This is the first discussion, right after role reveal. No one has been attacked yet, and there's no execution vote this round. Talk freely, then the host will move on to the real first night.",
    proceedToNightButton: "Done talking — proceed to night",
    survivors: "Survivors",
    dictatorButton: "Use Dictator power",
    dictatorConfirmTitle: "Use your Dictator power?",
    dictatorConfirmDesc: "This ends discussion immediately and executes your chosen target without a vote. You can only use this once per game.",
    dictatorConfirmAction: "Execute this player",
    skipButton: "Done talking — proceed to vote",
    waitingHost: "Waiting for the host to move on. There's no time limit, so talk it through.",
    runoffNotice: "The vote was tied, so this is discussion time before a runoff vote. If it's still tied after the runoff, the result will be random.",
    runoffCandidatesLabel: "Runoff candidates",
  },
  vote: {
    tag: (day) => `Vote — Day ${day}`,
    runoffTag: (day) => `Runoff vote — Day ${day}`,
    cannotVote: "You can't vote. Watch the results unfold.",
    instructions: "Choose one player to execute",
    runoffNotice: "The vote was tied, so this is a runoff among the tied candidates. If it's still tied, the result will be random.",
    submitButton: "Vote",
    submittedButton: "Voted (tap to change)",
    progress: (s, t) => `Votes cast: ${s} / ${t}`,
    forceAdvanceButton: "Close this vote without waiting for everyone (host)",
    voteChoicesTitle: "Live votes (visible to everyone because this setting is on)",
    voteChoicesLine: (voter, target) => `${voter} → ${target}`,
  },
  executionResult: {
    tag: (day) => `Execution result — Day ${day}`,
    executed: (name) => `${name} was executed`,
    spared: (name) => `The appeal vote spared ${name} — they survive`,
    sparedFirstVoteRule: (name) =>
      `Because "first vote can't result in a real execution" is on, ${name} was spared with no appeal vote`,
    noExecution: "The vote resulted in no execution.",
    mediumResult: "Medium's reading",
    mediumResultLine: (name, isBlack) => `${name} was ${isBlack ? "【Black - Werewolf】" : "【White】"}`,
    continueButton: "Continue to next night",
    waitingHost: "Waiting for the host to continue to the next night…",
  },
  lastWords: {
    tag: (day) => `Last words — Day ${day}`,
    title: "The vote has decided on an execution",
    waitingFor: (name) => `Let's hear ${name}'s last words`,
    youAreTitle: "You've been chosen for execution",
    youAreDesc: "If there's anything you want to say, now's the time. Tap the button below once you're done.",
    proceedButton: "I'm done (continue to the appeal vote)",
    waitingHost: "Waiting for the host or the chosen player to continue…",
  },
  appealVote: {
    tag: (day) => `Appeal vote — Day ${day}`,
    instructions: (name) => `Should ${name} really be executed, or spared?`,
    cannotVote: "You can't take part in this vote (you're the one on trial). Watch the results unfold.",
    executeOption: "Execute",
    spareOption: "Spare",
    submitButton: "Confirm",
    submittedButton: "Voted (tap to change)",
    progress: (s, t) => `Votes cast: ${s} / ${t}`,
    forceAdvanceButton: "Close this vote without waiting for everyone (host)",
  },
  allyNote: {
    title: "Private note for your allies",
    placeholder: "A short note only your allies can see (e.g. \"target player 3\")",
    hint: "Keep it short and quiet — this shares a single note, not a chat log, so it won't look suspicious.",
    groupSize: (n) => `Shared with ${n} people`,
  },
  gameOver: {
    primary: {
      village: "The Village wins!",
      werewolf: "The Werewolves win!",
      draw: "Draw",
    },
    extra: {
      fox: "The Fox also survived — a solo win!",
      god: "God also survived — a solo win!",
      lover: "Both Lovers survived — they win too!",
    },
    allRoles: "Everyone's roles",
    eliminated: "Eliminated",
    newGameButton: "Play again with the same players",
    waitingHost: "Waiting for the host to start a new game…",
    leaveButton: "Leave room",
  },
  confirm: {
    advanceTitle: "Move on to the next step?",
    advanceDesc: "Make sure everyone is ready before continuing. This can't be undone.",
    advanceAction: "Continue",
    forceResolveTitle: "Force everyone forward?",
    forceResolveDesc: "Anyone who hasn't acted or voted yet will be skipped.",
    forceResolveAction: "Force forward",
    newGameTitle: "Start a new game with the same players?",
    newGameDesc: "The current results will be reset and roles will be redealt.",
    newGameAction: "Start new game",
    skipHunterRevengeTitle: "Skip the hunter's revenge?",
    skipHunterRevengeDesc: "If skipped, the hunter won't take anyone down with them.",
    skipHunterRevengeAction: "Skip",
  },
  help: {
    button: "How to play",
    title: "How to play / Rules",
    tldr: "In short: the Villagers talk it out to find and vote off the hidden Werewolves.",
    tabFlow: "Flow",
    tabWin: "Winning",
    tabRoles: "Roles",
    intro:
      "Jinro DX is a social deduction game: the hidden 'Werewolves' try to survive while the 'Villagers' try to find them through conversation and deduction. Use this app for role reveals, night actions, and voting. 'Day' (discussion + vote) and 'Night' (secret actions) repeat until one side wins. This app has no automatic timers — every screen advances only when the host acts or everyone has finished, so you always play at your own pace.",
    flowTitle: "Game flow",
    flowSteps: [
      { title: "Role reveal", desc: "Everyone privately checks their own role and taps \"I've confirmed my role\". Make sure no one else can see your screen. The game won't move on until everyone has confirmed." },
      { title: "First discussion", desc: "A discussion-only round right after role reveal. No one has been attacked yet. Chat a little, then the host moves on to the real first night." },
      { title: "Night", desc: "Only players with night abilities (Werewolf, Seer, Bodyguard, etc.) act in secret. Everyone else just waits. This is where a werewolf attack can first happen (this can be turned off in settings)." },
      { title: "Morning (results)", desc: "The results of the night — who fell victim, if anyone — are announced." },
      { title: "Discussion", desc: "Talk it over and figure out who the werewolves are." },
      { title: "Vote", desc: "Everyone votes for one player to execute. The top vote-getter is executed; a tie triggers a runoff vote." },
      { title: "Repeat", desc: "Night → morning → discussion → vote repeats until one side wins." },
    ],
    winTitle: "Win conditions",
    winIntro: "How the game ends depends on the faction — more than one faction can win at once.",
    winVillage: "Village: wins once every Werewolf has been eliminated.",
    winWerewolf: "Werewolves: win once werewolves are at least as many as everyone else still alive.",
    winFox: "Fox: wins alone if still alive when the game ends (independent of Village/Werewolf outcome).",
    winGod: "God: wins alone if still alive when the game ends.",
    winLover: "Lovers: win together if both are still alive when the game ends.",
    rolesTitle: "All 13 roles",
    rolesIntro: "You can check your own role's description any time during the game from the \"My Role\" button at the top of the screen.",
    close: "Close",
  },
  myRole: {
    button: "My Role",
    title: "Your role",
    dayLabel: (day) => `Night ${day}`,
    seerHistoryTitle: "Everyone you've investigated",
    seerHistoryEmpty: "You haven't investigated anyone yet.",
    mediumHistoryTitle: "Everyone you've read",
    mediumHistoryEmpty: "You haven't read anyone yet.",
    noRoleYet: "Your role hasn't been revealed yet.",
    close: "Close",
  },
  team: {
    village: "Village Team",
    werewolf: "Werewolf Team",
    fox: "Fox (Solo Faction)",
    god: "God (Solo Faction)",
    lover: "Lovers (Solo Faction)",
  },
  deathCause: {
    attack: "killed by the werewolves",
    execution: "executed",
    curse: "investigated by the Seer and struck by a curse",
    hunter: "taken down by the Hunter",
    lover_grief: "died of grief following their partner",
  },
  roles: {
    villager: {
      name: "Villager",
      short: "No special ability",
      detail: "You are a Villager. You have no special ability — rely on conversation and deduction to find the werewolves and vote them out.",
    },
    seer: {
      name: "Seer",
      short: "Each night, investigate one player to learn if they're a werewolf",
      detail:
        "You are the Seer. Each night, choose one player to investigate. You'll learn whether they are a Werewolf (black) or not (white). If you investigate the Fox, it dies of a curse that same night.",
    },
    bodyguard: {
      name: "Bodyguard",
      short: "Each night, protect one player from the werewolves",
      detail:
        "You are the Bodyguard. Each night, choose one player other than yourself to protect from the werewolves' attack. If your chosen player was the target, they survive.",
    },
    medium: {
      name: "Medium",
      short: "Learn whether the executed player was a werewolf",
      detail: "You are the Medium. Each night, you learn whether the player executed that day was a Werewolf or not.",
    },
    hunter: {
      name: "Hunter",
      short: "When you die, you can take one other player with you",
      detail:
        "You are the Hunter. If you are executed or killed by a werewolf attack, you may name one other player to die alongside you.",
    },
    mason: {
      name: "Mason",
      short: "A villager who knows the other Masons",
      detail: "You are a Mason. You know who the other Masons are. You have no special ability, but you can trust each other completely.",
    },
    dictator: {
      name: "Dictator",
      short: "Once per game, skip the vote and decide an execution yourself",
      detail:
        "You are the Dictator. Once per game, during the day's discussion, you may reveal yourself to end discussion early and decide who is executed on your own — skipping the vote entirely. Use it wisely.",
    },
    werewolf: {
      name: "Werewolf",
      short: "Each night, attack one player. You know the other werewolves",
      detail:
        "You are a Werewolf. You know who the other werewolves are. Each night, coordinate with them to choose one player to attack. Stay hidden — you win once werewolves equal the rest of the survivors in number.",
    },
    traitor: {
      name: "Traitor",
      short: "On the Werewolf team, but doesn't know who the werewolves are",
      detail:
        "You are the Traitor. You win with the Werewolf team, but you don't know who the werewolves are. You appear as an innocent villager to the Seer and Medium. Pose as a villager while quietly helping the werewolves.",
    },
    insider: {
      name: "Insider",
      short: "Knows who the werewolves are, but appears innocent",
      detail:
        "You are the Insider. You know who the werewolves are. You appear as an innocent villager to the Seer and Medium, making you especially hard to catch. Avoid defending the wolves too obviously.",
    },
    fox: {
      name: "Fox",
      short: "Immune to werewolf attacks, but dies if investigated",
      detail:
        "You are the Fox, a solo faction belonging to neither the Village nor the Werewolves. You survive werewolf attacks, but if the Seer investigates you, you die of a curse that same night. You win if you're still alive when the game ends.",
    },
    god: {
      name: "God",
      short: "Knows everyone's role. Wins by surviving",
      detail:
        "You are God, a solo faction. You know everyone's role from the very start of the game. You appear as an innocent villager to the Seer and Medium. Regardless of who wins the main game, you win if you're still alive when it ends.",
    },
    lover: {
      name: "Lover",
      short: "A pair of 2. If one dies, so does the other",
      detail:
        "You are a Lover, a solo faction of two. You know who your partner is. If either of you dies (executed or attacked), the other dies of grief right after. You win together if you're both still alive when the game ends.",
    },
  },
  errors: {
    ROOM_NOT_FOUND: "Room not found. Please check the room code.",
    GAME_ALREADY_STARTED: "This game has already started, so you can't join.",
    ROOM_FULL: "This room is full.",
    REJOIN_FAILED: "Failed to reconnect.",
    PLAYER_NOT_FOUND: "Player information not found.",
    NOT_HOST: "Only the host can do that.",
    ALREADY_STARTED: "The game has already started.",
    NOT_IN_ROOM: "You're not in a room.",
    MIN_PLAYERS: "Not enough players yet.",
    KICKED: "You were removed from the room by the host.",
    INVALID_ROOM_CODE: "Room codes must be 5-8 letters/numbers.",
    ROOM_CODE_TAKEN: "That room code is already in use. Try a different one.",
  },
  validation: (issue) => {
    switch (issue.code) {
      case "SEAT_MISMATCH":
        return `Total roles (${issue.total}) doesn't match the number of players (${issue.playerCount}).`;
      case "NO_WEREWOLF":
        return "You need at least 1 werewolf.";
      case "MASON_ODD":
        return "Masons must be set in pairs of 2.";
      case "LOVER_INVALID":
        return "Lovers must be set as a pair of exactly 2.";
      case "WOLF_TOO_MANY":
        return "Too many players on the werewolf side — the village would start at a disadvantage.";
    }
  },
};

const ko: Strings = {
  meta: {
    title: "진로DX 온라인",
    description:
      "대화형 심리 게임 「진로DX 신장판(인랑 게임)」의 온라인 진행 앱. 모인 인원끼리 각자 스마트폰으로 즐길 수 있습니다.",
  },
  common: {
    host: "호스트",
    connected: "연결됨",
    disconnected: "연결 끊김",
    reconnecting: "재접속 중…",
    connecting: "접속하는 중…",
    kicked: "호스트에 의해 방에서 나가게 되었습니다.",
    seconds: (n) => `${n}초`,
    timeRemaining: "남은 시간",
    close: "닫기",
    cancel: "취소",
    people: (n) => `${n}명`,
    listSeparator: ", ",
    confirmProceed: "진행",
    transitioning: "다음 장면으로 이동 중…",
    on: "ON",
    off: "OFF",
    themeToggleToLight: "라이트 모드로 전환",
    themeToggleToDark: "다크 모드로 전환",
  },
  entry: {
    title: "진로DX 온라인",
    subtitle: "대화형 심리 게임 「진로DX 신장판」 13개 역할 지원. 어디서든 스마트폰 하나로 즐길 수 있습니다.",
    cardTitle: "시작하기",
    cardDesc: "방을 만들거나, 방 코드로 참가하세요.",
    tabCreate: "방 만들기",
    tabJoin: "방 참가하기",
    nameLabel: "닉네임",
    namePlaceholder: "예: 민준",
    createButton: "방 만들기",
    codeLabel: "방 코드",
    codePlaceholder: "예: AB3XZ",
    joinButton: "참가하기",
    footerNote: "※ 이 앱에는 채팅 기능이 없습니다. 대화를 나누며 플레이하세요.",
    helpButton: "게임 방법 · 규칙 보기",
    customCodeLabel: "방 코드 (선택)",
    customCodePlaceholder: "비워두면 자동으로 생성됩니다",
    customCodeHint: "영문자·숫자 5~8자. 지정하지 않으면 자동으로 발급됩니다.",
    avatarLabel: "프로필 사진 (선택)",
    avatarAddButton: "사진 추가",
    avatarChangeButton: "사진 변경",
    avatarRemoveButton: "사진 삭제",
    avatarTooLarge: "이미지 크기가 너무 큽니다 (최대 8MB)",
    avatarUnsupported: "이미지 파일을 선택해 주세요",
  },
  profile: {
    editButton: "프로필 편집",
    title: "프로필 편집",
    desc: "표시 이름과 프로필 사진은 언제든지 변경할 수 있습니다.",
    nameLabel: "닉네임",
    avatarLabel: "프로필 사진",
    saveButton: "저장",
    savedToast: "프로필이 업데이트되었습니다",
    closeButton: "닫기",
  },
  lobby: {
    codeLabel: "방 코드",
    copyCode: "코드 복사",
    copyLink: "초대 링크 복사",
    copyCodeToast: "코드를 복사했습니다",
    copyLinkToast: "초대 링크를 복사했습니다",
    copyErrorToast: "복사에 실패했습니다",
    participants: (n) => `참가자 (${n}명)`,
    waitingForMorePlayers: (n) => `${n}명이 더 모이면 게임을 시작할 수 있습니다`,
    composition: "역할 구성",
    compositionReadonly: "역할 구성 (호스트가 설정 중)",
    compositionReadonlyDesc: (wolves, total) => `인랑 ${wolves}명을 포함해 총 ${total}명분의 역할이 설정되어 있습니다.`,
    compositionEmpty: "아직 역할이 설정되지 않았습니다.",
    roomInfoButton: "배역・설정",
    roomInfoTitle: "이번 게임의 배역 구성・설정",
    suggest: "추천 구성",
    seatTotal: "역할 합계",
    seatTotalOf: (total, count) => `${total} / ${count}명`,
    soloGroupLabel: "단독 진영",
    startButton: "게임 시작",
    waitingHost: "호스트가 시작하기를 기다리는 중…",
    leaveButton: "나가기",
    settingsTitle: "게임 설정",
    revealOnDeath: "사망 시 역할 공개",
    allowFirstNightKill: "첫날 밤에 인랑이 습격할 수 있다",
    allowFirstNightKillDesc: "꺼두면 첫날 밤(1일차 밤)에는 인랑이 누구를 습격해도 죽지 않습니다. 2일차 밤부터는 평소대로 습격이 유효해집니다. 인랑DX에 익숙하지 않은 멤버가 많을 때 추천하는 설정입니다.",
    allowFirstVoteExecution: "첫 투표에서 실제로 추방할 수 있다",
    allowFirstVoteExecutionDesc: "꺼두면 첫 투표(1일차 투표)에서 누가 선택되어도 실제로는 추방되지 않고 살아남습니다. 2일차 투표부터는 평소대로 추방이 유효해집니다.",
    seerFirstNightDivine: "예언자는 역할 확인 시 1명을 점칠 수 있다 (발전 규칙)",
    seerFirstNightDivineDesc: "설명서 11페이지의 발전 규칙입니다. 역할 확인 시점에 예언자가 1명을 점칠 수 있습니다 (7명 이상 플레이 권장). 점칠지 여부는 예언자가 자유롭게 선택할 수 있습니다.",
    allowSelfVote: "투표에서 자기 자신에게 투표할 수 있음",
    revealVoteChoices: "투표 내용을 전원에게 공개",
    revealVoteChoicesDesc: "켜면 투표 단계 중에 누가 누구에게 투표하는지 실시간으로 전원에게 보입니다. 끄면(기본값) 기존처럼 집계 수만 공개됩니다.",
    hunterRevengeOnAnyDeath: "헌터의 동반 사살을 모든 사망 원인에서 발동",
    hunterRevengeOnAnyDeathDesc: "기본 규칙에서는 헌터의 동반 사살이 습격·처형으로 사망했을 때만 발동합니다. 켜면 저주사, 연인의 뒤따름 등 다른 사망 원인에서도 발동합니다.",
    allowBodyguardSelfGuard: "보디가드가 자기 자신을 호위할 수 있음",
    secondTieExecutesRandomly: "결선 투표도 동수일 경우 무작위로 처형",
    secondTieExecutesRandomlyDesc: "끄면 결선 투표도 동수로 끝났을 때 아무도 처형되지 않고 그 날이 끝납니다.",
    dictatorCanTargetSelf: "독재자가 자기 자신을 처형 대상으로 지정할 수 있음",
    settingsPacingNote: "이 앱에는 자동 타이머가 없습니다. 각 화면은 호스트의 조작이나 전원의 행동이 모두 끝났을 때만 다음으로 넘어갑니다. 여러분의 속도에 맞춰 진행하세요.",
    kick: "내보내기",
    makeHost: "호스트로 지정",
    makeHostConfirmTitle: "호스트를 교체하시겠습니까?",
    makeHostConfirmDesc: (name) => `${name}님이 새로운 호스트가 됩니다. 당신은 호스트 권한을 잃고, 진행 조작 등을 할 수 없게 됩니다.`,
    makeHostConfirmAction: "교체하기",
  },
  roleReveal: {
    label: "나의 역할",
    tapToReveal: "탭하여 확인",
    privacyHint: "주변 사람에게 보이지 않도록 확인하세요",
    allies: "나의 동료",
    allRoles: "전체 플레이어의 역할",
    waitingOthers: "확인을 마쳤습니다. 전원의 확인이 끝나면 자동으로 첫 번째 토론으로 넘어갑니다.",
    confirmButton: "확인했습니다",
    progress: (s, t) => `확인 완료: ${s} / ${t}명`,
    earlyDivineTitle: "예언자의 능력을 지금 사용하기 (선택)",
    earlyDivineDesc: "역할 확인 시점에 1명을 점칠 수 있습니다. 사용하지 않고 넘어가도 됩니다.",
    earlyDivineButton: "이 사람을 점치기",
    earlyDivineSkipNote: "점치지 않고 '확인했습니다'를 눌러 진행할 수도 있습니다.",
    earlyDivineDone: "이미 점을 쳤습니다. 결과는 아래와 같습니다.",
  },
  night: {
    tag: (day) => `밤 ${day}일차`,
    deadNotice: "당신은 이미 탈락했습니다. 조용히 밤이 지나가는 것을 지켜봐 주세요…",
    dormant: "밤이 깊어가고 있습니다…",
    dormantDesc: "능력을 가진 사람이 행동을 마칠 때까지 기다려 주세요.",
    progress: (s, t) => `행동 완료: ${s} / ${t}명`,
    submitButton: "결정하기",
    resubmitButton: "제출됨 (변경하기)",
    previousSeerResult: (day) => `이전 점술 결과 (${day}일차)`,
    seerResultLine: (name, isBlack) => `${name}님은 ${isBlack ? "【흑(인랑)】" : "【백】"}이었습니다`,
    actions: {
      attack: { title: "누구를 습격하시겠습니까?", desc: "동료 인랑과 상의하여 오늘 밤 습격할 대상을 선택하세요.", skip: "오늘 밤은 습격하지 않는다" },
      guard: { title: "누구를 지키시겠습니까?", desc: "인랑의 습격으로부터 지킬 대상을 선택하세요. 자기 자신은 지킬 수 없고, 어젯밤 지킨 대상도 다시 선택할 수 없습니다.", skip: "오늘 밤은 아무도 지키지 않는다" },
      divine: { title: "누구를 점치시겠습니까?", desc: "상대가 인랑인지 아닌지를 점칩니다.", skip: "오늘 밤은 점치지 않는다" },
    },
    firstNightKillDisabledNotice: "설정에 따라 첫날 밤(1일차)에는 누구를 습격해도 죽지 않습니다. 2일차 밤부터는 평소대로 효과가 있습니다.",
    forceAdvanceButton: "전원을 기다리지 않고 진행하기 (호스트 조작)",
    wolfSelectionsTitle: "동료 인랑들이 지금 선택하고 있는 대상 (상의용)",
    wolfSelectionsEmpty: "아직 아무도 선택하지 않았습니다",
    wolfSelectionsLine: (name, targetName) => `${name}님: ${targetName ?? "미선택"}`,
    wolfConsensusNeeded: "인랑 전원이 같은 대상(또는 전원 「습격하지 않음」)을 선택할 때까지 밤은 끝나지 않습니다. 상의해서 한 명으로 정하세요.",
    wolfConsensusReached: "전원의 의견이 일치했습니다.",
  },
  hunterRevenge: {
    title: "헌터의 정체가 드러났다!",
    waitingFor: (name) => `${name}님이 함께 데려갈 상대를 선택하는 중입니다…`,
    youAre: "당신은 헌터입니다. 함께 데려갈 상대를 한 명 선택할 수 있습니다 (선택하지 않아도 됩니다).",
    skip: "아무도 데려가지 않는다",
    submit: "결정하기",
    submitted: "제출됨",
    hostSkipButton: "헌터 대신 '아무도 데려가지 않음'으로 처리 (호스트 조작)",
  },
  dayResult: {
    tag: (day) => `아침 ${day}일차`,
    noDeaths: "어젯밤에는 아무도 희생되지 않았습니다. 평화로운 아침입니다.",
    seerResult: "점술 결과",
    continueButton: "토론 시간으로 진행",
    waitingHost: "호스트가 토론 시간으로 진행하기를 기다리는 중…",
  },
  discussion: {
    tag: (day) => `토론 시간 ${day}일차`,
    firstRoundTag: "첫 번째 토론",
    firstRoundNotice: "역할 확인 직후에 진행되는, 투표 없는 첫 번째 토론입니다. 아직 아무도 습격당하지 않았습니다. 이번 라운드에는 추방 투표도 없습니다. 자유롭게 이야기를 나눈 뒤, 호스트가 진짜 「밤」으로 진행합니다.",
    proceedToNightButton: "토론을 마치고 밤으로 진행",
    survivors: "생존자",
    dictatorButton: "독재자 권한 발동",
    dictatorConfirmTitle: "독재자 권한을 발동하시겠습니까?",
    dictatorConfirmDesc: "토론을 강제로 종료하고, 투표 없이 지정한 사람을 독단으로 추방합니다. 이 능력은 게임 중 단 한 번만 사용할 수 있습니다.",
    dictatorConfirmAction: "이 사람을 추방하기",
    skipButton: "토론을 마치고 투표로 진행",
    waitingHost: "호스트가 다음으로 진행하기를 기다리는 중입니다. 시간 제한이 없으니 충분히 이야기하세요.",
    runoffNotice: "투표가 동수였기 때문에, 결선 투표 전의 토론 시간입니다. 그래도 결정되지 않으면 무작위로 결정됩니다.",
    runoffCandidatesLabel: "결선 투표 대상",
  },
  vote: {
    tag: (day) => `투표 시간 ${day}일차`,
    runoffTag: (day) => `결선 투표 ${day}일차`,
    cannotVote: "당신은 투표할 수 없습니다. 결과를 지켜봐 주세요.",
    instructions: "추방할 사람을 한 명 선택하세요",
    runoffNotice: "동수였기 때문에 대상을 좁힌 결선 투표입니다. 그래도 결정되지 않으면 무작위로 결정됩니다.",
    submitButton: "투표하기",
    submittedButton: "투표됨 (변경하기)",
    progress: (s, t) => `투표 완료: ${s} / ${t}명`,
    forceAdvanceButton: "전원의 투표를 기다리지 않고 마감하기 (호스트 조작)",
    voteChoicesTitle: "실시간 투표 현황 (이 설정이 켜져 있어 전원에게 공개됩니다)",
    voteChoicesLine: (voter, target) => `${voter} → ${target}`,
  },
  executionResult: {
    tag: (day) => `추방 결과 ${day}일차`,
    executed: (name) => `${name}님이 추방되었습니다`,
    spared: (name) => `결선 투표 결과, ${name}님은 살아남았습니다`,
    sparedFirstVoteRule: (name) =>
      `"첫 투표에서는 실제로 추방하지 않음" 설정 때문에, ${name}님은 결선 투표 없이 살아남았습니다`,
    noExecution: "투표 결과, 아무도 추방되지 않았습니다.",
    mediumResult: "영매 결과",
    mediumResultLine: (name, isBlack) => `${name}님은 ${isBlack ? "【흑(인랑)】" : "【백】"}이었습니다`,
    continueButton: "다음 밤으로 진행",
    waitingHost: "호스트가 다음 밤으로 진행하기를 기다리는 중…",
  },
  lastWords: {
    tag: (day) => `마지막 한마디 ${day}일차`,
    title: "투표 결과 추방이 결정되었습니다",
    waitingFor: (name) => `${name}님의 마지막 한마디를 들어봅시다`,
    youAreTitle: "당신이 추방 대상으로 선택되었습니다",
    youAreDesc: "마지막으로 하고 싶은 말이 있다면 모두에게 이야기하세요. 이야기를 마치면 아래 버튼으로 진행합니다.",
    proceedButton: "이야기를 마쳤습니다 (결선 투표로 진행)",
    waitingHost: "본인 또는 호스트가 다음으로 진행하기를 기다리는 중…",
  },
  appealVote: {
    tag: (day) => `생존 결선 투표 ${day}일차`,
    instructions: (name) => `${name}님을 정말로 추방할까요, 아니면 살릴까요?`,
    cannotVote: "당신은 이 결선 투표에 참여할 수 없습니다 (추방 대상이기 때문입니다). 결과를 지켜봐 주세요.",
    executeOption: "추방한다",
    spareOption: "살린다",
    submitButton: "결정하기",
    submittedButton: "투표됨 (변경하기)",
    progress: (s, t) => `투표 완료: ${s} / ${t}명`,
    forceAdvanceButton: "전원의 투표를 기다리지 않고 마감하기 (호스트 조작)",
  },
  allyNote: {
    title: "동료끼리만 보는 메모",
    placeholder: "동료에게만 전달되는 짧은 메모 (예: 3번을 노린다)",
    hint: "주변 사람이 눈치채지 않도록 짧은 말로 조용히 전달하세요. 채팅이 아닌 한 장의 메모로 공유됩니다.",
    groupSize: (n) => `${n}명이 함께 보는 중`,
  },
  gameOver: {
    primary: {
      village: "시민 진영의 승리!",
      werewolf: "인랑 진영의 승리!",
      draw: "무승부",
    },
    extra: {
      fox: "요호도 살아남아 단독 승리!",
      god: "신도 살아남아 단독 승리!",
      lover: "연인 두 사람 모두 살아남아 승리!",
    },
    allRoles: "전원의 역할",
    eliminated: "탈락",
    newGameButton: "같은 멤버로 다시 하기",
    waitingHost: "호스트가 다음 게임을 시작하기를 기다리는 중…",
    leaveButton: "나가기",
  },
  confirm: {
    advanceTitle: "다음으로 진행할까요?",
    advanceDesc: "모두 준비되었는지 확인한 후 진행해 주세요. 이 작업은 취소할 수 없습니다.",
    advanceAction: "진행하기",
    forceResolveTitle: "강제로 진행할까요?",
    forceResolveDesc: "아직 행동하거나 투표하지 않은 사람이 있다면 건너뜁니다.",
    forceResolveAction: "강제로 진행",
    newGameTitle: "같은 멤버로 새 게임을 시작할까요?",
    newGameDesc: "현재 결과는 초기화되고 역할이 다시 배분됩니다.",
    newGameAction: "새 게임 시작",
    skipHunterRevengeTitle: "사냥꾼의 복수를 건너뛸까요?",
    skipHunterRevengeDesc: "건너뛰면 사냥꾼은 아무도 함께 데려가지 못합니다.",
    skipHunterRevengeAction: "건너뛰기",
  },
  help: {
    button: "게임 방법",
    title: "게임 방법 · 규칙",
    tldr: "한마디로: 숨어 있는 「인랑」을, 시민들이 대화를 통해 찾아내 추방하는 게임입니다.",
    tabFlow: "진행 순서",
    tabWin: "승리 조건",
    tabRoles: "역할",
    intro:
      "진로DX는 정체를 숨긴 「인랑」을 「시민」들이 대화와 추리로 찾아내는 심리 게임입니다. 이 앱으로 역할 확인·밤의 행동·투표를 진행합니다. 「낮(토론·투표)」과 「밤(능력 행동)」을 반복하며, 어느 한쪽 진영이 조건을 만족하면 게임이 종료됩니다. 이 앱에는 자동 타이머가 없습니다 — 각 화면은 호스트의 조작이나 전원의 행동이 끝났을 때만 넘어가므로, 항상 여러분의 속도에 맞춰 진행할 수 있습니다.",
    flowTitle: "게임 진행 순서",
    flowSteps: [
      { title: "역할 확인", desc: "모든 사람이 각자 자신의 역할을 몰래 확인하고 '확인했습니다'를 누릅니다. 주변 사람에게 보이지 않도록 주의하세요. 전원이 누르기 전에는 다음으로 넘어가지 않습니다." },
      { title: "첫 번째 토론", desc: "역할 확인 직후에 진행되는, 투표가 없는 토론입니다. 아직 아무도 습격당하지 않았습니다. 가볍게 이야기를 나눈 뒤, 호스트가 진짜 「밤」으로 진행합니다." },
      { title: "밤", desc: "인랑·점술사·보디가드 등 능력을 가진 역할만 몰래 행동합니다. 능력이 없는 사람은 아무것도 하지 않고 대기합니다. 여기서 처음으로 인랑의 습격이 발생할 수 있습니다 (설정에서 끌 수도 있습니다)." },
      { title: "아침 (결과 발표)", desc: "밤사이 무슨 일이 있었는지 (누가 희생되었는지)가 발표됩니다." },
      { title: "토론", desc: "누가 인랑인지 이야기를 나누며 추리합니다." },
      { title: "투표", desc: "추방할 사람을 한 명 선택해 투표합니다. 최다 득표자가 추방되며, 동수일 경우 결선 투표가 진행됩니다." },
      { title: "반복", desc: "「밤 → 아침 → 토론 → 투표」를 어느 한쪽 진영이 승리할 때까지 반복합니다." },
    ],
    winTitle: "승리 조건",
    winIntro: "게임이 끝나는 방식은 진영마다 다릅니다. 여러 진영이 동시에 승리하는 경우도 있습니다.",
    winVillage: "시민 진영: 인랑을 모두 추방하면 승리.",
    winWerewolf: "인랑 진영: 인랑의 수가 인랑 이외의 생존자 수 이상이 되면 승리.",
    winFox: "요호: 게임 종료 시 살아 있으면 단독 승리 (시민·인랑의 승패와는 별개).",
    winGod: "신: 게임 종료 시 살아 있으면 단독 승리.",
    winLover: "연인: 게임 종료 시 두 사람 모두 살아 있으면 함께 승리.",
    rolesTitle: "역할 목록 (13종)",
    rolesIntro: "자신의 역할에 대한 설명은 화면 상단의 「나의 역할」 버튼에서 게임 중 언제든지 확인할 수 있습니다.",
    close: "닫기",
  },
  myRole: {
    button: "나의 역할",
    title: "당신의 역할",
    dayLabel: (day) => `${day}일차`,
    seerHistoryTitle: "지금까지 점술한 사람",
    seerHistoryEmpty: "아직 아무도 점술하지 않았습니다.",
    mediumHistoryTitle: "지금까지 판정한 사람",
    mediumHistoryEmpty: "아직 판정한 사람이 없습니다.",
    noRoleYet: "아직 역할이 확인되지 않았습니다.",
    close: "닫기",
  },
  team: {
    village: "시민 진영",
    werewolf: "인랑 진영",
    fox: "요호 (단독 진영)",
    god: "신 (단독 진영)",
    lover: "연인 (단독 진영)",
  },
  deathCause: {
    attack: "인랑에게 습격당함",
    execution: "추방됨",
    curse: "점술사에게 점쳐져 저주로 사망",
    hunter: "헌터에게 함께 죽임을 당함",
    lover_grief: "연인의 뒤를 따라감",
  },
  roles: {
    villager: {
      name: "시민",
      short: "특별한 능력이 없는 마을 사람",
      detail: "당신은 시민입니다. 특별한 능력은 없습니다. 대화와 추리만으로 인랑을 찾아내 추방합시다.",
    },
    seer: {
      name: "점술사",
      short: "매일 밤 한 명을 점쳐 인랑인지 아닌지 알아낸다",
      detail:
        "당신은 점술사입니다. 매일 밤 한 명을 골라 점칠 수 있습니다. 그 사람이 「인랑」이면 흑, 그 외에는 백으로 판명됩니다. 참고로 요호를 점치면 요호는 그날 밤 저주로 사망합니다.",
    },
    bodyguard: {
      name: "보디가드",
      short: "매일 밤 한 명을 인랑의 습격으로부터 지킨다",
      detail:
        "당신은 보디가드입니다. 매일 밤 자신을 제외한 한 명을 선택해 인랑의 습격으로부터 지킬 수 있습니다. 지킨 상대가 습격 대상이었다면 그 사람은 살아남습니다.",
    },
    medium: {
      name: "영매사",
      short: "추방된 사람이 인랑이었는지 알 수 있다",
      detail: "당신은 영매사입니다. 낮에 추방된 플레이어가 「인랑」이었는지 아닌지를 그날 밤 알 수 있습니다.",
    },
    hunter: {
      name: "헌터",
      short: "자신이 죽을 때, 한 명을 함께 데려갈 수 있다",
      detail:
        "당신은 헌터입니다. 「추방」되거나 「인랑에게 습격」당해 사망할 때, 한 명을 지목하여 함께 죽음에 이르게 할 수 있습니다.",
    },
    mason: {
      name: "공유자",
      short: "2명 이상이 서로를 알고 있는 마을 사람",
      detail: "당신은 공유자입니다. 다른 공유자가 누구인지 알고 있습니다. 특별한 능력은 없지만, 서로를 믿고 마을을 이끌어 갑시다.",
    },
    dictator: {
      name: "독재자",
      short: "단 한 번, 토론을 중단시키고 독단으로 추방자를 결정할 수 있다",
      detail:
        "당신은 독재자입니다. 게임 중 단 한 번, 낮의 토론 중에 정체를 밝히고 토론을 강제 종료시켜 투표 없이 추방자를 독단으로 결정할 수 있습니다. 사용할 때는 신중하게.",
    },
    werewolf: {
      name: "인랑",
      short: "매일 밤 한 명을 습격한다. 다른 인랑을 알 수 있다",
      detail:
        "당신은 인랑입니다. 동료 인랑이 누구인지 알고 있습니다. 매일 밤 동료와 상의하여 한 명을 습격하세요. 정체를 숨기고 시민을 인랑과 같은 수까지 줄이면 승리입니다.",
    },
    traitor: {
      name: "배신자",
      short: "인랑 진영이지만 누가 인랑인지는 모르는 시민인 척하는 사람",
      detail:
        "당신은 배신자입니다. 인랑 진영의 승리가 곧 당신의 승리이지만, 누가 인랑인지는 알지 못합니다. 점술·영매에서는 「백」으로 판정됩니다. 시민인 척하며 인랑 진영을 도웁시다.",
    },
    insider: {
      name: "내통자",
      short: "인랑이 누구인지 알고 있는 인랑 진영의 협력자",
      detail:
        "당신은 내통자입니다. 인랑이 누구인지 알고 있습니다. 점술·영매에서는 「백」으로 판정되기 때문에, 인랑 진영 중에서도 특히 활동하기 쉬운 존재입니다. 노골적인 옹호는 피하세요.",
    },
    fox: {
      name: "요호",
      short: "인랑에게 습격당해도 죽지 않는 단독 진영. 점쳐지면 사망",
      detail:
        "당신은 요호입니다. 시민·인랑 어느 쪽에도 속하지 않는 단독 진영으로, 인랑에게 습격당해도 죽지 않습니다. 다만 점술사에게 점쳐지면 그날 밤 저주로 사망합니다. 게임 종료 시 생존해 있으면 당신의 승리입니다.",
    },
    god: {
      name: "신",
      short: "모든 사람의 역할을 알고 있는 단독 진영. 살아남으면 승리",
      detail:
        "당신은 신입니다. 게임 시작 시점부터 모든 플레이어의 역할을 알고 있습니다. 점술·영매에서는 「백」으로 판정됩니다. 시민·인랑 어느 쪽의 승패와도 관계없이, 게임 종료 시 생존해 있으면 당신의 승리입니다.",
    },
    lover: {
      name: "연인",
      short: "2명이 한 쌍. 상대가 죽으면 자신도 죽는 단독 진영",
      detail:
        "당신은 연인입니다. 또 다른 연인이 누구인지 알고 있습니다. 둘 중 한 명이 추방이나 습격으로 사망하면, 남은 한 명도 그 뒤를 따라 사망합니다. 게임 종료 시 두 사람 모두 생존해 있으면 연인의 승리입니다.",
    },
  },
  errors: {
    ROOM_NOT_FOUND: "방을 찾을 수 없습니다. 방 코드를 확인해 주세요.",
    GAME_ALREADY_STARTED: "이미 게임이 시작되어 참가할 수 없습니다.",
    ROOM_FULL: "참가 인원 상한에 도달했습니다.",
    REJOIN_FAILED: "재접속에 실패했습니다.",
    PLAYER_NOT_FOUND: "플레이어 정보를 찾을 수 없습니다.",
    NOT_HOST: "이 조작은 호스트만 할 수 있습니다.",
    ALREADY_STARTED: "이미 시작되었습니다.",
    NOT_IN_ROOM: "방에 참가하고 있지 않습니다.",
    MIN_PLAYERS: "참가 인원이 부족합니다.",
    KICKED: "호스트에 의해 방에서 나가게 되었습니다.",
    INVALID_ROOM_CODE: "방 코드는 영문자·숫자 5~8자로 입력해 주세요.",
    ROOM_CODE_TAKEN: "그 방 코드는 이미 사용 중입니다. 다른 코드를 시도해 주세요.",
  },
  validation: (issue) => {
    switch (issue.code) {
      case "SEAT_MISMATCH":
        return `역할 합계 인원(${issue.total}명)이 참가 인원(${issue.playerCount}명)과 일치하지 않습니다.`;
      case "NO_WEREWOLF":
        return "인랑이 최소 1명은 필요합니다.";
      case "MASON_ODD":
        return "공유자는 2명 1조로 설정해 주세요.";
      case "LOVER_INVALID":
        return "연인은 2명 1조로 설정해 주세요.";
      case "WOLF_TOO_MANY":
        return "인랑 진영의 인원이 너무 많습니다. 시민 진영이 처음부터 불리해집니다.";
    }
  },
};

export const STRINGS: Record<Locale, Strings> = { ja, en, ko };

export type { Strings };
