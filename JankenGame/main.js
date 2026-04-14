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
    }

    setAction(action) {
        this.action = action;
    }
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

function getNpcChoice() {
    const hands = ["gu", "choki", "pa"];
    const actions = ["attack", "defense"];

    const hand = hands[Math.floor(Math.random() * hands.length)];
    const action = actions[Math.floor(Math.random() * actions.length)];

    return { hand, action };
}

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

function reverseResult(result) {
    if (result === "win") return "lose";
    if (result === "lose") return "win";
    return "draw";
}

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

function playTurn(player, npc) {
    const npcChoice = getNpcChoice();
    npc.hand = npcChoice.hand;
    npc.action = npcChoice.action;

    const result = judgeJanken(player.hand, npc.hand);

    setScore(player, result);
    setScore(npc, reverseResult(result));

    applyDamage(player, npc);

    return {
        result,
        npcHand: npc.hand,
        npcAction: npc.action
    };
}

const player = new Player();
const npc = new Npc();

let currentHand = null;
let currentAction = null;
let turn = 1;
const MAX_TURN = 10;

function initUI() {
    document.getElementById("player-life").textContent = player.life;
    document.getElementById("npc-life").textContent = npc.life;
    document.getElementById("turn-count").textContent = turn;

    document.getElementById("hand-selection").style.display = "block";
    document.getElementById("action-selection").style.display = "none";
    document.getElementById("next-button").style.display = "none";

    document.getElementById("result-message").textContent = "";
    document.getElementById("choice-message").textContent = "";
}

function setHand(hand) {
    currentHand = hand;
    document.getElementById("hand-selection").style.display = "none";
    document.getElementById("action-selection").style.display = "block";
}

function setAction(action) {
    currentAction = action;
    document.getElementById("action-selection").style.display = "none";
    document.getElementById("next-button").style.display = "block";
}

function nextTurn() {
    if (!currentHand || !currentAction) {
        alert("手と行動を選択してください");
        return;
    }

    player.hand = currentHand;
    player.action = currentAction;

    const turnResult = playTurn(player, npc);

    document.getElementById("player-life").textContent = player.life;
    document.getElementById("npc-life").textContent = npc.life;
    document.getElementById("turn-count").textContent = turn;

    document.getElementById("result-message").textContent = turnResult.result;
    document.getElementById("choice-message").textContent =
        `プレイヤー: ${player.hand} / ${player.action} | NPC: ${turnResult.npcHand} / ${turnResult.npcAction}`;

    if (player.life <= 0 || npc.life <= 0 || turn >= MAX_TURN) {
        let finalMessage = "";

        if (player.life > npc.life) {
            finalMessage = "プレイヤーの勝ち";
        } else if (player.life < npc.life) {
            finalMessage = "NPCの勝ち";
        } else {
            finalMessage = "引き分け";
        }

        document.getElementById("result-message").textContent = finalMessage;
        return;
    }

    turn++;
    currentHand = null;
    currentAction = null;

    document.getElementById("hand-selection").style.display = "block";
    document.getElementById("action-selection").style.display = "none";
    document.getElementById("next-button").style.display = "none";
}

window.onload = initUI;