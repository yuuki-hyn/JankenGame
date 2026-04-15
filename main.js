// クラス定義
class Character {
    constructor(life) {
        this.life = life;
        this.hand = null;
        this.action = null;
        this.attackScore = 0;
        this.defenseScore = 0;
    }

    setHand(hand) {
        this.hand = hand;
    } // まだ未使用

    setAction(action) {
        this.action = action;
    } //まだ未使用
}

class Player extends Character {
    constructor() {
        super(5);
    }
}

class Npc extends Character {
    constructor() {
        super(5);
    }
}

// NPCの手をランダムに決定
function getNpcChoice() {
    const hands = ["gu", "choki", "pa"];
    const actions = ["attack", "defense"];

    const hand = hands[Math.floor(Math.random() * hands.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];

    return { hand, action };
}

//じゃんけんの勝敗を判定
function judgeJanken(playerHand, npcHand) {
    if (playerHand === npcHand) {
        return "draw";
    }

    if (
        (playerHand === "gu" && npcHand === "choki") ||
        (playerHand === "choki" && npcHand === "pa") ||
        (playerHand === "pa" && npcHand === "gu")
    ) {
        return "win";
    }

    return "lose";
}

// プレイヤーの勝敗を反転させてNPCの勝敗を決定
function reverseResult(result) {
    if (result === "win") return "lose";
    if (result === "lose") return "win";
    return "draw";
}

// じゃんけんの勝敗と行動からダメージ計算に用いるスコアを決定
function setScore(character, result) {
    character.attackScore = 0;
    character.defenseScore = 0;

    if (result === "win" && character.action === "attack") {
        character.attackScore = 2;
        return;
    }

    if (result === "win" && character.action === "defense") {
        character.attackScore = 1;
        character.defenseScore = 1;
        return;
    }

    if (result === "lose" && character.action === "attack") {
        return;
    }

    if (result === "lose" && character.action === "defense") {
        character.defenseScore = 1;
        return;
    }

    if (result === "draw" && character.action === "attack") {
        character.attackScore = 1;
        return;
    }

    if (result === "draw" && character.action === "defense") {
        character.defenseScore = 1;
        return;
    }
}

// ダメージ計算処理
function applyDamage(player, npc) {
    let playerDamage = npc.attackScore - player.defenseScore;
    if (playerDamage < 0) playerDamage = 0;

    let npcDamage = player.attackScore - npc.defenseScore;
    if (npcDamage < 0) npcDamage = 0;

    player.life -= playerDamage;
    if (player.life < 0) player.life = 0;

    npc.life -= npcDamage;
    if (npc.life < 0) npc.life = 0;

    return {
        playerDamage,
        npcDamage
    };
}

// 1ターンの処理
function playTurn(player, npc) {
    const npcChoice = getNpcChoice();
    npc.hand = npcChoice.hand;
    npc.action = npcChoice.action;

    const result = judgeJanken(player.hand, npc.hand);

    setScore(player, result);
    setScore(npc, reverseResult(result));

    const damageResult = applyDamage(player, npc);

    return {
        result,
        npcHand: npc.hand,
        npcAction: npc.action,
        playerDamage: damageResult.playerDamage,
        npcDamage: damageResult.npcDamage
    };
}

//じゃんけんの画像のパスを取得
function getHandImagePath(hand) {
    if (hand === "gu") return "images/gu.png";
    if (hand === "choki") return "images/choki.png";
    return "images/pa.png";
}

// 行動の画像のパスを取得
function getActionImagePath(action) {
    if (action === "attack") return "images/sword.png";
    return "images/shield.png";
}

const player = new Player();
const npc = new Npc();

let currentHand = null;
let currentAction = null;
let turn = 1;
const MAX_TURN = 10;

// UIの初期化
function initUI() {
    document.getElementById("player-life").textContent = player.life;
    document.getElementById("npc-life").textContent = npc.life;
    document.getElementById("turn-count").textContent = turn;

    // ボタン関係の表示
    document.getElementById("hand-selection").style.display = "block";
    document.getElementById("action-selection").style.display = "none";
    document.getElementById("next-button").style.display = "none";
    document.getElementById("next-round-button").style.display = "none";
    document.getElementById("restart-button").style.display = "none";

    // 結果の表示
    document.getElementById("player-result-image").src = "";
    document.getElementById("npc-result-image").src = "";
    document.getElementById("player-action-image").src = "";
    document.getElementById("npc-action-image").src = "";

    document.getElementById("result-message").textContent = "";
    document.getElementById("damage-message").textContent = "";
    document.getElementById("final-message").textContent = "";
}

// プレイヤーの手の選択
function setHand(hand) {
    currentHand = hand;

    document.getElementById("hand-selection").style.display = "none";
    document.getElementById("action-selection").style.display = "block";
}

// プレイヤーの行動選択
function setAction(action) {
    currentAction = action;

    document.getElementById("action-selection").style.display = "none";
    document.getElementById("next-button").style.display = "block";
}

// ターンを実行
function nextTurn() {
    if (!currentHand || !currentAction) {
        alert("手と行動を選択してください");
        return;
    }

    player.hand = currentHand;
    player.action = currentAction;

    const turnResult = playTurn(player, npc);

    //結果からステータスを更新
    document.getElementById("player-life").textContent = player.life;
    document.getElementById("npc-life").textContent = npc.life;
    document.getElementById("turn-count").textContent = turn;

    document.getElementById("player-result-image").src = getHandImagePath(player.hand);
    document.getElementById("npc-result-image").src = getHandImagePath(turnResult.npcHand);

    document.getElementById("player-action-image").src = getActionImagePath(player.action);
    document.getElementById("npc-action-image").src = getActionImagePath(turnResult.npcAction);

    // じゃんけんの勝敗表示
    let resultText = "";
    if (turnResult.result === "win") {
        resultText = "じゃんけんの勝敗：プレイヤーの勝ち";
    } else if (turnResult.result === "lose") {
        resultText = "じゃんけんの勝敗：NPCの勝ち";
    } else {
        resultText = "じゃんけんの勝敗：あいこ";
    }

    document.getElementById("result-message").textContent = resultText;

    const damageText = `NPCに${turnResult.npcDamage}のダメージ / プレイヤーに${turnResult.playerDamage}のダメージ`;
    document.getElementById("damage-message").textContent = damageText;

    document.getElementById("hand-selection").style.display = "none";
    document.getElementById("action-selection").style.display = "none";
    document.getElementById("next-button").style.display = "none";

    if (player.life <= 0 || npc.life <= 0 || turn >= MAX_TURN) {
        let finalMessage = "";

        if (player.life > npc.life) {
            finalMessage = "ゲーム終了：プレイヤーの勝ち";
        } else if (player.life < npc.life) {
            finalMessage = "ゲーム終了：NPCの勝ち";
        } else {
            finalMessage = "ゲーム終了：引き分け";
        }

        document.getElementById("final-message").textContent = finalMessage;
        document.getElementById("restart-button").style.display = "block";
        return;
    }

    document.getElementById("next-round-button").style.display = "block";
}

// 次のターンのためにリセット
function prepareNextTurn() {
    turn++;
    currentHand = null;
    currentAction = null;

    document.getElementById("turn-count").textContent = turn;

    document.getElementById("hand-selection").style.display = "block";
    document.getElementById("action-selection").style.display = "none";
    document.getElementById("next-button").style.display = "none";
    document.getElementById("next-round-button").style.display = "none";

    document.getElementById("player-result-image").src = "";
    document.getElementById("npc-result-image").src = "";
    document.getElementById("player-action-image").src = "";
    document.getElementById("npc-action-image").src = "";

    document.getElementById("result-message").textContent = "";
    document.getElementById("damage-message").textContent = "";
}

//ゲームをリセット
function resetGame() {
    player.life = 5;
    player.hand = null;
    player.action = null;
    player.attackScore = 0;
    player.defenseScore = 0;

    npc.life = 5;
    npc.hand = null;
    npc.action = null;
    npc.attackScore = 0;
    npc.defenseScore = 0;

    currentHand = null;
    currentAction = null;
    turn = 1;

    initUI();
}

window.onload = initUI;