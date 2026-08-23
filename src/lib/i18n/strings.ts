import type { RoleId, Team, NightActionType } from "@/lib/game/roles";
import type { DeathCause } from "@/lib/game/types";

export type Locale = "ja" | "en" | "ko" | "zh" | "es" | "fr" | "de" | "pt" | "ru" | "vi" | "th" | "id" | "it";
export const LOCALES: Locale[] = ["ja", "en", "ko", "zh", "es", "fr", "de", "pt", "ru", "vi", "th", "id", "it"];

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
    menu: string;
    officialRuleBadge: string;
    optionalRuleBadge: string;
    themeLabel: string;
    languageLabel: string;
    endGameButton: string;
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
    castLabel: string;
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
    shareLink: string;
    shareMessage: (code: string) => string;
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
    officialRulesSectionTitle: string;
    extraRulesSectionTitle: string;
    extraRulesSectionDesc: string;
    revealOnDeath: string;
    allowFirstNightKill: string;
    allowFirstNightKillDesc: string;
    allowFirstVoteExecution: string;
    allowFirstVoteExecutionDesc: string;
    allowWolfFriendlyFire: string;
    allowWolfFriendlyFireDesc: string;
    seerFirstNightDivine: string;
    seerFirstNightDivineDesc: string;
    allowSelfVote: string;
    revealVoteChoices: string;
    revealVoteChoicesDesc: string;
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
    hostEndedTitle: string;
    hostEndedDesc: string;
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
    endGameTitle: string;
    endGameDesc: string;
    endGameAction: string;
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
    diagramTitle: string;
    diagramIntro: string;
    diagramDayLabel: (day: number) => string;
    diagramSameDayNote: string;
    diagramOutcomeLabel: string;
    diagramNoRoomNote: string;
    diagramSettingsHeading: string;
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
    description: "隠れた人狼を会話と推理で見つけ出す、13役職対応の会話型心理ゲーム。集まったメンバーでスマホ片手に遊べます。",
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
    menu: "メニュー",
    themeLabel: "テーマ",
    languageLabel: "言語",
    endGameButton: "ゲームを終了する",
    officialRuleBadge: "公式ルール",
    optionalRuleBadge: "選択ルール",
  },
  entry: {
    title: "人狼DX オンライン",
    subtitle: "隠れた人狼を会話と推理で見つけ出す、13役職対応の会話型心理ゲーム。どこからでもスマホ片手に遊べます。",
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
    castLabel: "登場する13の役職",
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
    shareLink: "招待リンクを送る",
    shareMessage: (code) => `人狼DXオンラインの部屋に招待されました。合言葉コード: ${code}`,
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
    officialRulesSectionTitle: "基本ルール",
    extraRulesSectionTitle: "追加ルール",
    extraRulesSectionDesc: "ここから下は、このアプリ独自の拡張ルールです。基本ルールには存在しない設定なので、遊びやすいように自由にカスタマイズしてください。",
    revealOnDeath: "死亡時に役職を公開する",
    allowFirstNightKill: "最初の夜、人狼は襲撃できる",
    allowFirstNightKillDesc: "オフにすると、最初の夜(1日目の夜)だけ人狼が誰を襲撃しても死にません。初めてのメンバーが多い場合におすすめの設定です。2日目以降の夜は通常通り襲撃が有効になります。",
    allowFirstVoteExecution: "最初の投票で、実際に追放できる",
    allowFirstVoteExecutionDesc: "オフにすると、最初の投票(1日目の投票)で誰が選ばれても実際には追放されず、生かされます。2日目以降の投票は通常通り追放が有効になります。",
    allowWolfFriendlyFire: "人狼は仲間の人狼を襲撃対象にできる",
    allowWolfFriendlyFireDesc: "オンにすると、人狼が仲間の人狼を襲撃対象に選べるようになります(通常はできません)。",
    seerFirstNightDivine: "予言者は役職確認のときに1人占える",
    seerFirstNightDivineDesc: "役職確認のタイミングで、予言者が1人を自由に占える遊び方です(7人以上でのプレイ推奨)。占うかどうかは予言者が自由に選べます。オフの場合、占いは最初の夜から始まります。",
    allowSelfVote: "投票で自分自身に投票できる",
    revealVoteChoices: "投票内容を全員に公開する",
    revealVoteChoicesDesc: "ONにすると、投票フェーズ中に「誰が誰に投票しているか」がリアルタイムで全員に見えるようになります。OFFの場合は今まで通り、票数の集計のみが公開されます。",
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
    previousSeerResult: (day) =>
      day === 0 ? "前回の占い結果(役職確認時)" : `前回の占い結果(${day}日目)`,
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
    hostEndedTitle: "ホストがゲームを終了しました",
    hostEndedDesc: "勝敗はつかず、ここでゲームが終了しました。",
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
    endGameTitle: "ゲームを終了しますか?",
    endGameDesc: "現在のゲームがここで終了し、全員に役職が公開されます。この操作は取り消せません。",
    endGameAction: "終了する",
  },
  help: {
    button: "遊び方",
    title: "遊び方・ルール",
    tldr: "ひとことで言うと: 正体を隠した「人狼」を、市民たちが話し合いで見つけ出し、投票で追放するゲームです。",
    tabFlow: "流れ",
    tabWin: "勝利条件",
    tabRoles: "役職",
    intro:
      "人狼DXは、正体を隠した「人狼」と、それを見つけ出したい「市民」に分かれて遊ぶ心理ゲームです。「昼」(話し合いと投票)と「夜」(役職ごとの秘密の行動)を交互にくり返し、市民が人狼を全員追放するか、人狼が市民と同数まで減れば決着します。役職確認・夜の行動・投票は、すべてこの画面上で行います。自動で進むタイマーはないので、ホストの操作か全員の操作がそろうまで、自分たちのペースで進められます。",
    flowTitle: "ゲームの流れ",
    flowSteps: [
      { title: "役職確認", desc: "全員が自分だけの役職をこっそり確認し、「確認しました」を押します。周りに見られないように注意しましょう。全員が押し終えるまで次には進みません。" },
      { title: "最初の話し合い", desc: "役職確認の直後に行う、まだ誰も襲われていない状態での自己紹介タイムです。投票はありません。軽く話したら、ホストの操作で本当の「夜」に進みます。" },
      { title: "夜", desc: "人狼・予言者・ボディーガードなど、能力を持つ役職だけがこっそり行動します。能力のない人は何もせず待機するだけでOKです。ここで初めて人狼の襲撃が発生します(1日目の夜だけ襲撃なしにする設定もあります)。" },
      { title: "朝(結果発表)", desc: "夜の間に何が起きたか(誰が犠牲になったか)が発表されます。" },
      { title: "議論", desc: "夜の結果をふまえて、誰が人狼か話し合って推理します。時間制限はないので、納得いくまで話しましょう。" },
      { title: "投票", desc: "追放したい人をひとり選んで投票します。最多票の人が追放され、同数の場合は決選投票になります。全員の投票がそろうと自動的に結果発表に進みます。" },
      { title: "くり返し", desc: "「夜→朝→議論→投票」を、どちらかの陣営が勝利するまでくり返します。" },
    ],
    diagramTitle: "図でみる夜と昼のサイクル",
    diagramIntro:
      "「夜」と、その直後に続く「朝→議論→投票」はセットで同じ日数として数えます。たとえば「夜1」の次に来る朝・議論・投票はすべて「1日目」です。",
    diagramDayLabel: (day) => `${day}日目`,
    diagramSameDayNote: "🌙 夜と ☀️ 昼(朝・議論・投票)は、同じ番号なら同じひとまとまりです。",
    diagramOutcomeLabel: "決着",
    diagramNoRoomNote: "実際の設定は参加した部屋によって異なります。部屋に入ると「配役・設定」タブでも確認できます。",
    diagramSettingsHeading: "この部屋の設定",
    winTitle: "勝利条件",
    winIntro: "決着のつき方は陣営ごとに異なります。複数の陣営が同時に勝利することもあります。",
    winVillage: "市民陣営: 人狼をひとり残らず追放すると勝利。",
    winWerewolf: "人狼陣営: 人狼の数が、人狼以外の生存者数以上になると勝利。",
    winFox: "妖狐: ゲーム終了まで生き延びれば、村・人狼どちらが勝っても関係なく単独で勝利。",
    winGod: "神様: ゲーム終了まで生き延びれば、村・人狼どちらが勝っても関係なく単独で勝利。",
    winLover: "恋人: ゲーム終了時に2人とも生き延びていれば、2人そろって勝利。",
    rolesTitle: "役職一覧(13種)",
    rolesIntro: "自分の役職の説明は、画面上部の「自分の役職」ボタンからゲーム中いつでも確認できます。",
    close: "閉じる",
  },
  myRole: {
    button: "自分の役職",
    title: "あなたの役職",
    dayLabel: (day) => (day === 0 ? "役職確認時" : `${day}日目`),
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
      detail: "あなたは市民です。特別な能力はありません。誰かを怪しいと思ったら、話し合いの中でその理由をみんなに伝えて、一緒に推理を進めましょう。",
    },
    seer: {
      name: "予言者",
      short: "毎晩ひとりを占い、人狼かどうかを知る",
      detail:
        "あなたは予言者です。毎晩、誰かひとりを占うことができます。占った相手が「人狼」なら黒、それ以外なら白と分かります。この結果は他の人には見えないので、話し合いでどう伝えるかはあなた次第です。なお、妖狐を占うと、妖狐はその夜のうちに呪い殺されます。",
    },
    bodyguard: {
      name: "ボディーガード",
      short: "毎晩ひとりを人狼の襲撃から守る",
      detail:
        "あなたはボディーガードです。毎晩、自分以外の誰かひとりを選んで人狼の襲撃から守ります。守った相手がその夜の襲撃対象だった場合、その人は生き残ります。同じ人を2晩連続では守れません。",
    },
    medium: {
      name: "霊媒師",
      short: "追放された人が人狼だったか分かる",
      detail: "あなたは霊媒師です。昼に追放されたプレイヤーが「人狼」だったかどうかを、その夜のうちに知ることができます。まだ誰も追放されていない1日目の夜は、判定する相手がいません。",
    },
    hunter: {
      name: "ハンター",
      short: "自分が死ぬとき、ひとり道連れにできる",
      detail:
        "あなたはハンターです。「追放」されたとき、または「人狼に襲撃」されて死亡したときに、誰かひとりを道連れに指名して一緒に葬ることができます(指名しなくても構いません)。自分から役職を明かす必要はありません。",
    },
    mason: {
      name: "共有者",
      short: "2人以上でお互いを知っている村人",
      detail: "あなたは共有者です。他の共有者が誰かを知っています。特別な能力はありませんが、お互いを100%信頼できる貴重な仲間です。人狼に怪しまれないよう、正体を明かすタイミングは慎重に選びましょう。",
    },
    dictator: {
      name: "独裁者",
      short: "1度だけ議論を打ち切り、独断で追放者を決められる",
      detail:
        "あなたは独裁者です。ゲーム中1度だけ、昼の話し合い中に正体を明かして議論を強制終了させ、投票なしで追放する相手を独断で決められます。強力な能力なので、使うタイミングは慎重に見極めましょう。",
    },
    werewolf: {
      name: "人狼",
      short: "毎晩ひとりを襲撃する。他の人狼が分かる",
      detail:
        "あなたは人狼です。仲間の人狼が誰かを知っています。毎晩、仲間と相談してひとりを襲撃してください。話し合いでは市民のふりをして正体を隠し通し、人狼の数が市民と同数になれば勝利です。",
    },
    traitor: {
      name: "裏切り者",
      short: "人狼陣営の一員だが、人狼の正体は知らされない",
      detail:
        "あなたは裏切り者です。人狼陣営が勝利すればあなたも勝利しますが、誰が人狼かは知らされません。占い・霊媒でも「白(人狼ではない)」と判定されるため、疑われにくい立場です。人狼を探すふりをしながら、それとなく人狼陣営に有利な行動をとりましょう(内通者と違い、あなた自身は人狼の顔ぶれを知らない点に注意)。",
    },
    insider: {
      name: "内通者",
      short: "人狼の正体を知っている、人狼陣営の協力者",
      detail:
        "あなたは内通者です。人狼が誰かを知っています。占い・霊媒でも「白(人狼ではない)」と判定されるため、人狼陣営の中でもとりわけ疑われにくい立場です。人狼を露骨にかばうと怪しまれるので、市民のふりをしながらさりげなく助けましょう(裏切り者と違い、あなたは人狼の顔ぶれを知っています)。",
    },
    fox: {
      name: "妖狐",
      short: "人狼に襲撃されても死なない単独陣営。占われると死ぬ",
      detail:
        "あなたは妖狐です。村にも人狼にも属さない単独陣営で、人狼に襲撃されても死にません。ただし予言者に占われると、その夜のうちに呪い殺されてしまいます。村・人狼どちらが勝っても関係なく、ゲーム終了時に生き残っていればあなたの勝利です。",
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
        "あなたは恋人です。もうひとりの恋人が誰か知っています。どちらか一方が追放や襲撃で死亡すると、もう一方もその後を追って死亡します。ゲーム終了時に2人とも生存していれば、2人そろっての勝利です。",
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
      "A social deduction party game for groups: find the hidden Werewolves through conversation and deduction, with 13 roles to play. Everyone plays from their own phone.",
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
    menu: "Menu",
    themeLabel: "Theme",
    languageLabel: "Language",
    endGameButton: "End game",
    officialRuleBadge: "Official Rule",
    optionalRuleBadge: "Optional Rule",
  },
  entry: {
    title: "Jinro DX Online",
    subtitle: "A 13-role social deduction party game — find the hidden Werewolves through conversation and deduction. Play from anywhere, right from your phone.",
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
    castLabel: "13 roles to play",
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
    shareLink: "Share invite link",
    shareMessage: (code) => `You're invited to a Jinro DX Online room. Room code: ${code}`,
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
    officialRulesSectionTitle: "Base rules",
    extraRulesSectionTitle: "Extra rules",
    extraRulesSectionDesc: "Everything below is an extension unique to this app — these options aren't part of the base rules, so feel free to tune them however your group likes.",
    revealOnDeath: "Reveal role on death",
    allowFirstNightKill: "Werewolves can attack on the first night",
    allowFirstNightKillDesc: "Turn this off to make the first night (night 1) attack-proof — whoever the werewolves attack survives. From night 2 onward, attacks work normally. Recommended if most players are new to the game.",
    allowFirstVoteExecution: "The first vote can result in a real execution",
    allowFirstVoteExecutionDesc: "Turn this off to make the first vote (day 1) execution-proof — whoever is chosen is spared instead of executed. From day 2 onward, votes work normally.",
    allowWolfFriendlyFire: "Werewolves can attack each other",
    allowWolfFriendlyFireDesc: "Turn this on to let werewolves target a fellow werewolf with their attack (not allowed by default).",
    seerFirstNightDivine: "Seer can investigate one player during role reveal",
    seerFirstNightDivineDesc: "An alternate way to play: the Seer may freely investigate one player right at role reveal. Recommended for 7+ players. Using it is entirely optional. When off, investigating starts on the first night as usual.",
    allowSelfVote: "Allow voting for yourself",
    revealVoteChoices: "Reveal everyone's votes live",
    revealVoteChoicesDesc: "When on, everyone can see who's voting for whom in real time during the vote phase. When off (default), only the total counts are shown as before.",
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
    previousSeerResult: (day) =>
      day === 0 ? "Last investigation (at role reveal)" : `Last investigation (night ${day})`,
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
    hostEndedTitle: "The host ended the game",
    hostEndedDesc: "No winner was decided — the game was ended here.",
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
    endGameTitle: "End the game now?",
    endGameDesc: "The current game will end right here, and everyone's role will be revealed. This can't be undone.",
    endGameAction: "End game",
  },
  help: {
    button: "How to play",
    title: "How to play / Rules",
    tldr: "In short: hidden Werewolves try to survive while Villagers talk it out and vote to root them out.",
    tabFlow: "Flow",
    tabWin: "Winning",
    tabRoles: "Roles",
    intro:
      "Jinro DX is a social deduction game: hidden 'Werewolves' try to survive while 'Villagers' try to find and eliminate them through conversation and deduction. 'Day' (discussion and voting) and 'Night' (secret role actions) repeat until one side meets its win condition. Use this app for role reveals, night actions, and voting. There are no automatic timers — every screen advances only when the host acts or everyone has finished, so you always play at your own pace.",
    flowTitle: "Game flow",
    flowSteps: [
      { title: "Role reveal", desc: "Everyone privately checks their own role and taps \"I've confirmed my role\". Make sure no one else can see your screen. The game won't move on until everyone has confirmed." },
      { title: "First discussion", desc: "A quick, vote-free round for introductions right after role reveal — no one has been attacked yet. Chat a little, then the host moves on to the real first night." },
      { title: "Night", desc: "Only players with night abilities (Werewolf, Seer, Bodyguard, etc.) act in secret; everyone else just waits. This is the first time a werewolf attack can happen (night 1 attacks can be turned off in settings)." },
      { title: "Morning (results)", desc: "The results of the night — who fell victim, if anyone — are announced." },
      { title: "Discussion", desc: "Talk through what happened and figure out who the werewolves are. There's no time limit, so take as long as you need." },
      { title: "Vote", desc: "Everyone votes for one player to execute. The top vote-getter is executed; a tie triggers a runoff vote. Once everyone has voted, the result is shown automatically." },
      { title: "Repeat", desc: "Night → morning → discussion → vote repeats until one side wins." },
    ],
    diagramTitle: "Night & Day cycle at a glance",
    diagramIntro:
      "Each \"Night\" and the \"Morning → Discussion → Vote\" that immediately follows it share the same day number. For example, everything right after \"Night 1\" — morning, discussion, and vote — is all \"Day 1\".",
    diagramDayLabel: (day) => `Day ${day}`,
    diagramSameDayNote: "🌙 Night and ☀️ Day (morning, discussion, vote) sharing the same number belong to the same round.",
    diagramOutcomeLabel: "Game over",
    diagramNoRoomNote: "The actual settings depend on the room you join — you can check them under the room's \"Setup\" tab once you're in one.",
    diagramSettingsHeading: "This room's settings",
    winTitle: "Win conditions",
    winIntro: "How the game ends depends on the faction — more than one faction can win at once.",
    winVillage: "Village: wins once every last Werewolf has been eliminated.",
    winWerewolf: "Werewolves: win once werewolves are at least as many as everyone else still alive.",
    winFox: "Fox: wins alone if still alive when the game ends — independent of whether Village or Werewolf wins.",
    winGod: "God: wins alone if still alive when the game ends — independent of whether Village or Werewolf wins.",
    winLover: "Lovers: win together if both are still alive when the game ends.",
    rolesTitle: "All 13 roles",
    rolesIntro: "You can check your own role's description any time during the game — just tap the \"My Role\" button at the top of the screen.",
    close: "Close",
  },
  myRole: {
    button: "My Role",
    title: "Your role",
    dayLabel: (day) => (day === 0 ? "At role reveal" : `Night ${day}`),
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
      detail: "You are a Villager. You have no special ability. If you suspect someone, share your reasoning during discussion and help the group figure out who the werewolves are.",
    },
    seer: {
      name: "Seer",
      short: "Each night, investigate one player to learn if they're a werewolf",
      detail:
        "You are the Seer. Each night, choose one player to investigate. You'll learn whether they are a Werewolf (black) or not (white). No one else sees this result, so it's up to you whether and how to share it. If you investigate the Fox, it dies of a curse that same night.",
    },
    bodyguard: {
      name: "Bodyguard",
      short: "Each night, protect one player from the werewolves",
      detail:
        "You are the Bodyguard. Each night, choose one player other than yourself to protect from the werewolves' attack. If your chosen player was the target, they survive. You can't protect the same person two nights in a row.",
    },
    medium: {
      name: "Medium",
      short: "Learn whether the executed player was a werewolf",
      detail: "You are the Medium. Each night, you learn whether the player executed that day was a Werewolf or not. There's nothing to learn on the very first night, since no one has been executed yet.",
    },
    hunter: {
      name: "Hunter",
      short: "When you die, you can take one other player with you",
      detail:
        "You are the Hunter. If you are executed or killed by a werewolf attack, you may name one other player to die alongside you (this is optional). You don't need to reveal your role in advance.",
    },
    mason: {
      name: "Mason",
      short: "A villager who knows the other Masons",
      detail: "You are a Mason. You know who the other Masons are. You have no special ability, but you have someone you can trust completely — choose carefully when (or whether) to let the group know.",
    },
    dictator: {
      name: "Dictator",
      short: "Once per game, skip the vote and decide an execution yourself",
      detail:
        "You are the Dictator. Once per game, during the day's discussion, you may reveal yourself to end discussion early and decide who is executed on your own — skipping the vote entirely. It's a powerful move, so time it carefully.",
    },
    werewolf: {
      name: "Werewolf",
      short: "Each night, attack one player. You know the other werewolves",
      detail:
        "You are a Werewolf. You know who the other werewolves are. Each night, coordinate with them to choose one player to attack. Act like an innocent villager during discussion to stay hidden — you win once werewolves equal the rest of the survivors in number.",
    },
    traitor: {
      name: "Traitor",
      short: "On the Werewolf team, but doesn't know who the werewolves are",
      detail:
        "You are the Traitor. You win with the Werewolf team, but you don't know who the werewolves are. You appear as an innocent villager to the Seer and Medium, so you're hard to catch. Pretend to help hunt the werewolves while quietly steering things their way. (Unlike the Insider, you don't actually know who the werewolves are.)",
    },
    insider: {
      name: "Insider",
      short: "Knows who the werewolves are, but appears innocent",
      detail:
        "You are the Insider. You know who the werewolves are. You appear as an innocent villager to the Seer and Medium, making you especially hard to catch. Avoid defending the wolves too obviously — a subtle nudge works better than an obvious one. (Unlike the Traitor, you do know their identities.)",
    },
    fox: {
      name: "Fox",
      short: "Immune to werewolf attacks, but dies if investigated",
      detail:
        "You are the Fox, a solo faction belonging to neither the Village nor the Werewolves. You survive werewolf attacks, but if the Seer investigates you, you die of a curse that same night. Whoever else wins, you win on your own if you're still alive when the game ends.",
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
    title: "마피아DX 온라인 (진로DX)",
    description:
      "숨어 있는 마피아를 대화와 추리로 찾아내는 13개 역할 마피아 게임. 모인 인원끼리 각자 스마트폰으로 즐길 수 있습니다.",
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
    menu: "메뉴",
    themeLabel: "테마",
    languageLabel: "언어",
    endGameButton: "게임 종료",
    officialRuleBadge: "공식 규칙",
    optionalRuleBadge: "선택 규칙",
  },
  entry: {
    title: "마피아DX 온라인 (진로DX)",
    subtitle: "숨어 있는 마피아를 대화와 추리로 찾아내는 13개 역할 마피아 게임. 어디서든 스마트폰 하나로 즐길 수 있습니다.",
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
    castLabel: "등장하는 13가지 역할",
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
    shareLink: "초대 링크 공유하기",
    shareMessage: (code) => `마피아DX 온라인 방에 초대되었습니다. 방 코드: ${code}`,
    copyCodeToast: "코드를 복사했습니다",
    copyLinkToast: "초대 링크를 복사했습니다",
    copyErrorToast: "복사에 실패했습니다",
    participants: (n) => `참가자 (${n}명)`,
    waitingForMorePlayers: (n) => `${n}명이 더 모이면 게임을 시작할 수 있습니다`,
    composition: "역할 구성",
    compositionReadonly: "역할 구성 (호스트가 설정 중)",
    compositionReadonlyDesc: (wolves, total) => `마피아 ${wolves}명을 포함해 총 ${total}명분의 역할이 설정되어 있습니다.`,
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
    officialRulesSectionTitle: "기본 규칙",
    extraRulesSectionTitle: "추가 규칙",
    extraRulesSectionDesc: "이 아래는 이 앱만의 확장 규칙입니다. 기본 규칙에는 없는 옵션이니 우리 모임에 맞게 자유롭게 설정하세요.",
    revealOnDeath: "사망 시 역할 공개",
    allowFirstNightKill: "첫날 밤에 마피아가 습격할 수 있다",
    allowFirstNightKillDesc: "꺼두면 첫날 밤(1일차 밤)에는 마피아가 누구를 습격해도 죽지 않습니다. 처음 하는 멤버가 많을 때 추천하는 설정입니다. 2일차 밤부터는 평소대로 습격이 유효해집니다.",
    allowFirstVoteExecution: "첫 투표에서 실제로 추방할 수 있다",
    allowFirstVoteExecutionDesc: "꺼두면 첫 투표(1일차 투표)에서 누가 선택되어도 실제로는 추방되지 않고 살아남습니다. 2일차 투표부터는 평소대로 추방이 유효해집니다.",
    allowWolfFriendlyFire: "마피아는 동료 마피아를 습격 대상으로 지정할 수 있다",
    allowWolfFriendlyFireDesc: "켜면 마피아가 동료 마피아를 습격 대상으로 선택할 수 있게 됩니다 (평소에는 불가능합니다).",
    seerFirstNightDivine: "경찰은 역할 확인 시 1명을 조사할 수 있다",
    seerFirstNightDivineDesc: "역할 확인 시점에 경찰이 원하는 한 명을 자유롭게 조사할 수 있는 또 다른 플레이 방식입니다 (7명 이상 플레이 권장). 조사할지 여부는 경찰이 자유롭게 선택할 수 있습니다. 꺼두면 수사는 첫날 밤부터 평소대로 시작됩니다.",
    allowSelfVote: "투표에서 자기 자신에게 투표할 수 있음",
    revealVoteChoices: "투표 내용을 전원에게 공개",
    revealVoteChoicesDesc: "켜면 투표 단계 중에 누가 누구에게 투표하는지 실시간으로 전원에게 보입니다. 끄면(기본값) 기존처럼 집계 수만 공개됩니다.",
    allowBodyguardSelfGuard: "의사가 자기 자신을 치료할 수 있음",
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
    earlyDivineTitle: "경찰의 능력을 지금 사용하기 (선택)",
    earlyDivineDesc: "역할 확인 시점에 1명을 조사할 수 있습니다. 사용하지 않고 넘어가도 됩니다.",
    earlyDivineButton: "이 사람을 조사하기",
    earlyDivineSkipNote: "조사하지 않고 '확인했습니다'를 눌러 진행할 수도 있습니다.",
    earlyDivineDone: "이미 조사를 마쳤습니다. 결과는 아래와 같습니다.",
  },
  night: {
    tag: (day) => `밤 ${day}일차`,
    deadNotice: "당신은 이미 탈락했습니다. 조용히 밤이 지나가는 것을 지켜봐 주세요…",
    dormant: "밤이 깊어가고 있습니다…",
    dormantDesc: "능력을 가진 사람이 행동을 마칠 때까지 기다려 주세요.",
    progress: (s, t) => `행동 완료: ${s} / ${t}명`,
    submitButton: "결정하기",
    resubmitButton: "제출됨 (변경하기)",
    previousSeerResult: (day) =>
      day === 0 ? "이전 수사 결과 (역할 확인 시)" : `이전 수사 결과 (${day}일차)`,
    seerResultLine: (name, isBlack) => `${name}님은 ${isBlack ? "【흑(마피아)】" : "【백】"}이었습니다`,
    actions: {
      attack: { title: "누구를 습격하시겠습니까?", desc: "동료 마피아와 상의하여 오늘 밤 습격할 대상을 선택하세요.", skip: "오늘 밤은 습격하지 않는다" },
      guard: { title: "누구를 치료하시겠습니까?", desc: "마피아의 습격으로부터 치료할 대상을 선택하세요. 자기 자신은 치료할 수 없고, 어젯밤 치료한 대상도 다시 선택할 수 없습니다.", skip: "오늘 밤은 아무도 치료하지 않는다" },
      divine: { title: "누구를 조사하시겠습니까?", desc: "상대가 마피아인지 아닌지를 조사합니다.", skip: "오늘 밤은 조사하지 않는다" },
    },
    firstNightKillDisabledNotice: "설정에 따라 첫날 밤(1일차)에는 누구를 습격해도 죽지 않습니다. 2일차 밤부터는 평소대로 효과가 있습니다.",
    forceAdvanceButton: "전원을 기다리지 않고 진행하기 (호스트 조작)",
    wolfSelectionsTitle: "동료 마피아들이 지금 선택하고 있는 대상 (상의용)",
    wolfSelectionsEmpty: "아직 아무도 선택하지 않았습니다",
    wolfSelectionsLine: (name, targetName) => `${name}님: ${targetName ?? "미선택"}`,
    wolfConsensusNeeded: "마피아 전원이 같은 대상(또는 전원 '습격하지 않음')을 선택할 때까지 밤은 끝나지 않습니다. 상의해서 한 명으로 정하세요.",
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
    seerResult: "수사 결과",
    continueButton: "토론 시간으로 진행",
    waitingHost: "호스트가 토론 시간으로 진행하기를 기다리는 중…",
  },
  discussion: {
    tag: (day) => `토론 시간 ${day}일차`,
    firstRoundTag: "첫 번째 토론",
    firstRoundNotice: "역할 확인 직후에 진행되는, 투표 없는 첫 번째 토론입니다. 아직 아무도 습격당하지 않았습니다. 이번 라운드에는 추방 투표도 없습니다. 자유롭게 이야기를 나눈 뒤, 호스트가 진짜 '밤'으로 진행합니다.",
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
    mediumResultLine: (name, isBlack) => `${name}님은 ${isBlack ? "【흑(마피아)】" : "【백】"}이었습니다`,
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
      werewolf: "마피아 진영의 승리!",
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
    hostEndedTitle: "호스트가 게임을 종료했습니다",
    hostEndedDesc: "승패가 가려지지 않고, 여기서 게임이 종료되었습니다.",
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
    endGameTitle: "게임을 종료할까요?",
    endGameDesc: "지금 진행 중인 게임이 여기서 종료되고, 전원의 역할이 공개됩니다. 이 작업은 취소할 수 없습니다.",
    endGameAction: "종료하기",
  },
  help: {
    button: "게임 방법",
    title: "게임 방법 · 규칙",
    tldr: "한마디로: 숨어 있는 '마피아'를 시민들이 대화로 찾아내 투표로 추방하는 게임입니다.",
    tabFlow: "진행 순서",
    tabWin: "승리 조건",
    tabRoles: "역할",
    intro:
      "마피아DX(진로DX)는 정체를 숨긴 '마피아'와, 그들을 찾아내려는 '시민'으로 나뉘어 즐기는 심리 게임입니다. '낮'(토론과 투표)과 '밤'(역할별 비밀 행동)을 번갈아 반복하며, 시민이 마피아를 전부 추방하거나 마피아가 시민과 같은 수까지 줄어들면 게임이 끝납니다. 역할 확인 · 밤의 행동 · 투표는 모두 이 화면에서 진행합니다. 자동으로 넘어가는 타이머는 없으므로, 호스트의 조작이나 전원의 행동이 끝날 때까지 여러분의 속도에 맞춰 진행할 수 있습니다.",
    flowTitle: "게임 진행 순서",
    flowSteps: [
      { title: "역할 확인", desc: "모든 사람이 각자 자신의 역할을 몰래 확인하고 '확인했습니다'를 누릅니다. 주변 사람에게 보이지 않도록 주의하세요. 전원이 누르기 전에는 다음으로 넘어가지 않습니다." },
      { title: "첫 번째 토론", desc: "역할 확인 직후에 진행되는, 투표가 없는 자기소개 시간입니다. 아직 아무도 습격당하지 않았습니다. 가볍게 이야기를 나눈 뒤, 호스트가 진짜 '밤'으로 진행합니다." },
      { title: "밤", desc: "마피아 · 경찰 · 의사 등 능력을 가진 역할만 몰래 행동합니다. 능력이 없는 사람은 그냥 기다리기만 하면 됩니다. 여기서 처음으로 마피아의 습격이 발생합니다 (첫날 밤 습격만 끄는 설정도 있습니다)." },
      { title: "아침 (결과 발표)", desc: "밤사이 무슨 일이 있었는지 (누가 희생되었는지)가 발표됩니다." },
      { title: "토론", desc: "밤의 결과를 바탕으로 누가 마피아인지 이야기를 나누며 추리합니다. 시간 제한이 없으니 납득이 갈 때까지 충분히 이야기하세요." },
      { title: "투표", desc: "추방할 사람을 한 명 선택해 투표합니다. 최다 득표자가 추방되며, 동수일 경우 결선 투표가 진행됩니다. 전원이 투표를 마치면 자동으로 결과가 발표됩니다." },
      { title: "반복", desc: "'밤 → 아침 → 토론 → 투표'를 어느 한쪽 진영이 승리할 때까지 반복합니다." },
    ],
    diagramTitle: "한눈에 보는 밤과 낮의 순서",
    diagramIntro:
      "'밤'과 그 직후에 이어지는 '아침 → 토론 → 투표'는 같은 날짜로 묶입니다. 예를 들어 '밤1' 다음에 오는 아침 · 토론 · 투표는 모두 '1일차'입니다.",
    diagramDayLabel: (day) => `${day}일차`,
    diagramSameDayNote: "🌙 밤과 ☀️ 낮(아침 · 토론 · 투표)은 같은 번호라면 같은 묶음입니다.",
    diagramOutcomeLabel: "결착",
    diagramNoRoomNote: "실제 설정은 참가한 방마다 다릅니다. 방에 들어가면 '배역 · 설정' 탭에서도 확인할 수 있습니다.",
    diagramSettingsHeading: "이 방의 설정",
    winTitle: "승리 조건",
    winIntro: "게임이 끝나는 방식은 진영마다 다릅니다. 여러 진영이 동시에 승리하는 경우도 있습니다.",
    winVillage: "시민 진영: 마피아를 한 명도 남김없이 추방하면 승리.",
    winWerewolf: "마피아 진영: 마피아의 수가 마피아 이외의 생존자 수 이상이 되면 승리.",
    winFox: "요호: 게임이 끝날 때까지 살아남으면, 시민 · 마피아의 승패와 상관없이 단독 승리.",
    winGod: "신: 게임이 끝날 때까지 살아남으면, 시민 · 마피아의 승패와 상관없이 단독 승리.",
    winLover: "연인: 게임 종료 시 두 사람 모두 살아남아 있으면 함께 승리.",
    rolesTitle: "역할 목록 (13종)",
    rolesIntro: "자신의 역할에 대한 설명은 화면 상단의 '나의 역할' 버튼을 누르면 게임 중 언제든지 확인할 수 있습니다.",
    close: "닫기",
  },
  myRole: {
    button: "나의 역할",
    title: "당신의 역할",
    dayLabel: (day) => (day === 0 ? "역할 확인 시" : `${day}일차`),
    seerHistoryTitle: "지금까지 조사한 사람",
    seerHistoryEmpty: "아직 아무도 조사하지 않았습니다.",
    mediumHistoryTitle: "지금까지 판정한 사람",
    mediumHistoryEmpty: "아직 판정한 사람이 없습니다.",
    noRoleYet: "아직 역할이 확인되지 않았습니다.",
    close: "닫기",
  },
  team: {
    village: "시민 진영",
    werewolf: "마피아 진영",
    fox: "요호 (단독 진영)",
    god: "신 (단독 진영)",
    lover: "연인 (단독 진영)",
  },
  deathCause: {
    attack: "마피아에게 습격당함",
    execution: "추방됨",
    curse: "경찰의 조사를 받아 저주로 사망",
    hunter: "헌터의 복수로 사망",
    lover_grief: "연인의 뒤를 따라감",
  },
  roles: {
    villager: {
      name: "시민",
      short: "특별한 능력이 없는 마을 사람",
      detail: "당신은 시민입니다. 특별한 능력은 없습니다. 누군가 의심스럽다면 토론 시간에 그 이유를 함께 나누며 다 같이 추리를 이어가세요.",
    },
    seer: {
      name: "경찰",
      short: "매일 밤 한 명을 조사해 마피아인지 아닌지 알아낸다",
      detail:
        "당신은 경찰입니다. 매일 밤 한 명을 골라 조사할 수 있습니다. 그 사람이 '마피아'이면 흑, 그 외에는 백으로 판명됩니다. 이 결과는 다른 사람에게는 보이지 않으니, 토론에서 어떻게 알릴지는 당신의 선택입니다. 참고로 요호를 조사하면 요호는 그날 밤 저주로 사망합니다.",
    },
    bodyguard: {
      name: "의사",
      short: "매일 밤 한 명을 치료하여 마피아의 습격으로부터 지킨다",
      detail:
        "당신은 의사입니다. 매일 밤 자신을 제외한 한 명을 선택해 치료하여 마피아의 습격으로부터 지킬 수 있습니다. 치료한 상대가 습격 대상이었다면 그 사람은 살아남습니다. 단, 같은 사람을 이틀 연속으로는 치료할 수 없습니다.",
    },
    medium: {
      name: "영매사",
      short: "추방된 사람이 마피아였는지 알 수 있다",
      detail: "당신은 영매사입니다. 낮에 추방된 플레이어가 '마피아'였는지 아닌지를 그날 밤 알 수 있습니다. 아직 아무도 추방되지 않은 첫날 밤에는 알 수 있는 대상이 없습니다.",
    },
    hunter: {
      name: "헌터",
      short: "자신이 죽을 때, 한 명을 함께 데려갈 수 있다",
      detail:
        "당신은 헌터입니다. '추방'되거나 '마피아에게 습격'당해 사망할 때, 한 명을 지목해 함께 죽음에 이르게 할 수 있습니다 (지목하지 않아도 됩니다). 미리 자신의 역할을 밝힐 필요는 없습니다.",
    },
    mason: {
      name: "공유자",
      short: "2명 이상이 서로를 알고 있는 마을 사람",
      detail: "당신은 공유자입니다. 다른 공유자가 누구인지 알고 있습니다. 특별한 능력은 없지만, 완전히 믿을 수 있는 소중한 동료가 있는 셈입니다. 정체를 언제 밝힐지는 신중하게 판단하세요.",
    },
    dictator: {
      name: "독재자",
      short: "단 한 번, 토론을 중단시키고 독단으로 추방자를 결정할 수 있다",
      detail:
        "당신은 독재자입니다. 게임 중 단 한 번, 낮의 토론 중에 정체를 밝히고 토론을 강제 종료시켜 투표 없이 추방자를 독단으로 결정할 수 있습니다. 강력한 능력이니 사용 시점을 신중하게 고르세요.",
    },
    werewolf: {
      name: "마피아",
      short: "매일 밤 한 명을 습격한다. 다른 마피아를 알 수 있다",
      detail:
        "당신은 마피아입니다. 동료 마피아가 누구인지 알고 있습니다. 매일 밤 동료와 상의하여 한 명을 습격하세요. 토론 중에는 시민인 척 정체를 숨기고, 마피아의 수가 시민과 같아지면 승리입니다.",
    },
    traitor: {
      name: "배신자",
      short: "마피아 진영이지만 마피아의 정체는 모름",
      detail:
        "당신은 배신자입니다. 마피아 진영이 승리하면 당신도 승리하지만, 누가 마피아인지는 알지 못합니다. 수사 · 영매에서도 '백(마피아 아님)'으로 판정되어 의심받기 어려운 위치입니다. 마피아를 찾는 척하면서 은근히 마피아 진영에 유리하게 행동하세요 (내통자와 달리, 당신은 마피아의 정체를 모릅니다).",
    },
    insider: {
      name: "내통자",
      short: "마피아가 누구인지 알고 있는 마피아 진영의 협력자",
      detail:
        "당신은 내통자입니다. 마피아가 누구인지 알고 있습니다. 수사 · 영매에서도 '백(마피아 아님)'으로 판정되어, 마피아 진영 중에서도 특히 의심받기 어려운 위치입니다. 노골적으로 마피아를 감싸면 의심을 사니, 티 나지 않게 도와주세요 (배신자와 달리, 당신은 마피아의 정체를 알고 있습니다).",
    },
    fox: {
      name: "요호",
      short: "마피아에게 습격당해도 죽지 않는 단독 진영. 조사받으면 사망",
      detail:
        "당신은 요호입니다. 시민 · 마피아 어느 쪽에도 속하지 않는 단독 진영으로, 마피아에게 습격당해도 죽지 않습니다. 다만 경찰에게 조사받으면 그날 밤 저주로 사망합니다. 시민과 마피아 중 누가 이기든 상관없이, 게임 종료 시 살아남아 있으면 단독으로 승리합니다.",
    },
    god: {
      name: "신",
      short: "모든 사람의 역할을 알고 있는 단독 진영. 살아남으면 승리",
      detail:
        "당신은 신입니다. 게임 시작 시점부터 모든 플레이어의 역할을 알고 있습니다. 수사·영매에서는 '백'으로 판정됩니다. 시민·마피아 어느 쪽의 승패와도 관계없이, 게임 종료 시 생존해 있으면 당신의 승리입니다.",
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
        return "마피아가 최소 1명은 필요합니다.";
      case "MASON_ODD":
        return "공유자는 2명 1조로 설정해 주세요.";
      case "LOVER_INVALID":
        return "연인은 2명 1조로 설정해 주세요.";
      case "WOLF_TOO_MANY":
        return "마피아 진영의 인원이 너무 많습니다. 시민 진영이 처음부터 불리해집니다.";
    }
  },
};

const zh: Strings = {
  meta: {
    title: "狼人杀DX 在线版",
    description: "通过对话与推理揪出隐藏狼人的心理游戏，支持13种角色。三五好友聚在一起，用手机就能玩。",
  },
  common: {
    host: "房主",
    connected: "已连接",
    disconnected: "已断开",
    reconnecting: "正在重新连接…",
    connecting: "正在连接…",
    kicked: "你已被房主移出房间。",
    seconds: (n) => `${n}秒`,
    timeRemaining: "剩余时间",
    close: "关闭",
    cancel: "取消",
    people: (n) => `${n}人`,
    listSeparator: "、",
    confirmProceed: "继续",
    transitioning: "正在进入下一环节…",
    on: "开",
    off: "关",
    themeToggleToLight: "切换为浅色模式",
    themeToggleToDark: "切换为深色模式",
    menu: "菜单",
    themeLabel: "主题",
    languageLabel: "语言",
    endGameButton: "结束游戏",
    officialRuleBadge: "基本规则",
    optionalRuleBadge: "可选规则",
  },
  entry: {
    title: "狼人杀DX 在线版",
    subtitle: "通过对话与推理揪出隐藏狼人的心理游戏，支持13种角色。无论身在何处，用手机就能开局。",
    cardTitle: "开始游戏",
    cardDesc: "创建房间，或输入暗号加入房间。",
    tabCreate: "创建房间",
    tabJoin: "加入房间",
    nameLabel: "昵称",
    namePlaceholder: "例：小明",
    createButton: "创建房间",
    codeLabel: "暗号",
    codePlaceholder: "例：AB3XZ",
    joinButton: "加入",
    footerNote: "※本应用没有聊天功能，请当面对话进行游戏。",
    helpButton: "查看玩法与规则",
    customCodeLabel: "房间号（可选）",
    customCodePlaceholder: "留空将自动生成",
    customCodeHint: "5〜8位英文数字。不填写将自动生成。",
    avatarLabel: "头像（可选）",
    avatarAddButton: "添加头像",
    avatarChangeButton: "更换头像",
    avatarRemoveButton: "删除头像",
    avatarTooLarge: "图片过大（最大8MB）",
    avatarUnsupported: "请选择图片文件",
    castLabel: "登场的13种角色",
  },
  profile: {
    editButton: "编辑个人资料",
    title: "编辑个人资料",
    desc: "昵称和头像可以随时修改。",
    nameLabel: "昵称",
    avatarLabel: "头像",
    saveButton: "保存",
    savedToast: "个人资料已更新",
    closeButton: "关闭",
  },
  lobby: {
    codeLabel: "暗号",
    copyCode: "复制暗号",
    copyLink: "复制邀请链接",
    shareLink: "发送邀请链接",
    shareMessage: (code) => `你被邀请加入「狼人杀DX 在线版」的房间，暗号：${code}`,
    copyCodeToast: "暗号已复制",
    copyLinkToast: "邀请链接已复制",
    copyErrorToast: "复制失败",
    participants: (n) => `参与者（${n}人）`,
    waitingForMorePlayers: (n) => `还需${n}人即可开始游戏`,
    composition: "角色配置",
    compositionReadonly: "角色配置（房主设置中）",
    compositionReadonlyDesc: (wolves, total) => `已设置共${total}人的角色，其中包含${wolves}名狼人。`,
    compositionEmpty: "尚未设置角色。",
    roomInfoButton: "配置与设置",
    roomInfoTitle: "本局配置与游戏设置",
    suggest: "推荐配置",
    seatTotal: "角色总数",
    seatTotalOf: (total, count) => `${total} / ${count} 人`,
    soloGroupLabel: "单独阵营",
    startButton: "开始游戏",
    waitingHost: "等待房主开始游戏…",
    leaveButton: "退出",
    settingsTitle: "游戏设置",
    officialRulesSectionTitle: "基本规则",
    extraRulesSectionTitle: "附加规则",
    extraRulesSectionDesc: "以下为本应用独有的扩展规则，基本规则中不包含这些设定，可根据大家的喜好自由调整。",
    revealOnDeath: "死亡时公开角色",
    allowFirstNightKill: "第一晚狼人可以袭击",
    allowFirstNightKillDesc: "关闭后，第一晚（第1天夜晚）无论狼人袭击谁都不会死亡，适合新手较多的场合。第2天晚上起，袭击将正常生效。",
    allowFirstVoteExecution: "第一次投票可以真正放逐",
    allowFirstVoteExecutionDesc: "关闭后，第一次投票（第1天投票）无论选中谁都不会真正放逐，会被留下来。第2天投票起将正常生效。",
    allowWolfFriendlyFire: "狼人可以将同伴狼人设为袭击目标",
    allowWolfFriendlyFireDesc: "开启后，狼人可以选择同伴狼人作为袭击目标（通常不可以）。",
    seerFirstNightDivine: "预言家在确认角色时可查验一人",
    seerFirstNightDivineDesc: "在确认角色的同时，预言家可以自由查验一人（建议7人以上时使用）。是否查验由预言家自行决定。关闭时，查验从第一晚正式开始。",
    allowSelfVote: "投票时可以投给自己",
    revealVoteChoices: "向所有人公开投票内容",
    revealVoteChoicesDesc: "开启后，投票阶段中「谁投给了谁」会实时公开给所有人查看。关闭时则和以往一样，只公开票数统计。",
    allowBodyguardSelfGuard: "守卫可以守护自己",
    secondTieExecutesRandomly: "决选投票仍平票时随机放逐",
    secondTieExecutesRandomlyDesc: "关闭后，如果决选投票仍未分出胜负，当天将无人被放逐。",
    dictatorCanTargetSelf: "独裁者可以将自己设为放逐对象",
    settingsPacingNote: "本应用没有自动计时器，各个画面会随房主的操作，或所有人都完成行动后自动推进。请按你们自己的节奏进行。",
    kick: "移出房间",
    makeHost: "设为房主",
    makeHostConfirmTitle: "要交接房主权限吗？",
    makeHostConfirmDesc: (name) => `${name} 将成为新房主，你将失去房主权限，无法再进行游戏进程操作。`,
    makeHostConfirmAction: "交接",
  },
  roleReveal: {
    label: "你的角色",
    tapToReveal: "点击查看",
    privacyHint: "请注意不要被周围的人看到",
    allies: "你的同伴",
    allRoles: "全体玩家的角色",
    waitingOthers: "已确认。等所有人确认完毕后，将自动进入最初的讨论环节。",
    confirmButton: "已确认",
    progress: (s, t) => `已确认：${s} / ${t} 人`,
    earlyDivineTitle: "立即使用预言家的能力（可选）",
    earlyDivineDesc: "在确认角色的同时，可以查验一人。不使用也没关系。",
    earlyDivineButton: "查验此人",
    earlyDivineSkipNote: "也可以不查验，直接点击「已确认」继续。",
    earlyDivineDone: "已完成查验，结果如下。",
  },
  night: {
    tag: (day) => `夜晚 第${day}天`,
    deadNotice: "你已经出局了，请安静地见证夜晚的推移……",
    dormant: "夜正在加深……",
    dormantDesc: "请等待拥有能力的人完成行动。",
    progress: (s, t) => `行动完成：${s} / ${t} 人`,
    submitButton: "确定",
    resubmitButton: "已提交（修改）",
    previousSeerResult: (day) =>
      day === 0 ? "上次的查验结果（确认角色时）" : `上次的查验结果（第${day}天）`,
    seerResultLine: (name, isBlack) => `${name} 是${isBlack ? "【黑（狼人）】" : "【白】"}`,
    actions: {
      attack: { title: "要袭击谁？", desc: "请和同伴狼人商量，选择今晚要袭击的对象。", skip: "今晚不袭击" },
      guard: { title: "要守护谁？", desc: "选择要保护、使其免受狼人袭击的对象。不能守护自己，也不能选择上一晚守护过的人。", skip: "今晚不守护任何人" },
      divine: { title: "要查验谁？", desc: "查验对方是否为狼人。", skip: "今晚不查验" },
    },
    firstNightKillDisabledNotice: "根据设置，第一晚（第1天）无论袭击谁都不会死亡。第2天晚上起将正常生效。",
    forceAdvanceButton: "不等待所有人行动，直接推进（房主操作）",
    wolfSelectionsTitle: "同伴狼人正在选择的对象（供商量参考）",
    wolfSelectionsEmpty: "还没有人选择",
    wolfSelectionsLine: (name, targetName) => `${name}：${targetName ?? "未选择"}`,
    wolfConsensusNeeded: "在所有狼人选择同一个目标（或全员选择「不袭击」）之前，夜晚不会结束。请商量后统一意见。",
    wolfConsensusReached: "所有人的意见已经一致。",
  },
  hunterRevenge: {
    title: "猎人的身份揭晓！",
    waitingFor: (name) => `${name} 正在选择要带走的对象……`,
    youAre: "你是猎人。可以选择一人一同带走（不选择也没关系）。",
    skip: "谁都不带走",
    submit: "确定",
    submitted: "已提交",
    hostSkipButton: "代替猎人选择「不带走任何人」（房主操作）",
  },
  dayResult: {
    tag: (day) => `清晨 第${day}天`,
    noDeaths: "昨晚无人遇害，是平静的一个清晨。",
    seerResult: "查验结果",
    continueButton: "进入讨论时间",
    waitingHost: "等待房主进入讨论时间…",
  },
  discussion: {
    tag: (day) => `讨论时间 第${day}天`,
    firstRoundTag: "最初的讨论",
    firstRoundNotice: "这是刚确认完角色、还没有人被袭击时的最初讨论。这里不会进行放逐投票。自由讨论之后，房主操作即可进入真正的「夜晚」。",
    proceedToNightButton: "结束讨论，进入夜晚",
    survivors: "生存者",
    dictatorButton: "发动独裁者的权限",
    dictatorConfirmTitle: "要发动独裁者的权限吗？",
    dictatorConfirmDesc: "将强制结束讨论，不经投票，由你独断放逐指定的对象。此能力整局游戏只能使用一次。",
    dictatorConfirmAction: "放逐此人",
    skipButton: "结束讨论，进入投票",
    waitingHost: "等待房主推进。没有时间限制，可以讨论到大家都满意为止。",
    runoffNotice: "由于投票出现平票，这是进入决选投票前的讨论时间。若仍无法决出结果，将随机决定。",
    runoffCandidatesLabel: "决选投票对象",
  },
  vote: {
    tag: (day) => `投票时间 第${day}天`,
    runoffTag: (day) => `决选投票 第${day}天`,
    cannotVote: "你无法投票，请见证结果。",
    instructions: "请选择一名想要放逐的对象",
    runoffNotice: "由于票数相同，这是缩小范围后的决选投票。若仍无法决出结果，将随机决定。",
    submitButton: "投票",
    submittedButton: "已投票（修改）",
    progress: (s, t) => `投票完成：${s} / ${t} 人`,
    forceAdvanceButton: "不等待所有人投票，直接结束（房主操作）",
    voteChoicesTitle: "投票情况（公开设置已开启，所有人可见）",
    voteChoicesLine: (voterName, targetName) => `${voterName} → ${targetName}`,
  },
  executionResult: {
    tag: (day) => `放逐结果 第${day}天`,
    executed: (name) => `${name} 被放逐了`,
    spared: (name) => `经过决选投票，${name} 被留了下来`,
    sparedFirstVoteRule: (name) =>
      `由于设置了「第一次投票不真正放逐」，${name} 未经决选投票便被留了下来`,
    noExecution: "投票结果，无人被放逐。",
    mediumResult: "通灵结果",
    mediumResultLine: (name, isBlack) => `${name} 是${isBlack ? "【黑（狼人）】" : "【白】"}`,
    continueButton: "进入下一个夜晚",
    waitingHost: "等待房主进入下一个夜晚…",
  },
  lastWords: {
    tag: (day) => `临别遗言 第${day}天`,
    title: "投票结果已确定，即将放逐",
    waitingFor: (name) => `请听 ${name} 留下最后的话`,
    youAreTitle: "你被选为了放逐对象",
    youAreDesc: "如果有最后想说的话，请告诉大家。说完后可点击下方按钮继续。",
    proceedButton: "已说完（进入决选投票）",
    waitingHost: "等待本人或房主推进…",
  },
  appealVote: {
    tag: (day) => `生存决选投票 第${day}天`,
    instructions: (name) => `真的要放逐 ${name} 吗？还是留下他/她？`,
    cannotVote: "你无法参加此次决选投票（因为你是被提名放逐的对象）。请见证结果。",
    executeOption: "放逐",
    spareOption: "留下",
    submitButton: "确定",
    submittedButton: "已投票（修改）",
    progress: (s, t) => `投票完成：${s} / ${t} 人`,
    forceAdvanceButton: "不等待所有人投票，直接结束（房主操作）",
  },
  allyNote: {
    title: "仅同伴可见的备忘",
    placeholder: "只传达给同伴的简短留言（例：瞄准3号）",
    hint: "请用简短的话语悄悄传达，避免被周围人察觉。这不是聊天，而是以一张便签的形式共享。",
    groupSize: (n) => `${n}人共享中`,
  },
  gameOver: {
    primary: {
      village: "好人阵营胜利！",
      werewolf: "狼人阵营胜利！",
      draw: "平局",
    },
    extra: {
      fox: "妖狐也生存了下来，单独获胜！",
      god: "神明也生存了下来，单独获胜！",
      lover: "情侣二人都生存了下来，共同获胜！",
    },
    allRoles: "全员角色",
    eliminated: "出局",
    newGameButton: "与相同成员再来一局",
    waitingHost: "等待房主开始下一局…",
    leaveButton: "退出",
    hostEndedTitle: "房主已结束游戏",
    hostEndedDesc: "本局未分胜负，游戏到此结束。",
  },
  confirm: {
    advanceTitle: "要进入下一步吗？",
    advanceDesc: "请确认所有人都已准备好后再继续。此操作无法撤销。",
    advanceAction: "继续",
    forceResolveTitle: "要强制推进吗？",
    forceResolveDesc: "如果还有人尚未行动或投票，将跳过其部分。",
    forceResolveAction: "强制推进",
    newGameTitle: "要与相同成员开始新的一局吗？",
    newGameDesc: "当前结果将被重置，从重新分配角色开始。",
    newGameAction: "开始新的一局",
    skipHunterRevengeTitle: "要跳过猎人带走的机会吗？",
    skipHunterRevengeDesc: "跳过后，猎人将无法带走任何人。",
    skipHunterRevengeAction: "跳过",
    endGameTitle: "要结束游戏吗？",
    endGameDesc: "当前游戏将在此结束，所有人的角色都将被公开。此操作无法撤销。",
    endGameAction: "结束",
  },
  help: {
    button: "玩法说明",
    title: "玩法与规则",
    tldr: "一句话概括：好人们通过讨论找出隐藏在其中的「狼人」，并投票将其放逐的游戏。",
    tabFlow: "流程",
    tabWin: "胜利条件",
    tabRoles: "角色",
    intro:
      "狼人杀DX 是一款分为隐藏身份的「狼人」与想找出狼人的「好人」两方进行的心理游戏。「白天」（讨论与投票）与「夜晚」（各角色的秘密行动）交替进行，当好人放逐所有狼人，或狼人数量达到与好人相同时，游戏结束。确认角色、夜晚行动、投票均在本画面上进行。没有自动计时器，所以可以按房主的操作或所有人都完成操作后，以自己的节奏推进游戏。",
    flowTitle: "游戏流程",
    flowSteps: [
      { title: "确认角色", desc: "所有人偷偷确认自己的角色后，点击「已确认」。请注意不要被周围人看到。所有人都完成之前不会进入下一步。" },
      { title: "最初的讨论", desc: "确认角色后立即进行的自我介绍时间，此时还没有人被袭击，也不进行投票。简单交流后，房主操作即可进入真正的「夜晚」。" },
      { title: "夜晚", desc: "只有狼人、预言家、守卫等拥有能力的角色会悄悄行动，没有能力的人只需静静等待即可。狼人的袭击将从这里正式开始（也可设置第一晚不发生袭击）。" },
      { title: "清晨（结果公布）", desc: "公布夜晚发生了什么（谁遇害了）。" },
      { title: "讨论", desc: "根据夜晚的结果，大家一起推理讨论谁是狼人。没有时间限制，可以讨论到满意为止。" },
      { title: "投票", desc: "选出一名想要放逐的对象进行投票。得票最多的人将被放逐，票数相同则进入决选投票。所有人投票完成后将自动进入结果公布。" },
      { title: "循环", desc: "「夜晚→清晨→讨论→投票」将不断循环，直到某一阵营获胜为止。" },
    ],
    diagramTitle: "夜晚与白天循环图解",
    diagramIntro:
      "「夜晚」与紧随其后的「清晨→讨论→投票」算作同一天。例如「夜晚1」之后的清晨、讨论、投票，都属于「第1天」。",
    diagramDayLabel: (day) => `第${day}天`,
    diagramSameDayNote: "🌙 夜晚 与 ☀️ 白天（清晨・讨论・投票）编号相同即属于同一组。",
    diagramOutcomeLabel: "结局",
    diagramNoRoomNote: "实际设置会因所加入的房间而异。进入房间后，也可以在「配置与设置」标签中查看。",
    diagramSettingsHeading: "本房间的设置",
    winTitle: "胜利条件",
    winIntro: "各阵营的获胜方式各不相同，也可能有多个阵营同时获胜。",
    winVillage: "好人阵营：将狼人全部放逐即可获胜。",
    winWerewolf: "狼人阵营：当狼人数量达到狼人以外生存者数量以上时获胜。",
    winFox: "妖狐：只要存活到游戏结束，无论好人还是狼人获胜都无关，单独获胜。",
    winGod: "神明：只要存活到游戏结束，无论好人还是狼人获胜都无关，单独获胜。",
    winLover: "情侣：游戏结束时两人都存活，则两人一同获胜。",
    rolesTitle: "角色一览（共13种）",
    rolesIntro: "关于自己角色的说明，游戏中随时可以通过画面上方的「我的角色」按钮查看。",
    close: "关闭",
  },
  myRole: {
    button: "我的角色",
    title: "你的角色",
    dayLabel: (day) => (day === 0 ? "确认角色时" : `第${day}天`),
    seerHistoryTitle: "至今查验过的人",
    seerHistoryEmpty: "还没有查验过任何人。",
    mediumHistoryTitle: "至今通灵判定过的人",
    mediumHistoryEmpty: "还没有判定过任何人。",
    noRoleYet: "角色尚未确认。",
    close: "关闭",
  },
  team: {
    village: "好人阵营",
    werewolf: "狼人阵营",
    fox: "妖狐（单独阵营）",
    god: "神明（单独阵营）",
    lover: "情侣（单独阵营）",
  },
  deathCause: {
    attack: "被狼人袭击",
    execution: "被放逐",
    curse: "被预言家查验后诅咒身亡",
    hunter: "被猎人带走",
    lover_grief: "殉情而死",
  },
  roles: {
    villager: {
      name: "平民",
      short: "没有特殊能力的村民",
      detail: "你是平民。没有特殊能力。如果怀疑某人，请在讨论中说出理由，与大家一起推理。",
    },
    seer: {
      name: "预言家",
      short: "每晚查验一人，得知对方是否为狼人",
      detail:
        "你是预言家。每晚可以查验一人，若对方是「狼人」，结果为黑，否则为白。这个结果只有你自己知道，如何在讨论中透露由你自行决定。另外，若查验了妖狐，妖狐将在当晚被诅咒身亡。",
    },
    bodyguard: {
      name: "守卫",
      short: "每晚守护一人，使其免受狼人袭击",
      detail:
        "你是守卫。每晚可以选择自己以外的一人进行守护，使其免受狼人袭击。如果被守护的人正是当晚的袭击目标，该人将存活。不能连续两晚守护同一个人。",
    },
    medium: {
      name: "通灵师",
      short: "得知被放逐者是否为狼人",
      detail: "你是通灵师。白天被放逐的玩家是否为「狼人」，你会在当晚得知结果。第1天晚上由于还没有人被放逐，没有判定对象。",
    },
    hunter: {
      name: "猎人",
      short: "自己死亡时，可以带走一人",
      detail:
        "你是猎人。当你「被放逐」或「被狼人袭击」而死亡时，可以指定一人一同带走（不指定也可以）。你不需要主动公开自己的角色。",
    },
    mason: {
      name: "共知者",
      short: "两人以上彼此知道对方身份的村民",
      detail: "你是共知者，知道其他共知者是谁。虽然没有特殊能力，但你们之间可以做到百分之百互相信任，是宝贵的同伴。请谨慎选择公开身份的时机，以免被狼人怀疑。",
    },
    dictator: {
      name: "独裁者",
      short: "整局限一次，可打断讨论并独断决定放逐对象",
      detail:
        "你是独裁者。整局游戏中只能使用一次：可以在白天讨论时公开身份，强制结束讨论，不经投票、由你独断决定要放逐的对象。这是十分强大的能力，请谨慎判断使用时机。",
    },
    werewolf: {
      name: "狼人",
      short: "每晚袭击一人，可识别其他狼人",
      detail:
        "你是狼人，知道同伴狼人是谁。请每晚与同伴商量后袭击一人。讨论时请伪装成好人，隐藏身份，当狼人数量与好人数量相同时即可获胜。",
    },
    traitor: {
      name: "叛徒",
      short: "属于狼人阵营，但不知道谁是狼人",
      detail:
        "你是叛徒。狼人阵营获胜你也随之获胜，但你并不知道谁是狼人。被预言家或通灵师查验时也会判定为「白（非狼人）」，因此不容易被怀疑。请一边假装寻找狼人，一边不动声色地做出有利于狼人阵营的行动（与内应不同，你自己并不知道狼人都有谁）。",
    },
    insider: {
      name: "内应",
      short: "知道狼人身份，暗中协助狼人阵营的伪装者",
      detail:
        "你是内应，知道谁是狼人。被预言家或通灵师查验时也会判定为「白（非狼人）」，在狼人阵营中尤其不容易被怀疑。如果过于明显地包庇狼人会引起怀疑，所以请伪装成好人，不动声色地提供帮助（与叛徒不同，你知道狼人都有谁）。",
    },
    fox: {
      name: "妖狐",
      short: "不会被狼人袭击杀死的单独阵营，但被查验会死亡",
      detail:
        "你是妖狐，既不属于好人也不属于狼人，是单独行动的阵营，不会因狼人的袭击而死亡。但如果被预言家查验，你将在当晚被诅咒身亡。无论好人还是狼人获胜，只要你在游戏结束时存活，就是你的胜利。",
    },
    god: {
      name: "神明",
      short: "从一开始就知道所有人角色的单独阵营，存活即可获胜",
      detail:
        "你是神明。从游戏开始起就知道所有玩家的角色。被预言家或通灵师查验时会判定为「白」。无论好人还是狼人获胜，只要你在游戏结束时存活，就是你的胜利。",
    },
    lover: {
      name: "情侣",
      short: "两人一组，一方死亡另一方也会殉情的单独阵营",
      detail:
        "你是情侣，知道另一位情侣是谁。当其中一人因放逐或袭击而死亡时，另一人也会随之殉情死亡。若游戏结束时两人都存活，则两人一同获胜。",
    },
  },
  errors: {
    ROOM_NOT_FOUND: "找不到该房间，请确认暗号是否正确。",
    GAME_ALREADY_STARTED: "游戏已经开始，无法加入。",
    ROOM_FULL: "参与人数已达上限。",
    REJOIN_FAILED: "重新连接失败。",
    PLAYER_NOT_FOUND: "找不到玩家信息。",
    NOT_HOST: "此操作只有房主可以执行。",
    ALREADY_STARTED: "游戏已经开始。",
    NOT_IN_ROOM: "你尚未加入任何房间。",
    MIN_PLAYERS: "参与人数不足。",
    KICKED: "你已被房主移出房间。",
    INVALID_ROOM_CODE: "房间号请输入5〜8位英文数字。",
    ROOM_CODE_TAKEN: "该房间号已被使用，请尝试其他号码。",
  },
  validation: (issue) => {
    switch (issue.code) {
      case "SEAT_MISMATCH":
        return `角色总人数（${issue.total}人）与参与人数（${issue.playerCount}人）不一致。`;
      case "NO_WEREWOLF":
        return "至少需要1名狼人。";
      case "MASON_ODD":
        return "共知者请以2人为一组进行设置。";
      case "LOVER_INVALID":
        return "情侣请以2人为一组进行设置。";
      case "WOLF_TOO_MANY":
        return "狼人阵营人数过多，好人阵营从一开始就会处于劣势。";
    }
  },
};

const es: Strings = {
  meta: {
    title: "Los Hombres Lobo DX Online",
    description: "Un juego de deducción social para 13 roles: encuentra a los hombres lobo ocultos hablando y razonando con tu grupo. Se juega en persona, con el móvil como mando.",
  },
  common: {
    host: "Anfitrión",
    connected: "Conectado",
    disconnected: "Desconectado",
    reconnecting: "Reconectando…",
    connecting: "Conectando…",
    kicked: "El anfitrión te ha expulsado de la sala.",
    seconds: (n) => `${n} s`,
    timeRemaining: "Tiempo restante",
    close: "Cerrar",
    cancel: "Cancelar",
    people: (n) => `${n} ${n === 1 ? "jugador" : "jugadores"}`,
    listSeparator: ", ",
    confirmProceed: "Continuar",
    transitioning: "Pasando a la siguiente pantalla…",
    on: "SÍ",
    off: "NO",
    themeToggleToLight: "Cambiar a modo claro",
    themeToggleToDark: "Cambiar a modo oscuro",
    menu: "Menú",
    themeLabel: "Tema",
    languageLabel: "Idioma",
    endGameButton: "Terminar la partida",
    officialRuleBadge: "Regla oficial",
    optionalRuleBadge: "Regla opcional",
  },
  entry: {
    title: "Los Hombres Lobo DX Online",
    subtitle: "Un juego de deducción social para 13 roles: encuentra a los hombres lobo ocultos hablando y razonando con tu grupo. Jugad donde queráis, con el móvil como mando.",
    cardTitle: "Empezar",
    cardDesc: "Crea una sala o únete con un código.",
    tabCreate: "Crear sala",
    tabJoin: "Unirse a una sala",
    nameLabel: "Apodo",
    namePlaceholder: "Ej.: Carlos",
    createButton: "Crear sala",
    codeLabel: "Código de sala",
    codePlaceholder: "Ej.: AB3XZ",
    joinButton: "Unirse",
    footerNote: "* Esta app no tiene chat. Jugad hablando en persona.",
    helpButton: "Ver reglas y cómo jugar",
    customCodeLabel: "Código de sala (opcional)",
    customCodePlaceholder: "Déjalo en blanco para generarlo automáticamente",
    customCodeHint: "De 5 a 8 caracteres alfanuméricos. Si no lo indicas, se generará uno automáticamente.",
    avatarLabel: "Foto de perfil (opcional)",
    avatarAddButton: "Añadir foto",
    avatarChangeButton: "Cambiar foto",
    avatarRemoveButton: "Quitar foto",
    avatarTooLarge: "La imagen es demasiado grande (máximo 8 MB)",
    avatarUnsupported: "Selecciona un archivo de imagen",
    castLabel: "Los 13 roles del juego",
  },
  profile: {
    editButton: "Editar perfil",
    title: "Editar perfil",
    desc: "Puedes cambiar tu nombre y tu foto de perfil en cualquier momento.",
    nameLabel: "Apodo",
    avatarLabel: "Foto de perfil",
    saveButton: "Guardar",
    savedToast: "Perfil actualizado",
    closeButton: "Cerrar",
  },
  lobby: {
    codeLabel: "Código de sala",
    copyCode: "Copiar código",
    copyLink: "Copiar enlace de invitación",
    shareLink: "Enviar enlace de invitación",
    shareMessage: (code) => `Te han invitado a una sala de Los Hombres Lobo DX Online. Código: ${code}`,
    copyCodeToast: "Código copiado",
    copyLinkToast: "Enlace de invitación copiado",
    copyErrorToast: "No se ha podido copiar",
    participants: (n) => `Participantes (${n})`,
    waitingForMorePlayers: (n) => `Faltan ${n} jugadores para poder empezar`,
    composition: "Reparto de roles",
    compositionReadonly: "Reparto de roles (el anfitrión lo está configurando)",
    compositionReadonlyDesc: (wolves, total) => `Se ha configurado un reparto de ${total} roles en total, incluyendo ${wolves} hombres lobo.`,
    compositionEmpty: "Todavía no se ha configurado el reparto de roles.",
    roomInfoButton: "Reparto y ajustes",
    roomInfoTitle: "Reparto y ajustes de esta partida",
    suggest: "Reparto sugerido",
    seatTotal: "Total de roles",
    seatTotalOf: (total, count) => `${total} / ${count} jugadores`,
    soloGroupLabel: "Bandos en solitario",
    startButton: "Empezar partida",
    waitingHost: "Esperando a que el anfitrión empiece la partida…",
    leaveButton: "Salir",
    settingsTitle: "Ajustes de la partida",
    officialRulesSectionTitle: "Reglas básicas",
    extraRulesSectionTitle: "Reglas adicionales",
    extraRulesSectionDesc: "A partir de aquí encontrarás reglas ampliadas propias de esta app. No forman parte de las reglas básicas, así que puedes personalizarlas libremente para adaptarlas a vuestro grupo.",
    revealOnDeath: "Revelar el rol al morir",
    allowFirstNightKill: "La primera noche, los hombres lobo pueden atacar",
    allowFirstNightKillDesc: "Si lo desactivas, nadie muere aunque los hombres lobo ataquen la primera noche (la noche del día 1). Se recomienda para grupos con muchos jugadores nuevos. A partir de la segunda noche, el ataque funciona con normalidad.",
    allowFirstVoteExecution: "La primera votación puede eliminar de verdad",
    allowFirstVoteExecutionDesc: "Si lo desactivas, nadie es eliminado de verdad en la primera votación (la del día 1), sea quien sea el más votado. A partir de la segunda votación, la eliminación funciona con normalidad.",
    allowWolfFriendlyFire: "Los hombres lobo pueden atacar a otro hombre lobo",
    allowWolfFriendlyFireDesc: "Si lo activas, los hombres lobo podrán elegir a otro hombre lobo como objetivo del ataque (normalmente no pueden).",
    seerFirstNightDivine: "La vidente puede investigar a alguien al confirmar su rol",
    seerFirstNightDivineDesc: "Al confirmar los roles, la vidente puede investigar libremente a una persona (se recomienda con 7 jugadores o más). La vidente decide si quiere hacerlo o no. Si está desactivado, las investigaciones empiezan la primera noche.",
    allowSelfVote: "Se puede votar por uno mismo",
    revealVoteChoices: "Mostrar los votos a todo el mundo",
    revealVoteChoicesDesc: "Si lo activas, durante la votación todos podrán ver en tiempo real quién vota a quién. Si está desactivado, como hasta ahora, solo se hace público el recuento de votos.",
    allowBodyguardSelfGuard: "El guardaespaldas puede protegerse a sí mismo",
    secondTieExecutesRandomly: "Si hay empate también en la segunda vuelta, eliminar a alguien al azar",
    secondTieExecutesRandomlyDesc: "Si lo desactivas, cuando la segunda vuelta también termine en empate, ese día acabará sin ninguna eliminación.",
    dictatorCanTargetSelf: "El dictador puede elegirse a sí mismo para la eliminación",
    settingsPacingNote: "Esta app no tiene temporizador automático. Cada pantalla avanza cuando el anfitrión lo indica o cuando todos han completado su acción. Jugad al ritmo que os resulte más cómodo.",
    kick: "Expulsar",
    makeHost: "Nombrar anfitrión",
    makeHostConfirmTitle: "¿Cambiar de anfitrión?",
    makeHostConfirmDesc: (name) => `${name} se convertirá en el nuevo anfitrión. Perderás los permisos de anfitrión y ya no podrás controlar el avance de la partida.`,
    makeHostConfirmAction: "Cambiar",
  },
  roleReveal: {
    label: "Tu rol",
    tapToReveal: "Toca para revelar",
    privacyHint: "Comprueba tu rol sin que nadie más lo vea",
    allies: "Tus aliados",
    allRoles: "Roles de todos los jugadores",
    waitingOthers: "Has confirmado tu rol. En cuanto todos lo hayan hecho, se pasará automáticamente a la primera ronda de conversación.",
    confirmButton: "Confirmado",
    progress: (s, t) => `Confirmado: ${s} / ${t}`,
    earlyDivineTitle: "Usa el poder de la vidente ahora mismo (opcional)",
    earlyDivineDesc: "Al confirmar tu rol, puedes investigar a una persona. También puedes continuar sin usar este poder.",
    earlyDivineButton: "Investigar a esta persona",
    earlyDivineSkipNote: "También puedes pulsar «Confirmado» sin investigar a nadie.",
    earlyDivineDone: "Ya has investigado. Este es el resultado.",
  },
  night: {
    tag: (day) => `Noche ${day}`,
    deadNotice: "Ya has sido eliminado. Observa en silencio cómo amanece…",
    dormant: "Cae la noche…",
    dormantDesc: "Espera a que los jugadores con poderes terminen sus acciones.",
    progress: (s, t) => `Acciones completadas: ${s} / ${t}`,
    submitButton: "Confirmar",
    resubmitButton: "Enviado (cambiar)",
    previousSeerResult: (day) =>
      day === 0 ? "Resultado de la investigación anterior (al confirmar tu rol)" : `Resultado de la investigación anterior (día ${day})`,
    seerResultLine: (name, isBlack) => `${name} era ${isBlack ? "【negro (hombre lobo)】" : "【blanco】"}`,
    actions: {
      attack: { title: "¿A quién queréis atacar?", desc: "Poneos de acuerdo con los demás hombres lobo y elegid a quién atacar esta noche.", skip: "No atacar esta noche" },
      guard: { title: "¿A quién quieres proteger?", desc: "Elige a la persona que protegerás del ataque de los hombres lobo. No puedes protegerte a ti mismo. Tampoco puedes elegir a quien protegiste la noche anterior.", skip: "No proteger a nadie esta noche" },
      divine: { title: "¿A quién quieres investigar?", desc: "Descubrirás si esa persona es un hombre lobo o no.", skip: "No investigar esta noche" },
    },
    firstNightKillDisabledNotice: "Según los ajustes de la partida, nadie muere aunque los hombres lobo ataquen la primera noche (día 1). A partir de la segunda noche, el ataque tiene efecto con normalidad.",
    forceAdvanceButton: "Avanzar sin esperar a todos (acción del anfitrión)",
    wolfSelectionsTitle: "A quién están eligiendo los demás hombres lobo (para poneros de acuerdo)",
    wolfSelectionsEmpty: "Todavía nadie ha elegido a nadie",
    wolfSelectionsLine: (name, targetName) => `${name}: ${targetName ?? "sin elegir"}`,
    wolfConsensusNeeded: "La noche no terminará hasta que todos los hombres lobo elijáis al mismo objetivo (o todos optéis por «no atacar»). Poneos de acuerdo entre vosotros.",
    wolfConsensusReached: "Todos estáis de acuerdo.",
  },
  hunterRevenge: {
    title: "¡Se ha revelado quién era el cazador!",
    waitingFor: (name) => `${name} está eligiendo a quién llevarse por delante…`,
    youAre: "Eres el cazador. Puedes elegir a una persona para llevártela contigo (también puedes no elegir a nadie).",
    skip: "No llevarse a nadie",
    submit: "Confirmar",
    submitted: "Enviado",
    hostSkipButton: "Decidir «no llevarse a nadie» en lugar del cazador (acción del anfitrión)",
  },
  dayResult: {
    tag: (day) => `Amanecer del día ${day}`,
    noDeaths: "Anoche no hubo ninguna víctima. Una mañana tranquila.",
    seerResult: "Resultado de la investigación",
    continueButton: "Pasar a la conversación",
    waitingHost: "Esperando a que el anfitrión pase a la conversación…",
  },
  discussion: {
    tag: (day) => `Conversación del día ${day}`,
    firstRoundTag: "Primera conversación",
    firstRoundNotice: "Esta es la primera conversación, justo después de confirmar los roles. Todavía no ha habido ningún ataque, así que aquí tampoco se vota. Charlad con libertad y, cuando el anfitrión lo indique, pasaréis a la noche de verdad.",
    proceedToNightButton: "Terminar la conversación y pasar a la noche",
    survivors: "Supervivientes",
    dictatorButton: "Usar el poder del dictador",
    dictatorConfirmTitle: "¿Usar el poder del dictador?",
    dictatorConfirmDesc: "Cortarás la conversación de golpe y decidirás por tu cuenta, sin votación, a quién eliminar. Solo puedes usar este poder una vez por partida.",
    dictatorConfirmAction: "Eliminar a esta persona",
    skipButton: "Terminar la conversación y pasar a la votación",
    waitingHost: "Esperando a que el anfitrión continúe. No hay límite de tiempo, así que hablad todo lo que necesitéis.",
    runoffNotice: "La votación quedó empatada, así que esta es la conversación previa a la segunda vuelta. Si sigue sin decidirse, se elegirá al azar.",
    runoffCandidatesLabel: "Candidatos a la segunda vuelta",
  },
  vote: {
    tag: (day) => `Votación del día ${day}`,
    runoffTag: (day) => `Segunda vuelta del día ${day}`,
    cannotVote: "No puedes votar. Observa cómo se desarrolla el resultado.",
    instructions: "Elige a una persona para eliminar",
    runoffNotice: "Hubo un empate, así que esta es una segunda vuelta entre los candidatos. Si sigue sin decidirse, se elegirá al azar.",
    submitButton: "Votar",
    submittedButton: "Votado (cambiar)",
    progress: (s, t) => `Votos emitidos: ${s} / ${t}`,
    forceAdvanceButton: "Cerrar la votación sin esperar a todos (acción del anfitrión)",
    voteChoicesTitle: "Estado de la votación (visible para todos porque está activada esta opción)",
    voteChoicesLine: (voter, target) => `${voter} → ${target}`,
  },
  executionResult: {
    tag: (day) => `Resultado de la eliminación del día ${day}`,
    executed: (name) => `${name} ha sido eliminado`,
    spared: (name) => `Tras la segunda vuelta, ${name} se ha salvado`,
    sparedFirstVoteRule: (name) =>
      `Como esta partida tiene activada la regla de que la primera votación no elimina de verdad, ${name} se ha salvado sin necesidad de segunda vuelta`,
    noExecution: "Según el resultado de la votación, nadie ha sido eliminado.",
    mediumResult: "Resultado del médium",
    mediumResultLine: (name, isBlack) => `${name} era ${isBlack ? "【negro (hombre lobo)】" : "【blanco】"}`,
    continueButton: "Pasar a la siguiente noche",
    waitingHost: "Esperando a que el anfitrión pase a la siguiente noche…",
  },
  lastWords: {
    tag: (day) => `Últimas palabras del día ${day}`,
    title: "La votación ha decidido una eliminación",
    waitingFor: (name) => `Escuchemos las últimas palabras de ${name}`,
    youAreTitle: "Has sido elegido para ser eliminado",
    youAreDesc: "Si quieres decir algo antes de irte, es tu momento. Cuando termines, continúa con el botón de abajo.",
    proceedButton: "He terminado (pasar a la segunda vuelta)",
    waitingHost: "Esperando a que esta persona o el anfitrión continúen…",
  },
  appealVote: {
    tag: (day) => `Segunda vuelta de supervivencia del día ${day}`,
    instructions: (name) => `¿De verdad queréis eliminar a ${name}, o preferís salvarlo?`,
    cannotVote: "No puedes participar en esta segunda vuelta (eres el candidato a eliminación). Observa cómo se desarrolla el resultado.",
    executeOption: "Eliminar",
    spareOption: "Salvar",
    submitButton: "Confirmar",
    submittedButton: "Votado (cambiar)",
    progress: (s, t) => `Votos emitidos: ${s} / ${t}`,
    forceAdvanceButton: "Cerrar la votación sin esperar a todos (acción del anfitrión)",
  },
  allyNote: {
    title: "Nota solo para tu grupo",
    placeholder: "Un mensaje breve solo para tus aliados (ej.: «apuntad al número 3»)",
    hint: "Comunicaos con mensajes cortos y discretos, sin que los demás se den cuenta. No es un chat, se comparte como una única nota.",
    groupSize: (n) => `Compartida entre ${n} personas`,
  },
  gameOver: {
    primary: {
      village: "¡Victoria del bando de los aldeanos!",
      werewolf: "¡Victoria del bando de los hombres lobo!",
      draw: "Empate",
    },
    extra: {
      fox: "¡El zorro también sobrevive y gana en solitario!",
      god: "¡El dios también sobrevive y gana en solitario!",
      lover: "¡Los dos enamorados sobreviven y ganan juntos!",
    },
    allRoles: "Roles de todos los jugadores",
    eliminated: "Eliminado",
    newGameButton: "Jugar otra vez con el mismo grupo",
    waitingHost: "Esperando a que el anfitrión empiece la siguiente partida…",
    leaveButton: "Salir",
    hostEndedTitle: "El anfitrión ha terminado la partida",
    hostEndedDesc: "La partida ha terminado aquí sin que se decidiera un ganador.",
  },
  confirm: {
    advanceTitle: "¿Continuar?",
    advanceDesc: "Asegúrate de que todos están listos antes de continuar. Esta acción no se puede deshacer.",
    advanceAction: "Continuar",
    forceResolveTitle: "¿Forzar el avance?",
    forceResolveDesc: "Si alguien todavía no ha actuado o votado, se omitirá su turno.",
    forceResolveAction: "Forzar el avance",
    newGameTitle: "¿Empezar una nueva partida con el mismo grupo?",
    newGameDesc: "El resultado actual se reiniciará y se repartirán los roles de nuevo desde el principio.",
    newGameAction: "Empezar nueva partida",
    skipHunterRevengeTitle: "¿Omitir el turno del cazador?",
    skipHunterRevengeDesc: "Si lo omites, el cazador no podrá llevarse a nadie por delante.",
    skipHunterRevengeAction: "Omitir",
    endGameTitle: "¿Terminar la partida?",
    endGameDesc: "La partida actual terminará aquí y se revelarán los roles de todos. Esta acción no se puede deshacer.",
    endGameAction: "Terminar",
  },
  help: {
    button: "Cómo jugar",
    title: "Cómo jugar y reglas",
    tldr: "En pocas palabras: los aldeanos deben descubrir, hablando y razonando, quiénes son los hombres lobo ocultos entre ellos, y eliminarlos por votación.",
    tabFlow: "Desarrollo",
    tabWin: "Condiciones de victoria",
    tabRoles: "Roles",
    intro:
      "Los Hombres Lobo DX es un juego de deducción social en el que los «hombres lobo» ocultos se enfrentan a los «aldeanos» que intentan descubrirlos. Se alternan el «día» (conversación y votación) y la «noche» (acciones secretas según el rol de cada uno) hasta que los aldeanos eliminan a todos los hombres lobo o el número de hombres lobo iguala al de los demás jugadores vivos. La confirmación de roles, las acciones nocturnas y las votaciones se hacen todas desde esta pantalla. No hay temporizador automático, así que la partida avanza al ritmo que marquéis vosotros, según las acciones del anfitrión o de todo el grupo.",
    flowTitle: "Desarrollo de la partida",
    flowSteps: [
      { title: "Confirmación de roles", desc: "Todos comprueban en privado cuál es su rol y pulsan «Confirmado». Ten cuidado de que nadie más lo vea. No se avanza hasta que todos hayan confirmado." },
      { title: "Primera conversación", desc: "Justo después de confirmar los roles, hay un momento de presentación en el que todavía no ha habido ningún ataque. No se vota. Tras charlar un poco, el anfitrión hará avanzar la partida hacia la noche de verdad." },
      { title: "Noche", desc: "Solo actúan en secreto los roles con poderes, como los hombres lobo, la vidente o el guardaespaldas. Quien no tenga poderes simplemente espera sin hacer nada. Aquí es cuando ocurre el primer ataque de los hombres lobo (aunque también existe la opción de desactivar el ataque solo la primera noche)." },
      { title: "Amanecer (resultados)", desc: "Se anuncia lo ocurrido durante la noche: quién ha sido la víctima, si la hay." },
      { title: "Conversación", desc: "A partir de lo ocurrido por la noche, deducid juntos quiénes podrían ser los hombres lobo. No hay límite de tiempo, así que hablad todo lo que necesitéis." },
      { title: "Votación", desc: "Cada uno elige a una persona para eliminar. Gana el más votado; en caso de empate, hay una segunda vuelta. En cuanto todos hayan votado, se pasa automáticamente al resultado." },
      { title: "Repetición", desc: "El ciclo «noche → amanecer → conversación → votación» se repite hasta que un bando consigue la victoria." },
    ],
    diagramTitle: "El ciclo de noche y día en un vistazo",
    diagramIntro:
      "Cada «noche» y el «amanecer → conversación → votación» que la sigue se cuentan juntos como un mismo día. Por ejemplo, el amanecer, la conversación y la votación que siguen a la «noche 1» forman todos parte del «día 1».",
    diagramDayLabel: (day) => `Día ${day}`,
    diagramSameDayNote: "🌙 La noche y ☀️ el día (amanecer, conversación y votación) forman un mismo bloque cuando comparten número.",
    diagramOutcomeLabel: "Desenlace",
    diagramNoRoomNote: "Los ajustes concretos dependen de la sala a la que te hayas unido. Una vez dentro, también puedes consultarlos en la pestaña «Reparto y ajustes».",
    diagramSettingsHeading: "Ajustes de esta sala",
    winTitle: "Condiciones de victoria",
    winIntro: "La forma de ganar varía según el bando. Es posible que varios bandos ganen a la vez.",
    winVillage: "Bando de los aldeanos: gana si consigue eliminar a todos los hombres lobo, sin excepción.",
    winWerewolf: "Bando de los hombres lobo: gana cuando el número de hombres lobo es igual o mayor que el de los demás supervivientes.",
    winFox: "Zorro: si sobrevive hasta el final de la partida, gana en solitario, gane el bando que gane entre aldeanos y hombres lobo.",
    winGod: "Dios: si sobrevive hasta el final de la partida, gana en solitario, gane el bando que gane entre aldeanos y hombres lobo.",
    winLover: "Enamorados: si ambos siguen vivos al terminar la partida, ganan juntos.",
    rolesTitle: "Lista de roles (13 tipos)",
    rolesIntro: "Puedes consultar la descripción de tu propio rol en cualquier momento de la partida desde el botón «Mi rol», en la parte superior de la pantalla.",
    close: "Cerrar",
  },
  myRole: {
    button: "Mi rol",
    title: "Tu rol",
    dayLabel: (day) => (day === 0 ? "Al confirmar el rol" : `Día ${day}`),
    seerHistoryTitle: "Personas investigadas hasta ahora",
    seerHistoryEmpty: "Todavía no has investigado a nadie.",
    mediumHistoryTitle: "Personas comprobadas hasta ahora",
    mediumHistoryEmpty: "Todavía no has comprobado a nadie.",
    noRoleYet: "Aún no se ha confirmado ningún rol.",
    close: "Cerrar",
  },
  team: {
    village: "Bando de los aldeanos",
    werewolf: "Bando de los hombres lobo",
    fox: "Zorro (bando en solitario)",
    god: "Dios (bando en solitario)",
    lover: "Enamorados (bando en solitario)",
  },
  deathCause: {
    attack: "Atacado por los hombres lobo",
    execution: "Eliminado por votación",
    curse: "Maldecido tras ser investigado por la vidente",
    hunter: "Llevado por el cazador",
    lover_grief: "Murió de pena tras la muerte de su pareja",
  },
  roles: {
    villager: {
      name: "Aldeano",
      short: "Habitante del pueblo sin poderes especiales",
      detail: "Eres un aldeano. No tienes ningún poder especial. Si sospechas de alguien, comparte tus razones con el grupo durante la conversación y ayuda a avanzar en la deducción.",
    },
    seer: {
      name: "Vidente",
      short: "Investiga a una persona cada noche para saber si es un hombre lobo",
      detail:
        "Eres la vidente. Cada noche puedes investigar a una persona. Si es un hombre lobo, el resultado será negro; en cualquier otro caso, será blanco. Nadie más puede ver este resultado, así que cómo lo compartas durante la conversación depende de ti. Ten en cuenta que, si investigas al zorro, este morirá maldecido esa misma noche.",
    },
    bodyguard: {
      name: "Guardaespaldas",
      short: "Cada noche protege a una persona del ataque de los hombres lobo",
      detail:
        "Eres el guardaespaldas. Cada noche eliges a alguien, aparte de ti mismo, para protegerlo del ataque de los hombres lobo. Si la persona que proteges es el objetivo del ataque esa noche, sobrevivirá. No puedes proteger a la misma persona dos noches seguidas.",
    },
    medium: {
      name: "Médium",
      short: "Descubre si la persona eliminada por votación era un hombre lobo",
      detail: "Eres el médium. Cada noche puedes descubrir si el jugador eliminado por votación durante el día era un hombre lobo. La primera noche, como todavía no se ha eliminado a nadie, no hay a quién comprobar.",
    },
    hunter: {
      name: "Cazador",
      short: "Cuando muere, puede llevarse a alguien consigo",
      detail:
        "Eres el cazador. Cuando seas «eliminado por votación» o mueras «atacado por los hombres lobo», podrás elegir a una persona para llevártela contigo (también puedes no elegir a nadie). No necesitas revelar tu rol por tu cuenta.",
    },
    mason: {
      name: "Comunero",
      short: "Dos o más aldeanos que se conocen entre sí",
      detail: "Eres comunero. Sabes quiénes son los demás comuneros. No tienes ningún poder especial, pero contáis con la ventaja de poder confiar plenamente los unos en los otros. Elegid con cuidado el momento de revelar vuestra identidad, para no despertar las sospechas de los hombres lobo.",
    },
    dictator: {
      name: "Dictador",
      short: "Una vez por partida, corta la conversación y decide una eliminación por su cuenta",
      detail:
        "Eres el dictador. Una vez por partida, durante la conversación del día, puedes revelar tu identidad para cortar la conversación de golpe y decidir por tu cuenta, sin votación, a quién eliminar. Es un poder muy fuerte, así que elige con cuidado el momento de usarlo.",
    },
    werewolf: {
      name: "Hombre Lobo",
      short: "Ataca a una persona cada noche. Conoce a los demás hombres lobo",
      detail:
        "Eres un hombre lobo. Sabes quiénes son tus compañeros hombres lobo. Cada noche, poneos de acuerdo entre vosotros y atacad a una persona. Durante la conversación, finge ser un aldeano para ocultar tu identidad. Ganáis cuando el número de hombres lobo iguala al de los demás supervivientes.",
    },
    traitor: {
      name: "Traidor",
      short: "Pertenece al bando de los hombres lobo, pero no sabe quiénes son",
      detail:
        "Eres el traidor. Ganas si vence el bando de los hombres lobo, pero no sabes quiénes son. Tanto la vidente como el médium te verán como «blanco (no eres un hombre lobo)», así que es difícil que sospechen de ti. Finge que buscas a los hombres lobo mientras, discretamente, favoreces a su bando (a diferencia del infiltrado, tú no sabes quiénes son los hombres lobo).",
    },
    insider: {
      name: "Infiltrado",
      short: "Conoce a los hombres lobo y colabora en secreto con ellos",
      detail:
        "Eres el infiltrado. Sabes quiénes son los hombres lobo. Tanto la vidente como el médium te verán como «blanco (no eres un hombre lobo)», por lo que, dentro del bando de los hombres lobo, eres quien menos sospechas despierta. Si defiendes a los hombres lobo demasiado abiertamente, levantarás sospechas, así que ayúdalos con disimulo mientras finges ser un aldeano (a diferencia del traidor, tú sí sabes quiénes son los hombres lobo).",
    },
    fox: {
      name: "Zorro",
      short: "Bando en solitario inmune al ataque de los hombres lobo, pero muere si la vidente lo investiga",
      detail:
        "Eres el zorro. No perteneces ni al bando de los aldeanos ni al de los hombres lobo, y no mueres si te atacan los hombres lobo. Sin embargo, si la vidente te investiga, morirás maldecido esa misma noche. Ganas si sigues con vida al final de la partida, sin importar qué bando venza entre los aldeanos y los hombres lobo.",
    },
    god: {
      name: "Dios",
      short: "Bando en solitario que conoce el rol de todos. Gana si sobrevive",
      detail:
        "Eres el dios. Desde el inicio de la partida conoces el rol de todos los jugadores. Tanto la vidente como el médium te verán como «blanco». Ganas si sigues con vida al final de la partida, sin importar qué bando venza entre los aldeanos y los hombres lobo.",
    },
    lover: {
      name: "Enamorado",
      short: "Forma pareja con otro jugador. Si su pareja muere, él también muere",
      detail:
        "Eres uno de los enamorados. Sabes quién es tu pareja. Si uno de los dos muere, ya sea eliminado por votación o atacado, el otro morirá de pena poco después. Si ambos siguen con vida al final de la partida, ganáis los dos juntos.",
    },
  },
  errors: {
    ROOM_NOT_FOUND: "No se ha encontrado la sala. Comprueba el código.",
    GAME_ALREADY_STARTED: "No puedes unirte porque la partida ya ha empezado.",
    ROOM_FULL: "Se ha alcanzado el número máximo de participantes.",
    REJOIN_FAILED: "No se ha podido reconectar.",
    PLAYER_NOT_FOUND: "No se ha encontrado la información del jugador.",
    NOT_HOST: "Solo el anfitrión puede hacer esto.",
    ALREADY_STARTED: "La partida ya ha empezado.",
    NOT_IN_ROOM: "No estás en ninguna sala.",
    MIN_PLAYERS: "No hay suficientes jugadores.",
    KICKED: "El anfitrión te ha expulsado de la sala.",
    INVALID_ROOM_CODE: "El código de sala debe tener de 5 a 8 caracteres alfanuméricos.",
    ROOM_CODE_TAKEN: "Ese código de sala ya está en uso. Prueba con otro.",
  },
  validation: (issue) => {
    switch (issue.code) {
      case "SEAT_MISMATCH":
        return `El total de roles asignados (${issue.total}) no coincide con el número de jugadores (${issue.playerCount}).`;
      case "NO_WEREWOLF":
        return "Debe haber al menos un hombre lobo.";
      case "MASON_ODD":
        return "Los comuneros deben configurarse en parejas.";
      case "LOVER_INVALID":
        return "Los enamorados deben configurarse en parejas.";
      case "WOLF_TOO_MANY":
        return "Hay demasiados hombres lobo. El bando de los aldeanos partiría en desventaja desde el principio.";
    }
  },
};

const fr: Strings = {
  meta: {
    title: "Loup-Garou DX en ligne",
    description: "Un jeu d'ambiance et de déduction où les villageois traquent les loups-garous cachés parmi eux, à la conversation et à l'intuition. 13 rôles disponibles, jouable entre amis avec juste un smartphone.",
  },
  common: {
    host: "Hôte",
    connected: "Connecté",
    disconnected: "Déconnecté",
    reconnecting: "Reconnexion…",
    connecting: "Connexion en cours…",
    kicked: "Vous avez été expulsé de la partie par l'hôte.",
    seconds: (n) => `${n} s`,
    timeRemaining: "Temps restant",
    close: "Fermer",
    cancel: "Annuler",
    people: (n) => (n > 1 ? `${n} joueurs` : `${n} joueur`),
    listSeparator: ", ",
    confirmProceed: "Continuer",
    transitioning: "Passage à la suite…",
    on: "Activé",
    off: "Désactivé",
    themeToggleToLight: "Passer au mode clair",
    themeToggleToDark: "Passer au mode sombre",
    menu: "Menu",
    themeLabel: "Thème",
    languageLabel: "Langue",
    endGameButton: "Terminer la partie",
    officialRuleBadge: "Règle officielle",
    optionalRuleBadge: "Règle optionnelle",
  },
  entry: {
    title: "Loup-Garou DX en ligne",
    subtitle: "Un jeu d'ambiance et de déduction où les villageois traquent les loups-garous cachés parmi eux, à la conversation et à l'intuition. 13 rôles disponibles, jouable où que vous soyez avec juste un smartphone.",
    cardTitle: "Commencer",
    cardDesc: "Créez une partie ou rejoignez-en une avec un code.",
    tabCreate: "Créer une partie",
    tabJoin: "Rejoindre une partie",
    nameLabel: "Pseudo",
    namePlaceholder: "ex. : Julie",
    createButton: "Créer la partie",
    codeLabel: "Code de la partie",
    codePlaceholder: "ex. : AB3XZ",
    joinButton: "Rejoindre",
    footerNote: "※ Cette application n'a pas de fonction de chat. Discutez de vive voix pendant la partie.",
    helpButton: "Voir les règles du jeu",
    customCodeLabel: "Code de partie personnalisé (facultatif)",
    customCodePlaceholder: "Laissez vide pour une génération automatique",
    customCodeHint: "5 à 8 caractères alphanumériques. Un code sera généré automatiquement si vous ne précisez rien.",
    avatarLabel: "Photo de profil (facultatif)",
    avatarAddButton: "Ajouter une photo",
    avatarChangeButton: "Changer la photo",
    avatarRemoveButton: "Supprimer la photo",
    avatarTooLarge: "L'image est trop volumineuse (8 Mo maximum)",
    avatarUnsupported: "Veuillez sélectionner un fichier image",
    castLabel: "Les 13 rôles du jeu",
  },
  profile: {
    editButton: "Modifier le profil",
    title: "Modifier le profil",
    desc: "Vous pouvez changer votre nom affiché et votre photo de profil à tout moment.",
    nameLabel: "Pseudo",
    avatarLabel: "Photo de profil",
    saveButton: "Enregistrer",
    savedToast: "Profil mis à jour",
    closeButton: "Fermer",
  },
  lobby: {
    codeLabel: "Code de la partie",
    copyCode: "Copier le code",
    copyLink: "Copier le lien d'invitation",
    shareLink: "Envoyer le lien d'invitation",
    shareMessage: (code) => `Vous êtes invité(e) à une partie de Loup-Garou DX en ligne. Code de la partie : ${code}`,
    copyCodeToast: "Code copié",
    copyLinkToast: "Lien d'invitation copié",
    copyErrorToast: "Échec de la copie",
    participants: (n) => `Participants (${n})`,
    waitingForMorePlayers: (n) => (n > 1 ? `Encore ${n} joueurs pour pouvoir commencer` : `Encore ${n} joueur pour pouvoir commencer`),
    composition: "Composition des rôles",
    compositionReadonly: "Composition des rôles (en cours de réglage par l'hôte)",
    compositionEmpty: "Aucun rôle n'a encore été configuré.",
    compositionReadonlyDesc: (wolves, total) => `${total} rôles configurés au total, dont ${wolves} Loup${wolves > 1 ? "s" : ""}-Garou${wolves > 1 ? "s" : ""}.`,
    roomInfoButton: "Rôles et réglages",
    roomInfoTitle: "Rôles et réglages de cette partie",
    suggest: "Composition suggérée",
    seatTotal: "Total des rôles",
    seatTotalOf: (total, count) => `${total} / ${count} joueurs`,
    soloGroupLabel: "Camps solitaires",
    startButton: "Démarrer la partie",
    waitingHost: "En attente que l'hôte démarre la partie…",
    leaveButton: "Quitter",
    settingsTitle: "Réglages de la partie",
    officialRulesSectionTitle: "Règles de base",
    extraRulesSectionTitle: "Règles additionnelles",
    extraRulesSectionDesc: "Tout ce qui suit est une extension propre à cette application. Ces réglages n'existent pas dans les règles de base : personnalisez-les librement pour que la partie soit agréable pour votre groupe.",
    revealOnDeath: "Révéler le rôle à la mort d'un joueur",
    allowFirstNightKill: "Les Loups-Garous peuvent attaquer dès la première nuit",
    allowFirstNightKillDesc: "Si désactivé, personne ne meurt lors de la toute première nuit (nuit du jour 1), quelle que soit la cible choisie par les Loups-Garous. Recommandé si plusieurs joueurs débutent. À partir de la nuit 2, les attaques redeviennent normalement effectives.",
    allowFirstVoteExecution: "Le premier vote peut réellement éliminer un joueur",
    allowFirstVoteExecutionDesc: "Si désactivé, la personne désignée lors du tout premier vote (jour 1) n'est pas réellement éliminée : elle est graciée. À partir du jour 2, les votes redeviennent normalement décisifs.",
    allowWolfFriendlyFire: "Les Loups-Garous peuvent attaquer un autre Loup-Garou",
    allowWolfFriendlyFireDesc: "Si activé, les Loups-Garous peuvent désigner un autre Loup-Garou comme cible de leur attaque (impossible par défaut).",
    seerFirstNightDivine: "La Voyante peut sonder quelqu'un dès la révélation des rôles",
    seerFirstNightDivineDesc: "Permet à la Voyante de sonder librement une personne au moment même de la révélation des rôles (recommandé à partir de 7 joueurs). La Voyante reste libre de sonder ou non. Si désactivé, les visions ne commencent qu'à la première nuit.",
    allowSelfVote: "Un joueur peut voter pour lui-même",
    revealVoteChoices: "Rendre les votes visibles de tous",
    revealVoteChoicesDesc: "Si activé, tout le monde voit en temps réel qui vote pour qui pendant la phase de vote. Si désactivé, seul le décompte des voix reste visible, comme d'habitude.",
    allowBodyguardSelfGuard: "Le Garde du corps peut se protéger lui-même",
    secondTieExecutesRandomly: "En cas d'égalité même au vote décisif, éliminer un joueur au hasard",
    secondTieExecutesRandomlyDesc: "Si désactivé, une égalité persistant même au vote décisif clôt la journée sans aucune élimination.",
    dictatorCanTargetSelf: "Le Despote peut se désigner lui-même pour l'élimination",
    settingsPacingNote: "Cette application n'a pas de minuteur automatique. Chaque écran avance sur action de l'hôte, ou dès que tous les joueurs ont agi. Jouez à votre propre rythme.",
    kick: "Expulser",
    makeHost: "Nommer hôte",
    makeHostConfirmTitle: "Transférer le rôle d'hôte ?",
    makeHostConfirmDesc: (name) => `${name} deviendra le nouvel hôte. Vous perdrez vos privilèges d'hôte et ne pourrez plus faire avancer la partie.`,
    makeHostConfirmAction: "Transférer",
  },
  roleReveal: {
    label: "Votre rôle",
    tapToReveal: "Toucher pour révéler",
    privacyHint: "Assurez-vous que personne autour de vous ne peut voir l'écran",
    allies: "Vos alliés",
    allRoles: "Rôles de tous les joueurs",
    waitingOthers: "Vous avez confirmé. Dès que tout le monde aura confirmé, la première discussion commencera automatiquement.",
    confirmButton: "J'ai confirmé",
    progress: (s, t) => `Confirmé : ${s} / ${t}`,
    earlyDivineTitle: "Utiliser dès maintenant le pouvoir de la Voyante (facultatif)",
    earlyDivineDesc: "Vous pouvez sonder une personne dès maintenant, au moment de la révélation des rôles. Vous pouvez aussi continuer sans le faire.",
    earlyDivineButton: "Sonder cette personne",
    earlyDivineSkipNote: "Vous pouvez aussi continuer sans sonder personne en appuyant sur « J'ai confirmé ».",
    earlyDivineDone: "Vision déjà effectuée. Voici le résultat.",
  },
  night: {
    tag: (day) => `Nuit ${day}`,
    deadNotice: "Vous avez été éliminé. Observez la suite en silence…",
    dormant: "La nuit avance…",
    dormantDesc: "Veuillez patienter pendant que les rôles actifs agissent.",
    progress: (s, t) => `Actions effectuées : ${s} / ${t}`,
    submitButton: "Valider",
    resubmitButton: "Envoyé (modifier)",
    previousSeerResult: (day) =>
      day === 0 ? "Résultat de la vision précédente (révélation des rôles)" : `Résultat de la vision précédente (jour ${day})`,
    seerResultLine: (name, isBlack) => `${name} s'est révélé(e) ${isBlack ? "【noir (Loup-Garou)】" : "【blanc】"}`,
    actions: {
      attack: { title: "Qui voulez-vous attaquer ?", desc: "Concertez-vous avec les autres Loups-Garous et choisissez qui attaquer cette nuit.", skip: "N'attaquer personne cette nuit" },
      guard: { title: "Qui voulez-vous protéger ?", desc: "Choisissez la personne à protéger d'une attaque de Loup-Garou. Vous ne pouvez pas vous protéger vous-même, ni protéger la même personne que la nuit précédente.", skip: "Ne protéger personne cette nuit" },
      divine: { title: "Qui voulez-vous sonder ?", desc: "Découvrez si cette personne est un Loup-Garou.", skip: "Ne sonder personne cette nuit" },
    },
    firstNightKillDisabledNotice: "D'après les réglages, personne ne meurt lors de la première nuit (jour 1), quelle que soit la cible attaquée. À partir de la nuit 2, les attaques redeviennent normalement effectives.",
    forceAdvanceButton: "Avancer sans attendre tout le monde (action de l'hôte)",
    wolfSelectionsTitle: "Choix actuels des Loups-Garous (pour vous concerter)",
    wolfSelectionsEmpty: "Personne n'a encore choisi",
    wolfSelectionsLine: (name, targetName) => `${name} : ${targetName ?? "aucun choix"}`,
    wolfConsensusNeeded: "La nuit ne se termine que lorsque tous les Loups-Garous choisissent la même cible (ou choisissent tous « ne pas attaquer »). Mettez-vous d'accord sur une seule personne.",
    wolfConsensusReached: "Tout le monde est d'accord.",
  },
  hunterRevenge: {
    title: "L'identité du Chasseur est révélée !",
    waitingFor: (name) => `${name} choisit qui entraîner dans sa chute…`,
    youAre: "Vous êtes le Chasseur. Vous pouvez choisir une personne à entraîner dans votre chute (ce n'est pas obligatoire).",
    skip: "N'entraîner personne",
    submit: "Valider",
    submitted: "Envoyé",
    hostSkipButton: "Décider à la place du Chasseur qu'il n'entraîne personne (action de l'hôte)",
  },
  dayResult: {
    tag: (day) => `Matin ${day}`,
    noDeaths: "Personne n'a été attaqué cette nuit. Un matin paisible.",
    seerResult: "Résultat de la vision",
    continueButton: "Passer à la discussion",
    waitingHost: "En attente que l'hôte lance la discussion…",
  },
  discussion: {
    tag: (day) => `Discussion, jour ${day}`,
    firstRoundTag: "Première discussion",
    firstRoundNotice: "C'est la toute première discussion, juste après la révélation des rôles. Personne n'a encore été attaqué. Il n'y a pas de vote d'élimination pour l'instant. Discutez librement, puis l'hôte lancera la véritable première « nuit ».",
    proceedToNightButton: "Terminer la discussion et passer à la nuit",
    survivors: "Survivants",
    dictatorButton: "Activer le pouvoir du Despote",
    dictatorConfirmTitle: "Activer le pouvoir du Despote ?",
    dictatorConfirmDesc: "La discussion sera interrompue immédiatement et la personne que vous désignez sera éliminée sans vote, sur votre seule décision. Ce pouvoir ne peut être utilisé qu'une seule fois par partie.",
    dictatorConfirmAction: "Éliminer cette personne",
    skipButton: "Terminer la discussion et passer au vote",
    waitingHost: "En attente que l'hôte fasse avancer la partie. Il n'y a pas de limite de temps : discutez jusqu'à ce que tout le monde soit prêt.",
    runoffNotice: "Le vote s'est terminé sur une égalité : voici la discussion précédant le vote décisif. Si l'égalité persiste, le résultat sera tiré au sort.",
    runoffCandidatesLabel: "Candidats au vote décisif",
  },
  vote: {
    tag: (day) => `Vote, jour ${day}`,
    runoffTag: (day) => `Vote décisif, jour ${day}`,
    cannotVote: "Vous ne pouvez pas voter. Observez la suite.",
    instructions: "Choisissez une personne à éliminer",
    runoffNotice: "Le vote précédent s'est terminé sur une égalité : voici le vote décisif, restreint aux candidats à égalité. Si l'égalité persiste, le résultat sera tiré au sort.",
    submitButton: "Voter",
    submittedButton: "Voté (modifier)",
    progress: (s, t) => `Votes reçus : ${s} / ${t}`,
    forceAdvanceButton: "Clore le vote sans attendre tout le monde (action de l'hôte)",
    voteChoicesTitle: "Votes en cours (visibles de tous, car ce réglage est activé)",
    voteChoicesLine: (voter, target) => `${voter} → ${target}`,
  },
  executionResult: {
    tag: (day) => `Résultat du vote, jour ${day}`,
    executed: (name) => `${name} a été éliminé(e)`,
    spared: (name) => `À l'issue du vote décisif, ${name} a été gracié(e)`,
    sparedFirstVoteRule: (name) =>
      `En raison du réglage « le premier vote ne peut pas réellement éliminer », ${name} a été gracié(e) sans vote décisif`,
    noExecution: "Le vote n'a abouti à aucune élimination.",
    mediumResult: "Résultat de la Médium",
    mediumResultLine: (name, isBlack) => `${name} s'est révélé(e) ${isBlack ? "【noir (Loup-Garou)】" : "【blanc】"}`,
    continueButton: "Passer à la nuit suivante",
    waitingHost: "En attente que l'hôte passe à la nuit suivante…",
  },
  lastWords: {
    tag: (day) => `Derniers mots, jour ${day}`,
    title: "Le vote a désigné une personne à éliminer",
    waitingFor: (name) => `Écoutons les derniers mots de ${name}`,
    youAreTitle: "Vous avez été désigné(e) pour l'élimination",
    youAreDesc: "Si vous avez quelque chose à dire avant la fin, c'est le moment. Une fois terminé, continuez avec le bouton ci-dessous.",
    proceedButton: "J'ai terminé (passer au vote décisif)",
    waitingHost: "En attente que la personne concernée ou l'hôte fasse avancer la partie…",
  },
  appealVote: {
    tag: (day) => `Vote décisif : gracier ou non, jour ${day}`,
    instructions: (name) => `Faut-il vraiment éliminer ${name}, ou le/la gracier ?`,
    cannotVote: "Vous ne pouvez pas participer à ce vote décisif (vous êtes le candidat à l'élimination). Observez la suite.",
    executeOption: "Éliminer",
    spareOption: "Gracier",
    submitButton: "Valider",
    submittedButton: "Voté (modifier)",
    progress: (s, t) => `Votes reçus : ${s} / ${t}`,
    forceAdvanceButton: "Clore le vote sans attendre tout le monde (action de l'hôte)",
  },
  allyNote: {
    title: "Note réservée aux alliés",
    placeholder: "Un court message visible seulement de vos alliés (ex. : viser le n°3)",
    hint: "Passez-vous discrètement de courts messages, sans vous faire remarquer. Ce n'est pas un chat : c'est une note unique partagée entre vous.",
    groupSize: (n) => `Partagée entre ${n} personnes`,
  },
  gameOver: {
    primary: {
      village: "Victoire du camp des Villageois !",
      werewolf: "Victoire du camp des Loups-Garous !",
      draw: "Match nul",
    },
    extra: {
      fox: "Le Renard a aussi survécu : victoire solitaire !",
      god: "La Divinité a aussi survécu : victoire solitaire !",
      lover: "Les deux Amoureux ont survécu : victoire à deux !",
    },
    allRoles: "Rôles de tous les joueurs",
    eliminated: "Éliminé",
    newGameButton: "Rejouer avec le même groupe",
    waitingHost: "En attente que l'hôte lance une nouvelle partie…",
    leaveButton: "Quitter",
    hostEndedTitle: "L'hôte a mis fin à la partie",
    hostEndedDesc: "La partie s'est terminée ici, sans vainqueur déterminé.",
  },
  confirm: {
    advanceTitle: "Passer à la suite ?",
    advanceDesc: "Assurez-vous que tout le monde est prêt avant de continuer. Cette action est irréversible.",
    advanceAction: "Continuer",
    forceResolveTitle: "Forcer le passage à la suite ?",
    forceResolveDesc: "Les joueurs n'ayant pas encore agi ou voté seront ignorés.",
    forceResolveAction: "Forcer le passage",
    newGameTitle: "Démarrer une nouvelle partie avec le même groupe ?",
    newGameDesc: "Les résultats actuels seront réinitialisés et les rôles redistribués depuis le début.",
    newGameAction: "Démarrer une nouvelle partie",
    skipHunterRevengeTitle: "Passer l'occasion pour le Chasseur d'entraîner quelqu'un ?",
    skipHunterRevengeDesc: "Si vous passez, le Chasseur n'entraînera personne dans sa chute.",
    skipHunterRevengeAction: "Passer",
    endGameTitle: "Terminer la partie ?",
    endGameDesc: "La partie en cours se terminera ici et le rôle de chaque joueur sera révélé à tous. Cette action est irréversible.",
    endGameAction: "Terminer",
  },
  help: {
    button: "Règles du jeu",
    title: "Règles du jeu",
    tldr: "En bref : les Villageois doivent démasquer, par la discussion, les Loups-Garous cachés parmi eux, puis les éliminer par le vote.",
    tabFlow: "Déroulement",
    tabWin: "Conditions de victoire",
    tabRoles: "Rôles",
    intro:
      "Loup-Garou DX est un jeu de bluff et de déduction où les « Loups-Garous », dissimulés parmi les joueurs, s'opposent aux « Villageois » qui cherchent à les démasquer. Le jeu alterne entre le « jour » (discussion et vote) et la « nuit » (actions secrètes propres à chaque rôle), jusqu'à ce que les Villageois éliminent tous les Loups-Garous, ou que les Loups-Garous soient aussi nombreux que le reste des survivants. La révélation des rôles, les actions de nuit et les votes se déroulent tous directement sur cet écran. Il n'y a pas de minuteur automatique : la partie avance sur action de l'hôte ou dès que tout le monde a agi, à votre propre rythme.",
    flowTitle: "Déroulement de la partie",
    flowSteps: [
      { title: "Révélation des rôles", desc: "Chaque joueur découvre discrètement son propre rôle, puis appuie sur « J'ai confirmé ». Veillez à ce que personne autour de vous ne voie votre écran. La partie n'avance que lorsque tout le monde a confirmé." },
      { title: "Première discussion", desc: "Juste après la révélation des rôles, c'est un moment de présentation où personne n'a encore été attaqué. Il n'y a pas de vote. Après quelques échanges, l'hôte lance la véritable première « nuit »." },
      { title: "Nuit", desc: "Seuls les rôles avec un pouvoir — Loups-Garous, Voyante, Garde du corps, etc. — agissent discrètement. Les joueurs sans pouvoir n'ont rien à faire, il suffit d'attendre. C'est ici que la première attaque des Loups-Garous a lieu (un réglage permet de désactiver les effets de l'attaque lors de la toute première nuit)." },
      { title: "Matin (annonce des résultats)", desc: "Ce qui s'est passé pendant la nuit (qui a été attaqué) est révélé." },
      { title: "Discussion", desc: "En vous basant sur les résultats de la nuit, discutez et déduisez qui pourrait être un Loup-Garou. Il n'y a pas de limite de temps : discutez jusqu'à ce que tout le monde soit prêt." },
      { title: "Vote", desc: "Chaque joueur vote pour une personne à éliminer. Celle qui reçoit le plus de voix est éliminée ; en cas d'égalité, un vote décisif a lieu. Dès que tous les votes sont reçus, les résultats s'affichent automatiquement." },
      { title: "Répétition", desc: "Le cycle « nuit → matin → discussion → vote » se répète jusqu'à la victoire d'un camp." },
    ],
    diagramTitle: "Le cycle jour-nuit en images",
    diagramIntro:
      "Une « nuit » et le « matin → discussion → vote » qui la suit immédiatement forment un seul et même jour. Par exemple, le matin, la discussion et le vote qui suivent la « nuit 1 » constituent tous ensemble le « jour 1 ».",
    diagramDayLabel: (day) => `Jour ${day}`,
    diagramSameDayNote: "🌙 La nuit et ☀️ le jour (matin, discussion, vote) portant le même numéro forment un seul et même cycle.",
    diagramOutcomeLabel: "Issue de la partie",
    diagramNoRoomNote: "Les réglages réels dépendent de la partie que vous avez rejointe. Une fois dans une partie, vous pouvez aussi les consulter dans l'onglet « Rôles et réglages ».",
    diagramSettingsHeading: "Réglages de cette partie",
    winTitle: "Conditions de victoire",
    winIntro: "Les conditions de victoire varient selon le camp. Plusieurs camps peuvent parfois l'emporter en même temps.",
    winVillage: "Camp des Villageois : victoire lorsque tous les Loups-Garous ont été éliminés.",
    winWerewolf: "Camp des Loups-Garous : victoire lorsque le nombre de Loups-Garous est égal ou supérieur au nombre des autres survivants.",
    winFox: "Renard : s'il survit jusqu'à la fin de la partie, il gagne seul, peu importe si les Villageois ou les Loups-Garous l'emportent.",
    winGod: "Divinité : si elle survit jusqu'à la fin de la partie, elle gagne seule, peu importe si les Villageois ou les Loups-Garous l'emportent.",
    winLover: "Amoureux : s'ils survivent tous les deux jusqu'à la fin de la partie, ils gagnent ensemble.",
    rolesTitle: "Liste des rôles (13 au total)",
    rolesIntro: "Les explications de votre propre rôle restent accessibles à tout moment pendant la partie, via le bouton « Mon rôle » en haut de l'écran.",
    close: "Fermer",
  },
  myRole: {
    button: "Mon rôle",
    title: "Votre rôle",
    dayLabel: (day) => (day === 0 ? "À la révélation des rôles" : `Jour ${day}`),
    seerHistoryTitle: "Personnes déjà sondées",
    seerHistoryEmpty: "Vous n'avez encore sondé personne.",
    mediumHistoryTitle: "Personnes déjà examinées",
    mediumHistoryEmpty: "Vous n'avez encore examiné personne.",
    noRoleYet: "Aucun rôle n'a encore été révélé.",
    close: "Fermer",
  },
  team: {
    village: "Camp des Villageois",
    werewolf: "Camp des Loups-Garous",
    fox: "Renard (camp solitaire)",
    god: "Divinité (camp solitaire)",
    lover: "Amoureux (camp solitaire)",
  },
  deathCause: {
    attack: "Attaqué(e) par les Loups-Garous",
    execution: "Éliminé(e) par le vote",
    curse: "Sondé(e) par la Voyante et maudit(e)",
    hunter: "Entraîné(e) dans la chute du Chasseur",
    lover_grief: "Mort(e) de chagrin après son Amoureux",
  },
  roles: {
    villager: {
      name: "Villageois",
      short: "Un habitant du village sans pouvoir particulier",
      detail: "Vous êtes Villageois. Vous n'avez aucun pouvoir particulier. Si quelqu'un vous semble suspect, exposez vos raisons pendant la discussion et aidez le groupe à mener l'enquête.",
    },
    seer: {
      name: "Voyante",
      short: "Chaque nuit, sonde une personne pour savoir si c'est un Loup-Garou",
      detail:
        "Vous êtes la Voyante. Chaque nuit, vous pouvez sonder une personne de votre choix. Si elle est « Loup-Garou », vous obtenez noir ; sinon, blanc. Ce résultat n'est visible que de vous : à vous de décider comment (et si) le révéler pendant la discussion. Attention : si vous sondez le Renard, celui-ci meurt maudit dans la nuit.",
    },
    bodyguard: {
      name: "Garde du corps",
      short: "Chaque nuit, protège une personne d'une attaque de Loup-Garou",
      detail:
        "Vous êtes le Garde du corps. Chaque nuit, choisissez une personne autre que vous-même à protéger d'une attaque de Loup-Garou. Si la personne protégée était bien la cible de l'attaque, elle survit. Vous ne pouvez pas protéger la même personne deux nuits de suite.",
    },
    medium: {
      name: "Médium",
      short: "Sait si la personne éliminée par le vote était un Loup-Garou",
      detail: "Vous êtes la Médium. Chaque nuit suivant une élimination par le vote, vous apprenez si la personne éliminée était un « Loup-Garou ». Lors de la nuit du jour 1, personne n'a encore été éliminé : vous n'avez donc personne à examiner.",
    },
    hunter: {
      name: "Chasseur",
      short: "En mourant, peut entraîner une personne dans sa chute",
      detail:
        "Vous êtes le Chasseur. Lorsque vous êtes « éliminé(e) par le vote » ou tué(e) par une « attaque de Loup-Garou », vous pouvez désigner une personne à entraîner avec vous dans la mort (ce n'est pas obligatoire). Vous n'avez pas besoin de révéler votre rôle vous-même.",
    },
    mason: {
      name: "Frère juré",
      short: "Deux Villageois (ou plus) qui se connaissent entre eux",
      detail: "Vous êtes Frère juré. Vous savez qui sont les autres Frères jurés. Vous n'avez aucun pouvoir particulier, mais vous formez entre vous un groupe d'alliés en qui vous pouvez avoir une confiance totale. Choisissez avec prudence le moment de vous révéler, pour ne pas éveiller les soupçons des Loups-Garous.",
    },
    dictator: {
      name: "Despote",
      short: "Une fois par partie, coupe court à la discussion et décide seul de l'élimination",
      detail:
        "Vous êtes le Despote. Une seule fois dans la partie, vous pouvez vous révéler pendant la discussion du jour pour l'interrompre immédiatement et décider seul(e), sans vote, qui sera éliminé. C'est un pouvoir puissant : choisissez le bon moment avec prudence.",
    },
    werewolf: {
      name: "Loup-Garou",
      short: "Chaque nuit, attaque une personne. Connaît les autres Loups-Garous",
      detail:
        "Vous êtes un Loup-Garou. Vous savez qui sont les autres Loups-Garous. Chaque nuit, concertez-vous avec eux pour attaquer une personne. Pendant les discussions, faites-vous passer pour un Villageois afin de garder votre identité secrète. Votre camp gagne lorsque les Loups-Garous sont aussi nombreux que les autres survivants.",
    },
    traitor: {
      name: "Traître",
      short: "Membre du camp des Loups-Garous, mais qui ignore leur identité",
      detail:
        "Vous êtes le Traître. Vous gagnez avec le camp des Loups-Garous si celui-ci l'emporte, mais vous ne savez pas qui ils sont. Les visions et examens vous révèlent « blanc (pas un Loup-Garou) », ce qui vous rend difficile à soupçonner. Faites semblant de chercher les Loups-Garous tout en agissant discrètement dans leur intérêt (contrairement à l'Espion, vous ne connaissez pas leur identité).",
    },
    insider: {
      name: "Espion",
      short: "Connaît l'identité des Loups-Garous et les aide en secret",
      detail:
        "Vous êtes l'Espion. Vous savez qui sont les Loups-Garous. Les visions et examens vous révèlent « blanc (pas un Loup-Garou) », ce qui vous rend particulièrement difficile à soupçonner parmi les alliés des Loups-Garous. Ne les défendez pas trop ouvertement au risque d'éveiller les soupçons : aidez-les discrètement, en vous faisant passer pour un Villageois (contrairement au Traître, vous connaissez leur identité).",
    },
    fox: {
      name: "Renard",
      short: "Camp solitaire immunisé aux attaques des Loups-Garous, mais meurt s'il est sondé",
      detail:
        "Vous êtes le Renard. Vous n'appartenez ni au camp des Villageois ni à celui des Loups-Garous : leurs attaques ne peuvent pas vous tuer. Mais si la Voyante vous sonde, vous mourez maudit dans la nuit. Peu importe qui l'emporte entre Villageois et Loups-Garous : si vous survivez jusqu'à la fin de la partie, vous gagnez.",
    },
    god: {
      name: "Divinité",
      short: "Camp solitaire qui connaît le rôle de tous. Gagne en survivant",
      detail:
        "Vous êtes la Divinité. Dès le début de la partie, vous connaissez le rôle de tous les joueurs. Les visions et examens vous révèlent « blanc ». Peu importe qui l'emporte entre Villageois et Loups-Garous : si vous survivez jusqu'à la fin de la partie, vous gagnez.",
    },
    lover: {
      name: "Amoureux",
      short: "Duo secret : si l'un meurt, l'autre meurt aussi. Camp solitaire",
      detail:
        "Vous êtes Amoureux. Vous savez qui est l'autre Amoureux. Si l'un de vous deux meurt, éliminé(e) ou attaqué(e), l'autre meurt de chagrin juste après. Si vous survivez tous les deux jusqu'à la fin de la partie, vous gagnez ensemble.",
    },
  },
  errors: {
    ROOM_NOT_FOUND: "Partie introuvable. Vérifiez le code de la partie.",
    GAME_ALREADY_STARTED: "Impossible de rejoindre : la partie a déjà commencé.",
    ROOM_FULL: "Le nombre maximum de participants est atteint.",
    REJOIN_FAILED: "Échec de la reconnexion.",
    PLAYER_NOT_FOUND: "Informations du joueur introuvables.",
    NOT_HOST: "Seul l'hôte peut effectuer cette action.",
    ALREADY_STARTED: "La partie a déjà commencé.",
    NOT_IN_ROOM: "Vous ne participez à aucune partie.",
    MIN_PLAYERS: "Pas assez de participants.",
    KICKED: "Vous avez été expulsé de la partie par l'hôte.",
    INVALID_ROOM_CODE: "Le code de la partie doit contenir de 5 à 8 caractères alphanumériques.",
    ROOM_CODE_TAKEN: "Ce code de partie est déjà utilisé. Essayez-en un autre.",
  },
  validation: (issue) => {
    switch (issue.code) {
      case "SEAT_MISMATCH":
        return `Le nombre total de rôles (${issue.total}) ne correspond pas au nombre de participants (${issue.playerCount}).`;
      case "NO_WEREWOLF":
        return "Il faut au moins un Loup-Garou.";
      case "MASON_ODD":
        return "Les Frères jurés doivent être configurés par paires.";
      case "LOVER_INVALID":
        return "Les Amoureux doivent être configurés par paire de deux.";
      case "WOLF_TOO_MANY":
        return "Il y a trop de membres dans le camp des Loups-Garous : le camp des Villageois serait désavantagé dès le départ.";
    }
  },
};

const de: Strings = {
  meta: {
    title: "Werwolf DX Online",
    description: "Ein psychologisches Gesprächsspiel mit 13 Rollen: Findet die verborgenen Werwölfe durch Diskussion und Deduktion. Gemeinsam vor Ort gespielt, jeder mit dem Smartphone in der Hand.",
  },
  common: {
    host: "Gastgeber",
    connected: "Verbunden",
    disconnected: "Getrennt",
    reconnecting: "Verbindung wird wiederhergestellt…",
    connecting: "Verbindung wird hergestellt…",
    kicked: "Du wurdest vom Gastgeber aus dem Raum entfernt.",
    seconds: (n) => `${n} ${n === 1 ? "Sekunde" : "Sekunden"}`,
    timeRemaining: "Verbleibende Zeit",
    close: "Schließen",
    cancel: "Abbrechen",
    people: (n) => `${n} ${n === 1 ? "Person" : "Personen"}`,
    listSeparator: ", ",
    confirmProceed: "Bestätigen",
    transitioning: "Weiter zur nächsten Szene…",
    on: "AN",
    off: "AUS",
    themeToggleToLight: "Zum hellen Modus wechseln",
    themeToggleToDark: "Zum dunklen Modus wechseln",
    menu: "Menü",
    themeLabel: "Design",
    languageLabel: "Sprache",
    endGameButton: "Spiel beenden",
    officialRuleBadge: "Standardregel",
    optionalRuleBadge: "Zusatzregel",
  },
  entry: {
    title: "Werwolf DX Online",
    subtitle: "Ein psychologisches Gesprächsspiel mit 13 Rollen: Findet die verborgenen Werwölfe durch Diskussion und Deduktion. Überall spielbar – einfach mit dem Smartphone in der Hand.",
    cardTitle: "Loslegen",
    cardDesc: "Erstelle einen Raum oder tritt mit einem Raumcode bei.",
    tabCreate: "Raum erstellen",
    tabJoin: "Raum beitreten",
    nameLabel: "Spitzname",
    namePlaceholder: "z. B. Max",
    createButton: "Raum erstellen",
    codeLabel: "Raumcode",
    codePlaceholder: "z. B. AB3XZ",
    joinButton: "Beitreten",
    footerNote: "* Diese App hat keine Chat-Funktion. Unterhaltet euch bitte persönlich, während ihr spielt.",
    helpButton: "Spielregeln ansehen",
    customCodeLabel: "Raumcode (optional)",
    customCodePlaceholder: "Bei leerem Feld wird automatisch einer erzeugt",
    customCodeHint: "5–8 Zeichen, nur Buchstaben und Zahlen. Ohne Angabe wird automatisch ein Code vergeben.",
    avatarLabel: "Profilbild (optional)",
    avatarAddButton: "Bild hinzufügen",
    avatarChangeButton: "Bild ändern",
    avatarRemoveButton: "Bild entfernen",
    avatarTooLarge: "Die Bilddatei ist zu groß (maximal 8 MB)",
    avatarUnsupported: "Bitte wähle eine Bilddatei aus",
    castLabel: "Die 13 Rollen des Spiels",
  },
  profile: {
    editButton: "Profil bearbeiten",
    title: "Profil bearbeiten",
    desc: "Du kannst deinen Anzeigenamen und dein Profilbild jederzeit ändern.",
    nameLabel: "Spitzname",
    avatarLabel: "Profilbild",
    saveButton: "Speichern",
    savedToast: "Profil aktualisiert",
    closeButton: "Schließen",
  },
  lobby: {
    codeLabel: "Raumcode",
    copyCode: "Code kopieren",
    copyLink: "Einladungslink kopieren",
    shareLink: "Einladungslink senden",
    shareMessage: (code) => `Du wurdest zu einer Runde Werwolf DX Online eingeladen. Raumcode: ${code}`,
    copyCodeToast: "Code kopiert",
    copyLinkToast: "Einladungslink kopiert",
    copyErrorToast: "Kopieren fehlgeschlagen",
    participants: (n) => `Teilnehmer (${n})`,
    waitingForMorePlayers: (n) => `Noch ${n} ${n === 1 ? "Person" : "Personen"}, dann kann das Spiel starten`,
    composition: "Rollenzusammenstellung",
    compositionReadonly: "Rollenzusammenstellung (wird vom Gastgeber festgelegt)",
    compositionReadonlyDesc: (wolves, total) => `Enthält ${wolves} ${wolves === 1 ? "Werwolf" : "Werwölfe"}, insgesamt sind Rollen für ${total} ${total === 1 ? "Person" : "Personen"} festgelegt.`,
    compositionEmpty: "Es wurden noch keine Rollen festgelegt.",
    roomInfoButton: "Rollen & Einstellungen",
    roomInfoTitle: "Rollenverteilung & Spieleinstellungen",
    suggest: "Empfohlene Verteilung",
    seatTotal: "Rollen insgesamt",
    seatTotalOf: (total, count) => `${total} / ${count} Personen`,
    soloGroupLabel: "Solofraktionen",
    startButton: "Spiel starten",
    waitingHost: "Warte darauf, dass der Gastgeber das Spiel startet…",
    leaveButton: "Verlassen",
    settingsTitle: "Spieleinstellungen",
    officialRulesSectionTitle: "Grundregeln",
    extraRulesSectionTitle: "Zusatzregeln",
    extraRulesSectionDesc: "Ab hier folgen App-eigene Erweiterungsregeln. Diese gibt es in den Grundregeln nicht – stellt sie nach Belieben so ein, wie es euch am meisten Spaß macht.",
    revealOnDeath: "Rolle bei Tod aufdecken",
    allowFirstNightKill: "In der ersten Nacht können die Werwölfe angreifen",
    allowFirstNightKillDesc: "Ist diese Option deaktiviert, stirbt in der allerersten Nacht (Nacht von Tag 1) niemand, egal wen die Werwölfe angreifen. Empfehlenswert, wenn viele Neulinge mitspielen. Ab der zweiten Nacht wirkt der Angriff wie gewohnt.",
    allowFirstVoteExecution: "Die erste Abstimmung kann tatsächlich zur Verbannung führen",
    allowFirstVoteExecutionDesc: "Ist diese Option deaktiviert, wird bei der ersten Abstimmung (an Tag 1) niemand tatsächlich verbannt, egal wer die meisten Stimmen erhält. Ab der zweiten Abstimmung gilt die Verbannung wie gewohnt.",
    allowWolfFriendlyFire: "Werwölfe können andere Werwölfe angreifen",
    allowWolfFriendlyFireDesc: "Ist diese Option aktiviert, können die Werwölfe auch einen anderen Werwolf als Angriffsziel wählen (normalerweise nicht möglich).",
    seerFirstNightDivine: "Die Seherin darf bei der Rollenbestätigung schon jemanden weissagen",
    seerFirstNightDivineDesc: "Bei der Rollenbestätigung darf die Seherin frei eine Person weissagen (empfohlen ab 7 Spielern). Sie entscheidet selbst, ob sie davon Gebrauch macht. Ist diese Option deaktiviert, beginnt das Weissagen erst in der ersten Nacht.",
    allowSelfVote: "Bei der Abstimmung darf man für sich selbst stimmen",
    revealVoteChoices: "Abstimmungsverhalten für alle sichtbar machen",
    revealVoteChoicesDesc: "Ist diese Option aktiviert, sehen während der Abstimmungsphase alle in Echtzeit, wer für wen stimmt. Ist sie deaktiviert, wird wie gewohnt nur die Stimmenanzahl veröffentlicht.",
    allowBodyguardSelfGuard: "Der Beschützer darf sich selbst beschützen",
    secondTieExecutesRandomly: "Bei erneutem Gleichstand in der Stichwahl wird zufällig verbannt",
    secondTieExecutesRandomlyDesc: "Ist diese Option deaktiviert, wird bei erneutem Gleichstand in der Stichwahl niemand verbannt, und der Tag endet ohne Verbannung.",
    dictatorCanTargetSelf: "Der Diktator kann sich selbst zur Verbannung bestimmen",
    settingsPacingNote: "Diese App hat keinen automatischen Timer. Jeder Bildschirm geht erst weiter, wenn der Gastgeber es auslöst oder alle ihre Handlung abgeschlossen haben. Spielt in eurem eigenen Tempo.",
    kick: "Entfernen",
    makeHost: "Zum Gastgeber machen",
    makeHostConfirmTitle: "Gastgeberrolle übertragen?",
    makeHostConfirmDesc: (name) => `${name} wird zum neuen Gastgeber. Du verlierst deine Gastgeberrechte und kannst den Spielablauf nicht mehr steuern.`,
    makeHostConfirmAction: "Übertragen",
  },
  roleReveal: {
    label: "Deine Rolle",
    tapToReveal: "Zum Aufdecken tippen",
    privacyHint: "Achte darauf, dass niemand in der Nähe mitliest",
    allies: "Deine Verbündeten",
    allRoles: "Rollen aller Spieler",
    waitingOthers: "Bestätigt. Sobald alle bestätigt haben, geht es automatisch mit der ersten Gesprächsrunde weiter.",
    confirmButton: "Bestätigt",
    progress: (s, t) => `Bestätigt: ${s} / ${t}`,
    earlyDivineTitle: "Die Kraft der Seherin jetzt schon nutzen (optional)",
    earlyDivineDesc: "Bei der Rollenbestätigung kannst du bereits eine Person weissagen. Du kannst diese Möglichkeit auch ungenutzt lassen.",
    earlyDivineButton: "Diese Person weissagen",
    earlyDivineSkipNote: "Du kannst auch ohne Weissagung einfach auf „Bestätigt“ tippen und weitergehen.",
    earlyDivineDone: "Bereits geweissagt. Das Ergebnis siehst du unten.",
  },
  night: {
    tag: (day) => `Nacht, Tag ${day}`,
    deadNotice: "Du bist bereits ausgeschieden. Beobachte in Ruhe, wie die Nacht vergeht…",
    dormant: "Die Nacht bricht herein…",
    dormantDesc: "Bitte warte, bis alle Rollen mit Fähigkeiten ihre Handlung abgeschlossen haben.",
    progress: (s, t) => `Handlungen abgeschlossen: ${s} / ${t}`,
    submitButton: "Bestätigen",
    resubmitButton: "Gesendet (ändern)",
    previousSeerResult: (day) =>
      day === 0 ? "Letztes Weissagungsergebnis (bei der Rollenbestätigung)" : `Letztes Weissagungsergebnis (Tag ${day})`,
    seerResultLine: (name, isBlack) => `${name} war ${isBlack ? "[Schwarz – Werwolf]" : "[Weiß]"}`,
    actions: {
      attack: { title: "Wen möchtest du angreifen?", desc: "Sprich dich mit den anderen Werwölfen ab und einigt euch auf das heutige Angriffsziel.", skip: "Heute Nacht nicht angreifen" },
      guard: { title: "Wen möchtest du beschützen?", desc: "Wähle die Person, die du vor dem Angriff der Werwölfe beschützen willst. Dich selbst kannst du nicht beschützen. Außerdem kannst du nicht dieselbe Person beschützen wie in der letzten Nacht.", skip: "Heute Nacht niemanden beschützen" },
      divine: { title: "Wen möchtest du weissagen?", desc: "Du erfährst, ob diese Person ein Werwolf ist.", skip: "Heute Nacht nicht weissagen" },
    },
    firstNightKillDisabledNotice: "Aufgrund der Einstellungen stirbt in der ersten Nacht (Tag 1) niemand, egal wer angegriffen wird. Ab der zweiten Nacht wirkt der Angriff wie gewohnt.",
    forceAdvanceButton: "Weiter, ohne auf alle zu warten (Gastgeber-Aktion)",
    wolfSelectionsTitle: "Wen die anderen Werwölfe gerade wählen (zur Absprache)",
    wolfSelectionsEmpty: "Noch niemand hat gewählt",
    wolfSelectionsLine: (name, targetName) => `${name}: ${targetName ?? "Noch nicht gewählt"}`,
    wolfConsensusNeeded: "Die Nacht endet erst, wenn sich alle Werwölfe auf dasselbe Ziel geeinigt haben (oder alle „nicht angreifen“ wählen). Sprecht euch ab und entscheidet euch für eine Person.",
    wolfConsensusReached: "Alle sind sich einig.",
  },
  hunterRevenge: {
    title: "Die wahre Identität des Jägers kommt ans Licht!",
    waitingFor: (name) => `${name} wählt gerade, wen er mit in den Tod reißt…`,
    youAre: "Du bist der Jäger. Du darfst eine Person wählen, die du mit in den Tod reißt (du musst niemanden wählen).",
    skip: "Niemanden mitnehmen",
    submit: "Bestätigen",
    submitted: "Gesendet",
    hostSkipButton: "Für den Jäger festlegen, dass niemand mitgenommen wird (Gastgeber-Aktion)",
  },
  dayResult: {
    tag: (day) => `Morgen, Tag ${day}`,
    noDeaths: "Letzte Nacht ist niemandem etwas zugestoßen. Ein friedlicher Morgen.",
    seerResult: "Weissagungsergebnis",
    continueButton: "Weiter zur Diskussion",
    waitingHost: "Warte darauf, dass der Gastgeber zur Diskussion weiterschaltet…",
  },
  discussion: {
    tag: (day) => `Diskussion, Tag ${day}`,
    firstRoundTag: "Erste Gesprächsrunde",
    firstRoundNotice: "Dies ist die erste Gesprächsrunde direkt nach der Rollenbestätigung. Noch wurde niemand angegriffen, und es wird hier auch noch nicht über eine Verbannung abgestimmt. Unterhaltet euch frei, und der Gastgeber leitet euch anschließend in die eigentliche „Nacht“ über.",
    proceedToNightButton: "Diskussion beenden und zur Nacht übergehen",
    survivors: "Überlebende",
    dictatorButton: "Macht des Diktators einsetzen",
    dictatorConfirmTitle: "Macht des Diktators wirklich einsetzen?",
    dictatorConfirmDesc: "Die Diskussion wird sofort beendet, und du bestimmst ohne Abstimmung im Alleingang, wer verbannt wird. Diese Fähigkeit kannst du nur einmal pro Spiel nutzen.",
    dictatorConfirmAction: "Diese Person verbannen",
    skipButton: "Diskussion beenden und zur Abstimmung übergehen",
    waitingHost: "Warte darauf, dass der Gastgeber weiterschaltet. Es gibt kein Zeitlimit – diskutiert, bis alle zufrieden sind.",
    runoffNotice: "Die Abstimmung endete mit einem Gleichstand. Dies ist die Diskussion vor der Stichwahl. Kommt auch dann keine Entscheidung zustande, wird zufällig entschieden.",
    runoffCandidatesLabel: "Kandidaten der Stichwahl",
  },
  vote: {
    tag: (day) => `Abstimmung, Tag ${day}`,
    runoffTag: (day) => `Stichwahl, Tag ${day}`,
    cannotVote: "Du darfst nicht abstimmen. Verfolge einfach das Ergebnis.",
    instructions: "Wähle eine Person, die verbannt werden soll",
    runoffNotice: "Da es einen Gleichstand gab, ist dies eine Stichwahl mit den betroffenen Kandidaten. Kommt auch dann keine Entscheidung zustande, wird zufällig entschieden.",
    submitButton: "Abstimmen",
    submittedButton: "Abgestimmt (ändern)",
    progress: (s, t) => `Abgestimmt: ${s} / ${t}`,
    forceAdvanceButton: "Abstimmung schließen, ohne auf alle zu warten (Gastgeber-Aktion)",
    voteChoicesTitle: "Abstimmungsstand (für alle sichtbar, da diese Einstellung aktiviert ist)",
    voteChoicesLine: (voter, target) => `${voter} → ${target}`,
  },
  executionResult: {
    tag: (day) => `Ergebnis der Verbannung, Tag ${day}`,
    executed: (name) => `${name} wurde verbannt`,
    spared: (name) => `Durch die Stichwahl wurde ${name} verschont`,
    sparedFirstVoteRule: (name) =>
      `Da bei der ersten Abstimmung niemand tatsächlich verbannt wird, wurde ${name} ohne Stichwahl verschont`,
    noExecution: "Das Ergebnis der Abstimmung: Niemand wurde verbannt.",
    mediumResult: "Ergebnis des Mediums",
    mediumResultLine: (name, isBlack) => `${name} war ${isBlack ? "[Schwarz – Werwolf]" : "[Weiß]"}`,
    continueButton: "Weiter zur nächsten Nacht",
    waitingHost: "Warte darauf, dass der Gastgeber zur nächsten Nacht weiterschaltet…",
  },
  lastWords: {
    tag: (day) => `Letzte Worte, Tag ${day}`,
    title: "Die Abstimmung ist entschieden: Eine Verbannung steht bevor",
    waitingFor: (name) => `Hört euch die letzten Worte von ${name} an`,
    youAreTitle: "Du wurdest zur Verbannung bestimmt",
    youAreDesc: "Wenn du den anderen noch etwas mitteilen möchtest, tu es jetzt. Wenn du fertig bist, geht es über den Button unten weiter.",
    proceedButton: "Fertig gesprochen (weiter zur Stichwahl)",
    waitingHost: "Warte darauf, dass die betroffene Person oder der Gastgeber weiterschaltet…",
  },
  appealVote: {
    tag: (day) => `Stichwahl: Verbannen oder verschonen, Tag ${day}`,
    instructions: (name) => `Soll ${name} wirklich verbannt werden – oder doch verschont?`,
    cannotVote: "Du darfst an dieser Stichwahl nicht teilnehmen (da du selbst zur Verbannung anstehst). Verfolge einfach das Ergebnis.",
    executeOption: "Verbannen",
    spareOption: "Verschonen",
    submitButton: "Bestätigen",
    submittedButton: "Abgestimmt (ändern)",
    progress: (s, t) => `Abgestimmt: ${s} / ${t}`,
    forceAdvanceButton: "Abstimmung schließen, ohne auf alle zu warten (Gastgeber-Aktion)",
  },
  allyNote: {
    title: "Notiz nur für Verbündete",
    placeholder: "Kurze Notiz, die nur eure Gruppe sieht (z. B. „Nummer 3 ins Visier nehmen“)",
    hint: "Tauscht euch unauffällig mit wenigen Worten aus. Das ist kein Chat, sondern eine gemeinsam sichtbare Notiz.",
    groupSize: (n) => `Geteilt mit ${n} ${n === 1 ? "Person" : "Personen"}`,
  },
  gameOver: {
    primary: {
      village: "Die Dorfbewohner haben gewonnen!",
      werewolf: "Die Werwölfe haben gewonnen!",
      draw: "Unentschieden",
    },
    extra: {
      fox: "Auch der Fuchs hat überlebt und gewinnt im Alleingang!",
      god: "Auch der Gott hat überlebt und gewinnt im Alleingang!",
      lover: "Auch die Verliebten haben zu zweit überlebt und gewonnen!",
    },
    allRoles: "Rollen aller Spieler",
    eliminated: "Ausgeschieden",
    newGameButton: "Noch einmal mit derselben Gruppe",
    waitingHost: "Warte darauf, dass der Gastgeber die nächste Runde startet…",
    leaveButton: "Verlassen",
    hostEndedTitle: "Der Gastgeber hat das Spiel beendet",
    hostEndedDesc: "Es gab keine Entscheidung – das Spiel wurde an dieser Stelle beendet.",
  },
  confirm: {
    advanceTitle: "Weitergehen?",
    advanceDesc: "Stelle sicher, dass alle bereit sind, bevor du fortfährst. Diese Aktion kann nicht rückgängig gemacht werden.",
    advanceAction: "Weiter",
    forceResolveTitle: "Wirklich erzwingen?",
    forceResolveDesc: "Wer noch nicht gehandelt oder abgestimmt hat, wird dabei übersprungen.",
    forceResolveAction: "Erzwingen",
    newGameTitle: "Neues Spiel mit derselben Gruppe starten?",
    newGameDesc: "Das aktuelle Ergebnis wird zurückgesetzt, und die Rollen werden neu verteilt.",
    newGameAction: "Neues Spiel starten",
    skipHunterRevengeTitle: "Möglichkeit des Mitnehmens überspringen?",
    skipHunterRevengeDesc: "Wird dies übersprungen, kann der Jäger niemanden mit in den Tod reißen.",
    skipHunterRevengeAction: "Überspringen",
    endGameTitle: "Spiel beenden?",
    endGameDesc: "Das laufende Spiel wird beendet, und die Rollen aller Spieler werden aufgedeckt. Diese Aktion kann nicht rückgängig gemacht werden.",
    endGameAction: "Beenden",
  },
  help: {
    button: "Spielregeln",
    title: "Spielregeln",
    tldr: "Kurz gesagt: Die Dorfbewohner versuchen, die verborgenen Werwölfe durch Diskussion aufzuspüren und per Abstimmung zu verbannen.",
    tabFlow: "Ablauf",
    tabWin: "Siegbedingungen",
    tabRoles: "Rollen",
    intro:
      "Werwolf DX ist ein psychologisches Spiel, bei dem die verdeckten „Werwölfe“ und die „Dorfbewohner“, die sie aufspüren wollen, gegeneinander antreten. „Tag“ (Diskussion und Abstimmung) und „Nacht“ (geheime Aktionen der einzelnen Rollen) wechseln sich ab, bis entweder alle Werwölfe verbannt sind oder die Werwölfe zahlenmäßig mit den übrigen Dorfbewohnern gleichgezogen haben. Rollenbestätigung, nächtliche Aktionen und Abstimmungen laufen alle über diesen Bildschirm. Es gibt keinen automatischen Timer – es geht erst weiter, wenn der Gastgeber es auslöst oder alle bereit sind, sodass ihr in eurem eigenen Tempo spielen könnt.",
    flowTitle: "Ablauf des Spiels",
    flowSteps: [
      { title: "Rollenbestätigung", desc: "Alle sehen sich heimlich ihre eigene Rolle an und tippen auf „Bestätigt“. Achtet darauf, dass niemand mitliest. Es geht erst weiter, wenn alle bestätigt haben." },
      { title: "Erste Gesprächsrunde", desc: "Direkt nach der Rollenbestätigung stellt ihr euch vor – noch ist niemand angegriffen worden. Es wird nicht abgestimmt. Nach einem kurzen Gespräch leitet der Gastgeber zur eigentlichen „Nacht“ über." },
      { title: "Nacht", desc: "Nur Rollen mit besonderen Fähigkeiten – Werwölfe, Seherin, Beschützer und weitere – handeln jetzt heimlich. Wer keine Fähigkeit hat, wartet einfach ab. Hier greifen die Werwölfe zum ersten Mal an (in den Einstellungen lässt sich der Angriff in der ersten Nacht auch deaktivieren)." },
      { title: "Morgen (Ergebnis)", desc: "Es wird bekannt gegeben, was in der Nacht geschehen ist – wer zum Opfer wurde." },
      { title: "Diskussion", desc: "Auf Grundlage des nächtlichen Geschehens überlegt ihr gemeinsam, wer ein Werwolf sein könnte. Es gibt kein Zeitlimit – diskutiert, bis ihr zufrieden seid." },
      { title: "Abstimmung", desc: "Jeder wählt eine Person, die verbannt werden soll. Wer die meisten Stimmen erhält, wird verbannt; bei Gleichstand gibt es eine Stichwahl. Sobald alle abgestimmt haben, geht es automatisch mit dem Ergebnis weiter." },
      { title: "Wiederholung", desc: "„Nacht → Morgen → Diskussion → Abstimmung“ wiederholt sich, bis eine Seite gewinnt." },
    ],
    diagramTitle: "Der Tag-Nacht-Zyklus im Überblick",
    diagramIntro:
      "Eine „Nacht“ und der darauffolgende Block aus „Morgen → Diskussion → Abstimmung“ zählen zusammen als ein und derselbe Tag. Auf „Nacht 1“ folgen also Morgen, Diskussion und Abstimmung von „Tag 1“.",
    diagramDayLabel: (day) => `Tag ${day}`,
    diagramSameDayNote: "🌙 Nacht und ☀️ Tag (Morgen, Diskussion, Abstimmung) mit derselben Nummer gehören zusammen.",
    diagramOutcomeLabel: "Entscheidung",
    diagramNoRoomNote: "Die tatsächlichen Einstellungen hängen vom jeweiligen Raum ab. Nach dem Beitritt findest du sie auch im Tab „Rollen & Einstellungen“.",
    diagramSettingsHeading: "Einstellungen dieses Raums",
    winTitle: "Siegbedingungen",
    winIntro: "Wie eine Fraktion gewinnt, ist unterschiedlich. Es können auch mehrere Fraktionen gleichzeitig gewinnen.",
    winVillage: "Dorfbewohner: Gewinnen, sobald alle Werwölfe verbannt wurden.",
    winWerewolf: "Werwölfe: Gewinnen, sobald ihre Anzahl mindestens der Anzahl der übrigen Überlebenden entspricht.",
    winFox: "Fuchs: Wer bis zum Spielende überlebt, gewinnt im Alleingang – unabhängig davon, ob das Dorf oder die Werwölfe gewinnen.",
    winGod: "Gott: Wer bis zum Spielende überlebt, gewinnt im Alleingang – unabhängig davon, ob das Dorf oder die Werwölfe gewinnen.",
    winLover: "Verliebte: Überleben am Ende beide, gewinnen sie gemeinsam.",
    rolesTitle: "Die 13 Rollen",
    rolesIntro: "Die Erklärung deiner eigenen Rolle findest du jederzeit während des Spiels über den Button „Meine Rolle“ oben im Bildschirm.",
    close: "Schließen",
  },
  myRole: {
    button: "Meine Rolle",
    title: "Deine Rolle",
    dayLabel: (day) => (day === 0 ? "Bei der Rollenbestätigung" : `Tag ${day}`),
    seerHistoryTitle: "Bisher geweissagte Personen",
    seerHistoryEmpty: "Du hast noch niemanden geweissagt.",
    mediumHistoryTitle: "Bisher überprüfte Personen",
    mediumHistoryEmpty: "Du hast noch niemanden überprüft.",
    noRoleYet: "Deine Rolle wurde noch nicht bestätigt.",
    close: "Schließen",
  },
  team: {
    village: "Dorfbewohner-Fraktion",
    werewolf: "Werwölfe",
    fox: "Fuchs (Solofraktion)",
    god: "Gott (Solofraktion)",
    lover: "Verliebte (Solofraktion)",
  },
  deathCause: {
    attack: "Von den Werwölfen angegriffen",
    execution: "Verbannt",
    curse: "Von der Seherin durchschaut und verflucht gestorben",
    hunter: "Vom Jäger mit in den Tod gerissen",
    lover_grief: "Aus Liebeskummer gestorben",
  },
  roles: {
    villager: {
      name: "Dorfbewohner",
      short: "Dorfbewohner ohne besondere Fähigkeiten",
      detail: "Du bist Dorfbewohner. Du hast keine besonderen Fähigkeiten. Wenn dir jemand verdächtig vorkommt, teile deine Gründe offen mit den anderen und hilf mit, gemeinsam die Wahrheit herauszufinden.",
    },
    seer: {
      name: "Seherin",
      short: "Weissagt jede Nacht eine Person und erfährt, ob sie ein Werwolf ist",
      detail:
        "Du bist die Seherin. Jede Nacht kannst du eine Person weissagen. Ist die geweissagte Person ein „Werwolf“, erfährst du Schwarz, andernfalls Weiß. Dieses Ergebnis sieht sonst niemand – wie du es der Gruppe mitteilst, liegt ganz bei dir. Weissagst du den Fuchs, wird dieser noch in derselben Nacht verflucht und stirbt.",
    },
    bodyguard: {
      name: "Beschützer",
      short: "Beschützt jede Nacht eine Person vor dem Angriff der Werwölfe",
      detail:
        "Du bist der Beschützer. Jede Nacht wählst du eine andere Person aus, die du vor dem Angriff der Werwölfe beschützt. War die beschützte Person das Angriffsziel der Nacht, überlebt sie. Du kannst nicht zwei Nächte hintereinander dieselbe Person beschützen.",
    },
    medium: {
      name: "Medium",
      short: "Erfährt, ob eine verbannte Person ein Werwolf war",
      detail: "Du bist das Medium. Du erfährst noch in derselben Nacht, ob die tagsüber verbannte Person ein „Werwolf“ war. In der ersten Nacht, in der noch niemand verbannt wurde, gibt es niemanden zu überprüfen.",
    },
    hunter: {
      name: "Jäger",
      short: "Kann beim eigenen Tod eine Person mit in den Tod reißen",
      detail:
        "Du bist der Jäger. Wirst du „verbannt“ oder stirbst du durch den „Angriff der Werwölfe“, kannst du eine Person bestimmen, die du mit in den Tod reißt (du musst niemanden wählen). Du musst deine Rolle dabei nicht offenlegen.",
    },
    mason: {
      name: "Freimaurer",
      short: "Zwei oder mehr Dorfbewohner, die sich gegenseitig kennen",
      detail: "Du bist Freimaurer. Du weißt, wer die anderen Freimaurer sind. Ihr habt keine besonderen Fähigkeiten, aber ihr könnt einander zu hundert Prozent vertrauen – ein wertvoller Vorteil. Überlegt euch gut, wann ihr euch zu erkennen gebt, damit die Werwölfe nicht misstrauisch werden.",
    },
    dictator: {
      name: "Diktator",
      short: "Kann die Diskussion einmal pro Spiel abbrechen und im Alleingang verbannen",
      detail:
        "Du bist der Diktator. Einmal im Spiel kannst du während der Tagesdiskussion deine Identität offenlegen, die Diskussion sofort beenden und ohne Abstimmung im Alleingang bestimmen, wer verbannt wird. Eine mächtige Fähigkeit – wähle den richtigen Moment mit Bedacht.",
    },
    werewolf: {
      name: "Werwolf",
      short: "Greift jede Nacht eine Person an. Kennt die anderen Werwölfe",
      detail:
        "Du bist Werwolf. Du weißt, wer die anderen Werwölfe sind. Sprich dich jede Nacht mit ihnen ab und greift gemeinsam eine Person an. Gib dich in der Diskussion als Dorfbewohner aus und halte deine wahre Identität geheim – ihr gewinnt, sobald die Werwölfe zahlenmäßig mit den Dorfbewohnern gleichziehen.",
    },
    traitor: {
      name: "Verräter",
      short: "Gehört zu den Werwölfen, kennt sie aber nicht",
      detail:
        "Du bist der Verräter. Gewinnen die Werwölfe, gewinnst auch du – doch du erfährst nicht, wer sie sind. Weissagung und Medium zeigen bei dir Weiß (kein Werwolf), wodurch du kaum verdächtigt wirst. Tu so, als würdest du nach den Werwölfen suchen, und lenke die Diskussion dabei unauffällig zu ihren Gunsten (anders als der Kollaborateur kennst du selbst die Werwölfe nicht).",
    },
    insider: {
      name: "Kollaborateur",
      short: "Kennt die Werwölfe und arbeitet heimlich mit ihnen zusammen",
      detail:
        "Du bist der Kollaborateur. Du weißt, wer die Werwölfe sind. Weissagung und Medium zeigen bei dir Weiß (kein Werwolf), weshalb du unter allen Verbündeten der Werwölfe am wenigsten verdächtig wirkst. Offene Verteidigung der Werwölfe würde auffallen – gib dich als Dorfbewohner aus und hilf ihnen nur unauffällig (anders als der Verräter kennst du die Werwölfe).",
    },
    fox: {
      name: "Fuchs",
      short: "Solofraktion, die den Angriff der Werwölfe übersteht, aber durch Weissagung stirbt",
      detail:
        "Du bist der Fuchs. Du gehörst weder zum Dorf noch zu den Werwölfen und überstehst deren Angriff unbeschadet. Wirst du jedoch von der Seherin weissagt, stirbst du noch in derselben Nacht an einem Fluch. Ob das Dorf oder die Werwölfe gewinnen, spielt keine Rolle – überlebst du bis zum Spielende, hast du gewonnen.",
    },
    god: {
      name: "Gott",
      short: "Solofraktion, die von Anfang an alle Rollen kennt. Gewinnt durch Überleben",
      detail:
        "Du bist der Gott. Von Spielbeginn an kennst du die Rollen aller Spieler. Weissagung und Medium zeigen bei dir Weiß. Ob das Dorf oder die Werwölfe gewinnen, spielt für dich keine Rolle – überlebst du bis zum Spielende, hast du gewonnen.",
    },
    lover: {
      name: "Verliebte",
      short: "Ein Paar zu zweit. Stirbt eine Person, stirbt auch die andere",
      detail:
        "Du gehörst zu den Verliebten. Du weißt, wer die andere verliebte Person ist. Stirbt eine von euch beiden durch Verbannung oder Angriff, folgt die andere Person kurz darauf in den Tod. Überlebt ihr beide bis zum Spielende, gewinnt ihr gemeinsam.",
    },
  },
  errors: {
    ROOM_NOT_FOUND: "Der Raum wurde nicht gefunden. Überprüfe den Raumcode.",
    GAME_ALREADY_STARTED: "Das Spiel hat bereits begonnen, ein Beitritt ist nicht mehr möglich.",
    ROOM_FULL: "Die maximale Teilnehmerzahl ist bereits erreicht.",
    REJOIN_FAILED: "Die erneute Verbindung ist fehlgeschlagen.",
    PLAYER_NOT_FOUND: "Spielerinformationen wurden nicht gefunden.",
    NOT_HOST: "Diese Aktion ist nur dem Gastgeber vorbehalten.",
    ALREADY_STARTED: "Das Spiel läuft bereits.",
    NOT_IN_ROOM: "Du bist keinem Raum beigetreten.",
    MIN_PLAYERS: "Es sind nicht genügend Spieler vorhanden.",
    KICKED: "Du wurdest vom Gastgeber aus dem Raum entfernt.",
    INVALID_ROOM_CODE: "Der Raumcode muss aus 5–8 Buchstaben oder Zahlen bestehen.",
    ROOM_CODE_TAKEN: "Dieser Raumcode wird bereits verwendet. Bitte wähle einen anderen.",
  },
  validation: (issue) => {
    switch (issue.code) {
      case "SEAT_MISMATCH":
        return `Die Gesamtzahl der Rollen (${issue.total}) stimmt nicht mit der Teilnehmerzahl (${issue.playerCount}) überein.`;
      case "NO_WEREWOLF":
        return "Es wird mindestens ein Werwolf benötigt.";
      case "MASON_ODD":
        return "Freimaurer müssen paarweise (in 2er-Gruppen) festgelegt werden.";
      case "LOVER_INVALID":
        return "Verliebte müssen paarweise (in 2er-Gruppen) festgelegt werden.";
      case "WOLF_TOO_MANY":
        return "Es gibt zu viele Werwölfe. Das Dorf wäre von Anfang an benachteiligt.";
    }
  },
};

const pt: Strings = {
  meta: {
    title: "Lobisomem DX Online",
    description: "Um jogo de conversa e dedução para descobrir o lobisomem escondido, com suporte a 13 papéis. Jogue com os amigos reunidos, cada um com o celular na mão.",
  },
  common: {
    host: "Anfitrião",
    connected: "Conectado",
    disconnected: "Desconectado",
    reconnecting: "Reconectando…",
    connecting: "Conectando…",
    kicked: "Você foi removido da sala pelo anfitrião.",
    seconds: (n) => `${n} segundos`,
    timeRemaining: "Tempo restante",
    close: "Fechar",
    cancel: "Cancelar",
    people: (n) => `${n} pessoas`,
    listSeparator: ", ",
    confirmProceed: "Continuar",
    transitioning: "Avançando para a próxima etapa…",
    on: "ON",
    off: "OFF",
    themeToggleToLight: "Mudar para o modo claro",
    themeToggleToDark: "Mudar para o modo escuro",
    menu: "Menu",
    themeLabel: "Tema",
    languageLabel: "Idioma",
    endGameButton: "Encerrar partida",
    officialRuleBadge: "Regra oficial",
    optionalRuleBadge: "Regra opcional",
  },
  entry: {
    title: "Lobisomem DX Online",
    subtitle: "Um jogo de conversa e dedução para descobrir o lobisomem escondido, com suporte a 13 papéis. Jogue de onde estiver, com o celular na mão.",
    cardTitle: "Começar",
    cardDesc: "Crie uma sala ou entre usando o código.",
    tabCreate: "Criar sala",
    tabJoin: "Entrar na sala",
    nameLabel: "Apelido",
    namePlaceholder: "ex: João",
    createButton: "Criar sala",
    codeLabel: "Código da sala",
    codePlaceholder: "ex: AB3XZ",
    joinButton: "Entrar",
    footerNote: "* Este aplicativo não tem função de chat. Converse com o grupo enquanto joga.",
    helpButton: "Ver como jogar e as regras",
    customCodeLabel: "Código da sala (opcional)",
    customCodePlaceholder: "Deixe em branco para gerar automaticamente",
    customCodeHint: "5 a 8 caracteres alfanuméricos. Se não informar, um código será gerado automaticamente.",
    avatarLabel: "Foto de perfil (opcional)",
    avatarAddButton: "Adicionar foto",
    avatarChangeButton: "Trocar foto",
    avatarRemoveButton: "Remover foto",
    avatarTooLarge: "A imagem é grande demais (máx. 8MB)",
    avatarUnsupported: "Selecione um arquivo de imagem",
    castLabel: "Os 13 papéis do jogo",
  },
  profile: {
    editButton: "Editar perfil",
    title: "Editar perfil",
    desc: "Você pode alterar seu nome de exibição e foto de perfil a qualquer momento.",
    nameLabel: "Apelido",
    avatarLabel: "Foto de perfil",
    saveButton: "Salvar",
    savedToast: "Perfil atualizado",
    closeButton: "Fechar",
  },
  lobby: {
    codeLabel: "Código da sala",
    copyCode: "Copiar código",
    copyLink: "Copiar link de convite",
    shareLink: "Enviar link de convite",
    shareMessage: (code) => `Você foi convidado para uma sala do Lobisomem DX Online. Código da sala: ${code}`,
    copyCodeToast: "Código copiado",
    copyLinkToast: "Link de convite copiado",
    copyErrorToast: "Falha ao copiar",
    participants: (n) => `Participantes (${n})`,
    waitingForMorePlayers: (n) => `Faltam mais ${n} pessoa(s) para o jogo poder começar`,
    composition: "Composição de papéis",
    compositionReadonly: "Composição de papéis (o anfitrião está configurando)",
    compositionReadonlyDesc: (wolves, total) => `Foram configurados papéis para um total de ${total} pessoas, incluindo ${wolves} lobisomem(ns).`,
    compositionEmpty: "Os papéis ainda não foram configurados.",
    roomInfoButton: "Papéis e configurações",
    roomInfoTitle: "Papéis e configurações desta partida",
    suggest: "Sugestão de composição",
    seatTotal: "Total de papéis",
    seatTotalOf: (total, count) => `${total} / ${count} pessoas`,
    soloGroupLabel: "Facção solo",
    startButton: "Iniciar partida",
    waitingHost: "Aguardando o anfitrião iniciar…",
    leaveButton: "Sair",
    settingsTitle: "Configurações da partida",
    officialRulesSectionTitle: "Regras básicas",
    extraRulesSectionTitle: "Regras extras",
    extraRulesSectionDesc: "Tudo a partir daqui são regras extras exclusivas deste aplicativo. Elas não existem nas regras básicas, então sinta-se à vontade para personalizá-las como preferir.",
    revealOnDeath: "Revelar o papel ao morrer",
    allowFirstNightKill: "Na primeira noite, os lobisomens podem atacar",
    allowFirstNightKillDesc: "Se desativado, ninguém morre por ataque dos lobisomens apenas na primeira noite (noite do dia 1). A partir da noite do dia 2, o ataque volta a valer normalmente. Recomendado para grupos com muitos jogadores de primeira viagem.",
    allowFirstVoteExecution: "A primeira votação pode expulsar alguém de verdade",
    allowFirstVoteExecutionDesc: "Se desativado, quem for mais votado na primeira votação (votação do dia 1) não é realmente expulso e continua no jogo. A partir da votação do dia 2, a expulsão volta a valer normalmente.",
    allowWolfFriendlyFire: "Lobisomens podem escolher outro lobisomem como alvo do ataque",
    allowWolfFriendlyFireDesc: "Se ativado, os lobisomens podem escolher outro lobisomem como alvo do ataque (normalmente isso não é permitido).",
    seerFirstNightDivine: "O vidente pode fazer uma vidência já na confirmação de papel",
    seerFirstNightDivineDesc: "Permite que o vidente escolha livremente uma pessoa para investigar já no momento da confirmação de papel (recomendado para partidas com 7 ou mais jogadores). O vidente decide livremente se quer ou não fazer essa vidência. Se desativado, a primeira vidência só acontece na primeira noite.",
    allowSelfVote: "É permitido votar em si mesmo",
    revealVoteChoices: "Mostrar os votos para todos",
    revealVoteChoicesDesc: "Se ativado, durante a votação todos podem ver em tempo real quem está votando em quem. Se desativado, como de costume, só a contagem de votos é mostrada.",
    allowBodyguardSelfGuard: "O protetor pode proteger a si mesmo",
    secondTieExecutesRandomly: "Se a votação de desempate também empatar, expulsar alguém aleatoriamente",
    secondTieExecutesRandomlyDesc: "Se desativado, quando a votação de desempate também não decidir um resultado, ninguém é expulso naquele dia.",
    dictatorCanTargetSelf: "O ditador pode escolher a si mesmo como alvo da expulsão",
    settingsPacingNote: "Este aplicativo não tem temporizador automático. Cada tela avança pela ação do anfitrião ou quando todos concluem sua ação. Jogue no ritmo do seu grupo.",
    kick: "Remover",
    makeHost: "Tornar anfitrião",
    makeHostConfirmTitle: "Trocar de anfitrião?",
    makeHostConfirmDesc: (name) => `${name} se tornará o novo anfitrião. Você perderá os privilégios de anfitrião e não poderá mais controlar o andamento da partida.`,
    makeHostConfirmAction: "Trocar",
  },
  roleReveal: {
    label: "Seu papel",
    tapToReveal: "Toque para revelar",
    privacyHint: "Confira sem deixar que outras pessoas vejam",
    allies: "Seus aliados",
    allRoles: "Papéis de todos os jogadores",
    waitingOthers: "Confirmado. Assim que todos confirmarem, o jogo avançará automaticamente para a primeira discussão.",
    confirmButton: "Confirmado",
    progress: (s, t) => `Confirmados: ${s} / ${t}`,
    earlyDivineTitle: "Usar o poder do vidente agora (opcional)",
    earlyDivineDesc: "Você pode investigar uma pessoa já no momento da confirmação de papel. Também pode continuar sem usar esse poder.",
    earlyDivineButton: "Investigar esta pessoa",
    earlyDivineSkipNote: "Você também pode avançar sem investigar, tocando em “Confirmado”.",
    earlyDivineDone: "Vidência já realizada. O resultado está abaixo.",
  },
  night: {
    tag: (day) => `Noite - Dia ${day}`,
    deadNotice: "Você já foi eliminado. Observe em silêncio o amanhecer…",
    dormant: "A noite avança…",
    dormantDesc: "Aguarde até que quem tem poderes especiais termine suas ações.",
    progress: (s, t) => `Ações concluídas: ${s} / ${t}`,
    submitButton: "Confirmar",
    resubmitButton: "Enviado (alterar)",
    previousSeerResult: (day) =>
      day === 0 ? "Resultado anterior da vidência (na confirmação de papel)" : `Resultado anterior da vidência (Dia ${day})`,
    seerResultLine: (name, isBlack) => `${name} era ${isBlack ? "【preto (lobisomem)】" : "【branco】"}`,
    actions: {
      attack: { title: "Quem você vai atacar?", desc: "Combine com os outros lobisomens e escolham juntos a vítima desta noite.", skip: "Não atacar esta noite" },
      guard: { title: "Quem você vai proteger?", desc: "Escolha quem proteger do ataque dos lobisomens. Você não pode se proteger. Além disso, não é possível escolher quem você protegeu na noite anterior.", skip: "Não proteger ninguém esta noite" },
      divine: { title: "Quem você vai investigar?", desc: "Você vai descobrir se esta pessoa é um lobisomem.", skip: "Não investigar esta noite" },
    },
    firstNightKillDisabledNotice: "De acordo com a configuração da sala, ninguém morre por ataque na primeira noite (dia 1). A partir da noite do dia 2, o efeito volta ao normal.",
    forceAdvanceButton: "Avançar sem esperar todos (ação do anfitrião)",
    wolfSelectionsTitle: "Quem os outros lobisomens estão escolhendo (para combinar)",
    wolfSelectionsEmpty: "Ninguém escolheu ainda",
    wolfSelectionsLine: (name, targetName) => `${name}: ${targetName ?? "Ainda não escolheu"}`,
    wolfConsensusNeeded: "A noite só termina quando todos os lobisomens escolherem o mesmo alvo (ou todos escolherem “não atacar”). Conversem até chegar a um acordo.",
    wolfConsensusReached: "Todos chegaram a um acordo.",
  },
  hunterRevenge: {
    title: "A verdadeira identidade do caçador foi revelada!",
    waitingFor: (name) => `${name} está escolhendo quem levar consigo…`,
    youAre: "Você é o caçador. Pode escolher uma pessoa para levar consigo (não é obrigado a escolher ninguém).",
    skip: "Não levar ninguém",
    submit: "Confirmar",
    submitted: "Enviado",
    hostSkipButton: "Definir “ninguém” no lugar do caçador (ação do anfitrião)",
  },
  dayResult: {
    tag: (day) => `Manhã - Dia ${day}`,
    noDeaths: "Ninguém foi vitimado esta noite. Uma manhã tranquila.",
    seerResult: "Resultado da vidência",
    continueButton: "Ir para a discussão",
    waitingHost: "Aguardando o anfitrião avançar para a discussão…",
  },
  discussion: {
    tag: (day) => `Discussão - Dia ${day}`,
    firstRoundTag: "Primeira discussão",
    firstRoundNotice: "Esta é a primeira discussão, logo após a confirmação de papéis. Ainda ninguém foi atacado, e aqui não há votação de expulsão. Conversem livremente e, quando o anfitrião avançar, a verdadeira “noite” começa.",
    proceedToNightButton: "Encerrar a discussão e ir para a noite",
    survivors: "Sobreviventes",
    dictatorButton: "Usar o poder do ditador",
    dictatorConfirmTitle: "Usar o poder do ditador?",
    dictatorConfirmDesc: "A discussão será encerrada imediatamente e você decidirá sozinho, sem votação, quem será expulso. Esse poder só pode ser usado uma vez por partida.",
    dictatorConfirmAction: "Expulsar esta pessoa",
    skipButton: "Encerrar a discussão e ir para a votação",
    waitingHost: "Aguardando o anfitrião avançar. Não há limite de tempo, então conversem até chegar a uma conclusão.",
    runoffNotice: "A votação empatou, então esta é a discussão antes do desempate. Se ainda assim não houver decisão, o resultado será sorteado.",
    runoffCandidatesLabel: "Candidatos ao desempate",
  },
  vote: {
    tag: (day) => `Votação - Dia ${day}`,
    runoffTag: (day) => `Votação de desempate - Dia ${day}`,
    cannotVote: "Você não pode votar. Acompanhe o resultado.",
    instructions: "Escolha uma pessoa para expulsar",
    runoffNotice: "Houve empate, então esta votação de desempate é restrita aos candidatos empatados. Se ainda assim não houver decisão, o resultado será sorteado.",
    submitButton: "Votar",
    submittedButton: "Votado (alterar)",
    progress: (s, t) => `Votos: ${s} / ${t}`,
    forceAdvanceButton: "Encerrar sem esperar todos os votos (ação do anfitrião)",
    voteChoicesTitle: "Votos em andamento (visíveis a todos, pois a exibição está ativada)",
    voteChoicesLine: (voter, target) => `${voter} → ${target}`,
  },
  executionResult: {
    tag: (day) => `Resultado da expulsão - Dia ${day}`,
    executed: (name) => `${name} foi expulso(a)`,
    spared: (name) => `Com o resultado do desempate, ${name} foi poupado(a)`,
    sparedFirstVoteRule: (name) =>
      `Pela configuração “a primeira votação não expulsa de verdade”, ${name} foi poupado(a) sem votação de desempate`,
    noExecution: "Com o resultado da votação, ninguém foi expulso.",
    mediumResult: "Resultado do médium",
    mediumResultLine: (name, isBlack) => `${name} era ${isBlack ? "【preto (lobisomem)】" : "【branco】"}`,
    continueButton: "Ir para a próxima noite",
    waitingHost: "Aguardando o anfitrião avançar para a próxima noite…",
  },
  lastWords: {
    tag: (day) => `Últimas palavras - Dia ${day}`,
    title: "A votação decidiu uma expulsão",
    waitingFor: (name) => `Vamos ouvir as últimas palavras de ${name}`,
    youAreTitle: "Você foi escolhido(a) para ser expulso(a)",
    youAreDesc: "Se tiver algo a dizer antes de partir, fale para o grupo. Quando terminar, toque no botão abaixo para continuar.",
    proceedButton: "Terminei de falar (ir para o desempate)",
    waitingHost: "Aguardando você mesmo(a) ou o anfitrião avançar…",
  },
  appealVote: {
    tag: (day) => `Desempate final - Dia ${day}`,
    instructions: (name) => `Vocês querem realmente expulsar ${name}, ou poupá-lo(a)?`,
    cannotVote: "Você não pode participar deste desempate (por ser o alvo da expulsão). Acompanhe o resultado.",
    executeOption: "Expulsar",
    spareOption: "Poupar",
    submitButton: "Confirmar",
    submittedButton: "Votado (alterar)",
    progress: (s, t) => `Votos: ${s} / ${t}`,
    forceAdvanceButton: "Encerrar sem esperar todos os votos (ação do anfitrião)",
  },
  allyNote: {
    title: "Bilhete só entre aliados",
    placeholder: "Um bilhete curto que só seus aliados verão (ex: mirar no jogador 3)",
    hint: "Combinem em poucas palavras, sem chamar atenção dos outros. Isso é compartilhado como um único bilhete, não como um chat.",
    groupSize: (n) => `Compartilhado entre ${n} pessoas`,
  },
  gameOver: {
    primary: {
      village: "Vitória dos aldeões!",
      werewolf: "Vitória dos lobisomens!",
      draw: "Empate",
    },
    extra: {
      fox: "A raposa também sobreviveu e venceu sozinha!",
      god: "O Deus também sobreviveu e venceu sozinho!",
      lover: "Os dois apaixonados sobreviveram e venceram juntos!",
    },
    allRoles: "Papéis de todos",
    eliminated: "Eliminado(a)",
    newGameButton: "Jogar de novo com o mesmo grupo",
    waitingHost: "Aguardando o anfitrião iniciar a próxima partida…",
    leaveButton: "Sair",
    hostEndedTitle: "O anfitrião encerrou a partida",
    hostEndedDesc: "A partida terminou aqui, sem um vencedor definido.",
  },
  confirm: {
    advanceTitle: "Avançar para a próxima etapa?",
    advanceDesc: "Confirme que todos estão prontos antes de continuar. Esta ação não pode ser desfeita.",
    advanceAction: "Avançar",
    forceResolveTitle: "Avançar à força?",
    forceResolveDesc: "Quem ainda não agiu ou não votou terá sua ação ignorada.",
    forceResolveAction: "Avançar à força",
    newGameTitle: "Começar uma nova partida com o mesmo grupo?",
    newGameDesc: "O resultado atual será apagado e os papéis serão redistribuídos.",
    newGameAction: "Começar nova partida",
    skipHunterRevengeTitle: "Pular a chance do caçador?",
    skipHunterRevengeDesc: "Se você pular, o caçador não poderá levar ninguém consigo.",
    skipHunterRevengeAction: "Pular",
    endGameTitle: "Encerrar a partida?",
    endGameDesc: "A partida atual terminará agora e os papéis de todos serão revelados. Esta ação não pode ser desfeita.",
    endGameAction: "Encerrar",
  },
  help: {
    button: "Como jogar",
    title: "Como jogar e regras",
    tldr: "Resumindo: os aldeões tentam descobrir, por meio da conversa, quem são os “lobisomens” escondidos entre eles, e os expulsam por votação.",
    tabFlow: "Fluxo",
    tabWin: "Condições de vitória",
    tabRoles: "Papéis",
    intro:
      "Lobisomem DX é um jogo de dedução no qual os jogadores se dividem entre os “lobisomens”, que escondem sua identidade, e os “aldeões”, que tentam descobri-la. O jogo alterna entre o “dia” (discussão e votação) e a “noite” (ações secretas de cada papel), e termina quando os aldeões expulsam todos os lobisomens, ou quando o número de lobisomens se iguala ao de não lobisomens. A confirmação de papel, as ações noturnas e a votação acontecem todas nesta tela. Não há temporizador automático, então o jogo avança no ritmo de vocês, seja pela ação do anfitrião ou quando todos concluem sua parte.",
    flowTitle: "Fluxo da partida",
    flowSteps: [
      { title: "Confirmação de papel", desc: "Cada jogador confere seu próprio papel em segredo e toca em “Confirmado”. Tome cuidado para que ninguém mais veja sua tela. O jogo só avança quando todos tiverem confirmado." },
      { title: "Primeira discussão", desc: "Logo após a confirmação de papéis, é hora de uma rodada de apresentações, quando ainda ninguém foi atacado. Não há votação. Depois de conversar um pouco, o anfitrião avança para a verdadeira “noite”." },
      { title: "Noite", desc: "Só os papéis com poderes especiais — lobisomem, vidente, protetor e outros — agem, em segredo. Quem não tem poder especial só precisa esperar. É aqui que o primeiro ataque dos lobisomens pode acontecer (há uma configuração para desativar o ataque só na primeira noite)." },
      { title: "Manhã (resultado)", desc: "É revelado o que aconteceu durante a noite (quem foi vitimado, se houver)." },
      { title: "Discussão", desc: "Com base no resultado da noite, todos conversam e deduzem quem pode ser lobisomem. Não há limite de tempo, então discutam até ficarem satisfeitos." },
      { title: "Votação", desc: "Cada jogador escolhe uma pessoa para expulsar. Quem tiver mais votos é expulso; em caso de empate, há um desempate. Quando todos votarem, o resultado é revelado automaticamente." },
      { title: "Repetição", desc: "O ciclo “noite → manhã → discussão → votação” se repete até que uma das facções vença." },
    ],
    diagramTitle: "O ciclo de noites e dias em um diagrama",
    diagramIntro:
      "A “noite” e o “manhã → discussão → votação” que vem logo depois formam um conjunto contado como o mesmo dia. Por exemplo, a manhã, a discussão e a votação que vêm depois da “noite 1” são todas do “dia 1”.",
    diagramDayLabel: (day) => `Dia ${day}`,
    diagramSameDayNote: "🌙 Noite e ☀️ Dia (manhã, discussão e votação) com o mesmo número formam um único bloco.",
    diagramOutcomeLabel: "Desfecho",
    diagramNoRoomNote: "As configurações reais variam de acordo com a sala em que você está. Depois de entrar em uma sala, você também pode conferi-las na aba “Papéis e configurações”.",
    diagramSettingsHeading: "Configurações desta sala",
    winTitle: "Condições de vitória",
    winIntro: "Cada facção tem sua própria forma de vencer. É possível que mais de uma facção vença ao mesmo tempo.",
    winVillage: "Aldeões: vencem quando todos os lobisomens forem expulsos.",
    winWerewolf: "Lobisomens: vencem quando o número de lobisomens for igual ou maior que o de sobreviventes que não são lobisomens.",
    winFox: "Raposa: se sobreviver até o fim da partida, vence sozinha, não importa se os aldeões ou os lobisomens venceram.",
    winGod: "Deus: se sobreviver até o fim da partida, vence sozinho, não importa se os aldeões ou os lobisomens venceram.",
    winLover: "Apaixonados: se os dois estiverem vivos ao fim da partida, vencem juntos.",
    rolesTitle: "Lista de papéis (13 tipos)",
    rolesIntro: "A explicação do seu próprio papel pode ser conferida a qualquer momento durante a partida, pelo botão “Meu papel” no topo da tela.",
    close: "Fechar",
  },
  myRole: {
    button: "Meu papel",
    title: "Seu papel",
    dayLabel: (day) => (day === 0 ? "Na confirmação de papel" : `Dia ${day}`),
    seerHistoryTitle: "Pessoas investigadas até agora",
    seerHistoryEmpty: "Você ainda não investigou ninguém.",
    mediumHistoryTitle: "Pessoas avaliadas até agora",
    mediumHistoryEmpty: "Você ainda não avaliou ninguém.",
    noRoleYet: "O papel ainda não foi confirmado.",
    close: "Fechar",
  },
  team: {
    village: "Aldeões",
    werewolf: "Lobisomens",
    fox: "Raposa (facção solo)",
    god: "Deus (facção solo)",
    lover: "Apaixonados (facção solo)",
  },
  deathCause: {
    attack: "Atacado(a) pelos lobisomens",
    execution: "Expulso(a) por votação",
    curse: "Amaldiçoado(a) e morto(a) após ser investigado(a) pelo vidente",
    hunter: "Levado(a) pelo caçador",
    lover_grief: "Morreu ao lado do(a) apaixonado(a)",
  },
  roles: {
    villager: {
      name: "Aldeão",
      short: "Morador sem nenhum poder especial",
      detail: "Você é um aldeão. Não tem nenhum poder especial. Se desconfiar de alguém, compartilhe o motivo com o grupo durante a discussão e ajude a avançar a dedução.",
    },
    seer: {
      name: "Vidente",
      short: "Investiga uma pessoa por noite para saber se é lobisomem",
      detail:
        "Você é o vidente. Toda noite, pode investigar uma pessoa. Se ela for um “lobisomem”, o resultado é preto; caso contrário, é branco. Esse resultado só aparece para você, então cabe a você decidir como (e se) vai compartilhá-lo na discussão. Atenção: se você investigar a raposa, ela morrerá amaldiçoada ainda naquela noite.",
    },
    bodyguard: {
      name: "Protetor",
      short: "Protege uma pessoa por noite do ataque dos lobisomens",
      detail:
        "Você é o protetor. Toda noite, escolhe uma pessoa (além de você mesmo) para proteger do ataque dos lobisomens. Se a pessoa protegida for o alvo do ataque daquela noite, ela sobrevive. Você não pode proteger a mesma pessoa em duas noites seguidas.",
    },
    medium: {
      name: "Médium",
      short: "Descobre se quem foi expulso era lobisomem",
      detail: "Você é o médium. Na noite seguinte à expulsão de alguém, você descobre se essa pessoa era um “lobisomem”. Na noite do dia 1, como ainda ninguém foi expulso, não há ninguém para avaliar.",
    },
    hunter: {
      name: "Caçador",
      short: "Ao morrer, pode levar alguém junto",
      detail:
        "Você é o caçador. Se for “expulso” por votação ou morrer atacado por “lobisomens”, pode escolher uma pessoa para levar junto com você para a morte (não é obrigado a escolher ninguém). Você não precisa revelar seu papel.",
    },
    mason: {
      name: "Maçom",
      short: "Aldeão que conhece outros maçons entre si",
      detail: "Você é um maçom. Você sabe quem são os outros maçons. Não tem nenhum outro poder especial, mas vocês formam um grupo de aliados em quem podem confiar 100%. Escolha com cuidado o momento de revelar quem vocês são, para não levantar suspeitas dos lobisomens.",
    },
    dictator: {
      name: "Ditador",
      short: "Uma vez por partida, pode encerrar a discussão e decidir sozinho quem é expulso",
      detail:
        "Você é o ditador. Uma única vez durante a partida, pode se revelar no meio da discussão do dia, encerrá-la imediatamente e decidir sozinho, sem votação, quem será expulso. É um poder muito forte, então escolha com cuidado o momento certo de usá-lo.",
    },
    werewolf: {
      name: "Lobisomem",
      short: "Ataca uma pessoa por noite. Conhece os outros lobisomens",
      detail:
        "Você é um lobisomem. Sabe quem são os outros lobisomens. Toda noite, combine com eles e escolham juntos uma pessoa para atacar. Na discussão, finja ser um aldeão e mantenha sua identidade em segredo. Vocês vencem quando o número de lobisomens se igualar ao de aldeões restantes.",
    },
    traitor: {
      name: "Traidor",
      short: "Está do lado dos lobisomens, mas não sabe quem eles são",
      detail:
        "Você é o traidor. Se os lobisomens vencerem, você também vence, mas não sabe quem são os lobisomens. Tanto na vidência quanto no médium, você é avaliado como “branco” (não lobisomem), o que torna difícil desconfiarem de você. Finja estar caçando lobisomens enquanto, discretamente, age a favor deles (diferente do cúmplice, você não sabe quem são os lobisomens).",
    },
    insider: {
      name: "Cúmplice",
      short: "Colaborador dos lobisomens que sabe quem eles são",
      detail:
        "Você é o cúmplice. Sabe quem são os lobisomens. Tanto na vidência quanto no médium, você é avaliado como “branco” (não lobisomem), o que faz de você a peça mais difícil de desconfiar dentro do time dos lobisomens. Defender os lobisomens abertamente levanta suspeita, então ajude-os discretamente, fingindo ser um aldeão comum (diferente do traidor, você sabe quem são os lobisomens).",
    },
    fox: {
      name: "Raposa",
      short: "Facção solo imune ao ataque dos lobisomens, mas morre se investigada",
      detail:
        "Você é a raposa. Não pertence nem aos aldeões nem aos lobisomens: é uma facção solo, imune ao ataque dos lobisomens. Porém, se o vidente investigar você, morrerá amaldiçoada ainda naquela noite. Não importa se os aldeões ou os lobisomens vencerem: se você sobreviver até o fim da partida, você vence.",
    },
    god: {
      name: "Deus",
      short: "Facção solo que conhece o papel de todos. Vence se sobreviver",
      detail:
        "Você é o Deus. Desde o início da partida, você conhece o papel de todos os jogadores. Na vidência e no médium, você é avaliado como “branco”. Não importa quem vença entre aldeões e lobisomens: se você sobreviver até o fim da partida, você vence.",
    },
    lover: {
      name: "Apaixonado",
      short: "Um par secreto. Se um morre, o outro morre também",
      detail:
        "Você é um apaixonado. Você sabe quem é a outra pessoa apaixonada por você. Se um dos dois morrer, seja por expulsão ou por ataque, o outro morre logo em seguida, de tristeza. Se os dois sobreviverem até o fim da partida, vencem juntos.",
    },
  },
  errors: {
    ROOM_NOT_FOUND: "Sala não encontrada. Verifique o código.",
    GAME_ALREADY_STARTED: "Não é possível entrar porque a partida já começou.",
    ROOM_FULL: "O número máximo de participantes foi atingido.",
    REJOIN_FAILED: "Falha ao reconectar.",
    PLAYER_NOT_FOUND: "Informações do jogador não encontradas.",
    NOT_HOST: "Somente o anfitrião pode realizar esta ação.",
    ALREADY_STARTED: "A partida já foi iniciada.",
    NOT_IN_ROOM: "Você não está em nenhuma sala.",
    MIN_PLAYERS: "Não há jogadores suficientes.",
    KICKED: "Você foi removido da sala pelo anfitrião.",
    INVALID_ROOM_CODE: "O código da sala deve ter de 5 a 8 caracteres alfanuméricos.",
    ROOM_CODE_TAKEN: "Esse código de sala já está em uso. Tente outro.",
  },
  validation: (issue) => {
    switch (issue.code) {
      case "SEAT_MISMATCH":
        return `O total de papéis (${issue.total}) não corresponde ao número de participantes (${issue.playerCount}).`;
      case "NO_WEREWOLF":
        return "É necessário pelo menos 1 lobisomem.";
      case "MASON_ODD":
        return "Os maçons devem ser configurados em pares (2 pessoas).";
      case "LOVER_INVALID":
        return "Os apaixonados devem ser configurados em pares (2 pessoas).";
      case "WOLF_TOO_MANY":
        return "Há lobisomens demais. Os aldeões começariam a partida em desvantagem.";
    }
  },
};

const ru: Strings = {
  meta: {
    title: "Мафия DX Онлайн",
    description: "Разговорная психологическая игра на 13 ролей: ищите скрытую мафию через обсуждение и рассуждения. Играйте всей компанией, у каждого — свой смартфон.",
  },
  common: {
    host: "Хост",
    connected: "Подключено",
    disconnected: "Отключено",
    reconnecting: "Переподключение…",
    connecting: "Подключение…",
    kicked: "Хост удалил вас из комнаты.",
    seconds: (n) => {
      const mod10 = n % 10;
      const mod100 = n % 100;
      const word = mod10 === 1 && mod100 !== 11 ? "секунда" : mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14) ? "секунды" : "секунд";
      return `${n} ${word}`;
    },
    timeRemaining: "Осталось времени",
    close: "Закрыть",
    cancel: "Отмена",
    people: (n) => {
      const mod10 = n % 10;
      const mod100 = n % 100;
      const word = mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14) ? "человека" : "человек";
      return `${n} ${word}`;
    },
    listSeparator: ", ",
    confirmProceed: "Продолжить",
    transitioning: "Переход к следующему этапу…",
    on: "ВКЛ",
    off: "ВЫКЛ",
    themeToggleToLight: "Переключить на светлую тему",
    themeToggleToDark: "Переключить на тёмную тему",
    menu: "Меню",
    themeLabel: "Тема",
    languageLabel: "Язык",
    endGameButton: "Завершить игру",
    officialRuleBadge: "Официальное правило",
    optionalRuleBadge: "Дополнительное правило",
  },
  entry: {
    title: "Мафия DX Онлайн",
    subtitle: "Разговорная психологическая игра на 13 ролей: ищите скрытую мафию через обсуждение и рассуждения. Играть можно где угодно — нужен только смартфон.",
    cardTitle: "Начать",
    cardDesc: "Создайте комнату или войдите по кодовому слову.",
    tabCreate: "Создать комнату",
    tabJoin: "Войти в комнату",
    nameLabel: "Никнейм",
    namePlaceholder: "Например: Иван",
    createButton: "Создать комнату",
    codeLabel: "Кодовое слово",
    codePlaceholder: "Например: AB3XZ",
    joinButton: "Войти",
    footerNote: "※ В этом приложении нет встроенного чата — общайтесь вслух, пока играете.",
    helpButton: "Правила игры",
    customCodeLabel: "Код комнаты (необязательно)",
    customCodePlaceholder: "Оставьте пустым для автогенерации",
    customCodeHint: "5–8 латинских букв и цифр. Если не указать, код будет сгенерирован автоматически.",
    avatarLabel: "Фото профиля (необязательно)",
    avatarAddButton: "Добавить фото",
    avatarChangeButton: "Изменить фото",
    avatarRemoveButton: "Удалить фото",
    avatarTooLarge: "Файл слишком большой (максимум 8 МБ)",
    avatarUnsupported: "Выберите файл изображения",
    castLabel: "13 ролей игры",
  },
  profile: {
    editButton: "Редактировать профиль",
    title: "Редактирование профиля",
    desc: "Отображаемое имя и фото профиля можно изменить в любой момент.",
    nameLabel: "Никнейм",
    avatarLabel: "Фото профиля",
    saveButton: "Сохранить",
    savedToast: "Профиль обновлён",
    closeButton: "Закрыть",
  },
  lobby: {
    codeLabel: "Кодовое слово",
    copyCode: "Скопировать код",
    copyLink: "Скопировать ссылку-приглашение",
    shareLink: "Отправить ссылку-приглашение",
    shareMessage: (code) => `Вас пригласили в комнату «Мафия DX Онлайн». Кодовое слово: ${code}`,
    copyCodeToast: "Код скопирован",
    copyLinkToast: "Ссылка скопирована",
    copyErrorToast: "Не удалось скопировать",
    participants: (n) => {
      const mod10 = n % 10;
      const mod100 = n % 100;
      const word = mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14) ? "человека" : "человек";
      return `Участники (${n} ${word})`;
    },
    waitingForMorePlayers: (n) => {
      const mod10 = n % 10;
      const mod100 = n % 100;
      const word = mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14) ? "человека" : "человек";
      return `До начала игры нужно ещё ${n} ${word}`;
    },
    composition: "Состав ролей",
    compositionReadonly: "Состав ролей (настраивает хост)",
    compositionReadonlyDesc: (wolves, total) => `Настроено ролей: ${total}, из них мафии: ${wolves}.`,
    compositionEmpty: "Роли ещё не настроены.",
    roomInfoButton: "Состав и настройки",
    roomInfoTitle: "Состав ролей и настройки этой игры",
    suggest: "Рекомендуемый состав",
    seatTotal: "Всего ролей",
    seatTotalOf: (total, count) => `${total} / ${count}`,
    soloGroupLabel: "Одиночные фракции",
    startButton: "Начать игру",
    waitingHost: "Ожидаем, пока хост начнёт игру…",
    leaveButton: "Выйти",
    settingsTitle: "Настройки игры",
    officialRulesSectionTitle: "Основные правила",
    extraRulesSectionTitle: "Дополнительные правила",
    extraRulesSectionDesc: "Всё, что ниже, — расширенные правила, придуманные специально для этого приложения. В базовых правилах их нет, так что настраивайте их свободно, как вам удобнее играть.",
    revealOnDeath: "Показывать роль при выбытии",
    allowFirstNightKill: "В первую ночь мафия может напасть",
    allowFirstNightKillDesc: "Если выключено, в первую ночь (ночь 1-го дня) никто не погибнет от нападения мафии, кого бы она ни выбрала. Рекомендуется, если в компании много новичков. Начиная со второй ночи нападения снова действуют как обычно.",
    allowFirstVoteExecution: "Первое голосование может реально изгнать игрока",
    allowFirstVoteExecutionDesc: "Если выключено, по итогам первого голосования (в 1-й день) никто не будет изгнан на самом деле, кого бы ни выбрали. Со второго дня голосования снова работают как обычно.",
    allowWolfFriendlyFire: "Мафия может напасть на своего же",
    allowWolfFriendlyFireDesc: "Если включено, игроки мафии смогут выбрать целью нападения другого игрока мафии (обычно это запрещено).",
    seerFirstNightDivine: "Шериф может проверить одного игрока сразу при получении роли",
    seerFirstNightDivineDesc: "При получении роли шериф может сразу же по желанию проверить одного игрока (рекомендуется от 7 участников). Проверять или нет — решает сам шериф. Если выключено, проверки начинаются только с первой ночи.",
    allowSelfVote: "Можно голосовать за самого себя",
    revealVoteChoices: "Показывать всем, кто за кого голосует",
    revealVoteChoicesDesc: "Если включено, во время голосования все в реальном времени видят, кто за кого голосует. Если выключено, как обычно, виден только подсчёт голосов.",
    allowBodyguardSelfGuard: "Доктор может защищать самого себя",
    secondTieExecutesRandomly: "При повторной ничьей в решающем голосовании изгнание определяется случайно",
    secondTieExecutesRandomlyDesc: "Если выключено, и решающее голосование заканчивается ничьей, в этот день никто не будет изгнан.",
    dictatorCanTargetSelf: "Диктатор может изгнать самого себя",
    settingsPacingNote: "В этом приложении нет автоматического таймера. Каждый экран сменяется по команде хоста или когда все участники завершат свои действия. Играйте в своём темпе.",
    kick: "Удалить из комнаты",
    makeHost: "Сделать хостом",
    makeHostConfirmTitle: "Передать права хоста?",
    makeHostConfirmDesc: (name) => `Новым хостом станет ${name}. Вы потеряете права хоста и не сможете управлять ходом игры.`,
    makeHostConfirmAction: "Передать",
  },
  roleReveal: {
    label: "Ваша роль",
    tapToReveal: "Нажмите, чтобы посмотреть",
    privacyHint: "Смотрите так, чтобы никто рядом не подглядывал",
    allies: "Ваши союзники",
    allRoles: "Роли всех игроков",
    waitingOthers: "Вы подтвердили роль. Как только это сделают все, игра автоматически перейдёт к первому обсуждению.",
    confirmButton: "Подтвердить",
    progress: (s, t) => `Подтвердили: ${s} из ${t}`,
    earlyDivineTitle: "Использовать способность шерифа прямо сейчас (по желанию)",
    earlyDivineDesc: "Прямо сейчас, при получении роли, вы можете проверить одного игрока. Можно пропустить это и продолжить без проверки.",
    earlyDivineButton: "Проверить этого игрока",
    earlyDivineSkipNote: "Можно просто нажать «Подтвердить» и продолжить без проверки.",
    earlyDivineDone: "Проверка выполнена. Результат ниже.",
  },
  night: {
    tag: (day) => `Ночь ${day}`,
    deadNotice: "Вы уже выбыли из игры. Спокойно наблюдайте за тем, как наступит утро…",
    dormant: "Ночь продолжается…",
    dormantDesc: "Подождите, пока игроки с особыми способностями завершат свои действия.",
    progress: (s, t) => `Действия завершены: ${s} из ${t}`,
    submitButton: "Подтвердить",
    resubmitButton: "Отправлено (изменить)",
    previousSeerResult: (day) =>
      day === 0 ? "Предыдущий результат проверки (при получении роли)" : `Предыдущий результат проверки (день ${day})`,
    seerResultLine: (name, isBlack) => `${name}: ${isBlack ? "«чёрный» (мафия)" : "«белый»"}`,
    actions: {
      attack: { title: "На кого напасть?", desc: "Посовещайтесь с сообщниками по мафии и выберите, на кого напасть этой ночью.", skip: "Не нападать этой ночью" },
      guard: { title: "Кого защитить?", desc: "Выберите, кого защитить от нападения мафии этой ночью. Самого себя защитить нельзя. Также нельзя снова выбрать того, кого вы защищали прошлой ночью.", skip: "Никого не защищать этой ночью" },
      divine: { title: "Кого проверить?", desc: "Вы узнаете, мафия ли выбранный игрок.", skip: "Не проверять этой ночью" },
    },
    firstNightKillDisabledNotice: "По настройкам этой игры, в первую ночь (1-й день) никто не погибнет от нападения мафии, кого бы она ни выбрала. Начиная со второй ночи нападения действуют как обычно.",
    forceAdvanceButton: "Продолжить, не дожидаясь всех (действие хоста)",
    wolfSelectionsTitle: "Кого выбирают сообщники по мафии (для обсуждения)",
    wolfSelectionsEmpty: "Пока никто ничего не выбрал",
    wolfSelectionsLine: (name, targetName) => `${name}: ${targetName ?? "не выбрано"}`,
    wolfConsensusNeeded: "Ночь не закончится, пока вся мафия не сойдётся на одной цели (или все не выберут «не нападать»). Обсудите и примите общее решение.",
    wolfConsensusReached: "Мнения совпали.",
  },
  hunterRevenge: {
    title: "Раскрыта личность охотника!",
    waitingFor: (name) => `${name} выбирает, кого забрать с собой…`,
    youAre: "Вы — охотник. Выберите одного игрока, чтобы забрать его с собой в могилу (а можете никого не выбирать).",
    skip: "Никого не забирать с собой",
    submit: "Подтвердить",
    submitted: "Отправлено",
    hostSkipButton: "Решить за охотника, что он никого не забирает с собой (действие хоста)",
  },
  dayResult: {
    tag: (day) => `Утро ${day}`,
    noDeaths: "Этой ночью никто не пострадал. Спокойное утро.",
    seerResult: "Результат проверки",
    continueButton: "Перейти к обсуждению",
    waitingHost: "Ожидаем, пока хост перейдёт к обсуждению…",
  },
  discussion: {
    tag: (day) => `Обсуждение ${day}`,
    firstRoundTag: "Первое обсуждение",
    firstRoundNotice: "Это первое обсуждение, сразу после того, как все узнали свои роли. Пока ещё никто не пострадал от нападения. Голосования здесь тоже нет. Поговорите свободно, а затем хост переведёт игру к настоящей «ночи».",
    proceedToNightButton: "Закончить обсуждение и перейти к ночи",
    survivors: "Выжившие",
    dictatorButton: "Применить власть диктатора",
    dictatorConfirmTitle: "Применить власть диктатора?",
    dictatorConfirmDesc: "Обсуждение будет прервано, и вы без голосования единолично решите, кого изгнать. Эту способность можно использовать только один раз за игру.",
    dictatorConfirmAction: "Изгнать этого игрока",
    skipButton: "Закончить обсуждение и перейти к голосованию",
    waitingHost: "Ожидаем, пока хост продолжит игру. Время не ограничено — обсуждайте, пока не будете готовы.",
    runoffNotice: "Голоса разделились поровну, поэтому перед решающим туром — ещё одно обсуждение. Если и оно не поможет определиться, победитель будет выбран случайно.",
    runoffCandidatesLabel: "Претенденты на решающий тур",
  },
  vote: {
    tag: (day) => `Голосование ${day}`,
    runoffTag: (day) => `Решающее голосование ${day}`,
    cannotVote: "Вы не можете голосовать. Просто дождитесь результата.",
    instructions: "Выберите одного игрока, которого хотите изгнать",
    runoffNotice: "Голоса разделились поровну, поэтому решающий тур проходит только среди отобранных кандидатов. Если и он не поможет определиться, победитель будет выбран случайно.",
    submitButton: "Проголосовать",
    submittedButton: "Голос отдан (изменить)",
    progress: (s, t) => `Проголосовали: ${s} из ${t}`,
    forceAdvanceButton: "Завершить голосование, не дожидаясь всех (действие хоста)",
    voteChoicesTitle: "Ход голосования (виден всем, так как эта настройка включена)",
    voteChoicesLine: (voterName, targetName) => `${voterName} → ${targetName}`,
  },
  executionResult: {
    tag: (day) => `Итоги изгнания ${day}`,
    executed: (name) => `${name} изгнан(а) по итогам голосования`,
    spared: (name) => `По итогам решающего голосования ${name} остаётся в игре`,
    sparedFirstVoteRule: (name) =>
      `По правилу «первое голосование не приводит к изгнанию», ${name} остаётся в игре без решающего тура`,
    noExecution: "По итогам голосования никто не был изгнан.",
    mediumResult: "Результат медиума",
    mediumResultLine: (name, isBlack) => `${name}: ${isBlack ? "«чёрный» (мафия)" : "«белый»"}`,
    continueButton: "Перейти к следующей ночи",
    waitingHost: "Ожидаем, пока хост перейдёт к следующей ночи…",
  },
  lastWords: {
    tag: (day) => `Последнее слово ${day}`,
    title: "По итогам голосования принято решение об изгнании",
    waitingFor: (name) => `Послушаем последнее слово игрока ${name}`,
    youAreTitle: "Изгнание выбрало вас",
    youAreDesc: "Если хотите сказать что-то напоследок — самое время. Когда закончите, нажмите кнопку ниже.",
    proceedButton: "Слово сказано (к решающему голосованию)",
    waitingHost: "Ожидаем, пока сам игрок или хост продолжит игру…",
  },
  appealVote: {
    tag: (day) => `Решающее голосование за жизнь ${day}`,
    instructions: (name) => `Стоит ли на самом деле изгнать ${name} — или оставить в игре?`,
    cannotVote: "Вы не можете участвовать в этом решающем голосовании (так как сами под угрозой изгнания). Просто дождитесь результата.",
    executeOption: "Изгнать",
    spareOption: "Оставить",
    submitButton: "Подтвердить",
    submittedButton: "Голос отдан (изменить)",
    progress: (s, t) => `Проголосовали: ${s} из ${t}`,
    forceAdvanceButton: "Завершить голосование, не дожидаясь всех (действие хоста)",
  },
  allyNote: {
    title: "Заметка только для своих",
    placeholder: "Короткая заметка только для своих (например: «цель — игрок №3»)",
    hint: "Делитесь короткими сообщениями незаметно для окружающих. Это не чат, а одна общая заметка.",
    groupSize: (n) => {
      const mod10 = n % 10;
      const mod100 = n % 100;
      const word = mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14) ? "человека" : "человек";
      return `Заметку видят: ${n} ${word}`;
    },
  },
  gameOver: {
    primary: {
      village: "Победа мирных жителей!",
      werewolf: "Победа мафии!",
      draw: "Ничья",
    },
    extra: {
      fox: "Оборотень тоже выжил — и побеждает в одиночку!",
      god: "Бог тоже выжил — и побеждает в одиночку!",
      lover: "Оба влюблённых выжили — победа за ними!",
    },
    allRoles: "Роли всех игроков",
    eliminated: "Выбыл",
    newGameButton: "Сыграть ещё раз этим составом",
    waitingHost: "Ожидаем, пока хост начнёт следующую игру…",
    leaveButton: "Выйти",
    hostEndedTitle: "Хост завершил игру",
    hostEndedDesc: "Победитель не определён — игра завершена досрочно.",
  },
  confirm: {
    advanceTitle: "Перейти дальше?",
    advanceDesc: "Убедитесь, что все готовы, прежде чем продолжить. Это действие нельзя отменить.",
    advanceAction: "Продолжить",
    forceResolveTitle: "Продолжить принудительно?",
    forceResolveDesc: "Если кто-то ещё не совершил действие или не проголосовал, это будет пропущено.",
    forceResolveAction: "Продолжить принудительно",
    newGameTitle: "Начать новую игру этим же составом?",
    newGameDesc: "Текущий результат будет сброшен, и роли будут распределены заново.",
    newGameAction: "Начать новую игру",
    skipHunterRevengeTitle: "Пропустить возможность охотника забрать кого-то с собой?",
    skipHunterRevengeDesc: "Если пропустить, охотник не сможет никого забрать с собой.",
    skipHunterRevengeAction: "Пропустить",
    endGameTitle: "Завершить игру?",
    endGameDesc: "Текущая игра завершится, и роли всех игроков будут раскрыты. Это действие нельзя отменить.",
    endGameAction: "Завершить",
  },
  help: {
    button: "Правила",
    title: "Правила игры",
    tldr: "Коротко: мирные жители пытаются вычислить скрытую мафию через обсуждение и изгнать её голосованием.",
    tabFlow: "Ход игры",
    tabWin: "Условия победы",
    tabRoles: "Роли",
    intro:
      "«Мафия DX» — психологическая игра, где одни игроки тайно становятся «мафией», а другие — «мирными жителями», пытающимися её вычислить. День (обсуждение и голосование) и ночь (тайные действия по ролям) сменяют друг друга, пока мирные жители не изгонят всех членов мафии или пока число мафии не сравняется с числом мирных жителей. Получение роли, ночные действия и голосование — всё происходит прямо на этом экране. Автоматического таймера нет, поэтому игра идёт в темпе, который задают хост и сами игроки.",
    flowTitle: "Как проходит игра",
    flowSteps: [
      { title: "Получение роли", desc: "Каждый игрок тайно смотрит свою роль и нажимает «Подтвердить». Следите, чтобы никто рядом не подсматривал. Игра не продолжится, пока это не сделают все." },
      { title: "Первое обсуждение", desc: "Сразу после получения ролей — время для знакомства, пока ещё никто не пострадал. Голосования нет. Немного поговорив, хост переводит игру к настоящей «ночи»." },
      { title: "Ночь", desc: "Тайно действуют только игроки с особыми способностями: мафия, шериф, доктор и другие. Остальные просто ждут. Именно здесь впервые может произойти нападение мафии (в первую ночь его можно отключить в настройках)." },
      { title: "Утро (итоги)", desc: "Объявляется, что произошло ночью — кто пострадал." },
      { title: "Обсуждение", desc: "Опираясь на итоги ночи, все вместе рассуждают, кто может быть мафией. Время не ограничено — говорите, пока не будете готовы." },
      { title: "Голосование", desc: "Каждый выбирает одного игрока, которого хочет изгнать. Изгоняется набравший больше всех голосов; при равенстве голосов проводится решающий тур. Как только все проголосуют, итоги объявляются автоматически." },
      { title: "Повтор цикла", desc: "«Ночь → утро → обсуждение → голосование» повторяются, пока не победит одна из сторон." },
    ],
    diagramTitle: "Цикл ночи и дня на схеме",
    diagramIntro:
      "«Ночь» и следующие сразу за ней «утро → обсуждение → голосование» считаются одним и тем же днём. Например, утро, обсуждение и голосование после «ночи 1» — это всё «1-й день».",
    diagramDayLabel: (day) => `День ${day}`,
    diagramSameDayNote: "🌙 Ночь и ☀️ день (утро, обсуждение, голосование) с одинаковым номером относятся к одному циклу.",
    diagramOutcomeLabel: "Итог",
    diagramNoRoomNote: "Реальные настройки зависят от конкретной комнаты. После входа их можно посмотреть на вкладке «Состав и настройки».",
    diagramSettingsHeading: "Настройки этой комнаты",
    winTitle: "Условия победы",
    winIntro: "Способ определения победителя различается для каждой стороны. Иногда сразу несколько сторон побеждают одновременно.",
    winVillage: "Мирные жители: побеждают, изгнав всех до единого членов мафии.",
    winWerewolf: "Мафия: побеждает, когда её численность становится не меньше числа остальных выживших.",
    winFox: "Оборотень: если доживёт до конца игры, побеждает в одиночку — независимо от того, кто победил, мирные жители или мафия.",
    winGod: "Бог: если доживёт до конца игры, побеждает в одиночку — независимо от того, кто победил, мирные жители или мафия.",
    winLover: "Влюблённые: если оба доживут до конца игры, побеждают вместе.",
    rolesTitle: "Список ролей (13 штук)",
    rolesIntro: "Описание своей роли можно в любой момент посмотреть через кнопку «Моя роль» в верхней части экрана.",
    close: "Закрыть",
  },
  myRole: {
    button: "Моя роль",
    title: "Ваша роль",
    dayLabel: (day) => (day === 0 ? "При получении роли" : `День ${day}`),
    seerHistoryTitle: "Кого вы уже проверяли",
    seerHistoryEmpty: "Вы пока никого не проверяли.",
    mediumHistoryTitle: "Кого вы уже проверяли",
    mediumHistoryEmpty: "Вы пока никого не проверяли.",
    noRoleYet: "Роль ещё не раскрыта.",
    close: "Закрыть",
  },
  team: {
    village: "Мирные жители",
    werewolf: "Клан мафии",
    fox: "Оборотень (одиночная фракция)",
    god: "Бог (одиночная фракция)",
    lover: "Влюблённые (одиночная фракция)",
  },
  deathCause: {
    attack: "Нападение мафии",
    execution: "Изгнание по итогам голосования",
    curse: "Проклятие после проверки шерифом",
    hunter: "Месть охотника",
    lover_grief: "Скорбь по возлюбленному",
  },
  roles: {
    villager: {
      name: "Мирный житель",
      short: "Обычный житель без особых способностей",
      detail: "Вы — мирный житель. Особых способностей у вас нет. Если кто-то покажется вам подозрительным, поделитесь своими доводами со всеми во время обсуждения и вместе распутывайте эту историю.",
    },
    seer: {
      name: "Шериф",
      short: "Каждую ночь проверяет одного игрока и узнаёт, мафия ли он",
      detail:
        "Вы — шериф. Каждую ночь вы можете проверить одного игрока. Если проверяемый — мафия, вы получите результат «чёрный», если нет — «белый». Этот результат видите только вы, а как и когда рассказать о нём остальным — решать вам. Учтите: если вы проверите оборотня, той же ночью он погибнет от проклятия.",
    },
    bodyguard: {
      name: "Доктор",
      short: "Каждую ночь защищает одного игрока от нападения мафии",
      detail:
        "Вы — доктор. Каждую ночь вы выбираете одного игрока (кроме себя) и защищаете его от нападения мафии. Если мафия в эту ночь нападёт именно на него, он выживет. Одного и того же игрока нельзя защищать две ночи подряд.",
    },
    medium: {
      name: "Медиум",
      short: "Узнаёт, был ли изгнанный игрок мафией",
      detail: "Вы — медиум. Той же ночью, что и дневное изгнание, вы узнаёте, был ли изгнанный игрок мафией. В первую ночь проверять пока некого — ещё никого не изгоняли.",
    },
    hunter: {
      name: "Охотник",
      short: "Погибая, может забрать с собой ещё одного игрока",
      detail:
        "Вы — охотник. Если вас изгонят по итогам голосования или убьёт мафия, вы можете забрать с собой в могилу ещё одного игрока по своему выбору (а можете никого не выбирать). Раскрывать свою роль заранее не обязательно.",
    },
    mason: {
      name: "Побратим",
      short: "Двое и более мирных жителей, которые знают друг друга",
      detail: "Вы — побратим: мирный житель, который знает других побратимов в этой игре. Особых способностей у вас нет, зато вы можете полностью доверять друг другу — большая редкость в этой игре. Выбирайте момент, когда раскрыть себя, осторожно, чтобы не вызвать подозрений у мафии.",
    },
    dictator: {
      name: "Диктатор",
      short: "Раз за игру может прервать обсуждение и единолично решить, кого изгнать",
      detail:
        "Вы — диктатор. Один раз за игру вы можете во время дневного обсуждения раскрыть себя, прервать обсуждение и без голосования единолично решить, кого изгнать. Это очень сильная способность, поэтому выбирайте момент её применения с умом.",
    },
    werewolf: {
      name: "Мафия",
      short: "Каждую ночь нападает на одного игрока вместе с сообщниками. Знает остальных членов мафии",
      detail:
        "Вы — мафия. Вы знаете, кто ещё состоит в мафии. Каждую ночь вместе с сообщниками выбирайте, на кого напасть. Днём притворяйтесь мирным жителем и скрывайте свою личность: вы победите, как только мафии останется столько же, сколько и мирных жителей.",
    },
    traitor: {
      name: "Предатель",
      short: "Побеждает вместе с мафией, но не знает, кто в неё входит",
      detail:
        "Вы — предатель. Если победит мафия, победите и вы, но кто в неё входит, вам неизвестно. При проверке шерифом или медиумом вы всегда выглядите «белым» (не мафией), поэтому вас трудно заподозрить. Делайте вид, что ищете мафию вместе со всеми, но незаметно помогайте ей побеждать (в отличие от пособника, вы сами не знаете, кто именно состоит в мафии).",
    },
    insider: {
      name: "Пособник",
      short: "Знает, кто входит в мафию, и тайно помогает ей",
      detail:
        "Вы — пособник. Вы знаете, кто входит в мафию. При проверке шерифом или медиумом вы всегда выглядите «белым» (не мафией), поэтому вы — самый безопасный союзник мафии. Не защищайте мафию слишком открыто, иначе вызовете подозрения: притворяйтесь мирным жителем, но исподтишка помогайте ей (в отличие от предателя, вы точно знаете, кто входит в мафию).",
    },
    fox: {
      name: "Оборотень",
      short: "Одиночная фракция, неуязвимая для мафии, но погибает от проверки шерифа",
      detail:
        "Вы — оборотень. Вы не принадлежите ни к мирным жителям, ни к мафии и действуете сам за себя: нападения мафии вам не страшны. Однако если шериф проверит именно вас, той же ночью вы погибнете от проклятия. Победа мафии или мирных жителей вас не касается — важно лишь дожить до конца игры.",
    },
    god: {
      name: "Бог",
      short: "Одиночная фракция, знающая роли всех игроков. Побеждает, если доживёт до конца",
      detail:
        "Вы — бог. С самого начала игры вы знаете роли всех игроков. При проверке шерифом или медиумом вы всегда выглядите «белым». Победа мафии или мирных жителей не имеет значения — если вы доживёте до конца игры, вы победите.",
    },
    lover: {
      name: "Влюблённый",
      short: "Одиночная фракция из двух влюблённых: если один умирает, гибнет и другой",
      detail:
        "Вы — влюблённый. Вы знаете, кто ваша вторая половина. Если один из вас погибнет от изгнания или нападения, второй умрёт вслед за ним от горя. Если оба доживёте до конца игры, вы победите вместе.",
    },
  },
  errors: {
    ROOM_NOT_FOUND: "Комната не найдена. Проверьте кодовое слово.",
    GAME_ALREADY_STARTED: "Игра уже началась, поэтому присоединиться нельзя.",
    ROOM_FULL: "Достигнут лимит участников комнаты.",
    REJOIN_FAILED: "Не удалось переподключиться.",
    PLAYER_NOT_FOUND: "Информация об игроке не найдена.",
    NOT_HOST: "Это действие может выполнить только хост.",
    ALREADY_STARTED: "Игра уже началась.",
    NOT_IN_ROOM: "Вы не находитесь в комнате.",
    MIN_PLAYERS: "Недостаточно участников.",
    KICKED: "Хост удалил вас из комнаты.",
    INVALID_ROOM_CODE: "Код комнаты должен состоять из 5–8 латинских букв и цифр.",
    ROOM_CODE_TAKEN: "Этот код комнаты уже занят. Попробуйте другой.",
  },
  validation: (issue) => {
    switch (issue.code) {
      case "SEAT_MISMATCH":
        return `Общее количество ролей (${issue.total}) не совпадает с количеством участников (${issue.playerCount}).`;
      case "NO_WEREWOLF":
        return "Нужен хотя бы один игрок мафии.";
      case "MASON_ODD":
        return "Побратимов нужно назначать парами (по 2 человека).";
      case "LOVER_INVALID":
        return "Влюблённых нужно назначать парами (по 2 человека).";
      case "WOLF_TOO_MANY":
        return "Слишком много игроков мафии — мирные жители сразу окажутся в невыгодном положении.";
    }
  },
};

const vi: Strings = {
  meta: {
    title: "Ma Sói DX Online",
    description: "Trò chơi tâm lý đối thoại hỗ trợ 13 vai trò, nơi bạn dùng lời nói và suy luận để tìm ra những con Sói đang trốn trong làng. Cùng bạn bè quây quần, chỉ cần một chiếc điện thoại là chơi được.",
  },
  common: {
    host: "Chủ phòng",
    connected: "Đã kết nối",
    disconnected: "Mất kết nối",
    reconnecting: "Đang kết nối lại…",
    connecting: "Đang kết nối…",
    kicked: "Bạn đã bị chủ phòng cho ra khỏi phòng.",
    seconds: (n) => `${n} giây`,
    timeRemaining: "Thời gian còn lại",
    close: "Đóng",
    cancel: "Hủy",
    people: (n) => `${n} người`,
    listSeparator: ", ",
    confirmProceed: "Tiếp tục",
    transitioning: "Đang chuyển sang màn hình tiếp theo…",
    on: "BẬT",
    off: "TẮT",
    themeToggleToLight: "Chuyển sang chế độ sáng",
    themeToggleToDark: "Chuyển sang chế độ tối",
    menu: "Menu",
    themeLabel: "Giao diện",
    languageLabel: "Ngôn ngữ",
    endGameButton: "Kết thúc ván chơi",
    officialRuleBadge: "Luật chính thức",
    optionalRuleBadge: "Luật tùy chọn",
  },
  entry: {
    title: "Ma Sói DX Online",
    subtitle: "Trò chơi tâm lý đối thoại hỗ trợ 13 vai trò, nơi bạn dùng lời nói và suy luận để tìm ra những con Sói đang trốn trong làng. Chơi ở bất cứ đâu, chỉ cần một chiếc điện thoại.",
    cardTitle: "Bắt đầu",
    cardDesc: "Tạo một phòng mới hoặc tham gia bằng mã phòng.",
    tabCreate: "Tạo phòng",
    tabJoin: "Vào phòng",
    nameLabel: "Biệt danh",
    namePlaceholder: "Ví dụ: Minh",
    createButton: "Tạo phòng",
    codeLabel: "Mã phòng",
    codePlaceholder: "Ví dụ: AB3XZ",
    joinButton: "Tham gia",
    footerNote: "※ Ứng dụng này không có chức năng trò chuyện. Hãy vừa chơi vừa nói chuyện trực tiếp với nhau.",
    helpButton: "Xem cách chơi và luật lệ",
    customCodeLabel: "Mã phòng (tùy chọn)",
    customCodePlaceholder: "Để trống sẽ được tạo tự động",
    customCodeHint: "5–8 ký tự chữ và số. Nếu không nhập, mã sẽ được tạo tự động.",
    avatarLabel: "Ảnh đại diện (tùy chọn)",
    avatarAddButton: "Thêm ảnh",
    avatarChangeButton: "Đổi ảnh",
    avatarRemoveButton: "Xóa ảnh",
    avatarTooLarge: "Ảnh quá lớn (tối đa 8MB)",
    avatarUnsupported: "Vui lòng chọn một tệp hình ảnh",
    castLabel: "13 vai trò xuất hiện trong game",
  },
  profile: {
    editButton: "Chỉnh sửa hồ sơ",
    title: "Chỉnh sửa hồ sơ",
    desc: "Bạn có thể đổi tên hiển thị và ảnh đại diện bất cứ lúc nào.",
    nameLabel: "Biệt danh",
    avatarLabel: "Ảnh đại diện",
    saveButton: "Lưu",
    savedToast: "Đã cập nhật hồ sơ",
    closeButton: "Đóng",
  },
  lobby: {
    codeLabel: "Mã phòng",
    copyCode: "Sao chép mã",
    copyLink: "Sao chép liên kết mời",
    shareLink: "Gửi liên kết mời",
    shareMessage: (code) => `Bạn được mời vào phòng Ma Sói DX Online. Mã phòng: ${code}`,
    copyCodeToast: "Đã sao chép mã phòng",
    copyLinkToast: "Đã sao chép liên kết mời",
    copyErrorToast: "Sao chép thất bại",
    participants: (n) => `Người tham gia (${n} người)`,
    waitingForMorePlayers: (n) => `Cần thêm ${n} người nữa để bắt đầu ván chơi`,
    composition: "Cơ cấu vai trò",
    compositionReadonly: "Cơ cấu vai trò (chủ phòng đang thiết lập)",
    compositionReadonlyDesc: (wolves, total) => `Đã thiết lập tổng cộng ${total} vai trò, bao gồm ${wolves} Sói.`,
    compositionEmpty: "Chưa thiết lập vai trò nào.",
    roomInfoButton: "Vai trò & cài đặt",
    roomInfoTitle: "Cơ cấu vai trò & cài đặt ván này",
    suggest: "Gợi ý cơ cấu",
    seatTotal: "Tổng số vai trò",
    seatTotalOf: (total, count) => `${total} / ${count} người`,
    soloGroupLabel: "Phe đơn độc",
    startButton: "Bắt đầu ván chơi",
    waitingHost: "Đang chờ chủ phòng bắt đầu…",
    leaveButton: "Rời phòng",
    settingsTitle: "Cài đặt ván chơi",
    officialRulesSectionTitle: "Luật cơ bản",
    extraRulesSectionTitle: "Luật mở rộng",
    extraRulesSectionDesc: "Từ đây trở xuống là các luật mở rộng riêng của ứng dụng này, không có trong luật cơ bản. Hãy thoải mái tùy chỉnh sao cho phù hợp với nhóm của bạn.",
    revealOnDeath: "Công khai vai trò khi có người chết",
    allowFirstNightKill: "Đêm đầu tiên, Sói được phép cắn",
    allowFirstNightKillDesc: "Nếu tắt, vào đêm đầu tiên (đêm ngày 1) dù Sói cắn ai thì người đó cũng không chết. Phù hợp khi nhóm có nhiều người chơi lần đầu. Từ đêm thứ 2 trở đi, việc cắn sẽ có hiệu lực như bình thường.",
    allowFirstVoteExecution: "Lượt bỏ phiếu đầu tiên có thể treo cổ thật",
    allowFirstVoteExecutionDesc: "Nếu tắt, dù ai bị chọn nhiều phiếu nhất trong lượt bỏ phiếu đầu tiên (ngày 1) cũng sẽ không thực sự bị treo cổ mà được tha. Từ ngày thứ 2 trở đi, việc treo cổ sẽ có hiệu lực như bình thường.",
    allowWolfFriendlyFire: "Sói có thể chọn cắn đồng bọn của mình",
    allowWolfFriendlyFireDesc: "Nếu bật, Sói có thể chọn một Sói khác làm mục tiêu cắn (bình thường thì không thể).",
    seerFirstNightDivine: "Tiên Tri được soi một người ngay lúc xác nhận vai trò",
    seerFirstNightDivineDesc: "Cách chơi này cho phép Tiên Tri tự do soi một người ngay khi xác nhận vai trò (khuyến khích dùng khi có từ 7 người trở lên). Tiên Tri có thể chọn soi hoặc không. Nếu tắt, việc soi sẽ bắt đầu từ đêm đầu tiên.",
    allowSelfVote: "Có thể tự bỏ phiếu cho chính mình",
    revealVoteChoices: "Công khai nội dung bỏ phiếu cho tất cả mọi người",
    revealVoteChoicesDesc: "Nếu bật, trong lúc bỏ phiếu mọi người sẽ thấy theo thời gian thực ai đang bỏ phiếu cho ai. Nếu tắt, như thường lệ chỉ có kết quả tổng số phiếu được công khai.",
    allowBodyguardSelfGuard: "Bảo Vệ có thể tự bảo vệ chính mình",
    secondTieExecutesRandomly: "Nếu vòng bỏ phiếu quyết định vẫn hòa phiếu, sẽ chọn ngẫu nhiên người bị treo cổ",
    secondTieExecutesRandomlyDesc: "Nếu tắt, khi vòng bỏ phiếu quyết định vẫn hòa phiếu, sẽ không có ai bị treo cổ trong ngày hôm đó.",
    dictatorCanTargetSelf: "Nhà Độc Tài có thể chọn chính mình làm đối tượng bị treo cổ",
    settingsPacingNote: "Ứng dụng này không có bộ đếm giờ tự động. Mỗi màn hình sẽ chuyển tiếp theo thao tác của chủ phòng, hoặc khi tất cả mọi người đã hoàn tất hành động. Hãy chơi theo nhịp độ của riêng nhóm bạn.",
    kick: "Cho ra khỏi phòng",
    makeHost: "Trao quyền chủ phòng",
    makeHostConfirmTitle: "Bạn có muốn đổi chủ phòng không?",
    makeHostConfirmDesc: (name) => `${name} sẽ trở thành chủ phòng mới. Bạn sẽ mất quyền chủ phòng và không thể thực hiện các thao tác điều khiển ván chơi nữa.`,
    makeHostConfirmAction: "Đổi chủ phòng",
  },
  roleReveal: {
    label: "Vai trò của bạn",
    tapToReveal: "Chạm để xem",
    privacyHint: "Hãy xác nhận sao cho những người xung quanh không nhìn thấy",
    allies: "Đồng đội của bạn",
    allRoles: "Vai trò của tất cả người chơi",
    waitingOthers: "Bạn đã xác nhận xong. Khi tất cả mọi người xác nhận xong, ván chơi sẽ tự động chuyển sang phần thảo luận đầu tiên.",
    confirmButton: "Tôi đã xác nhận",
    progress: (s, t) => `Đã xác nhận: ${s} / ${t} người`,
    earlyDivineTitle: "Dùng năng lực của Tiên Tri ngay bây giờ (tùy chọn)",
    earlyDivineDesc: "Ngay lúc xác nhận vai trò, bạn có thể soi một người. Bạn cũng có thể bỏ qua và tiếp tục.",
    earlyDivineButton: "Soi người này",
    earlyDivineSkipNote: "Bạn cũng có thể nhấn “Tôi đã xác nhận” để tiếp tục mà không soi ai.",
    earlyDivineDone: "Bạn đã soi xong. Kết quả như bên dưới.",
  },
  night: {
    tag: (day) => `Đêm ngày ${day}`,
    deadNotice: "Bạn đã bị loại khỏi ván chơi. Hãy lặng lẽ theo dõi cho tới khi trời sáng…",
    dormant: "Đêm đang dần trôi qua…",
    dormantDesc: "Vui lòng chờ những người có năng lực hoàn tất hành động của họ.",
    progress: (s, t) => `Đã hành động: ${s} / ${t} người`,
    submitButton: "Xác nhận",
    resubmitButton: "Đã gửi (đổi lựa chọn)",
    previousSeerResult: (day) =>
      day === 0 ? "Kết quả soi lần trước (lúc xác nhận vai trò)" : `Kết quả soi lần trước (ngày ${day})`,
    seerResultLine: (name, isBlack) => `${name} là ${isBlack ? "【Đen (Sói)】" : "【Trắng】"}`,
    actions: {
      attack: { title: "Bạn muốn cắn ai?", desc: "Hãy bàn bạc với đồng bọn Sói và chọn mục tiêu cắn đêm nay.", skip: "Đêm nay không cắn ai" },
      guard: { title: "Bạn muốn bảo vệ ai?", desc: "Hãy chọn người bạn muốn bảo vệ khỏi bị Sói cắn. Bạn không thể tự bảo vệ chính mình. Ngoài ra, bạn không thể chọn lại người mình đã bảo vệ ở đêm trước.", skip: "Đêm nay không bảo vệ ai" },
      divine: { title: "Bạn muốn soi ai?", desc: "Soi xem người đó có phải là Sói hay không.", skip: "Đêm nay không soi ai" },
    },
    firstNightKillDisabledNotice: "Theo cài đặt hiện tại, vào đêm đầu tiên (ngày 1) dù cắn ai cũng sẽ không chết. Từ đêm thứ 2 trở đi sẽ có hiệu lực như bình thường.",
    forceAdvanceButton: "Tiếp tục mà không chờ tất cả mọi người (thao tác của chủ phòng)",
    wolfSelectionsTitle: "Mục tiêu mà các Sói khác đang chọn (để bàn bạc)",
    wolfSelectionsEmpty: "Chưa ai chọn",
    wolfSelectionsLine: (name, targetName) => `${name}: ${targetName ?? "Chưa chọn"}`,
    wolfConsensusNeeded: "Đêm sẽ chưa kết thúc cho tới khi tất cả các Sói cùng chọn một mục tiêu (hoặc tất cả cùng chọn “không cắn ai”). Hãy bàn bạc để thống nhất một lựa chọn.",
    wolfConsensusReached: "Tất cả đã thống nhất.",
  },
  hunterRevenge: {
    title: "Danh tính thật của Thợ Săn đã lộ diện!",
    waitingFor: (name) => `${name} đang chọn người sẽ mang theo…`,
    youAre: "Bạn là Thợ Săn. Bạn có thể chọn một người để mang theo cùng (không chọn cũng được).",
    skip: "Không mang theo ai",
    submit: "Xác nhận",
    submitted: "Đã gửi",
    hostSkipButton: "Chọn “không mang theo ai” thay cho Thợ Săn (thao tác của chủ phòng)",
  },
  dayResult: {
    tag: (day) => `Sáng ngày ${day}`,
    noDeaths: "Đêm qua không có ai bị hại. Một buổi sáng yên bình.",
    seerResult: "Kết quả soi",
    continueButton: "Vào phần thảo luận",
    waitingHost: "Đang chờ chủ phòng chuyển sang phần thảo luận…",
  },
  discussion: {
    tag: (day) => `Thảo luận ngày ${day}`,
    firstRoundTag: "Thảo luận đầu tiên",
    firstRoundNotice: "Đây là buổi thảo luận đầu tiên, ngay sau khi vừa xác nhận xong vai trò. Chưa có ai bị cắn cả. Ở đây cũng chưa có bỏ phiếu treo cổ. Sau khi thảo luận tự do, chủ phòng sẽ chuyển sang “đêm” thật sự.",
    proceedToNightButton: "Kết thúc thảo luận, vào đêm",
    survivors: "Người còn sống",
    dictatorButton: "Phát động quyền lực của Nhà Độc Tài",
    dictatorConfirmTitle: "Bạn có muốn phát động quyền lực của Nhà Độc Tài không?",
    dictatorConfirmDesc: "Buổi thảo luận sẽ bị chấm dứt ngay lập tức, và bạn sẽ tự quyết định treo cổ một người mà không cần bỏ phiếu. Năng lực này chỉ dùng được một lần duy nhất trong cả ván chơi.",
    dictatorConfirmAction: "Treo cổ người này",
    skipButton: "Kết thúc thảo luận, vào bỏ phiếu",
    waitingHost: "Đang chờ chủ phòng chuyển sang bước tiếp theo. Không có giới hạn thời gian, hãy thảo luận cho tới khi mọi người thấy thỏa đáng.",
    runoffNotice: "Vì số phiếu bằng nhau nên đây là phần thảo luận trước vòng bỏ phiếu quyết định. Nếu vẫn không phân định được, kết quả sẽ được chọn ngẫu nhiên.",
    runoffCandidatesLabel: "Đối tượng của vòng bỏ phiếu quyết định",
  },
  vote: {
    tag: (day) => `Bỏ phiếu ngày ${day}`,
    runoffTag: (day) => `Bỏ phiếu quyết định ngày ${day}`,
    cannotVote: "Bạn không thể bỏ phiếu. Hãy theo dõi kết quả.",
    instructions: "Hãy chọn một người mà bạn muốn treo cổ",
    runoffNotice: "Vì số phiếu bằng nhau nên đây là vòng bỏ phiếu quyết định, chỉ giới hạn trong số các đối tượng liên quan. Nếu vẫn không phân định được, kết quả sẽ được chọn ngẫu nhiên.",
    submitButton: "Bỏ phiếu",
    submittedButton: "Đã bỏ phiếu (đổi lựa chọn)",
    progress: (s, t) => `Đã bỏ phiếu: ${s} / ${t} người`,
    forceAdvanceButton: "Chốt phiếu mà không chờ tất cả mọi người (thao tác của chủ phòng)",
    voteChoicesTitle: "Tình hình bỏ phiếu (đang công khai cho tất cả mọi người vì cài đặt công khai đang BẬT)",
    voteChoicesLine: (voter, target) => `${voter} → ${target}`,
  },
  executionResult: {
    tag: (day) => `Kết quả treo cổ ngày ${day}`,
    executed: (name) => `${name} đã bị treo cổ`,
    spared: (name) => `Sau vòng bỏ phiếu quyết định, ${name} đã được tha`,
    sparedFirstVoteRule: (name) =>
      `Do cài đặt “lượt bỏ phiếu đầu tiên không treo cổ thật”, ${name} được tha mà không cần bỏ phiếu quyết định`,
    noExecution: "Không có ai bị treo cổ sau vòng bỏ phiếu.",
    mediumResult: "Kết quả gọi hồn",
    mediumResultLine: (name, isBlack) => `${name} là ${isBlack ? "【Đen (Sói)】" : "【Trắng】"}`,
    continueButton: "Sang đêm tiếp theo",
    waitingHost: "Đang chờ chủ phòng chuyển sang đêm tiếp theo…",
  },
  lastWords: {
    tag: (day) => `Lời cuối ngày ${day}`,
    title: "Kết quả bỏ phiếu đã xác định người bị treo cổ",
    waitingFor: (name) => `Hãy cùng lắng nghe lời cuối của ${name}`,
    youAreTitle: "Bạn là người được chọn để treo cổ",
    youAreDesc: "Nếu có điều gì muốn nói lần cuối, hãy nói với mọi người. Khi nói xong, nhấn nút bên dưới để tiếp tục.",
    proceedButton: "Đã nói xong (vào bỏ phiếu quyết định)",
    waitingHost: "Đang chờ chính người đó hoặc chủ phòng chuyển sang bước tiếp theo…",
  },
  appealVote: {
    tag: (day) => `Bỏ phiếu sống còn ngày ${day}`,
    instructions: (name) => `Bạn thực sự muốn treo cổ ${name}, hay muốn tha cho họ?`,
    cannotVote: "Bạn không thể tham gia vòng bỏ phiếu quyết định này (vì bạn là đối tượng bị treo cổ). Hãy theo dõi kết quả.",
    executeOption: "Treo cổ",
    spareOption: "Tha",
    submitButton: "Xác nhận",
    submittedButton: "Đã bỏ phiếu (đổi lựa chọn)",
    progress: (s, t) => `Đã bỏ phiếu: ${s} / ${t} người`,
    forceAdvanceButton: "Chốt phiếu mà không chờ tất cả mọi người (thao tác của chủ phòng)",
  },
  allyNote: {
    title: "Ghi chú riêng giữa đồng đội",
    placeholder: "Ghi chú ngắn chỉ đồng đội mới đọc được (ví dụ: nhắm vào người số 3)",
    hint: "Hãy lặng lẽ trao đổi bằng những dòng ngắn gọn để không bị người khác phát hiện. Đây không phải khung chat mà là một tờ ghi chú dùng chung.",
    groupSize: (n) => `Đang chia sẻ với ${n} người`,
  },
  gameOver: {
    primary: {
      village: "Phe Dân Làng chiến thắng!",
      werewolf: "Phe Sói chiến thắng!",
      draw: "Hòa",
    },
    extra: {
      fox: "Hồ Ly cũng sống sót và chiến thắng đơn độc!",
      god: "Vị Thần cũng sống sót và chiến thắng đơn độc!",
      lover: "Cả hai Người Yêu đều sống sót và cùng chiến thắng!",
    },
    allRoles: "Vai trò của tất cả mọi người",
    eliminated: "Đã bị loại",
    newGameButton: "Chơi lại với cùng thành viên",
    waitingHost: "Đang chờ chủ phòng bắt đầu ván tiếp theo…",
    leaveButton: "Rời phòng",
    hostEndedTitle: "Chủ phòng đã kết thúc ván chơi",
    hostEndedDesc: "Ván chơi kết thúc tại đây mà chưa phân định thắng thua.",
  },
  confirm: {
    advanceTitle: "Bạn có muốn tiếp tục không?",
    advanceDesc: "Hãy chắc chắn rằng tất cả mọi người đã sẵn sàng trước khi tiếp tục. Thao tác này không thể hoàn tác.",
    advanceAction: "Tiếp tục",
    forceResolveTitle: "Bạn có muốn buộc tiếp tục không?",
    forceResolveDesc: "Nếu còn ai chưa hành động hoặc chưa bỏ phiếu, phần của người đó sẽ bị bỏ qua.",
    forceResolveAction: "Buộc tiếp tục",
    newGameTitle: "Bạn có muốn bắt đầu ván mới với cùng thành viên không?",
    newGameDesc: "Kết quả hiện tại sẽ được đặt lại và vai trò sẽ được chia lại từ đầu.",
    newGameAction: "Bắt đầu ván mới",
    skipHunterRevengeTitle: "Bạn có muốn bỏ qua lượt mang theo của Thợ Săn không?",
    skipHunterRevengeDesc: "Nếu bỏ qua, Thợ Săn sẽ không mang theo được ai.",
    skipHunterRevengeAction: "Bỏ qua",
    endGameTitle: "Bạn có muốn kết thúc ván chơi không?",
    endGameDesc: "Ván chơi hiện tại sẽ kết thúc tại đây và vai trò của tất cả mọi người sẽ được công khai. Thao tác này không thể hoàn tác.",
    endGameAction: "Kết thúc",
  },
  help: {
    button: "Cách chơi",
    title: "Cách chơi & luật lệ",
    tldr: "Nói ngắn gọn: đây là trò chơi mà Dân Làng phải thảo luận và bỏ phiếu để tìm ra những con Sói đang giấu mình trong làng.",
    tabFlow: "Trình tự",
    tabWin: "Điều kiện thắng",
    tabRoles: "Vai trò",
    intro:
      "Ma Sói DX là trò chơi tâm lý, chia thành phe “Sói” đang giấu danh tính và phe “Dân Làng” muốn tìm ra chúng. Trò chơi luân phiên giữa “Ngày” (thảo luận và bỏ phiếu) và “Đêm” (hành động bí mật theo từng vai trò), cho tới khi Dân Làng treo cổ hết toàn bộ Sói, hoặc số Sói còn sống bằng số người không phải Sói. Việc xác nhận vai trò, hành động ban đêm và bỏ phiếu đều diễn ra ngay trên màn hình này. Không có bộ đếm giờ tự động, mọi thứ chỉ chuyển tiếp khi chủ phòng thao tác hoặc khi tất cả mọi người đã hoàn tất — bạn có thể chơi theo nhịp độ của riêng nhóm mình.",
    flowTitle: "Trình tự ván chơi",
    flowSteps: [
      { title: "Xác nhận vai trò", desc: "Mọi người lần lượt xem vai trò riêng của mình rồi nhấn “Tôi đã xác nhận”. Hãy cẩn thận để không bị người xung quanh nhìn thấy. Ván chơi sẽ không tiếp tục cho tới khi tất cả mọi người xác nhận xong." },
      { title: "Thảo luận đầu tiên", desc: "Ngay sau khi xác nhận vai trò, đây là lúc để tự giới thiệu khi chưa có ai bị cắn. Không có bỏ phiếu ở bước này. Sau khi trò chuyện nhẹ nhàng, chủ phòng sẽ chuyển sang “đêm” thật sự." },
      { title: "Đêm", desc: "Chỉ những vai trò có năng lực — như Sói, Tiên Tri, Bảo Vệ — mới lặng lẽ hành động. Những người không có năng lực chỉ cần chờ đợi. Đây là lúc lần cắn đầu tiên của Sói thực sự xảy ra (có cài đặt để vô hiệu hóa việc cắn vào đêm đầu tiên)." },
      { title: "Sáng (công bố kết quả)", desc: "Những gì đã xảy ra trong đêm (ai bị hại) sẽ được công bố." },
      { title: "Thảo luận", desc: "Dựa trên kết quả của đêm, mọi người cùng thảo luận và suy luận xem ai là Sói. Không giới hạn thời gian, hãy thảo luận cho tới khi thấy thỏa đáng." },
      { title: "Bỏ phiếu", desc: "Mỗi người chọn một người muốn treo cổ. Người bị nhiều phiếu nhất sẽ bị treo cổ; nếu bằng phiếu sẽ có vòng bỏ phiếu quyết định. Khi tất cả mọi người bỏ phiếu xong, kết quả sẽ tự động được công bố." },
      { title: "Lặp lại", desc: "Trình tự “Đêm → Sáng → Thảo luận → Bỏ phiếu” sẽ lặp lại cho tới khi một trong hai phe giành chiến thắng." },
    ],
    diagramTitle: "Sơ đồ chu kỳ Đêm và Ngày",
    diagramIntro:
      "“Đêm” và phần “Sáng → Thảo luận → Bỏ phiếu” ngay sau đó được tính chung là cùng một ngày. Ví dụ, buổi sáng, thảo luận và bỏ phiếu diễn ra sau “Đêm 1” đều thuộc “ngày 1”.",
    diagramDayLabel: (day) => `Ngày ${day}`,
    diagramSameDayNote: "🌙 Đêm và ☀️ Ngày (sáng, thảo luận, bỏ phiếu) có cùng số thứ tự nghĩa là thuộc cùng một cụm.",
    diagramOutcomeLabel: "Kết thúc",
    diagramNoRoomNote: "Cài đặt thực tế có thể khác nhau tùy theo phòng bạn tham gia. Sau khi vào phòng, bạn cũng có thể xem lại ở tab “Vai trò & cài đặt”.",
    diagramSettingsHeading: "Cài đặt của phòng này",
    winTitle: "Điều kiện thắng",
    winIntro: "Cách phân định thắng thua khác nhau tùy theo từng phe. Cũng có thể xảy ra trường hợp nhiều phe cùng chiến thắng một lúc.",
    winVillage: "Phe Dân Làng: thắng khi treo cổ được toàn bộ Sói.",
    winWerewolf: "Phe Sói: thắng khi số Sói còn sống lớn hơn hoặc bằng số người còn sống không phải Sói.",
    winFox: "Hồ Ly: nếu sống sót tới khi ván chơi kết thúc thì chiến thắng đơn độc, bất kể phe Dân Làng hay phe Sói thắng.",
    winGod: "Vị Thần: nếu sống sót tới khi ván chơi kết thúc thì chiến thắng đơn độc, bất kể phe Dân Làng hay phe Sói thắng.",
    winLover: "Người Yêu: nếu cả hai còn sống khi ván chơi kết thúc, cả hai cùng chiến thắng.",
    rolesTitle: "Danh sách vai trò (13 loại)",
    rolesIntro: "Bạn có thể xem lại mô tả vai trò của mình bất cứ lúc nào trong ván chơi qua nút “Vai trò của tôi” ở phía trên màn hình.",
    close: "Đóng",
  },
  myRole: {
    button: "Vai trò của tôi",
    title: "Vai trò của bạn",
    dayLabel: (day) => (day === 0 ? "Lúc xác nhận vai trò" : `Ngày ${day}`),
    seerHistoryTitle: "Những người đã soi",
    seerHistoryEmpty: "Bạn chưa soi ai.",
    mediumHistoryTitle: "Những người đã gọi hồn",
    mediumHistoryEmpty: "Bạn chưa gọi hồn ai.",
    noRoleYet: "Vai trò chưa được xác nhận.",
    close: "Đóng",
  },
  team: {
    village: "Phe Dân Làng",
    werewolf: "Phe Sói",
    fox: "Hồ Ly (phe đơn độc)",
    god: "Vị Thần (phe đơn độc)",
    lover: "Người Yêu (phe đơn độc)",
  },
  deathCause: {
    attack: "Bị Sói cắn",
    execution: "Bị treo cổ",
    curse: "Bị Tiên Tri soi trúng và chết vì lời nguyền",
    hunter: "Bị Thợ Săn mang theo",
    lover_grief: "Chết theo Người Yêu",
  },
  roles: {
    villager: {
      name: "Dân Làng",
      short: "Người dân bình thường, không có năng lực đặc biệt",
      detail: "Bạn là Dân Làng. Bạn không có năng lực đặc biệt nào. Nếu nghi ngờ ai đó, hãy chia sẻ lý do với mọi người trong lúc thảo luận và cùng nhau suy luận.",
    },
    seer: {
      name: "Tiên Tri",
      short: "Mỗi đêm soi một người để biết họ có phải Sói không",
      detail:
        "Bạn là Tiên Tri. Mỗi đêm, bạn có thể soi một người bất kỳ. Nếu người đó là “Sói”, bạn sẽ biết là Đen; nếu không phải, bạn sẽ biết là Trắng. Kết quả này chỉ mình bạn biết, việc chia sẻ ra sao trong lúc thảo luận là tùy bạn. Lưu ý: nếu bạn soi trúng Hồ Ly, Hồ Ly sẽ chết vì lời nguyền ngay trong đêm đó.",
    },
    bodyguard: {
      name: "Bảo Vệ",
      short: "Mỗi đêm bảo vệ một người khỏi bị Sói cắn",
      detail:
        "Bạn là Bảo Vệ. Mỗi đêm, bạn chọn một người khác (không phải bản thân) để bảo vệ khỏi bị Sói cắn. Nếu người bạn bảo vệ chính là mục tiêu bị cắn đêm đó, người ấy sẽ sống sót. Bạn không thể bảo vệ cùng một người trong hai đêm liên tiếp.",
    },
    medium: {
      name: "Thầy Đồng",
      short: "Biết được người vừa bị treo cổ có phải Sói hay không",
      detail: "Bạn là Thầy Đồng. Ngay trong đêm sau khi có người bị treo cổ vào ban ngày, bạn sẽ biết được người đó có phải là “Sói” hay không. Vào đêm ngày 1, khi chưa có ai bị treo cổ, sẽ chưa có ai để bạn gọi hồn.",
    },
    hunter: {
      name: "Thợ Săn",
      short: "Khi chết, có thể mang theo một người khác",
      detail:
        "Bạn là Thợ Săn. Khi bị “treo cổ”, hoặc chết vì bị “Sói cắn”, bạn có thể chỉ định một người để mang theo và cùng chết chung (không chỉ định cũng được). Bạn không cần tự tiết lộ vai trò của mình.",
    },
    mason: {
      name: "Tâm Giao",
      short: "Từ 2 người trở lên, biết rõ và tin tưởng tuyệt đối lẫn nhau",
      detail: "Bạn là Tâm Giao. Bạn biết những Tâm Giao khác là ai. Bạn không có năng lực đặc biệt nào, nhưng các bạn là những đồng đội quý giá có thể tin tưởng nhau tuyệt đối. Hãy cân nhắc kỹ thời điểm để lộ thân phận, kẻo bị Sói để ý.",
    },
    dictator: {
      name: "Nhà Độc Tài",
      short: "Một lần duy nhất, có thể chấm dứt thảo luận và tự quyết định người bị treo cổ",
      detail:
        "Bạn là Nhà Độc Tài. Trong cả ván chơi, bạn chỉ được dùng năng lực này một lần duy nhất: giữa buổi thảo luận ban ngày, bạn có thể lộ diện, chấm dứt thảo luận ngay lập tức và tự mình quyết định treo cổ một người mà không cần bỏ phiếu. Đây là năng lực rất mạnh, hãy cân nhắc kỹ thời điểm sử dụng.",
    },
    werewolf: {
      name: "Sói",
      short: "Mỗi đêm cắn một người. Biết những Sói khác là ai",
      detail:
        "Bạn là Sói. Bạn biết những Sói khác trong ván chơi là ai. Mỗi đêm, hãy bàn bạc với đồng bọn và chọn cắn một người. Trong lúc thảo luận, hãy giả vờ làm Dân Làng để che giấu thân phận. Phe Sói thắng khi số Sói còn sống bằng số người không phải Sói.",
    },
    traitor: {
      name: "Kẻ Phản Bội",
      short: "Thuộc phe Sói nhưng không biết ai là Sói",
      detail:
        "Bạn là Kẻ Phản Bội. Nếu phe Sói chiến thắng, bạn cũng thắng theo, nhưng bạn không hề biết ai là Sói. Khi bị Tiên Tri soi hoặc Thầy Đồng gọi hồn, bạn cũng ra kết quả “Trắng (không phải Sói)” nên rất khó bị nghi ngờ. Hãy vờ như đang truy tìm Sói trong khi âm thầm hành động có lợi cho phe Sói (khác với Nội Gián, bản thân bạn không biết mặt những con Sói).",
    },
    insider: {
      name: "Nội Gián",
      short: "Biết rõ ai là Sói, là kẻ tiếp tay bí mật cho phe Sói",
      detail:
        "Bạn là Nội Gián. Bạn biết những ai là Sói. Khi bị Tiên Tri soi hoặc Thầy Đồng gọi hồn, bạn cũng ra kết quả “Trắng (không phải Sói)”, nên trong số những người thuộc phe Sói, bạn là người ít bị nghi ngờ nhất. Nếu bênh vực Sói một cách lộ liễu sẽ dễ bị phát hiện, nên hãy giả vờ làm Dân Làng và âm thầm giúp đỡ (khác với Kẻ Phản Bội, bạn biết rõ mặt những con Sói).",
    },
    fox: {
      name: "Hồ Ly",
      short: "Phe đơn độc, không chết khi bị Sói cắn nhưng chết nếu bị soi",
      detail:
        "Bạn là Hồ Ly. Bạn không thuộc phe Dân Làng cũng không thuộc phe Sói, mà là một phe đơn độc, và sẽ không chết dù bị Sói cắn. Tuy nhiên, nếu bị Tiên Tri soi trúng, bạn sẽ chết vì lời nguyền ngay trong đêm đó. Bất kể phe Dân Làng hay phe Sói thắng, chỉ cần bạn còn sống khi ván chơi kết thúc là bạn chiến thắng.",
    },
    god: {
      name: "Vị Thần",
      short: "Phe đơn độc, biết vai trò của tất cả mọi người, sống sót là thắng",
      detail:
        "Bạn là Vị Thần. Ngay từ khi ván chơi bắt đầu, bạn đã biết vai trò của tất cả người chơi. Khi bị Tiên Tri soi hoặc Thầy Đồng gọi hồn, bạn luôn ra kết quả “Trắng”. Bất kể phe Dân Làng hay phe Sói thắng, chỉ cần bạn còn sống khi ván chơi kết thúc là bạn chiến thắng.",
    },
    lover: {
      name: "Người Yêu",
      short: "Một cặp 2 người; nếu người kia chết thì mình cũng chết theo",
      detail:
        "Bạn là Người Yêu. Bạn biết người yêu còn lại của mình là ai. Nếu một trong hai người chết vì bị treo cổ hoặc bị cắn, người còn lại cũng sẽ chết theo ngay sau đó. Nếu cả hai còn sống khi ván chơi kết thúc, cả hai sẽ cùng nhau chiến thắng.",
    },
  },
  errors: {
    ROOM_NOT_FOUND: "Không tìm thấy phòng. Vui lòng kiểm tra lại mã phòng.",
    GAME_ALREADY_STARTED: "Không thể tham gia vì ván chơi đã bắt đầu.",
    ROOM_FULL: "Phòng đã đủ số người tham gia tối đa.",
    REJOIN_FAILED: "Kết nối lại thất bại.",
    PLAYER_NOT_FOUND: "Không tìm thấy thông tin người chơi.",
    NOT_HOST: "Chỉ chủ phòng mới có thể thực hiện thao tác này.",
    ALREADY_STARTED: "Ván chơi đã bắt đầu.",
    NOT_IN_ROOM: "Bạn chưa tham gia phòng nào.",
    MIN_PLAYERS: "Chưa đủ số người tham gia tối thiểu.",
    KICKED: "Bạn đã bị chủ phòng cho ra khỏi phòng.",
    INVALID_ROOM_CODE: "Mã phòng phải gồm 5–8 ký tự chữ và số.",
    ROOM_CODE_TAKEN: "Mã phòng này đã được sử dụng. Vui lòng thử mã khác.",
  },
  validation: (issue) => {
    switch (issue.code) {
      case "SEAT_MISMATCH":
        return `Tổng số vai trò (${issue.total} người) không khớp với số người tham gia (${issue.playerCount} người).`;
      case "NO_WEREWOLF":
        return "Cần có ít nhất 1 Sói.";
      case "MASON_ODD":
        return "Tâm Giao phải được thiết lập theo cặp 2 người.";
      case "LOVER_INVALID":
        return "Người Yêu phải được thiết lập theo cặp 2 người.";
      case "WOLF_TOO_MANY":
        return "Số lượng phe Sói quá nhiều, khiến phe Dân Làng bất lợi ngay từ đầu.";
    }
  },
};

const th: Strings = {
  meta: {
    title: "มนุษย์หมาป่า DX ออนไลน์",
    description: "เกมไซโคโลจิคัลที่ต้องพูดคุยและใช้เหตุผลค้นหามนุษย์หมาป่าที่แฝงตัวอยู่ รองรับบทบาท 13 แบบ เล่นกับเพื่อนที่มารวมตัวกันได้ง่ายๆ ด้วยสมาร์ทโฟนเครื่องเดียว",
  },
  common: {
    host: "โฮสต์",
    connected: "เชื่อมต่อแล้ว",
    disconnected: "ขาดการเชื่อมต่อ",
    reconnecting: "กำลังเชื่อมต่อใหม่…",
    connecting: "กำลังเชื่อมต่อ…",
    kicked: "คุณถูกโฮสต์เตะออกจากห้องแล้ว",
    seconds: (n) => `${n} วินาที`,
    timeRemaining: "เวลาที่เหลือ",
    close: "ปิด",
    cancel: "ยกเลิก",
    people: (n) => `${n} คน`,
    listSeparator: ", ",
    confirmProceed: "ดำเนินการต่อ",
    transitioning: "กำลังไปยังฉากถัดไป…",
    on: "ON",
    off: "OFF",
    themeToggleToLight: "สลับเป็นโหมดสว่าง",
    themeToggleToDark: "สลับเป็นโหมดมืด",
    menu: "เมนู",
    themeLabel: "ธีม",
    languageLabel: "ภาษา",
    endGameButton: "จบเกม",
    officialRuleBadge: "กฎหลัก",
    optionalRuleBadge: "กฎเสริม",
  },
  entry: {
    title: "มนุษย์หมาป่า DX ออนไลน์",
    subtitle: "เกมไซโคโลจิคัลที่ต้องพูดคุยและใช้เหตุผลค้นหามนุษย์หมาป่าที่แฝงตัวอยู่ รองรับบทบาท 13 แบบ เล่นได้ทุกที่ด้วยสมาร์ทโฟนเครื่องเดียว",
    cardTitle: "เริ่มเล่น",
    cardDesc: "สร้างห้องใหม่ หรือเข้าร่วมด้วยรหัสห้อง",
    tabCreate: "สร้างห้อง",
    tabJoin: "เข้าร่วมห้อง",
    nameLabel: "ชื่อเล่น",
    namePlaceholder: "เช่น สมชาย",
    createButton: "สร้างห้อง",
    codeLabel: "รหัสห้อง",
    codePlaceholder: "เช่น AB3XZ",
    joinButton: "เข้าร่วม",
    footerNote: "※แอปนี้ไม่มีฟังก์ชันแชท กรุณาพูดคุยกันจริงๆ ระหว่างเล่น",
    helpButton: "ดูวิธีเล่นและกติกา",
    customCodeLabel: "รหัสห้อง (ไม่บังคับ)",
    customCodePlaceholder: "เว้นว่างไว้เพื่อสุ่มรหัสอัตโนมัติ",
    customCodeHint: "ตัวอักษรและตัวเลขภาษาอังกฤษ 5-8 ตัว หากไม่ระบุ ระบบจะสุ่มให้อัตโนมัติ",
    avatarLabel: "รูปโปรไฟล์ (ไม่บังคับ)",
    avatarAddButton: "เพิ่มรูปภาพ",
    avatarChangeButton: "เปลี่ยนรูปภาพ",
    avatarRemoveButton: "ลบรูปภาพ",
    avatarTooLarge: "ไฟล์รูปภาพมีขนาดใหญ่เกินไป (ไม่เกิน 8MB)",
    avatarUnsupported: "กรุณาเลือกไฟล์รูปภาพ",
    castLabel: "13 บทบาทที่ปรากฏในเกม",
  },
  profile: {
    editButton: "แก้ไขโปรไฟล์",
    title: "แก้ไขโปรไฟล์",
    desc: "คุณสามารถเปลี่ยนชื่อที่แสดงและรูปโปรไฟล์ได้ตลอดเวลา",
    nameLabel: "ชื่อเล่น",
    avatarLabel: "รูปโปรไฟล์",
    saveButton: "บันทึก",
    savedToast: "อัปเดตโปรไฟล์แล้ว",
    closeButton: "ปิด",
  },
  lobby: {
    codeLabel: "รหัสห้อง",
    copyCode: "คัดลอกรหัส",
    copyLink: "คัดลอกลิงก์เชิญ",
    shareLink: "แชร์ลิงก์เชิญ",
    shareMessage: (code) => `คุณได้รับเชิญเข้าห้องมนุษย์หมาป่า DX ออนไลน์ รหัสห้อง: ${code}`,
    copyCodeToast: "คัดลอกรหัสแล้ว",
    copyLinkToast: "คัดลอกลิงก์เชิญแล้ว",
    copyErrorToast: "คัดลอกไม่สำเร็จ",
    participants: (n) => `ผู้เข้าร่วม (${n} คน)`,
    waitingForMorePlayers: (n) => `อีก ${n} คนจะเริ่มเกมได้`,
    composition: "องค์ประกอบบทบาท",
    compositionReadonly: "องค์ประกอบบทบาท (โฮสต์กำลังตั้งค่า)",
    compositionReadonlyDesc: (wolves, total) => `ตั้งค่าบทบาทไว้ทั้งหมด ${total} คน รวมมนุษย์หมาป่า ${wolves} คน`,
    compositionEmpty: "ยังไม่ได้ตั้งค่าบทบาท",
    roomInfoButton: "บทบาท・ตั้งค่า",
    roomInfoTitle: "บทบาทและการตั้งค่าเกมครั้งนี้",
    suggest: "แนะนำองค์ประกอบ",
    seatTotal: "จำนวนบทบาททั้งหมด",
    seatTotalOf: (total, count) => `${total} / ${count} คน`,
    soloGroupLabel: "ฝ่ายเดี่ยว",
    startButton: "เริ่มเกม",
    waitingHost: "กำลังรอโฮสต์เริ่มเกม…",
    leaveButton: "ออกจากห้อง",
    settingsTitle: "ตั้งค่าเกม",
    officialRulesSectionTitle: "กฎพื้นฐาน",
    extraRulesSectionTitle: "กฎเพิ่มเติม",
    extraRulesSectionDesc: "ตั้งแต่ส่วนนี้ลงไปเป็นกฎขยายเฉพาะของแอปนี้ ซึ่งไม่มีอยู่ในกฎพื้นฐาน ปรับแต่งได้อย่างอิสระเพื่อให้เล่นสนุกยิ่งขึ้น",
    revealOnDeath: "เปิดเผยบทบาทเมื่อเสียชีวิต",
    allowFirstNightKill: "คืนแรก มนุษย์หมาป่าโจมตีได้",
    allowFirstNightKillDesc: "หากปิด ในคืนแรก (คืนของวันที่ 1) ไม่ว่ามนุษย์หมาป่าจะเลือกโจมตีใครก็จะไม่มีใครตาย เหมาะสำหรับกลุ่มที่มีผู้เล่นใหม่จำนวนมาก ตั้งแต่คืนวันที่ 2 เป็นต้นไป การโจมตีจะมีผลตามปกติ",
    allowFirstVoteExecution: "การโหวตครั้งแรก ขับไล่ได้จริง",
    allowFirstVoteExecutionDesc: "หากปิด ไม่ว่าการโหวตครั้งแรก (โหวตวันที่ 1) จะเลือกใคร ผู้นั้นจะไม่ถูกขับไล่จริงและรอดชีวิตต่อไป ตั้งแต่การโหวตวันที่ 2 เป็นต้นไป การขับไล่จะมีผลตามปกติ",
    allowWolfFriendlyFire: "มนุษย์หมาป่าเลือกโจมตีมนุษย์หมาป่าด้วยกันได้",
    allowWolfFriendlyFireDesc: "หากเปิด มนุษย์หมาป่าจะสามารถเลือกโจมตีมนุษย์หมาป่าด้วยกันเองได้ (ปกติทำไม่ได้)",
    seerFirstNightDivine: "เทพพยากรณ์ทำนายได้ 1 คนตอนเปิดเผยบทบาท",
    seerFirstNightDivineDesc: "รูปแบบการเล่นที่ให้เทพพยากรณ์เลือกทำนายใครก็ได้ 1 คนในช่วงเปิดเผยบทบาท (แนะนำสำหรับ 7 คนขึ้นไป) เทพพยากรณ์เลือกได้เองว่าจะทำนายหรือไม่ หากปิด การทำนายจะเริ่มตั้งแต่คืนแรก",
    allowSelfVote: "โหวตให้ตัวเองได้",
    revealVoteChoices: "เปิดเผยผลโหวตให้ทุกคนเห็น",
    revealVoteChoicesDesc: "หากเปิด ระหว่างช่วงโหวต ทุกคนจะเห็นแบบเรียลไทม์ว่าใครโหวตให้ใคร หากปิด จะเห็นเฉพาะยอดรวมคะแนนโหวตเหมือนเดิม",
    allowBodyguardSelfGuard: "บอดี้การ์ดปกป้องตัวเองได้",
    secondTieExecutesRandomly: "หากโหวตรอบตัดสินยังเสมอกัน จะสุ่มขับไล่",
    secondTieExecutesRandomlyDesc: "หากปิด ถ้าโหวตรอบตัดสินยังหาข้อสรุปไม่ได้ จะไม่มีใครถูกขับไล่ในวันนั้น",
    dictatorCanTargetSelf: "เผด็จการเลือกขับไล่ตัวเองได้",
    settingsPacingNote: "แอปนี้ไม่มีตัวจับเวลาอัตโนมัติ แต่ละหน้าจอจะดำเนินต่อไปเมื่อโฮสต์สั่ง หรือเมื่อทุกคนดำเนินการครบแล้ว เล่นกันได้ตามจังหวะของกลุ่มเลย",
    kick: "เตะออก",
    makeHost: "ตั้งเป็นโฮสต์",
    makeHostConfirmTitle: "เปลี่ยนโฮสต์หรือไม่?",
    makeHostConfirmDesc: (name) => `จะตั้งให้ ${name} เป็นโฮสต์คนใหม่ คุณจะสูญเสียสิทธิ์โฮสต์และไม่สามารถควบคุมการดำเนินเกมได้อีก`,
    makeHostConfirmAction: "เปลี่ยนโฮสต์",
  },
  roleReveal: {
    label: "บทบาทของคุณ",
    tapToReveal: "แตะเพื่อดู",
    privacyHint: "กรุณาตรวจสอบโดยไม่ให้คนรอบข้างเห็น",
    allies: "พวกพ้องของคุณ",
    allRoles: "บทบาทของผู้เล่นทุกคน",
    waitingOthers: "ยืนยันแล้ว เมื่อทุกคนยืนยันครบ จะเข้าสู่ช่วงพูดคุยครั้งแรกโดยอัตโนมัติ",
    confirmButton: "ยืนยันแล้ว",
    progress: (s, t) => `ยืนยันแล้ว: ${s} / ${t} คน`,
    earlyDivineTitle: "ใช้พลังของเทพพยากรณ์ทันที (ไม่บังคับ)",
    earlyDivineDesc: "ในช่วงเปิดเผยบทบาท คุณสามารถทำนายได้ 1 คน จะไม่ใช้และเล่นต่อไปก็ได้",
    earlyDivineButton: "ทำนายคนนี้",
    earlyDivineSkipNote: "จะไม่ทำนายและกด “ยืนยันแล้ว” เพื่อเล่นต่อก็ได้",
    earlyDivineDone: "ทำนายเรียบร้อยแล้ว ผลลัพธ์เป็นดังนี้",
  },
  night: {
    tag: (day) => `คืนที่ ${day}`,
    deadNotice: "คุณเสียชีวิตไปแล้ว โปรดเฝ้าดูความเป็นไปอย่างเงียบๆ จนกว่าฟ้าจะสาง…",
    dormant: "ค่ำคืนกำลังดำเนินไป…",
    dormantDesc: "กรุณารอจนกว่าผู้ที่มีความสามารถพิเศษจะดำเนินการเสร็จ",
    progress: (s, t) => `ดำเนินการแล้ว: ${s} / ${t} คน`,
    submitButton: "ยืนยัน",
    resubmitButton: "ส่งแล้ว (เปลี่ยนแปลง)",
    previousSeerResult: (day) =>
      day === 0 ? "ผลทำนายครั้งก่อน (ตอนเปิดเผยบทบาท)" : `ผลทำนายครั้งก่อน (วันที่ ${day})`,
    seerResultLine: (name, isBlack) => `${name} คือ${isBlack ? "【ดำ (มนุษย์หมาป่า)】" : "【ขาว】"}`,
    actions: {
      attack: { title: "จะโจมตีใคร?", desc: "ปรึกษากับมนุษย์หมาป่าคนอื่นแล้วเลือกเป้าหมายที่จะโจมตีคืนนี้", skip: "คืนนี้ไม่โจมตี" },
      guard: { title: "จะปกป้องใคร?", desc: "เลือกคนที่จะปกป้องจากการโจมตีของมนุษย์หมาป่า ปกป้องตัวเองไม่ได้ และเลือกคนที่ปกป้องไปแล้วในคืนก่อนหน้าไม่ได้เช่นกัน", skip: "คืนนี้ไม่ปกป้องใคร" },
      divine: { title: "จะทำนายใคร?", desc: "ทำนายว่าคนนั้นเป็นมนุษย์หมาป่าหรือไม่", skip: "คืนนี้ไม่ทำนาย" },
    },
    firstNightKillDisabledNotice: "ตามการตั้งค่า ในคืนแรก (วันที่ 1) ไม่ว่าจะโจมตีใครก็จะไม่มีใครตาย ตั้งแต่คืนวันที่ 2 เป็นต้นไปจะมีผลตามปกติ",
    forceAdvanceButton: "ดำเนินต่อโดยไม่รอทุกคน (สิทธิ์โฮสต์)",
    wolfSelectionsTitle: "เป้าหมายที่มนุษย์หมาป่าคนอื่นเลือก (สำหรับปรึกษากัน)",
    wolfSelectionsEmpty: "ยังไม่มีใครเลือก",
    wolfSelectionsLine: (name, targetName) => `${name}: ${targetName ?? "ยังไม่เลือก"}`,
    wolfConsensusNeeded: "คืนนี้จะยังไม่จบ จนกว่ามนุษย์หมาป่าทุกคนจะเลือกเป้าหมายเดียวกัน (หรือเลือก “ไม่โจมตี” ทั้งหมด) ปรึกษากันเพื่อตัดสินใจเลือกคนเดียวกัน",
    wolfConsensusReached: "ทุกคนเลือกตรงกันแล้ว",
  },
  hunterRevenge: {
    title: "ตัวตนที่แท้จริงของนายพรานถูกเปิดเผย!",
    waitingFor: (name) => `${name} กำลังเลือกคนที่จะพาไปด้วย…`,
    youAre: "คุณคือนายพราน คุณสามารถเลือกคนหนึ่งที่จะพาไปด้วยได้ (จะไม่เลือกก็ได้)",
    skip: "ไม่พาใครไปด้วย",
    submit: "ยืนยัน",
    submitted: "ส่งแล้ว",
    hostSkipButton: "ตั้งเป็น “ไม่พาใครไปด้วย” แทนนายพราน (สิทธิ์โฮสต์)",
  },
  dayResult: {
    tag: (day) => `เช้าวันที่ ${day}`,
    noDeaths: "เมื่อคืนไม่มีใครเสียชีวิต เป็นเช้าที่สงบสุข",
    seerResult: "ผลการทำนาย",
    continueButton: "ไปยังช่วงพูดคุย",
    waitingHost: "กำลังรอโฮสต์ไปยังช่วงพูดคุย…",
  },
  discussion: {
    tag: (day) => `ช่วงพูดคุยวันที่ ${day}`,
    firstRoundTag: "การพูดคุยครั้งแรก",
    firstRoundNotice: "นี่คือการพูดคุยครั้งแรก หลังจากเปิดเผยบทบาทเสร็จหมาดๆ ยังไม่มีใครถูกโจมตี และจะไม่มีการโหวตขับไล่ในรอบนี้ พูดคุยกันได้อย่างอิสระ แล้วโฮสต์จะสั่งเข้าสู่ “คืน” จริงๆ",
    proceedToNightButton: "จบการพูดคุยแล้วเข้าสู่คืน",
    survivors: "ผู้รอดชีวิต",
    dictatorButton: "ใช้อำนาจเผด็จการ",
    dictatorConfirmTitle: "ใช้อำนาจเผด็จการหรือไม่?",
    dictatorConfirmDesc: "ยุติการพูดคุยทันทีและขับไล่คนที่คุณเลือกโดยไม่ต้องโหวต ความสามารถนี้ใช้ได้เพียงครั้งเดียวตลอดเกม",
    dictatorConfirmAction: "ขับไล่คนนี้",
    skipButton: "จบการพูดคุยแล้วเข้าสู่การโหวต",
    waitingHost: "กำลังรอโฮสต์ดำเนินการต่อ ไม่มีการจำกัดเวลา พูดคุยกันจนกว่าจะพอใจ",
    runoffNotice: "เนื่องจากผลโหวตเสมอกัน นี่คือช่วงพูดคุยก่อนโหวตรอบตัดสิน หากยังตัดสินไม่ได้จะสุ่มเลือก",
    runoffCandidatesLabel: "ผู้ที่เข้ารอบตัดสิน",
  },
  vote: {
    tag: (day) => `ช่วงโหวตวันที่ ${day}`,
    runoffTag: (day) => `โหวตรอบตัดสิน วันที่ ${day}`,
    cannotVote: "คุณไม่สามารถโหวตได้ โปรดเฝ้าดูผลลัพธ์",
    instructions: "เลือกคนที่จะขับไล่ 1 คน",
    runoffNotice: "เนื่องจากผลเสมอกัน นี่คือการโหวตรอบตัดสินที่จำกัดเฉพาะผู้เข้ารอบ หากยังตัดสินไม่ได้จะสุ่มเลือก",
    submitButton: "โหวต",
    submittedButton: "โหวตแล้ว (เปลี่ยนแปลง)",
    progress: (s, t) => `โหวตแล้ว: ${s} / ${t} คน`,
    forceAdvanceButton: "ปิดโหวตโดยไม่รอทุกคน (สิทธิ์โฮสต์)",
    voteChoicesTitle: "สถานะการโหวต (เปิดเผยให้ทุกคนเห็นเพราะเปิดใช้งานการตั้งค่านี้)",
    voteChoicesLine: (voterName, targetName) => `${voterName} → ${targetName}`,
  },
  executionResult: {
    tag: (day) => `ผลการขับไล่วันที่ ${day}`,
    executed: (name) => `${name} ถูกขับไล่`,
    spared: (name) => `จากผลโหวตรอบตัดสิน ${name} รอดชีวิต`,
    sparedFirstVoteRule: (name) =>
      `เนื่องจากตั้งค่า “การโหวตครั้งแรกไม่ขับไล่จริง” ${name} จึงรอดชีวิตโดยไม่ต้องมีการโหวตรอบตัดสิน`,
    noExecution: "จากผลโหวต ไม่มีใครถูกขับไล่",
    mediumResult: "ผลการทรงวิญญาณ",
    mediumResultLine: (name, isBlack) => `${name} คือ${isBlack ? "【ดำ (มนุษย์หมาป่า)】" : "【ขาว】"}`,
    continueButton: "ไปยังคืนถัดไป",
    waitingHost: "กำลังรอโฮสต์ไปยังคืนถัดไป…",
  },
  lastWords: {
    tag: (day) => `คำพูดสุดท้ายวันที่ ${day}`,
    title: "ผลโหวตออกมาแล้ว มีการขับไล่เกิดขึ้น",
    waitingFor: (name) => `มาฟังคำพูดสุดท้ายของ ${name} กัน`,
    youAreTitle: "คุณคือผู้ถูกเลือกให้ขับไล่",
    youAreDesc: "หากมีอะไรอยากบอกเป็นครั้งสุดท้าย พูดกับทุกคนได้เลย พูดจบแล้วกดปุ่มด้านล่างเพื่อไปต่อ",
    proceedButton: "พูดจบแล้ว (ไปยังโหวตรอบตัดสิน)",
    waitingHost: "กำลังรอตัวผู้เล่นเองหรือโฮสต์ดำเนินการต่อ…",
  },
  appealVote: {
    tag: (day) => `โหวตตัดสินชะตาวันที่ ${day}`,
    instructions: (name) => `จะขับไล่ ${name} จริงๆ หรือจะให้รอดชีวิต?`,
    cannotVote: "คุณไม่สามารถร่วมโหวตรอบนี้ได้ (เพราะเป็นผู้ถูกเสนอขับไล่) โปรดเฝ้าดูผลลัพธ์",
    executeOption: "ขับไล่",
    spareOption: "ให้รอดชีวิต",
    submitButton: "ยืนยัน",
    submittedButton: "โหวตแล้ว (เปลี่ยนแปลง)",
    progress: (s, t) => `โหวตแล้ว: ${s} / ${t} คน`,
    forceAdvanceButton: "ปิดโหวตโดยไม่รอทุกคน (สิทธิ์โฮสต์)",
  },
  allyNote: {
    title: "โน้ตลับเฉพาะพวกพ้อง",
    placeholder: "โน้ตสั้นๆ ที่ส่งถึงพวกพ้องเท่านั้น (เช่น เล็งเป้าหมายเลข 3)",
    hint: "แอบส่งข้อความสั้นๆ ถึงกันโดยไม่ให้คนรอบข้างสังเกตเห็น นี่ไม่ใช่แชท แต่เป็นโน้ตแผ่นเดียวที่แชร์ร่วมกัน",
    groupSize: (n) => `กำลังแชร์ร่วมกับ ${n} คน`,
  },
  gameOver: {
    primary: {
      village: "ฝ่ายชาวบ้านชนะ!",
      werewolf: "ฝ่ายมนุษย์หมาป่าชนะ!",
      draw: "เสมอกัน",
    },
    extra: {
      fox: "จิ้งจอกปีศาจก็รอดชีวิตด้วย ชนะเดี่ยว!",
      god: "เทพเจ้าก็รอดชีวิตด้วย ชนะเดี่ยว!",
      lover: "คู่รักทั้งสองรอดชีวิต ชนะด้วยกัน!",
    },
    allRoles: "บทบาทของทุกคน",
    eliminated: "ตกรอบ",
    newGameButton: "เล่นอีกครั้งกับสมาชิกชุดเดิม",
    waitingHost: "กำลังรอโฮสต์เริ่มเกมถัดไป…",
    leaveButton: "ออกจากห้อง",
    hostEndedTitle: "โฮสต์จบเกมแล้ว",
    hostEndedDesc: "เกมจบลงตรงนี้โดยยังไม่มีผลแพ้ชนะ",
  },
  confirm: {
    advanceTitle: "ไปยังขั้นตอนถัดไปหรือไม่?",
    advanceDesc: "โปรดตรวจสอบให้แน่ใจว่าทุกคนพร้อมแล้วก่อนดำเนินการต่อ การกระทำนี้ย้อนกลับไม่ได้",
    advanceAction: "ไปต่อ",
    forceResolveTitle: "ดำเนินการต่อแบบบังคับหรือไม่?",
    forceResolveDesc: "หากมีคนที่ยังไม่ได้ดำเนินการหรือโหวต ส่วนของคนนั้นจะถูกข้ามไป",
    forceResolveAction: "ดำเนินการต่อแบบบังคับ",
    newGameTitle: "เริ่มเกมใหม่กับสมาชิกชุดเดิมหรือไม่?",
    newGameDesc: "ผลลัพธ์ปัจจุบันจะถูกรีเซ็ต และเริ่มแจกบทบาทใหม่อีกครั้ง",
    newGameAction: "เริ่มเกมใหม่",
    skipHunterRevengeTitle: "ข้ามโอกาสพาไปด้วยของนายพรานหรือไม่?",
    skipHunterRevengeDesc: "หากข้าม นายพรานจะไม่สามารถพาใครไปด้วยได้",
    skipHunterRevengeAction: "ข้าม",
    endGameTitle: "จบเกมหรือไม่?",
    endGameDesc: "เกมปัจจุบันจะจบลงตรงนี้ และบทบาทของทุกคนจะถูกเปิดเผย การกระทำนี้ย้อนกลับไม่ได้",
    endGameAction: "จบเกม",
  },
  help: {
    button: "วิธีเล่น",
    title: "วิธีเล่นและกติกา",
    tldr: "พูดง่ายๆ คือ: เกมที่ชาวบ้านต้องพูดคุยกันเพื่อค้นหา “มนุษย์หมาป่า” ที่ซ่อนตัวอยู่ แล้วโหวตขับไล่ออกไป",
    tabFlow: "ลำดับขั้นตอน",
    tabWin: "เงื่อนไขชนะ",
    tabRoles: "บทบาท",
    intro:
      "มนุษย์หมาป่า DX เป็นเกมไซโคโลจิคัลที่แบ่งผู้เล่นออกเป็นฝ่าย “มนุษย์หมาป่า” ผู้ซ่อนตัวตน กับฝ่าย “ชาวบ้าน” ผู้ต้องการค้นหาตัวมนุษย์หมาป่าให้เจอ เกมจะสลับกันระหว่างช่วง “กลางวัน” (พูดคุยและโหวต) กับช่วง “กลางคืน” (การกระทำลับเฉพาะแต่ละบทบาท) ไปเรื่อยๆ จนกว่าฝ่ายชาวบ้านจะขับไล่มนุษย์หมาป่าออกไปได้หมด หรือจำนวนมนุษย์หมาป่าเท่ากับผู้รอดชีวิตฝ่ายอื่น การเปิดเผยบทบาท การกระทำตอนกลางคืน และการโหวต ทั้งหมดทำผ่านหน้าจอนี้ เนื่องจากไม่มีตัวจับเวลาอัตโนมัติ เกมจะดำเนินไปตามจังหวะของโฮสต์หรือเมื่อทุกคนดำเนินการครบ เล่นกันได้ตามจังหวะของตัวเอง",
    flowTitle: "ลำดับขั้นตอนของเกม",
    flowSteps: [
      { title: "เปิดเผยบทบาท", desc: "ทุกคนแอบตรวจสอบบทบาทของตัวเองแล้วกด “ยืนยันแล้ว” ระวังอย่าให้คนรอบข้างเห็น เกมจะไม่ดำเนินต่อจนกว่าทุกคนจะกดยืนยันครบ" },
      { title: "การพูดคุยครั้งแรก", desc: "ช่วงแนะนำตัวทันทีหลังเปิดเผยบทบาท ซึ่งยังไม่มีใครถูกโจมตี ไม่มีการโหวตในรอบนี้ พูดคุยกันเบาๆ แล้วโฮสต์จะสั่งเข้าสู่ “คืน” จริงๆ" },
      { title: "กลางคืน", desc: "เฉพาะบทบาทที่มีความสามารถ เช่น มนุษย์หมาป่า เทพพยากรณ์ บอดี้การ์ด จะแอบดำเนินการ ผู้ที่ไม่มีความสามารถเพียงรอโดยไม่ต้องทำอะไร นี่คือจุดที่การโจมตีของมนุษย์หมาป่าเกิดขึ้นเป็นครั้งแรก (มีการตั้งค่าให้คืนแรกไม่มีการโจมตีได้เช่นกัน)" },
      { title: "เช้า (ประกาศผล)", desc: "ประกาศสิ่งที่เกิดขึ้นระหว่างคืน (ใครตกเป็นเหยื่อ)" },
      { title: "พูดคุย", desc: "จากผลลัพธ์ของคืนที่ผ่านมา ทุกคนพูดคุยและใช้เหตุผลว่าใครคือมนุษย์หมาป่า ไม่มีการจำกัดเวลา พูดคุยกันจนกว่าจะพอใจ" },
      { title: "โหวต", desc: "เลือกคนที่จะขับไล่ 1 คนแล้วโหวต คนที่ได้คะแนนมากที่สุดจะถูกขับไล่ หากคะแนนเสมอกันจะเข้าสู่โหวตรอบตัดสิน เมื่อทุกคนโหวตครบจะเข้าสู่การประกาศผลโดยอัตโนมัติ" },
      { title: "วนซ้ำ", desc: "ทำซ้ำ “กลางคืน → เช้า → พูดคุย → โหวต” ไปเรื่อยๆ จนกว่าฝ่ายใดฝ่ายหนึ่งจะชนะ" },
    ],
    diagramTitle: "แผนภาพวงจรกลางวัน-กลางคืน",
    diagramIntro:
      "“กลางคืน” และช่วง “เช้า → พูดคุย → โหวต” ที่ตามมาทันที จะนับเป็นวันเดียวกัน เช่น เช้า พูดคุย และโหวตที่มาหลัง “คืนที่ 1” ทั้งหมดถือเป็น “วันที่ 1”",
    diagramDayLabel: (day) => `วันที่ ${day}`,
    diagramSameDayNote: "🌙 กลางคืน และ ☀️ กลางวัน (เช้า・พูดคุย・โหวต) ที่มีหมายเลขเดียวกันคือช่วงเดียวกัน",
    diagramOutcomeLabel: "ผลสรุป",
    diagramNoRoomNote: "การตั้งค่าจริงจะแตกต่างกันไปตามห้องที่คุณเข้าร่วม เมื่อเข้าห้องแล้วสามารถตรวจสอบได้จากแท็บ “บทบาท・ตั้งค่า” เช่นกัน",
    diagramSettingsHeading: "การตั้งค่าของห้องนี้",
    winTitle: "เงื่อนไขชนะ",
    winIntro: "วิธีตัดสินผลแพ้ชนะแตกต่างกันไปตามแต่ละฝ่าย และอาจมีหลายฝ่ายชนะพร้อมกันได้",
    winVillage: "ฝ่ายชาวบ้าน: ชนะเมื่อขับไล่มนุษย์หมาป่าออกไปได้หมดทุกคน",
    winWerewolf: "ฝ่ายมนุษย์หมาป่า: ชนะเมื่อจำนวนมนุษย์หมาป่ามากกว่าหรือเท่ากับจำนวนผู้รอดชีวิตที่ไม่ใช่มนุษย์หมาป่า",
    winFox: "จิ้งจอกปีศาจ: หากรอดชีวิตจนจบเกม จะชนะเดี่ยวโดยไม่สนใจว่าฝ่ายชาวบ้านหรือมนุษย์หมาป่าจะเป็นฝ่ายชนะ",
    winGod: "เทพเจ้า: หากรอดชีวิตจนจบเกม จะชนะเดี่ยวโดยไม่สนใจว่าฝ่ายชาวบ้านหรือมนุษย์หมาป่าจะเป็นฝ่ายชนะ",
    winLover: "คู่รัก: หากทั้งสองคนรอดชีวิตจนจบเกม จะชนะร่วมกัน",
    rolesTitle: "รายชื่อบทบาททั้ง 13 แบบ",
    rolesIntro: "คำอธิบายบทบาทของตัวเอง สามารถตรวจสอบได้ตลอดเกมจากปุ่ม “บทบาทของฉัน” ที่ด้านบนของหน้าจอ",
    close: "ปิด",
  },
  myRole: {
    button: "บทบาทของฉัน",
    title: "บทบาทของคุณ",
    dayLabel: (day) => (day === 0 ? "ตอนเปิดเผยบทบาท" : `วันที่ ${day}`),
    seerHistoryTitle: "คนที่เคยทำนายมาแล้ว",
    seerHistoryEmpty: "ยังไม่เคยทำนายใครเลย",
    mediumHistoryTitle: "คนที่เคยทรงวิญญาณตรวจสอบมาแล้ว",
    mediumHistoryEmpty: "ยังไม่มีคนที่ตรวจสอบ",
    noRoleYet: "ยังไม่มีการเปิดเผยบทบาท",
    close: "ปิด",
  },
  team: {
    village: "ฝ่ายชาวบ้าน",
    werewolf: "ฝ่ายมนุษย์หมาป่า",
    fox: "จิ้งจอกปีศาจ (ฝ่ายเดี่ยว)",
    god: "เทพเจ้า (ฝ่ายเดี่ยว)",
    lover: "คู่รัก (ฝ่ายเดี่ยว)",
  },
  deathCause: {
    attack: "ถูกมนุษย์หมาป่าโจมตี",
    execution: "ถูกขับไล่",
    curse: "ถูกเทพพยากรณ์ทำนายจนถูกสาปตาย",
    hunter: "ถูกนายพรานพาไปด้วย",
    lover_grief: "ตายตามคู่รักไป",
  },
  roles: {
    villager: {
      name: "ชาวบ้าน",
      short: "ชาวบ้านธรรมดาที่ไม่มีความสามารถพิเศษ",
      detail: "คุณคือชาวบ้าน ไม่มีความสามารถพิเศษใดๆ หากสงสัยใคร จงบอกเหตุผลให้ทุกคนฟังในช่วงพูดคุย แล้วช่วยกันใช้เหตุผลค้นหาความจริง",
    },
    seer: {
      name: "เทพพยากรณ์",
      short: "ทำนายได้คืนละ 1 คนว่าเป็นมนุษย์หมาป่าหรือไม่",
      detail:
        "คุณคือเทพพยากรณ์ ทุกคืนสามารถทำนายได้ 1 คนว่าเป็นมนุษย์หมาป่าหรือไม่ หากคนที่ทำนายเป็น “มนุษย์หมาป่า” จะได้ผลลัพธ์ดำ นอกจากนั้นจะได้ผลลัพธ์ขาว ผลลัพธ์นี้คนอื่นมองไม่เห็น จะบอกใครหรือไม่ในช่วงพูดคุยขึ้นอยู่กับคุณ นอกจากนี้หากทำนายจิ้งจอกปีศาจ จิ้งจอกปีศาจจะถูกสาปตายภายในคืนนั้น",
    },
    bodyguard: {
      name: "บอดี้การ์ด",
      short: "ปกป้องคนหนึ่งจากการโจมตีของมนุษย์หมาป่าได้คืนละ 1 คน",
      detail:
        "คุณคือบอดี้การ์ด ทุกคืนสามารถเลือกคนอื่นที่ไม่ใช่ตัวเอง 1 คน เพื่อปกป้องจากการโจมตีของมนุษย์หมาป่า หากคนที่คุณปกป้องเป็นเป้าหมายการโจมตีในคืนนั้น คนนั้นจะรอดชีวิต ไม่สามารถปกป้องคนเดิม 2 คืนติดต่อกันได้",
    },
    medium: {
      name: "ร่างทรง",
      short: "รู้ว่าคนที่ถูกขับไล่เป็นมนุษย์หมาป่าหรือไม่",
      detail: "คุณคือร่างทรง สามารถรู้ได้ภายในคืนนั้นว่าผู้เล่นที่ถูกขับไล่ในตอนกลางวันเป็น “มนุษย์หมาป่า” หรือไม่ ในคืนวันที่ 1 ซึ่งยังไม่มีใครถูกขับไล่ จะยังไม่มีใครให้ตรวจสอบ",
    },
    hunter: {
      name: "นายพราน",
      short: "เมื่อตัวเองตาย สามารถพาคนหนึ่งไปด้วยได้",
      detail:
        "คุณคือนายพราน เมื่อ “ถูกขับไล่” หรือเสียชีวิตจาก “การโจมตีของมนุษย์หมาป่า” คุณสามารถเลือกคนหนึ่งเพื่อพาไปด้วยพร้อมกัน (จะไม่เลือกก็ได้) ไม่จำเป็นต้องเปิดเผยบทบาทของตัวเองก่อน",
    },
    mason: {
      name: "สหายลับ",
      short: "ชาวบ้านตั้งแต่ 2 คนขึ้นไปที่รู้จักกันเป็นการลับ",
      detail: "คุณคือสหายลับ คุณรู้ว่าใครคือสหายลับคนอื่นอีกบ้าง แม้จะไม่มีความสามารถพิเศษ แต่เป็นเพื่อนร่วมทางที่ไว้ใจกันได้เต็มร้อยเปอร์เซ็นต์ ควรเลือกจังหวะเปิดเผยตัวตนให้ดี เพื่อไม่ให้มนุษย์หมาป่าจับพิรุธได้",
    },
    dictator: {
      name: "เผด็จการ",
      short: "ยุติการพูดคุยได้ 1 ครั้งตลอดเกม และตัดสินขับไล่เองโดยไม่ต้องโหวต",
      detail:
        "คุณคือเผด็จการ ตลอดทั้งเกมสามารถใช้ความสามารถนี้ได้เพียงครั้งเดียว โดยเปิดเผยตัวตนระหว่างการพูดคุยตอนกลางวัน ยุติการพูดคุยทันที แล้วตัดสินใจเองว่าจะขับไล่ใครโดยไม่ต้องมีการโหวต เป็นความสามารถที่ทรงพลังมาก จึงควรพิจารณาจังหวะการใช้ให้รอบคอบ",
    },
    werewolf: {
      name: "มนุษย์หมาป่า",
      short: "โจมตีคืนละ 1 คน รู้ว่าใครคือมนุษย์หมาป่าด้วยกัน",
      detail:
        "คุณคือมนุษย์หมาป่า คุณรู้ว่าใครคือมนุษย์หมาป่าคนอื่น ทุกคืนให้ปรึกษากับพวกพ้องแล้วเลือกโจมตี 1 คน ในช่วงพูดคุยให้แสร้งทำเป็นชาวบ้านเพื่อปกปิดตัวตน หากจำนวนมนุษย์หมาป่าเท่ากับฝ่ายชาวบ้านที่เหลือ ฝ่ายมนุษย์หมาป่าจะชนะ",
    },
    traitor: {
      name: "ผู้ทรยศ",
      short: "อยู่ฝ่ายมนุษย์หมาป่า แต่ไม่รู้ว่าใครคือมนุษย์หมาป่า",
      detail:
        "คุณคือผู้ทรยศ หากฝ่ายมนุษย์หมาป่าชนะ คุณก็ชนะไปด้วย แต่คุณไม่รู้ว่าใครคือมนุษย์หมาป่า แม้แต่การทำนายหรือทรงวิญญาณตรวจสอบคุณ ก็จะได้ผลลัพธ์ “ขาว (ไม่ใช่มนุษย์หมาป่า)” จึงยากที่จะถูกสงสัย จงแสร้งทำเป็นช่วยตามหามนุษย์หมาป่า พร้อมกับแอบกระทำการที่เป็นประโยชน์ต่อฝ่ายมนุษย์หมาป่าไปด้วย (ข้อควรระวัง: ต่างจากผู้สมรู้ร่วมคิด คุณเองไม่รู้ว่าใครคือมนุษย์หมาป่า)",
    },
    insider: {
      name: "ผู้สมรู้ร่วมคิด",
      short: "รู้ว่าใครคือมนุษย์หมาป่า และเป็นผู้ให้ความร่วมมือฝ่ายมนุษย์หมาป่า",
      detail:
        "คุณคือผู้สมรู้ร่วมคิด คุณรู้ว่าใครคือมนุษย์หมาป่า แม้แต่การทำนายหรือทรงวิญญาณตรวจสอบคุณ ก็จะได้ผลลัพธ์ “ขาว (ไม่ใช่มนุษย์หมาป่า)” จึงเป็นตำแหน่งที่ยากจะถูกสงสัยที่สุดในฝ่ายมนุษย์หมาป่า หากปกป้องมนุษย์หมาป่าอย่างโจ่งแจ้งจะถูกจับพิรุธได้ จงแสร้งทำเป็นชาวบ้านพร้อมกับแอบช่วยเหลืออย่างแนบเนียน (ข้อควรระวัง: ต่างจากผู้ทรยศ คุณรู้ว่าใครคือมนุษย์หมาป่าทุกคน)",
    },
    fox: {
      name: "จิ้งจอกปีศาจ",
      short: "ฝ่ายเดี่ยวที่ไม่ตายแม้ถูกมนุษย์หมาป่าโจมตี แต่ตายหากถูกทำนาย",
      detail:
        "คุณคือจิ้งจอกปีศาจ เป็นฝ่ายเดี่ยวที่ไม่ได้อยู่ฝ่ายชาวบ้านหรือมนุษย์หมาป่า แม้ถูกมนุษย์หมาป่าโจมตีก็จะไม่ตาย แต่หากถูกเทพพยากรณ์ทำนาย จะถูกสาปตายภายในคืนนั้น ไม่ว่าฝ่ายชาวบ้านหรือมนุษย์หมาป่าจะเป็นฝ่ายชนะ หากคุณรอดชีวิตจนจบเกม คุณจะเป็นฝ่ายชนะ",
    },
    god: {
      name: "เทพเจ้า",
      short: "ฝ่ายเดี่ยวที่รู้บทบาทของทุกคน หากรอดชีวิตจะชนะ",
      detail:
        "คุณคือเทพเจ้า รู้บทบาทของผู้เล่นทุกคนตั้งแต่เริ่มเกม แม้ถูกทำนายหรือทรงวิญญาณตรวจสอบ ก็จะได้ผลลัพธ์ “ขาว” เสมอ ไม่ว่าฝ่ายชาวบ้านหรือมนุษย์หมาป่าจะเป็นฝ่ายชนะ หากคุณรอดชีวิตจนจบเกม คุณจะเป็นฝ่ายชนะ",
    },
    lover: {
      name: "คู่รัก",
      short: "จับคู่กัน 2 คน หากอีกฝ่ายตาย ตัวเองก็จะตายตามไปด้วย",
      detail:
        "คุณคือคู่รัก คุณรู้ว่าคู่รักอีกคนคือใคร หากฝ่ายใดฝ่ายหนึ่งเสียชีวิตจากการถูกขับไล่หรือถูกโจมตี อีกฝ่ายจะตายตามไปด้วยเช่นกัน หากทั้งสองคนรอดชีวิตจนจบเกม จะถือว่าชนะร่วมกัน",
    },
  },
  errors: {
    ROOM_NOT_FOUND: "ไม่พบห้องนี้ กรุณาตรวจสอบรหัสห้องอีกครั้ง",
    GAME_ALREADY_STARTED: "ไม่สามารถเข้าร่วมได้ เนื่องจากเกมเริ่มไปแล้ว",
    ROOM_FULL: "จำนวนผู้เข้าร่วมเต็มแล้ว",
    REJOIN_FAILED: "เชื่อมต่อใหม่ไม่สำเร็จ",
    PLAYER_NOT_FOUND: "ไม่พบข้อมูลผู้เล่น",
    NOT_HOST: "เฉพาะโฮสต์เท่านั้นที่ทำการนี้ได้",
    ALREADY_STARTED: "เริ่มเกมไปแล้ว",
    NOT_IN_ROOM: "คุณไม่ได้อยู่ในห้อง",
    MIN_PLAYERS: "จำนวนผู้เล่นไม่เพียงพอ",
    KICKED: "คุณถูกโฮสต์เตะออกจากห้องแล้ว",
    INVALID_ROOM_CODE: "กรุณาใส่รหัสห้องเป็นตัวอักษรและตัวเลขภาษาอังกฤษ 5-8 ตัว",
    ROOM_CODE_TAKEN: "รหัสห้องนี้ถูกใช้ไปแล้ว กรุณาลองรหัสอื่น",
  },
  validation: (issue) => {
    switch (issue.code) {
      case "SEAT_MISMATCH":
        return `จำนวนบทบาททั้งหมด (${issue.total} คน) ไม่ตรงกับจำนวนผู้เข้าร่วม (${issue.playerCount} คน)`;
      case "NO_WEREWOLF":
        return "ต้องมีมนุษย์หมาป่าอย่างน้อย 1 คน";
      case "MASON_ODD":
        return "สหายลับต้องตั้งค่าเป็นกลุ่มละ 2 คน";
      case "LOVER_INVALID":
        return "คู่รักต้องตั้งค่าเป็นคู่ละ 2 คน";
      case "WOLF_TOO_MANY":
        return "จำนวนฝ่ายมนุษย์หมาป่ามากเกินไป จะทำให้ฝ่ายชาวบ้านเสียเปรียบตั้งแต่เริ่มเกม";
    }
  },
};

const id: Strings = {
  meta: {
    title: "Werewolf DX Online",
    description:
      "Permainan psikologis berbasis obrolan dengan 13 peran, tempat kamu menemukan Werewolf yang bersembunyi lewat obrolan dan penalaran. Dimainkan bersama teman-teman yang berkumpul, cukup dengan ponsel di tangan.",
  },
  common: {
    host: "Host",
    connected: "Terhubung",
    disconnected: "Terputus",
    reconnecting: "Menghubungkan ulang…",
    connecting: "Menghubungkan…",
    kicked: "Kamu dikeluarkan dari ruang oleh host.",
    seconds: (n) => `${n} detik`,
    timeRemaining: "Waktu tersisa",
    close: "Tutup",
    cancel: "Batal",
    people: (n) => `${n} orang`,
    listSeparator: ", ",
    confirmProceed: "Lanjutkan",
    transitioning: "Berpindah ke tampilan berikutnya…",
    on: "ON",
    off: "OFF",
    themeToggleToLight: "Beralih ke mode terang",
    themeToggleToDark: "Beralih ke mode gelap",
    menu: "Menu",
    themeLabel: "Tema",
    languageLabel: "Bahasa",
    endGameButton: "Akhiri Permainan",
    officialRuleBadge: "Aturan Resmi",
    optionalRuleBadge: "Aturan Opsional",
  },
  entry: {
    title: "Werewolf DX Online",
    subtitle:
      "Permainan psikologis berbasis obrolan dengan 13 peran, tempat kamu menemukan Werewolf yang bersembunyi lewat obrolan dan penalaran. Bisa dimainkan di mana saja, cukup dengan ponsel di tangan.",
    cardTitle: "Mulai",
    cardDesc: "Buat ruang baru, atau gabung dengan kode sandi.",
    tabCreate: "Buat Ruang",
    tabJoin: "Gabung Ruang",
    nameLabel: "Nama Panggilan",
    namePlaceholder: "contoh: Budi",
    createButton: "Buat Ruang",
    codeLabel: "Kode Sandi",
    codePlaceholder: "contoh: AB3XZ",
    joinButton: "Gabung",
    footerNote: "*Aplikasi ini tidak memiliki fitur obrolan. Mainkan sambil mengobrol langsung.",
    helpButton: "Lihat Cara Main & Aturan",
    customCodeLabel: "Kode Ruang (opsional)",
    customCodePlaceholder: "Kosongkan untuk dibuat otomatis",
    customCodeHint: "5–8 karakter huruf/angka. Jika tidak diisi, kode akan dibuat otomatis.",
    avatarLabel: "Foto Profil (opsional)",
    avatarAddButton: "Tambah Foto",
    avatarChangeButton: "Ganti Foto",
    avatarRemoveButton: "Hapus Foto",
    avatarTooLarge: "Ukuran gambar terlalu besar (maksimal 8MB)",
    avatarUnsupported: "Silakan pilih file gambar",
    castLabel: "13 Peran yang Muncul",
  },
  profile: {
    editButton: "Edit Profil",
    title: "Edit Profil",
    desc: "Nama tampilan dan foto profil bisa diubah kapan saja.",
    nameLabel: "Nama Panggilan",
    avatarLabel: "Foto Profil",
    saveButton: "Simpan",
    savedToast: "Profil berhasil diperbarui",
    closeButton: "Tutup",
  },
  lobby: {
    codeLabel: "Kode Sandi",
    copyCode: "Salin Kode",
    copyLink: "Salin Tautan Undangan",
    shareLink: "Bagikan Tautan Undangan",
    shareMessage: (code) => `Kamu diundang ke ruang Werewolf DX Online. Kode sandi: ${code}`,
    copyCodeToast: "Kode berhasil disalin",
    copyLinkToast: "Tautan undangan berhasil disalin",
    copyErrorToast: "Gagal menyalin",
    participants: (n) => `Peserta (${n} orang)`,
    waitingForMorePlayers: (n) => `Permainan bisa dimulai setelah ${n} orang lagi bergabung`,
    composition: "Susunan Peran",
    compositionReadonly: "Susunan Peran (sedang diatur host)",
    compositionReadonlyDesc: (wolves, total) => `Termasuk ${wolves} Werewolf, total ${total} peran telah diatur.`,
    compositionEmpty: "Susunan peran belum diatur.",
    roomInfoButton: "Peran & Pengaturan",
    roomInfoTitle: "Susunan Peran & Pengaturan Permainan Kali Ini",
    suggest: "Susunan Rekomendasi",
    seatTotal: "Total Peran",
    seatTotalOf: (total, count) => `${total} / ${count} orang`,
    soloGroupLabel: "Kubu Tunggal",
    startButton: "Mulai Permainan",
    waitingHost: "Menunggu host memulai…",
    leaveButton: "Keluar",
    settingsTitle: "Pengaturan Permainan",
    officialRulesSectionTitle: "Aturan Dasar",
    extraRulesSectionTitle: "Aturan Tambahan",
    extraRulesSectionDesc:
      "Mulai dari sini ke bawah adalah aturan perluasan khusus aplikasi ini. Pengaturan ini tidak ada dalam aturan dasar, jadi silakan sesuaikan bebas agar permainan makin seru.",
    revealOnDeath: "Tampilkan peran saat gugur",
    allowFirstNightKill: "Werewolf bisa menyerang di malam pertama",
    allowFirstNightKillDesc:
      "Jika dimatikan, siapa pun yang diserang Werewolf pada malam pertama (malam hari ke-1) tidak akan mati. Cocok untuk kelompok yang banyak pemain barunya. Mulai malam ke-2, serangan berlaku seperti biasa.",
    allowFirstVoteExecution: "Hasil voting pertama benar-benar mengeksekusi",
    allowFirstVoteExecutionDesc:
      "Jika dimatikan, siapa pun yang terpilih pada voting pertama (voting hari ke-1) tidak benar-benar dieksekusi dan tetap hidup. Mulai voting hari ke-2, eksekusi berlaku seperti biasa.",
    allowWolfFriendlyFire: "Werewolf bisa menyerang sesama Werewolf",
    allowWolfFriendlyFireDesc: "Jika dinyalakan, Werewolf bisa memilih sesama Werewolf sebagai target serangan (biasanya tidak bisa).",
    seerFirstNightDivine: "Peramal bisa meramal satu orang saat konfirmasi peran",
    seerFirstNightDivineDesc:
      "Cara main di mana Peramal bisa bebas meramal satu orang saat konfirmasi peran (disarankan untuk 7 pemain ke atas). Peramal bebas memilih meramal atau tidak. Jika dimatikan, ramalan baru dimulai dari malam pertama.",
    allowSelfVote: "Bisa memilih diri sendiri saat voting",
    revealVoteChoices: "Tampilkan pilihan voting ke semua orang",
    revealVoteChoicesDesc:
      "Jika dinyalakan, selama fase voting semua orang bisa melihat secara langsung siapa memilih siapa. Jika dimatikan, seperti biasa hanya jumlah suara yang ditampilkan.",
    allowBodyguardSelfGuard: "Dokter bisa melindungi diri sendiri",
    secondTieExecutesRandomly: "Jika hasil voting susulan tetap seri, eksekusi acak",
    secondTieExecutesRandomlyDesc: "Jika dimatikan, apabila voting susulan tetap tidak menghasilkan keputusan, tidak ada yang dieksekusi dan hari itu berakhir.",
    dictatorCanTargetSelf: "Diktator bisa menjadikan diri sendiri target eksekusi",
    settingsPacingNote:
      "Aplikasi ini tidak memiliki timer otomatis. Setiap tampilan berpindah berdasarkan operasi host, atau setelah tindakan semua orang selesai. Silakan bermain dengan ritme kalian sendiri.",
    kick: "Keluarkan",
    makeHost: "Jadikan Host",
    makeHostConfirmTitle: "Ganti host?",
    makeHostConfirmDesc: (name) => `${name} akan menjadi host baru. Kamu akan kehilangan wewenang host dan tidak bisa lagi mengoperasikan jalannya permainan.`,
    makeHostConfirmAction: "Ganti",
  },
  roleReveal: {
    label: "Peran Kamu",
    tapToReveal: "Ketuk untuk melihat",
    privacyHint: "Pastikan tidak ada orang lain yang melihat layarmu",
    allies: "Rekan Kamu",
    allRoles: "Peran Semua Pemain",
    waitingOthers: "Kamu sudah mengonfirmasi. Setelah semua orang selesai, permainan akan otomatis lanjut ke diskusi pertama.",
    confirmButton: "Sudah Dikonfirmasi",
    progress: (s, t) => `Sudah konfirmasi: ${s} / ${t} orang`,
    earlyDivineTitle: "Gunakan Kekuatan Peramal Sekarang (Opsional)",
    earlyDivineDesc: "Saat konfirmasi peran, kamu bisa meramal satu orang. Boleh juga dilewati tanpa menggunakannya.",
    earlyDivineButton: "Ramal Orang Ini",
    earlyDivineSkipNote: "Kamu juga bisa langsung menekan \"Sudah Dikonfirmasi\" tanpa meramal.",
    earlyDivineDone: "Kamu sudah meramal. Hasilnya seperti berikut.",
  },
  night: {
    tag: (day) => `Malam Hari ke-${day}`,
    deadNotice: "Kamu sudah gugur. Saksikan saja malam ini berlalu dengan tenang…",
    dormant: "Malam semakin larut…",
    dormantDesc: "Mohon tunggu hingga pemain dengan kekuatan khusus selesai bertindak.",
    progress: (s, t) => `Tindakan selesai: ${s} / ${t} orang`,
    submitButton: "Putuskan",
    resubmitButton: "Terkirim (ubah)",
    previousSeerResult: (day) =>
      day === 0 ? "Hasil Ramalan Sebelumnya (saat konfirmasi peran)" : `Hasil Ramalan Sebelumnya (Hari ke-${day})`,
    seerResultLine: (name, isBlack) => `${name} ternyata ${isBlack ? "【Hitam (Werewolf)】" : "【Putih】"}`,
    actions: {
      attack: { title: "Siapa yang akan diserang?", desc: "Diskusikan dengan sesama Werewolf, lalu pilih target serangan malam ini.", skip: "Tidak menyerang malam ini" },
      guard: { title: "Siapa yang akan dilindungi?", desc: "Pilih orang yang akan dilindungi dari serangan Werewolf. Kamu tidak bisa melindungi diri sendiri. Orang yang kamu lindungi malam sebelumnya juga tidak bisa dipilih lagi.", skip: "Tidak melindungi siapa pun malam ini" },
      divine: { title: "Siapa yang akan diramal?", desc: "Ramal apakah orang ini Werewolf atau bukan.", skip: "Tidak meramal malam ini" },
    },
    firstNightKillDisabledNotice: "Karena pengaturan ini, siapa pun yang diserang pada malam pertama (hari ke-1) tidak akan mati. Mulai malam hari ke-2, serangan berlaku seperti biasa.",
    forceAdvanceButton: "Lanjutkan tanpa menunggu semua orang (operasi host)",
    wolfSelectionsTitle: "Target pilihan sesama Werewolf (untuk diskusi)",
    wolfSelectionsEmpty: "Belum ada yang memilih",
    wolfSelectionsLine: (name, targetName) => `${name}: ${targetName ?? "Belum memilih"}`,
    wolfConsensusNeeded: "Malam belum akan berakhir sampai semua Werewolf memilih target yang sama (atau semua memilih \"tidak menyerang\"). Diskusikan bersama untuk menentukan satu pilihan.",
    wolfConsensusReached: "Semua sudah sepakat.",
  },
  hunterRevenge: {
    title: "Identitas Pemburu Terungkap!",
    waitingFor: (name) => `${name} sedang memilih orang yang akan dibawa serta…`,
    youAre: "Kamu adalah Pemburu. Kamu boleh memilih satu orang untuk dibawa mati bersamamu (boleh juga tidak memilih siapa pun).",
    skip: "Tidak membawa siapa pun",
    submit: "Putuskan",
    submitted: "Terkirim",
    hostSkipButton: "Tetapkan \"tidak membawa siapa pun\" untuk Pemburu (operasi host)",
  },
  dayResult: {
    tag: (day) => `Pagi Hari ke-${day}`,
    noDeaths: "Tidak ada yang menjadi korban semalam. Pagi yang damai.",
    seerResult: "Hasil Ramalan",
    continueButton: "Lanjut ke Waktu Diskusi",
    waitingHost: "Menunggu host melanjutkan ke waktu diskusi…",
  },
  discussion: {
    tag: (day) => `Waktu Diskusi Hari ke-${day}`,
    firstRoundTag: "Diskusi Pertama",
    firstRoundNotice: "Ini adalah diskusi pertama, tepat setelah konfirmasi peran selesai. Belum ada yang diserang. Di sini juga belum ada voting eksekusi. Setelah mengobrol bebas, host akan melanjutkan ke \"malam\" yang sesungguhnya.",
    proceedToNightButton: "Selesaikan Diskusi & Lanjut ke Malam",
    survivors: "Pemain yang Bertahan",
    dictatorButton: "Gunakan Wewenang Diktator",
    dictatorConfirmTitle: "Gunakan wewenang Diktator?",
    dictatorConfirmDesc: "Diskusi akan dihentikan paksa, dan kamu akan menentukan sendiri siapa yang dieksekusi tanpa voting. Kekuatan ini hanya bisa dipakai sekali seumur permainan.",
    dictatorConfirmAction: "Eksekusi Orang Ini",
    skipButton: "Selesaikan Diskusi & Lanjut ke Voting",
    waitingHost: "Menunggu host melanjutkan. Tidak ada batas waktu, jadi diskusikan sampai semua puas.",
    runoffNotice: "Karena hasil voting seri, ini adalah diskusi sebelum voting susulan. Jika masih belum ada keputusan, hasil akan ditentukan secara acak.",
    runoffCandidatesLabel: "Kandidat Voting Susulan",
  },
  vote: {
    tag: (day) => `Waktu Voting Hari ke-${day}`,
    runoffTag: (day) => `Voting Susulan Hari ke-${day}`,
    cannotVote: "Kamu tidak bisa memberikan suara. Saksikan saja hasilnya.",
    instructions: "Pilih satu orang yang akan dieksekusi",
    runoffNotice: "Karena hasilnya seri, ini adalah voting susulan dengan kandidat terbatas. Jika masih belum ada keputusan, hasil akan ditentukan secara acak.",
    submitButton: "Beri Suara",
    submittedButton: "Sudah Memilih (ubah)",
    progress: (s, t) => `Voting selesai: ${s} / ${t} orang`,
    forceAdvanceButton: "Tutup voting tanpa menunggu semua orang (operasi host)",
    voteChoicesTitle: "Status Voting (terlihat semua orang karena pengaturan tampilkan ON)",
    voteChoicesLine: (voterName, targetName) => `${voterName} → ${targetName}`,
  },
  executionResult: {
    tag: (day) => `Hasil Eksekusi Hari ke-${day}`,
    executed: (name) => `${name} telah dieksekusi`,
    spared: (name) => `Berdasarkan hasil voting susulan, ${name} dibiarkan hidup`,
    sparedFirstVoteRule: (name) =>
      `Karena pengaturan "voting pertama tidak benar-benar mengeksekusi", ${name} dibiarkan hidup tanpa voting susulan`,
    noExecution: "Berdasarkan hasil voting, tidak ada yang dieksekusi.",
    mediumResult: "Hasil Penerawangan",
    mediumResultLine: (name, isBlack) => `${name} ternyata ${isBlack ? "【Hitam (Werewolf)】" : "【Putih】"}`,
    continueButton: "Lanjut ke Malam Berikutnya",
    waitingHost: "Menunggu host melanjutkan ke malam berikutnya…",
  },
  lastWords: {
    tag: (day) => `Kata-Kata Terakhir Hari ke-${day}`,
    title: "Hasil Voting Memutuskan Eksekusi",
    waitingFor: (name) => `Mari dengarkan kata-kata terakhir dari ${name}`,
    youAreTitle: "Kamu Terpilih untuk Dieksekusi",
    youAreDesc: "Jika ada hal terakhir yang ingin disampaikan, silakan bicara ke semua orang. Setelah selesai, lanjutkan dengan tombol di bawah.",
    proceedButton: "Sudah Selesai Bicara (Lanjut ke Voting Susulan)",
    waitingHost: "Menunggu orang yang bersangkutan atau host melanjutkan…",
  },
  appealVote: {
    tag: (day) => `Voting Susulan Bertahan Hidup Hari ke-${day}`,
    instructions: (name) => `Apakah ${name} benar-benar akan dieksekusi, atau dibiarkan hidup?`,
    cannotVote: "Kamu tidak bisa ikut voting susulan ini (karena menjadi calon yang dieksekusi). Saksikan saja hasilnya.",
    executeOption: "Eksekusi",
    spareOption: "Biarkan Hidup",
    submitButton: "Putuskan",
    submittedButton: "Sudah Memilih (ubah)",
    progress: (s, t) => `Voting selesai: ${s} / ${t} orang`,
    forceAdvanceButton: "Tutup voting tanpa menunggu semua orang (operasi host)",
  },
  allyNote: {
    title: "Catatan Khusus Rekan",
    placeholder: "Pesan singkat khusus untuk sesama rekan (contoh: incar nomor 3)",
    hint: "Sampaikan diam-diam dengan kata-kata singkat agar tidak disadari orang lain. Ini dibagikan sebagai satu catatan, bukan obrolan.",
    groupSize: (n) => `Dibagikan dengan ${n} orang`,
  },
  gameOver: {
    primary: {
      village: "Kubu Warga Menang!",
      werewolf: "Kubu Werewolf Menang!",
      draw: "Seri",
    },
    extra: {
      fox: "Rubah Siluman juga selamat, menang sendirian!",
      god: "Dewa juga selamat, menang sendirian!",
      lover: "Kedua Kekasih selamat, menang bersama!",
    },
    allRoles: "Peran Semua Pemain",
    eliminated: "Gugur",
    newGameButton: "Main Lagi dengan Anggota yang Sama",
    waitingHost: "Menunggu host memulai permainan berikutnya…",
    leaveButton: "Keluar",
    hostEndedTitle: "Host Mengakhiri Permainan",
    hostEndedDesc: "Tidak ada pemenang, permainan berakhir di sini.",
  },
  confirm: {
    advanceTitle: "Lanjutkan?",
    advanceDesc: "Pastikan semua orang sudah siap sebelum melanjutkan. Tindakan ini tidak bisa dibatalkan.",
    advanceAction: "Lanjutkan",
    forceResolveTitle: "Lanjutkan secara paksa?",
    forceResolveDesc: "Jika masih ada yang belum bertindak atau memberi suara, bagiannya akan dilewati.",
    forceResolveAction: "Lanjutkan Paksa",
    newGameTitle: "Mulai permainan baru dengan anggota yang sama?",
    newGameDesc: "Hasil saat ini akan direset, dan permainan dimulai lagi dari pembagian peran.",
    newGameAction: "Mulai Permainan Baru",
    skipHunterRevengeTitle: "Lewati kesempatan membawa serta korban?",
    skipHunterRevengeDesc: "Jika dilewati, Pemburu tidak akan membawa siapa pun mati bersamanya.",
    skipHunterRevengeAction: "Lewati",
    endGameTitle: "Akhiri permainan?",
    endGameDesc: "Permainan saat ini akan berakhir di sini, dan peran semua orang akan diperlihatkan. Tindakan ini tidak bisa dibatalkan.",
    endGameAction: "Akhiri",
  },
  help: {
    button: "Cara Main",
    title: "Cara Main & Aturan",
    tldr: "Singkatnya: sebuah permainan tempat warga mencari \"Werewolf\" yang menyembunyikan identitasnya lewat diskusi, lalu mengeksekusinya lewat voting.",
    tabFlow: "Alur",
    tabWin: "Syarat Menang",
    tabRoles: "Peran",
    intro:
      "Werewolf DX adalah permainan psikologis yang dimainkan dengan terbagi menjadi dua kubu: \"Werewolf\" yang menyembunyikan identitasnya, dan \"Warga\" yang ingin menemukannya. \"Siang\" (diskusi dan voting) serta \"Malam\" (tindakan rahasia tiap peran) berlangsung bergantian, hingga warga berhasil mengeksekusi semua Werewolf, atau jumlah Werewolf sudah sama banyak dengan warga yang tersisa. Konfirmasi peran, tindakan malam, dan voting semuanya dilakukan lewat layar ini. Tidak ada timer otomatis, jadi permainan berjalan sesuai ritme kalian sendiri, menunggu operasi host atau tindakan semua orang selesai.",
    flowTitle: "Alur Permainan",
    flowSteps: [
      { title: "Konfirmasi Peran", desc: "Semua orang diam-diam memeriksa perannya masing-masing, lalu menekan \"Sudah Dikonfirmasi\". Pastikan layarmu tidak terlihat orang lain. Permainan baru lanjut setelah semua orang menekan tombol ini." },
      { title: "Diskusi Pertama", desc: "Waktu perkenalan diri tepat setelah konfirmasi peran, sebelum ada yang diserang. Belum ada voting di sini. Setelah mengobrol santai, host akan melanjutkan ke \"malam\" yang sesungguhnya." },
      { title: "Malam", desc: "Hanya peran dengan kekuatan khusus—seperti Werewolf, Peramal, dan Dokter—yang diam-diam bertindak. Yang tidak punya kekuatan cukup menunggu. Di sinilah serangan Werewolf pertama kali terjadi (ada pengaturan untuk menonaktifkan serangan khusus pada malam pertama)." },
      { title: "Pagi (Pengumuman Hasil)", desc: "Diumumkan apa yang terjadi semalam (siapa yang menjadi korban)." },
      { title: "Diskusi", desc: "Berdasarkan hasil malam, semua orang berdiskusi dan menebak siapa Werewolf-nya. Tidak ada batas waktu, jadi diskusikan sampai puas." },
      { title: "Voting", desc: "Pilih satu orang yang ingin dieksekusi. Orang dengan suara terbanyak akan dieksekusi; jika seri, akan ada voting susulan. Setelah semua orang memilih, hasil akan otomatis diumumkan." },
      { title: "Berulang", desc: "\"Malam → Pagi → Diskusi → Voting\" akan terus berulang sampai salah satu kubu menang." },
    ],
    diagramTitle: "Siklus Malam dan Siang dalam Diagram",
    diagramIntro:
      "\"Malam\" dan \"Pagi → Diskusi → Voting\" yang mengikutinya dihitung sebagai satu hari yang sama. Misalnya, pagi, diskusi, dan voting setelah \"Malam 1\" semuanya termasuk \"Hari ke-1\".",
    diagramDayLabel: (day) => `Hari ke-${day}`,
    diagramSameDayNote: "🌙 Malam dan ☀️ Siang (pagi, diskusi, voting) dengan nomor yang sama termasuk dalam satu rangkaian yang sama.",
    diagramOutcomeLabel: "Keputusan",
    diagramNoRoomNote: "Pengaturan sebenarnya berbeda-beda tergantung ruang yang kamu ikuti. Setelah masuk ruang, kamu juga bisa memeriksanya di tab \"Peran & Pengaturan\".",
    diagramSettingsHeading: "Pengaturan Ruang Ini",
    winTitle: "Syarat Menang",
    winIntro: "Cara menang berbeda untuk tiap kubu. Beberapa kubu bisa menang bersamaan.",
    winVillage: "Kubu Warga: menang jika berhasil mengeksekusi semua Werewolf tanpa sisa.",
    winWerewolf: "Kubu Werewolf: menang jika jumlah Werewolf sudah sama banyak atau lebih dari sisa pemain non-Werewolf.",
    winFox: "Rubah Siluman: menang sendirian jika bertahan hidup sampai permainan berakhir, terlepas dari kubu mana yang menang.",
    winGod: "Dewa: menang sendirian jika bertahan hidup sampai permainan berakhir, terlepas dari kubu mana yang menang.",
    winLover: "Kekasih: jika keduanya masih hidup saat permainan berakhir, keduanya menang bersama.",
    rolesTitle: "Daftar Peran (13 Jenis)",
    rolesIntro: "Penjelasan tentang peranmu sendiri bisa dilihat kapan saja selama permainan lewat tombol \"Peran Kamu\" di bagian atas layar.",
    close: "Tutup",
  },
  myRole: {
    button: "Peran Kamu",
    title: "Peran Kamu",
    dayLabel: (day) => (day === 0 ? "Saat Konfirmasi Peran" : `Hari ke-${day}`),
    seerHistoryTitle: "Orang yang Sudah Diramal",
    seerHistoryEmpty: "Belum ada yang diramal.",
    mediumHistoryTitle: "Orang yang Sudah Diterawang",
    mediumHistoryEmpty: "Belum ada yang diterawang.",
    noRoleYet: "Peran belum dikonfirmasi.",
    close: "Tutup",
  },
  team: {
    village: "Kubu Warga",
    werewolf: "Kubu Werewolf",
    fox: "Rubah Siluman (Kubu Tunggal)",
    god: "Dewa (Kubu Tunggal)",
    lover: "Kekasih (Kubu Tunggal)",
  },
  deathCause: {
    attack: "Diserang Werewolf",
    execution: "Dieksekusi",
    curse: "Diramal Peramal dan tewas terkutuk",
    hunter: "Dibawa mati oleh Pemburu",
    lover_grief: "Menyusul kepergian Kekasihnya",
  },
  roles: {
    villager: {
      name: "Warga",
      short: "Warga biasa tanpa kekuatan khusus",
      detail: "Kamu adalah Warga. Kamu tidak memiliki kekuatan khusus. Jika mencurigai seseorang, sampaikan alasanmu ke semua orang saat diskusi, lalu bernalar bersama.",
    },
    seer: {
      name: "Peramal",
      short: "Meramal satu orang tiap malam untuk mengetahui apakah dia Werewolf",
      detail:
        "Kamu adalah Peramal. Setiap malam, kamu bisa meramal satu orang. Jika orang yang diramal adalah \"Werewolf\", hasilnya hitam; jika bukan, hasilnya putih. Hasil ini tidak terlihat oleh orang lain, jadi bagaimana cara menyampaikannya saat diskusi tergantung kamu. Perlu diketahui, jika kamu meramal Rubah Siluman, ia akan tewas terkutuk malam itu juga.",
    },
    bodyguard: {
      name: "Dokter",
      short: "Melindungi satu orang tiap malam dari serangan Werewolf",
      detail:
        "Kamu adalah Dokter. Setiap malam, pilih satu orang selain dirimu sendiri untuk dilindungi dari serangan Werewolf. Jika orang yang kamu lindungi menjadi target serangan malam itu, dia akan selamat. Kamu tidak bisa melindungi orang yang sama dua malam berturut-turut.",
    },
    medium: {
      name: "Cenayang",
      short: "Mengetahui apakah orang yang dieksekusi adalah Werewolf",
      detail: "Kamu adalah Cenayang. Kamu bisa mengetahui, pada malam harinya, apakah pemain yang dieksekusi siang tadi adalah \"Werewolf\" atau bukan. Pada malam hari ke-1, karena belum ada yang dieksekusi, belum ada yang bisa diterawang.",
    },
    hunter: {
      name: "Pemburu",
      short: "Bisa membawa satu orang mati bersamamu saat kamu gugur",
      detail:
        "Kamu adalah Pemburu. Saat \"dieksekusi\", atau saat gugur karena \"diserang Werewolf\", kamu bisa menunjuk satu orang untuk dibawa mati bersamamu (boleh juga tidak menunjuk siapa pun). Kamu tidak perlu mengungkap perannya sendiri.",
    },
    mason: {
      name: "Sekutu",
      short: "Warga yang saling mengenal, beranggotakan 2 orang atau lebih",
      detail: "Kamu adalah Sekutu. Kamu tahu siapa saja Sekutu lainnya. Tidak ada kekuatan khusus, tapi kalian adalah rekan berharga yang bisa saling percaya sepenuhnya. Pilih waktu yang tepat untuk mengungkap identitas kalian, agar tidak dicurigai Werewolf.",
    },
    dictator: {
      name: "Diktator",
      short: "Sekali seumur permainan, bisa menghentikan diskusi dan menentukan eksekusi secara sepihak",
      detail:
        "Kamu adalah Diktator. Sekali saja seumur permainan, kamu bisa mengungkap dirimu saat diskusi siang untuk menghentikan diskusi secara paksa, lalu menentukan sendiri siapa yang dieksekusi tanpa voting. Ini kekuatan yang sangat besar, jadi pertimbangkan baik-baik kapan waktu terbaik untuk menggunakannya.",
    },
    werewolf: {
      name: "Werewolf",
      short: "Menyerang satu orang tiap malam. Mengetahui sesama Werewolf",
      detail:
        "Kamu adalah Werewolf. Kamu tahu siapa saja sesama Werewolf. Setiap malam, diskusikan dengan rekanmu untuk memilih satu orang yang akan diserang. Saat diskusi siang, berpura-puralah menjadi warga biasa agar identitasmu tidak ketahuan. Kubu Werewolf menang jika jumlah kalian sudah sama banyak dengan warga yang tersisa.",
    },
    traitor: {
      name: "Pengkhianat",
      short: "Bagian dari kubu Werewolf, tapi tidak tahu siapa saja Werewolf-nya",
      detail:
        "Kamu adalah Pengkhianat. Kamu menang jika kubu Werewolf menang, tapi kamu tidak tahu siapa saja Werewolf-nya. Ramalan dan penerawangan terhadapmu akan menunjukkan hasil \"putih (bukan Werewolf)\", jadi kamu sulit dicurigai. Berpura-puralah ikut mencari Werewolf, sambil diam-diam bertindak menguntungkan kubu Werewolf (berbeda dari Kaki Tangan, kamu sendiri tidak tahu siapa saja Werewolf-nya).",
    },
    insider: {
      name: "Kaki Tangan",
      short: "Kolaborator kubu Werewolf yang tahu siapa saja Werewolf-nya",
      detail:
        "Kamu adalah Kaki Tangan. Kamu tahu siapa saja Werewolf-nya. Ramalan dan penerawangan terhadapmu akan menunjukkan hasil \"putih (bukan Werewolf)\", sehingga di antara kubu Werewolf, kamu paling sulit dicurigai. Membela Werewolf secara terang-terangan akan membuatmu dicurigai, jadi bantulah mereka secara halus sambil berpura-pura menjadi warga biasa (berbeda dari Pengkhianat, kamu tahu siapa saja Werewolf-nya).",
    },
    fox: {
      name: "Rubah Siluman",
      short: "Kubu tunggal yang tidak mati diserang Werewolf, tapi mati jika diramal",
      detail:
        "Kamu adalah Rubah Siluman. Kamu adalah kubu tunggal yang tidak berpihak pada warga maupun Werewolf, dan tidak mati meski diserang Werewolf. Namun, jika diramal oleh Peramal, kamu akan tewas terkutuk malam itu juga. Terlepas dari kubu mana yang menang, kamu menang sendirian jika berhasil bertahan hidup sampai permainan berakhir.",
    },
    god: {
      name: "Dewa",
      short: "Kubu tunggal yang tahu peran semua orang. Menang jika bertahan hidup",
      detail:
        "Kamu adalah Dewa. Sejak awal permainan, kamu sudah tahu peran semua pemain. Ramalan dan penerawangan terhadapmu akan menunjukkan hasil \"putih\". Terlepas dari kubu mana yang menang, kamu menang sendirian jika bertahan hidup sampai permainan berakhir.",
    },
    lover: {
      name: "Kekasih",
      short: "Sepasang dua orang. Jika salah satu mati, yang lain ikut mati—kubu tunggal",
      detail:
        "Kamu adalah Kekasih. Kamu tahu siapa Kekasih pasanganmu. Jika salah satu dari kalian mati karena dieksekusi atau diserang, pasangannya akan ikut mati menyusul. Jika kalian berdua masih hidup saat permainan berakhir, kalian menang bersama.",
    },
  },
  errors: {
    ROOM_NOT_FOUND: "Ruang tidak ditemukan. Periksa kembali kode sandimu.",
    GAME_ALREADY_STARTED: "Tidak bisa bergabung karena permainan sudah dimulai.",
    ROOM_FULL: "Jumlah peserta sudah mencapai batas maksimum.",
    REJOIN_FAILED: "Gagal menghubungkan ulang.",
    PLAYER_NOT_FOUND: "Data pemain tidak ditemukan.",
    NOT_HOST: "Hanya host yang bisa melakukan tindakan ini.",
    ALREADY_STARTED: "Permainan sudah dimulai.",
    NOT_IN_ROOM: "Kamu belum bergabung ke ruang mana pun.",
    MIN_PLAYERS: "Jumlah peserta belum mencukupi.",
    KICKED: "Kamu dikeluarkan dari ruang oleh host.",
    INVALID_ROOM_CODE: "Kode ruang harus terdiri dari 5–8 karakter huruf/angka.",
    ROOM_CODE_TAKEN: "Kode ruang tersebut sudah digunakan. Coba kode lain.",
  },
  validation: (issue) => {
    switch (issue.code) {
      case "SEAT_MISMATCH":
        return `Total jumlah peran (${issue.total} orang) tidak sesuai dengan jumlah peserta (${issue.playerCount} orang).`;
      case "NO_WEREWOLF":
        return "Dibutuhkan minimal 1 Werewolf.";
      case "MASON_ODD":
        return "Sekutu harus diatur berpasangan (2 orang).";
      case "LOVER_INVALID":
        return "Kekasih harus diatur berpasangan (2 orang).";
      case "WOLF_TOO_MANY":
        return "Jumlah kubu Werewolf terlalu banyak. Kubu warga akan langsung dirugikan sejak awal.";
    }
  },
};

const it: Strings = {
  meta: {
    title: "Lupus in Fabula DX Online",
    description: "Un gioco psicologico di deduzione sociale con 13 ruoli: scoprite chi sono i Lupi Mannari nascosti tra voi, parlando e ragionando insieme. Si gioca dal vivo, tutti insieme, con lo smartphone in mano.",
  },
  common: {
    host: "Host",
    connected: "Connesso",
    disconnected: "Disconnesso",
    reconnecting: "Riconnessione in corso…",
    connecting: "Connessione in corso…",
    kicked: "Sei stato rimosso dalla stanza dall'host.",
    seconds: (n) => (n === 1 ? "1 secondo" : `${n} secondi`),
    timeRemaining: "Tempo rimanente",
    close: "Chiudi",
    cancel: "Annulla",
    people: (n) => (n === 1 ? "1 persona" : `${n} persone`),
    listSeparator: ", ",
    confirmProceed: "Continua",
    transitioning: "Passaggio alla schermata successiva…",
    on: "ON",
    off: "OFF",
    themeToggleToLight: "Passa alla modalità chiara",
    themeToggleToDark: "Passa alla modalità scura",
    menu: "Menu",
    themeLabel: "Tema",
    languageLabel: "Lingua",
    endGameButton: "Termina la partita",
    officialRuleBadge: "Regola ufficiale",
    optionalRuleBadge: "Regola opzionale",
  },
  entry: {
    title: "Lupus in Fabula DX Online",
    subtitle: "Un gioco psicologico di deduzione sociale con 13 ruoli: scoprite chi sono i Lupi Mannari nascosti tra voi, parlando e ragionando insieme. Si gioca ovunque, con lo smartphone in mano.",
    cardTitle: "Inizia",
    cardDesc: "Crea una stanza oppure partecipa con un codice segreto.",
    tabCreate: "Crea una stanza",
    tabJoin: "Entra in una stanza",
    nameLabel: "Soprannome",
    namePlaceholder: "Es: Marco",
    createButton: "Crea la stanza",
    codeLabel: "Codice segreto",
    codePlaceholder: "Es: AB3XZ",
    joinButton: "Partecipa",
    footerNote: "* Questa app non ha una funzione di chat: giocate parlando dal vivo.",
    helpButton: "Come si gioca e regolamento",
    customCodeLabel: "Codice stanza (facoltativo)",
    customCodePlaceholder: "Se lasciato vuoto, verrà generato automaticamente",
    customCodeHint: "Da 5 a 8 caratteri alfanumerici. Se non lo specifichi, ne verrà assegnato uno automaticamente.",
    avatarLabel: "Foto del profilo (facoltativa)",
    avatarAddButton: "Aggiungi foto",
    avatarChangeButton: "Cambia foto",
    avatarRemoveButton: "Rimuovi foto",
    avatarTooLarge: "L'immagine è troppo grande (massimo 8MB)",
    avatarUnsupported: "Seleziona un file immagine",
    castLabel: "I 13 ruoli del gioco",
  },
  profile: {
    editButton: "Modifica profilo",
    title: "Modifica profilo",
    desc: "Puoi cambiare il nome visualizzato e la foto del profilo in qualsiasi momento.",
    nameLabel: "Soprannome",
    avatarLabel: "Foto del profilo",
    saveButton: "Salva",
    savedToast: "Profilo aggiornato",
    closeButton: "Chiudi",
  },
  lobby: {
    codeLabel: "Codice segreto",
    copyCode: "Copia codice",
    copyLink: "Copia link di invito",
    shareLink: "Condividi link di invito",
    shareMessage: (code) => `Sei stato invitato a una stanza di Lupus in Fabula DX Online. Codice segreto: ${code}`,
    copyCodeToast: "Codice copiato",
    copyLinkToast: "Link di invito copiato",
    copyErrorToast: "Copia non riuscita",
    participants: (n) => `Partecipanti (${n === 1 ? "1 persona" : `${n} persone`})`,
    waitingForMorePlayers: (n) => `Mancano ancora ${n === 1 ? "1 persona" : `${n} persone`} per poter iniziare la partita`,
    composition: "Composizione dei ruoli",
    compositionReadonly: "Composizione dei ruoli (in configurazione da parte dell'host)",
    compositionReadonlyDesc: (wolves, total) => `Sono stati assegnati ${total} ruoli in totale, di cui ${wolves} Lupi Mannari.`,
    compositionEmpty: "I ruoli non sono ancora stati impostati.",
    roomInfoButton: "Ruoli e impostazioni",
    roomInfoTitle: "Ruoli e impostazioni di questa partita",
    suggest: "Composizione consigliata",
    seatTotal: "Totale ruoli",
    seatTotalOf: (total, count) => `${total} / ${count} persone`,
    soloGroupLabel: "Fazioni solitarie",
    startButton: "Inizia la partita",
    waitingHost: "In attesa che l'host avvii la partita…",
    leaveButton: "Esci",
    settingsTitle: "Impostazioni di gioco",
    officialRulesSectionTitle: "Regole di base",
    extraRulesSectionTitle: "Regole aggiuntive",
    extraRulesSectionDesc: "Da qui in poi trovi le regole opzionali esclusive di questa app. Non fanno parte delle regole di base, quindi personalizzale liberamente come preferisci per rendere il gioco più divertente.",
    revealOnDeath: "Rivela il ruolo alla morte",
    allowFirstNightKill: "I Lupi Mannari possono attaccare nella prima notte",
    allowFirstNightKillDesc: "Se disattivata, nella prima notte (la notte del giorno 1) nessuno muore, qualunque sia il bersaglio scelto dai Lupi Mannari. Consigliata quando molti giocatori sono alle prime armi. Dalla notte del giorno 2 in poi gli attacchi tornano a funzionare normalmente.",
    allowFirstVoteExecution: "Il primo voto può portare davvero al bando",
    allowFirstVoteExecutionDesc: "Se disattivata, nella prima votazione (quella del giorno 1) nessuno viene davvero bandito, qualunque sia il risultato: la persona scelta viene graziata. Dalla votazione del giorno 2 in poi il bando torna a funzionare normalmente.",
    allowWolfFriendlyFire: "I Lupi Mannari possono scegliere un altro Lupo Mannaro come bersaglio",
    allowWolfFriendlyFireDesc: "Se attivata, i Lupi Mannari possono scegliere come bersaglio dell'attacco un altro Lupo Mannaro (normalmente non è possibile).",
    seerFirstNightDivine: "Il Veggente può divinare una persona già al momento della rivelazione del ruolo",
    seerFirstNightDivineDesc: "Con questa regola, il Veggente può divinare liberamente una persona già al momento della rivelazione del ruolo (consigliata con 7 o più giocatori). Sta al Veggente decidere se farlo o meno. Se disattivata, la divinazione inizia dalla prima notte.",
    allowSelfVote: "È possibile votare per se stessi",
    revealVoteChoices: "Mostra a tutti chi vota chi",
    revealVoteChoicesDesc: "Se attivata, durante la fase di voto tutti possono vedere in tempo reale chi sta votando chi. Se disattivata, come di consueto viene mostrato solo il conteggio dei voti.",
    allowBodyguardSelfGuard: "La Guardia del Corpo può proteggere se stessa",
    secondTieExecutesRandomly: "In caso di parità anche al ballottaggio, il bando viene deciso a caso",
    secondTieExecutesRandomlyDesc: "Se disattivata, se anche il ballottaggio finisce in parità la giornata si conclude senza che nessuno venga bandito.",
    dictatorCanTargetSelf: "Il Dittatore può scegliere se stesso come bersaglio del bando",
    settingsPacingNote: "Questa app non ha timer automatici. Ogni schermata avanza quando lo decide l'host, oppure quando tutti hanno completato la propria azione. Giocate ai vostri ritmi.",
    kick: "Rimuovi",
    makeHost: "Rendi host",
    makeHostConfirmTitle: "Vuoi cedere il ruolo di host?",
    makeHostConfirmDesc: (name) => `${name} diventerà il nuovo host. Perderai i privilegi da host e non potrai più controllare l'andamento della partita.`,
    makeHostConfirmAction: "Cedi il ruolo",
  },
  roleReveal: {
    label: "Il tuo ruolo",
    tapToReveal: "Tocca per rivelare",
    privacyHint: "Assicurati che nessuno intorno a te possa vedere lo schermo",
    allies: "I tuoi alleati",
    allRoles: "I ruoli di tutti i giocatori",
    waitingOthers: "Hai confermato. Quando tutti avranno confermato, si passerà automaticamente alla prima discussione.",
    confirmButton: "Ho confermato",
    progress: (s, t) => `Confermati: ${s} / ${t} persone`,
    earlyDivineTitle: "Usa subito il potere del Veggente (facoltativo)",
    earlyDivineDesc: "Puoi divinare una persona già ora, al momento della rivelazione del ruolo. Puoi anche continuare senza usarlo.",
    earlyDivineButton: "Divina questa persona",
    earlyDivineSkipNote: "Puoi anche procedere senza divinare, premendo semplicemente \"Ho confermato\".",
    earlyDivineDone: "Hai già divinato. Ecco il risultato.",
  },
  night: {
    tag: (day) => `Notte ${day}`,
    deadNotice: "Sei già eliminato. Osserva in silenzio finché non sorge il giorno…",
    dormant: "È notte inoltrata…",
    dormantDesc: "Attendi che chi possiede un potere completi la propria azione.",
    progress: (s, t) => `Azioni completate: ${s} / ${t} persone`,
    submitButton: "Conferma",
    resubmitButton: "Inviato (modifica)",
    previousSeerResult: (day) =>
      day === 0 ? "Risultato della divinazione precedente (al momento della rivelazione del ruolo)" : `Risultato della divinazione precedente (Giorno ${day})`,
    seerResultLine: (name, isBlack) => `${name} era ${isBlack ? "【Nero (Lupo Mannaro)】" : "【Bianco】"}`,
    actions: {
      attack: { title: "Chi volete attaccare?", desc: "Consultati con gli altri Lupi Mannari e scegliete insieme chi attaccare questa notte.", skip: "Non attaccare stanotte" },
      guard: { title: "Chi vuoi proteggere?", desc: "Scegli chi proteggere dall'attacco dei Lupi Mannari. Non puoi proteggere te stesso, né la persona che hai già protetto la notte precedente.", skip: "Non proteggere nessuno stanotte" },
      divine: { title: "Chi vuoi divinare?", desc: "Scoprirai se questa persona è un Lupo Mannaro.", skip: "Non divinare stanotte" },
    },
    firstNightKillDisabledNotice: "A causa delle impostazioni, nella prima notte (giorno 1) nessuno muore, qualunque sia il bersaglio. Dalla notte del giorno 2 in poi l'effetto torna normale.",
    forceAdvanceButton: "Continua senza aspettare tutti (azione dell'host)",
    wolfSelectionsTitle: "Chi stanno scegliendo gli altri Lupi Mannari (per confrontarvi)",
    wolfSelectionsEmpty: "Nessuno ha ancora scelto",
    wolfSelectionsLine: (name, targetName) => `${name}: ${targetName ?? "Nessuna scelta"}`,
    wolfConsensusNeeded: "La notte non finirà finché tutti i Lupi Mannari non sceglieranno lo stesso bersaglio (oppure tutti \"non attaccare\"). Discutete e decidete insieme.",
    wolfConsensusReached: "Siete tutti d'accordo.",
  },
  hunterRevenge: {
    title: "L'identità del Cacciatore è stata svelata!",
    waitingFor: (name) => `${name} sta scegliendo chi trascinare con sé…`,
    youAre: "Sei il Cacciatore. Puoi scegliere una persona da trascinare con te (oppure non scegliere nessuno).",
    skip: "Non trascinare nessuno con te",
    submit: "Conferma",
    submitted: "Inviato",
    hostSkipButton: "Imposta \"nessuno trascinato\" al posto del Cacciatore (azione dell'host)",
  },
  dayResult: {
    tag: (day) => `Mattino ${day}`,
    noDeaths: "Questa notte non ci sono state vittime. Un mattino di pace.",
    seerResult: "Risultato della divinazione",
    continueButton: "Passa alla discussione",
    waitingHost: "In attesa che l'host passi alla discussione…",
  },
  discussion: {
    tag: (day) => `Discussione - Giorno ${day}`,
    firstRoundTag: "Prima discussione",
    firstRoundNotice: "È la prima discussione, subito dopo la rivelazione dei ruoli: nessuno è ancora stato attaccato e qui non si vota per bandire nessuno. Parlate liberamente, poi sarà l'host a far scattare la vera \"notte\".",
    proceedToNightButton: "Termina la discussione e passa alla notte",
    survivors: "Sopravvissuti",
    dictatorButton: "Attiva il potere del Dittatore",
    dictatorConfirmTitle: "Vuoi attivare il potere del Dittatore?",
    dictatorConfirmDesc: "La discussione verrà interrotta immediatamente e la persona che indicherai sarà bandita senza votazione, per tua sola decisione. Questo potere si può usare una sola volta per partita.",
    dictatorConfirmAction: "Bandisci questa persona",
    skipButton: "Termina la discussione e passa al voto",
    waitingHost: "In attesa che l'host proceda. Non c'è limite di tempo: discutete finché non siete soddisfatti.",
    runoffNotice: "Il voto è finito in parità: questa è la discussione prima del ballottaggio. Se anche così non si decide, la scelta sarà casuale.",
    runoffCandidatesLabel: "Candidati al ballottaggio",
  },
  vote: {
    tag: (day) => `Votazione - Giorno ${day}`,
    runoffTag: (day) => `Ballottaggio - Giorno ${day}`,
    cannotVote: "Non puoi votare. Osserva il risultato.",
    instructions: "Scegli una persona da bandire",
    runoffNotice: "Poiché il voto è finito in parità, si passa a un ballottaggio ristretto ai candidati coinvolti. Se anche così non si decide, la scelta sarà casuale.",
    submitButton: "Vota",
    submittedButton: "Votato (modifica)",
    progress: (s, t) => `Voti espressi: ${s} / ${t} persone`,
    forceAdvanceButton: "Chiudi il voto senza aspettare tutti (azione dell'host)",
    voteChoicesTitle: "Andamento dei voti (visibile a tutti perché l'impostazione è attiva)",
    voteChoicesLine: (voterName, targetName) => `${voterName} → ${targetName}`,
  },
  executionResult: {
    tag: (day) => `Risultato del bando - Giorno ${day}`,
    executed: (name) => `${name} è stato bandito dal villaggio`,
    spared: (name) => `Grazie al ballottaggio, ${name} è stato graziato`,
    sparedFirstVoteRule: (name) =>
      `Per via dell'impostazione "il primo voto non porta davvero al bando", ${name} è stato graziato senza bisogno di un ballottaggio`,
    noExecution: "In base al voto, nessuno è stato bandito.",
    mediumResult: "Risultato del Medium",
    mediumResultLine: (name, isBlack) => `${name} era ${isBlack ? "【Nero (Lupo Mannaro)】" : "【Bianco】"}`,
    continueButton: "Passa alla notte successiva",
    waitingHost: "In attesa che l'host passi alla notte successiva…",
  },
  lastWords: {
    tag: (day) => `Ultime parole - Giorno ${day}`,
    title: "Il voto ha deciso il bando",
    waitingFor: (name) => `Ascoltiamo le ultime parole di ${name}`,
    youAreTitle: "Sei stato scelto per il bando",
    youAreDesc: "Se hai qualcosa da dire prima di andartene, parla pure a tutti. Quando hai finito, premi il pulsante qui sotto per continuare.",
    proceedButton: "Ho finito di parlare (passa al ballottaggio)",
    waitingHost: "In attesa che l'interessato o l'host proceda…",
  },
  appealVote: {
    tag: (day) => `Voto finale: bando o grazia - Giorno ${day}`,
    instructions: (name) => `Volete davvero bandire ${name}, oppure graziarlo?`,
    cannotVote: "Non puoi partecipare a questo ballottaggio, perché sei tu il candidato al bando. Osserva il risultato.",
    executeOption: "Bandisci",
    spareOption: "Grazia",
    submitButton: "Conferma",
    submittedButton: "Votato (modifica)",
    progress: (s, t) => `Voti espressi: ${s} / ${t} persone`,
    forceAdvanceButton: "Chiudi il voto senza aspettare tutti (azione dell'host)",
  },
  allyNote: {
    title: "Appunti solo per gli alleati",
    placeholder: "Un breve appunto visibile solo ai tuoi alleati (es: puntiamo al numero 3)",
    hint: "Scambiatevi messaggi brevi senza farvi notare dagli altri. Non è una chat: è un unico appunto condiviso.",
    groupSize: (n) => `Condiviso tra ${n} persone`,
  },
  gameOver: {
    primary: {
      village: "Vittoria del Villaggio!",
      werewolf: "Vittoria dei Lupi Mannari!",
      draw: "Pareggio",
    },
    extra: {
      fox: "Anche la Volpe è sopravvissuta: vittoria solitaria!",
      god: "Anche la Divinità è sopravvissuta: vittoria solitaria!",
      lover: "Anche gli Amanti sono sopravvissuti entrambi: vittoria!",
    },
    allRoles: "I ruoli di tutti",
    eliminated: "Eliminato",
    newGameButton: "Ancora una volta, stessi giocatori",
    waitingHost: "In attesa che l'host avvii una nuova partita…",
    leaveButton: "Esci",
    hostEndedTitle: "L'host ha terminato la partita",
    hostEndedDesc: "La partita si è conclusa qui, senza un verdetto.",
  },
  confirm: {
    advanceTitle: "Vuoi continuare?",
    advanceDesc: "Assicurati che tutti siano pronti prima di continuare. Questa azione non può essere annullata.",
    advanceAction: "Continua",
    forceResolveTitle: "Vuoi forzare l'avanzamento?",
    forceResolveDesc: "Chi non ha ancora agito o votato verrà saltato.",
    forceResolveAction: "Forza l'avanzamento",
    newGameTitle: "Vuoi iniziare una nuova partita con gli stessi giocatori?",
    newGameDesc: "Il risultato attuale verrà azzerato e si ripartirà dall'assegnazione dei ruoli.",
    newGameAction: "Inizia una nuova partita",
    skipHunterRevengeTitle: "Vuoi saltare l'occasione di trascinare qualcuno con sé?",
    skipHunterRevengeDesc: "Se salti, il Cacciatore non potrà trascinare nessuno con sé.",
    skipHunterRevengeAction: "Salta",
    endGameTitle: "Vuoi terminare la partita?",
    endGameDesc: "La partita attuale terminerà qui e i ruoli di tutti verranno rivelati. Questa azione non può essere annullata.",
    endGameAction: "Termina",
  },
  help: {
    button: "Come si gioca",
    title: "Come si gioca e regolamento",
    tldr: "In breve: i Contadini devono scoprire, discutendo tra loro, chi sono i Lupi Mannari nascosti tra loro, e bandirli con il voto.",
    tabFlow: "Svolgimento",
    tabWin: "Condizioni di vittoria",
    tabRoles: "Ruoli",
    intro:
      "Lupus in Fabula DX è un gioco psicologico in cui i giocatori si dividono tra i Lupi Mannari, che nascondono la propria identità, e i Contadini, che cercano di scovarli. Il gioco alterna il \"Giorno\" (discussione e voto) e la \"Notte\" (azioni segrete legate a ciascun ruolo): la partita finisce quando i Contadini bandiscono tutti i Lupi Mannari, oppure quando il numero dei Lupi Mannari raggiunge quello dei sopravvissuti non lupi. La rivelazione del ruolo, le azioni notturne e il voto avvengono tutti su questo schermo. Non ci sono timer automatici: si procede all'azione dell'host o quando tutti hanno completato la propria, ognuno ai propri ritmi.",
    flowTitle: "Lo svolgimento della partita",
    flowSteps: [
      { title: "Rivelazione del ruolo", desc: "Ognuno controlla di nascosto il proprio ruolo e preme \"Ho confermato\". Fai attenzione a non farti vedere dagli altri. Si va avanti solo quando tutti hanno confermato." },
      { title: "Prima discussione", desc: "Subito dopo la rivelazione dei ruoli, è il momento di presentarsi: nessuno è ancora stato attaccato e non si vota. Dopo una breve chiacchierata, sarà l'host a far scattare la vera \"Notte\"." },
      { title: "Notte", desc: "Solo i ruoli con un potere — Lupo Mannaro, Veggente, Guardia del Corpo e così via — agiscono di nascosto. Chi non ha poteri deve solo attendere. È qui che avviene per la prima volta l'attacco dei Lupi Mannari (esiste un'impostazione che disattiva l'attacco solo nella prima notte)." },
      { title: "Mattino (annuncio dei risultati)", desc: "Viene annunciato cosa è successo durante la notte, ovvero chi è stato vittima." },
      { title: "Discussione", desc: "Sulla base di quanto accaduto di notte, discutete e ragionate insieme su chi potrebbe essere un Lupo Mannaro. Non c'è limite di tempo: parlate finché non siete soddisfatti." },
      { title: "Voto", desc: "Ognuno vota la persona che vuole bandire. Chi riceve più voti viene bandito; in caso di parità si passa al ballottaggio. Quando tutti hanno votato, si passa automaticamente all'annuncio del risultato." },
      { title: "Si ricomincia", desc: "Il ciclo \"Notte → Mattino → Discussione → Voto\" si ripete finché una delle due fazioni non vince." },
    ],
    diagramTitle: "Il ciclo di notte e giorno, illustrato",
    diagramIntro:
      "La \"Notte\" e il \"Mattino → Discussione → Voto\" che la seguono formano un'unica unità e contano come lo stesso giorno. Ad esempio, il mattino, la discussione e il voto che seguono la \"Notte 1\" sono tutti parte del \"Giorno 1\".",
    diagramDayLabel: (day) => `Giorno ${day}`,
    diagramSameDayNote: "🌙 Notte e ☀️ Giorno (Mattino, Discussione, Voto) con lo stesso numero formano un'unica unità.",
    diagramOutcomeLabel: "Esito",
    diagramNoRoomNote: "Le impostazioni effettive variano a seconda della stanza. Una volta entrato, puoi controllarle anche nella scheda \"Ruoli e impostazioni\".",
    diagramSettingsHeading: "Impostazioni di questa stanza",
    winTitle: "Condizioni di vittoria",
    winIntro: "Il modo in cui si conclude la partita varia da fazione a fazione. Più fazioni possono vincere contemporaneamente.",
    winVillage: "Villaggio: vince se tutti i Lupi Mannari vengono banditi, senza eccezioni.",
    winWerewolf: "Lupi Mannari: vincono quando il loro numero raggiunge o supera quello dei sopravvissuti non lupi.",
    winFox: "Volpe: se sopravvive fino alla fine della partita, vince da sola, indipendentemente dall'esito tra Villaggio e Lupi Mannari.",
    winGod: "Divinità: se sopravvive fino alla fine della partita, vince da sola, indipendentemente dall'esito tra Villaggio e Lupi Mannari.",
    winLover: "Amanti: se entrambi sono ancora vivi alla fine della partita, vincono insieme.",
    rolesTitle: "Elenco dei ruoli (13 in totale)",
    rolesIntro: "Puoi rivedere la descrizione del tuo ruolo in qualsiasi momento durante la partita, tramite il pulsante \"Il mio ruolo\" in alto sullo schermo.",
    close: "Chiudi",
  },
  myRole: {
    button: "Il mio ruolo",
    title: "Il tuo ruolo",
    dayLabel: (day) => (day === 0 ? "Al momento della rivelazione del ruolo" : `Giorno ${day}`),
    seerHistoryTitle: "Persone divinate finora",
    seerHistoryEmpty: "Non hai ancora divinato nessuno.",
    mediumHistoryTitle: "Persone esaminate finora",
    mediumHistoryEmpty: "Non hai ancora esaminato nessuno.",
    noRoleYet: "Il ruolo non è ancora stato rivelato.",
    close: "Chiudi",
  },
  team: {
    village: "Villaggio",
    werewolf: "Lupi Mannari",
    fox: "Volpe (fazione solitaria)",
    god: "Divinità (fazione solitaria)",
    lover: "Amanti (fazione solitaria)",
  },
  deathCause: {
    attack: "Attaccato dai Lupi Mannari",
    execution: "Bandito dal villaggio",
    curse: "Maledetto a morte dal Veggente",
    hunter: "Trascinato nella tomba dal Cacciatore",
    lover_grief: "Morto di dolore, seguendo il proprio Amante",
  },
  roles: {
    villager: {
      name: "Contadino",
      short: "Un abitante del villaggio senza poteri speciali",
      detail: "Sei un Contadino. Non hai poteri speciali. Se sospetti di qualcuno, condividi le tue ragioni durante la discussione e aiuta gli altri a ragionare insieme.",
    },
    seer: {
      name: "Veggente",
      short: "Ogni notte divina una persona per scoprire se è un Lupo Mannaro",
      detail:
        "Sei il Veggente. Ogni notte puoi divinare una persona a tua scelta: se è un Lupo Mannaro il risultato sarà nero, altrimenti bianco. Nessun altro può vedere questo risultato, quindi sta a te decidere come e se rivelarlo durante la discussione. Attenzione: se divini la Volpe, questa morirà maledetta nel corso della stessa notte.",
    },
    bodyguard: {
      name: "Guardia del Corpo",
      short: "Ogni notte protegge una persona dall'attacco dei Lupi Mannari",
      detail:
        "Sei la Guardia del Corpo. Ogni notte scegli una persona, diversa da te stesso, da proteggere dall'attacco dei Lupi Mannari. Se la persona protetta era il bersaglio dell'attacco, sopravvive. Non puoi proteggere la stessa persona per due notti di fila.",
    },
    medium: {
      name: "Medium",
      short: "Scopre se la persona bandita era un Lupo Mannaro",
      detail: "Sei il Medium. Ogni notte scopri se la persona bandita durante il giorno era un Lupo Mannaro. Nella notte del giorno 1, poiché nessuno è ancora stato bandito, non c'è nessuno da esaminare.",
    },
    hunter: {
      name: "Cacciatore",
      short: "Se muore, può trascinare con sé un'altra persona",
      detail:
        "Sei il Cacciatore. Se vieni bandito, oppure ucciso in un attacco dei Lupi Mannari, puoi scegliere una persona da trascinare con te nella morte (puoi anche non scegliere nessuno). Non è necessario rivelare il tuo ruolo.",
    },
    mason: {
      name: "Massone",
      short: "Due o più Contadini che si conoscono tra loro",
      detail: "Sei un Massone. Conosci l'identità degli altri Massoni. Non hai altri poteri, ma potete fidarvi ciecamente l'uno dell'altro: un'alleanza preziosa. Scegliete con cura il momento giusto per rivelarvi, per non destare i sospetti dei Lupi Mannari.",
    },
    dictator: {
      name: "Dittatore",
      short: "Una volta per partita può interrompere la discussione e decidere da solo chi bandire",
      detail:
        "Sei il Dittatore. Una sola volta per partita, durante la discussione diurna, puoi rivelarti e interrompere immediatamente il dibattito per decidere da solo, senza voto, chi bandire. È un potere molto forte: scegli con attenzione il momento giusto per usarlo.",
    },
    werewolf: {
      name: "Lupo Mannaro",
      short: "Ogni notte attacca una persona insieme agli altri Lupi Mannari",
      detail:
        "Sei un Lupo Mannaro. Conosci l'identità degli altri Lupi Mannari. Ogni notte, consultati con loro e scegliete insieme chi attaccare. Durante la discussione, fingiti un Contadino per non farti scoprire: vincete quando il numero dei Lupi Mannari raggiunge quello dei Contadini superstiti.",
    },
    traitor: {
      name: "Traditore",
      short: "Vince con i Lupi Mannari, ma non sa chi sono",
      detail:
        "Sei il Traditore. Se vince la fazione dei Lupi Mannari, vinci anche tu, ma non ti viene rivelato chi sono. Anche la divinazione del Veggente e l'esame del Medium ti daranno sempre \"bianco\" (non Lupo Mannaro), quindi difficilmente sarai sospettato. Fingi di dare la caccia ai Lupi Mannari, mentre agisci sottilmente a loro vantaggio (a differenza della Talpa, tu non conosci l'identità dei Lupi Mannari).",
    },
    insider: {
      name: "Talpa",
      short: "Conosce l'identità dei Lupi Mannari e li aiuta di nascosto",
      detail:
        "Sei la Talpa. Sai chi sono i Lupi Mannari. Anche la divinazione del Veggente e l'esame del Medium ti daranno sempre \"bianco\" (non Lupo Mannaro), rendendoti particolarmente difficile da sospettare tra gli alleati dei Lupi Mannari. Difendere apertamente i Lupi Mannari desterebbe sospetti, quindi aiutali con discrezione fingendoti un Contadino (a differenza del Traditore, tu conosci l'identità dei Lupi Mannari).",
    },
    fox: {
      name: "Volpe",
      short: "Fazione solitaria immune all'attacco dei Lupi Mannari, ma muore se divinata",
      detail:
        "Sei la Volpe. Non appartieni né al Villaggio né ai Lupi Mannari: sei una fazione solitaria, immune all'attacco dei Lupi Mannari. Tuttavia, se il Veggente ti divina, morirai maledetta nel corso della stessa notte. Indipendentemente da chi vince tra Villaggio e Lupi Mannari, vinci se sei ancora viva alla fine della partita.",
    },
    god: {
      name: "Divinità",
      short: "Fazione solitaria che conosce i ruoli di tutti fin dall'inizio; vince se sopravvive",
      detail:
        "Sei la Divinità. Fin dall'inizio della partita conosci il ruolo di tutti i giocatori. La divinazione del Veggente e l'esame del Medium ti daranno sempre \"bianco\". Indipendentemente da chi vince tra Villaggio e Lupi Mannari, vinci se sei ancora viva alla fine della partita.",
    },
    lover: {
      name: "Amante",
      short: "Formi una coppia segreta: se il tuo partner muore, muori anche tu",
      detail:
        "Sei un Amante. Sai chi è l'altro membro della coppia. Se uno dei due muore, bandito o ucciso in un attacco, l'altro lo segue subito dopo nella morte. Se alla fine della partita siete ancora entrambi vivi, vincete insieme.",
    },
  },
  errors: {
    ROOM_NOT_FOUND: "Stanza non trovata. Controlla il codice segreto.",
    GAME_ALREADY_STARTED: "Non puoi partecipare perché la partita è già iniziata.",
    ROOM_FULL: "La stanza ha raggiunto il numero massimo di partecipanti.",
    REJOIN_FAILED: "Riconnessione non riuscita.",
    PLAYER_NOT_FOUND: "Informazioni sul giocatore non trovate.",
    NOT_HOST: "Solo l'host può eseguire questa azione.",
    ALREADY_STARTED: "La partita è già iniziata.",
    NOT_IN_ROOM: "Non fai parte di questa stanza.",
    MIN_PLAYERS: "Non ci sono abbastanza partecipanti.",
    KICKED: "Sei stato rimosso dalla stanza dall'host.",
    INVALID_ROOM_CODE: "Il codice stanza deve avere da 5 a 8 caratteri alfanumerici.",
    ROOM_CODE_TAKEN: "Questo codice stanza è già in uso. Provane un altro.",
  },
  validation: (issue) => {
    switch (issue.code) {
      case "SEAT_MISMATCH":
        return `Il numero totale di ruoli assegnati (${issue.total}) non corrisponde al numero di partecipanti (${issue.playerCount}).`;
      case "NO_WEREWOLF":
        return "È necessario almeno un Lupo Mannaro.";
      case "MASON_ODD":
        return "I Massoni vanno assegnati in coppie (un numero pari).";
      case "LOVER_INVALID":
        return "Gli Amanti vanno assegnati in coppia (esattamente due).";
      case "WOLF_TOO_MANY":
        return "Ci sono troppi Lupi Mannari. Il Villaggio partirebbe già in svantaggio.";
    }
  },
};

export const STRINGS: Record<Locale, Strings> = { ja, en, ko, zh, es, fr, de, pt, ru, vi, th, id, it };

export type { Strings };
