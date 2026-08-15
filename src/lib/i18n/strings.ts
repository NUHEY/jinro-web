import type { RoleId, Team, NightActionType } from "@/lib/game/roles";
import type { DeathCause } from "@/lib/game/types";

export type Locale = "ja" | "en";
export const LOCALES: Locale[] = ["ja", "en"];

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
    minutesUntilAuto: string;
    close: string;
    cancel: string;
    people: (n: number) => string;
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
    suggest: string;
    seatTotal: string;
    seatTotalOf: (total: number, count: number) => string;
    soloGroupLabel: string;
    startButton: string;
    waitingHost: string;
    leaveButton: string;
    settingsTitle: string;
    revealOnDeath: string;
    nightSeconds: string;
    discussionSeconds: string;
    voteSeconds: string;
    roleRevealSeconds: string;
    resultPauseSeconds: string;
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
    skipButton: string;
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
  };
  hunterRevenge: {
    title: string;
    waitingFor: (name: string) => string;
    youAre: string;
    skip: string;
    submit: string;
    submitted: string;
  };
  dayResult: {
    tag: (day: number) => string;
    noDeaths: string;
    continueButton: string;
    autoNotice: string;
  };
  discussion: {
    tag: (day: number) => string;
    instructions: string;
    survivors: string;
    dictatorButton: string;
    dictatorConfirmTitle: string;
    dictatorConfirmDesc: string;
    dictatorConfirmAction: string;
    skipButton: string;
    extendButton: string;
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
  };
  executionResult: {
    tag: (day: number) => string;
    executed: (name: string) => string;
    noExecution: string;
    mediumResult: string;
    mediumResultLine: (name: string, isBlack: boolean) => string;
    continueButton: string;
    autoNotice: string;
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
    minutesUntilAuto: "まもなく自動的に進みます",
    close: "閉じる",
    cancel: "キャンセル",
    people: (n) => `${n}人`,
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
    footerNote: "※このアプリにチャット機能はありません。実際に集まって(またはオンライン通話で)会話しながら遊ぶことを想定しています。",
    helpButton: "遊び方・ルールを見る",
    customCodeLabel: "ルームコード(任意)",
    customCodePlaceholder: "空欄なら自動生成されます",
    customCodeHint: "半角英数字5〜8文字。指定しない場合は自動で発行されます。",
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
    suggest: "おすすめ配役",
    seatTotal: "役職の合計",
    seatTotalOf: (total, count) => `${total} / ${count} 人`,
    soloGroupLabel: "単独陣営",
    startButton: "ゲームを開始する",
    waitingHost: "ホストの開始を待っています…",
    leaveButton: "退出する",
    settingsTitle: "ゲーム設定",
    revealOnDeath: "死亡時に役職を公開する",
    nightSeconds: "夜フェーズの時間",
    discussionSeconds: "議論タイムの時間",
    voteSeconds: "投票タイムの時間",
    roleRevealSeconds: "役職確認の自動進行までの時間",
    resultPauseSeconds: "結果発表の自動進行までの時間",
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
    waitingOthers: "確認済みです。他のプレイヤーの確認が終わり次第、自動的に夜へ進みます。",
    skipButton: "今すぐ夜へ進む",
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
      guard: { title: "誰を守りますか？", desc: "人狼の襲撃から守る相手を選んでください。自分は守れません。", skip: "今夜は誰も守らない" },
      divine: { title: "誰を占いますか？", desc: "相手が人狼かどうかを占います。", skip: "今夜は占わない" },
    },
  },
  hunterRevenge: {
    title: "ハンターの正体が明らかに！",
    waitingFor: (name) => `${name}さんが道連れにする相手を選んでいます…`,
    youAre: "あなたはハンターです。道連れにする相手をひとり選べます(選ばなくても構いません)。",
    skip: "誰も道連れにしない",
    submit: "決定する",
    submitted: "送信済み",
  },
  dayResult: {
    tag: (day) => `朝 ${day}日目`,
    noDeaths: "昨夜は誰も犠牲になりませんでした。平和な朝です。",
    continueButton: "今すぐ議論タイムへ進む",
    autoNotice: "まもなく自動的に議論タイムが始まります…",
  },
  discussion: {
    tag: (day) => `議論タイム ${day}日目`,
    instructions: "実際に集まって(またはオンライン通話で)話し合いましょう。誰が人狼か、みんなで推理してください。",
    survivors: "生存者",
    dictatorButton: "独裁者の権限を発動する",
    dictatorConfirmTitle: "独裁者の権限を発動しますか？",
    dictatorConfirmDesc: "議論を強制終了し、投票なしで指定した人を独断で追放します。この能力はゲーム中1度しか使えません。",
    dictatorConfirmAction: "この人を追放する",
    skipButton: "今すぐ投票へ進む",
    extendButton: "話し合いを延長する(+1分)",
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
  },
  executionResult: {
    tag: (day) => `追放結果 ${day}日目`,
    executed: (name) => `${name}さんが追放されました`,
    noExecution: "投票の結果、誰も追放されませんでした。",
    mediumResult: "霊媒結果",
    mediumResultLine: (name, isBlack) => `${name}さんは${isBlack ? "【黒(人狼)】" : "【白】"}でした`,
    continueButton: "今すぐ次の夜へ進む",
    autoNotice: "まもなく自動的に次の夜になります…",
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
  help: {
    button: "遊び方",
    title: "遊び方・ルール",
    tldr: "ひとことで言うと: 隠れている「人狼」を、市民たちが話し合いで見つけ出して追放するゲームです。",
    tabFlow: "流れ",
    tabWin: "勝利条件",
    tabRoles: "役職",
    intro:
      "人狼DXは、正体を隠した「人狼」を「市民」たちが会話と推理で見つけ出す心理ゲームです。実際に集まって(またはビデオ通話などで)話しながら、このアプリで役職確認・夜の行動・投票を行います。「昼(議論・投票)」と「夜(能力行動)」を繰り返し、どちらかの陣営が条件を満たすと決着します。",
    flowTitle: "ゲームの流れ",
    flowSteps: [
      { title: "役職確認", desc: "全員が自分だけの役職をこっそり確認します。周りに見られないように注意しましょう。" },
      { title: "夜", desc: "人狼・予言者・ボディーガードなど、能力を持つ役職だけがこっそり行動します。能力を持たない人は何もせず待機します。" },
      { title: "朝(結果発表)", desc: "夜に何が起きたか(誰が犠牲になったか)が発表されます。" },
      { title: "議論", desc: "実際に話し合って、誰が人狼か推理します(このアプリにチャット機能はないので、口頭やビデオ通話で話してください)。" },
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
    rolesIntro: "自分の役職の説明は、ゲーム中の「あなたの役職」画面でも確認できます。",
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
    minutesUntilAuto: "Moving on automatically soon",
    close: "Close",
    cancel: "Cancel",
    people: (n) => `${n}`,
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
    footerNote: "Note: this app has no chat feature. It's meant to be played while talking together in person (or on a call).",
    helpButton: "How to play / rules",
    customCodeLabel: "Room code (optional)",
    customCodePlaceholder: "Leave blank to auto-generate",
    customCodeHint: "5-8 letters/numbers. If left blank, one will be generated for you.",
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
    suggest: "Suggest roles",
    seatTotal: "Total roles",
    seatTotalOf: (total, count) => `${total} / ${count}`,
    soloGroupLabel: "Solo factions",
    startButton: "Start game",
    waitingHost: "Waiting for the host to start…",
    leaveButton: "Leave room",
    settingsTitle: "Game settings",
    revealOnDeath: "Reveal role on death",
    nightSeconds: "Night phase duration",
    discussionSeconds: "Discussion duration",
    voteSeconds: "Voting duration",
    roleRevealSeconds: "Time before role reveal auto-advances",
    resultPauseSeconds: "Time before results auto-advance",
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
    waitingOthers: "You're ready. Night will begin automatically once everyone has checked their role.",
    skipButton: "Start night now",
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
      guard: { title: "Who will you protect?", desc: "Choose someone to protect from the werewolves' attack. You can't protect yourself.", skip: "Don't protect anyone tonight" },
      divine: { title: "Who will you investigate?", desc: "Find out whether they are a werewolf.", skip: "Don't investigate tonight" },
    },
  },
  hunterRevenge: {
    title: "The Hunter's true identity is revealed!",
    waitingFor: (name) => `${name} is choosing someone to take down with them…`,
    youAre: "You are the Hunter. You may name one player to die alongside you (or choose no one).",
    skip: "Take no one down",
    submit: "Confirm",
    submitted: "Submitted",
  },
  dayResult: {
    tag: (day) => `Morning ${day}`,
    noDeaths: "No one fell victim last night. A peaceful morning.",
    continueButton: "Start discussion now",
    autoNotice: "Discussion will begin automatically soon…",
  },
  discussion: {
    tag: (day) => `Discussion — Day ${day}`,
    instructions: "Talk it over together (in person or on a call). Figure out who the werewolves might be.",
    survivors: "Survivors",
    dictatorButton: "Use Dictator power",
    dictatorConfirmTitle: "Use your Dictator power?",
    dictatorConfirmDesc: "This ends discussion immediately and executes your chosen target without a vote. You can only use this once per game.",
    dictatorConfirmAction: "Execute this player",
    skipButton: "Start voting now",
    extendButton: "Extend discussion (+1 min)",
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
  },
  executionResult: {
    tag: (day) => `Execution result — Day ${day}`,
    executed: (name) => `${name} was executed`,
    noExecution: "The vote resulted in no execution.",
    mediumResult: "Medium's reading",
    mediumResultLine: (name, isBlack) => `${name} was ${isBlack ? "【Black - Werewolf】" : "【White】"}`,
    continueButton: "Start next night now",
    autoNotice: "The next night will begin automatically soon…",
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
  help: {
    button: "How to play",
    title: "How to play / Rules",
    tldr: "In short: the Villagers talk it out to find and vote off the hidden Werewolves.",
    tabFlow: "Flow",
    tabWin: "Winning",
    tabRoles: "Roles",
    intro:
      "Jinro DX is a social deduction game: the hidden 'Werewolves' try to survive while the 'Villagers' try to find them through conversation and deduction. Talk together in person (or on a call) while using this app for role reveals, night actions, and voting. 'Day' (discussion + vote) and 'Night' (secret actions) repeat until one side wins.",
    flowTitle: "Game flow",
    flowSteps: [
      { title: "Role reveal", desc: "Everyone privately checks their own role. Make sure no one else can see your screen." },
      { title: "Night", desc: "Only players with night abilities (Werewolf, Seer, Bodyguard, etc.) act in secret. Everyone else just waits." },
      { title: "Morning (results)", desc: "The results of the night — who fell victim, if anyone — are announced." },
      { title: "Discussion", desc: "Talk it over and figure out who the werewolves are (this app has no chat feature, so talk in person or on a call)." },
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
    rolesIntro: "You can also see your own role's description on the 'Your role' screen during the game.",
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

export const STRINGS: Record<Locale, Strings> = { ja, en };

export type { Strings };
