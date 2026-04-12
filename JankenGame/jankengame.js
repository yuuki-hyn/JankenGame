class Character {
    constructor(life){
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
    constructor(){
        super(5); 
    }
}

class Npc extends Character {
    constructor(){
        super(5);
    }
}

function getPlayerChoice(){
    return {
        hand: "gu",
        action: "attack"
    };
}

function getNpcChoice(){
    const hands = ["gu", "choki", "pa"];
    const actions = ["attack", "defense"];

    let hand = hands[Math.floor(Math.random() * hands.length)];
    let action = actions[Math.floor(Math.random() * actions.length)];

    return {
        hand: hand, 
        action: action
    };
}

function judgeJanken(playerHand, npcHand){

    if (playerHand === npcHand){
        return "draw";
    } else if (
        (playerHand === "gu" && npcHand === "choki") ||
        (playerHand === "choki" && npcHand === "pa") ||
        (playerHand === "pa" && npcHand === "gu")
    ){
        return "win";
    } else {
        return "lose";
    }
}
console.log(judgeJanken("gu", "pa"));

function reverseResult(result){
    if(result === "win") return "lose";
    if(result === "lose") return "win";
    return "draw"
}

function setScore(character, result) {
    character.attackScore = 0;
    character.defenseScore = 0;

    if (result === "win" && character.action ==="attack"){
        character.attackScore = 2;
        character.defenseScore = 0;
        return;
    }
    if (result === "win" && character.action ==="defense"){
        character.attackScore = 1;
        character.defenseScore = 1;
        return;
    }
        if (result === "lose" && character.action ==="attack"){
        character.attackScore = 0;
        character.defenseScore = 0;
        return;
    }
    if (result === "lose" && character.action ==="defense"){
        character.attackScore = 0;
        character.defenseScore = 1;
        return;
    }

    if (result === "draw" && character.action ==="attack"){
        character.attackScore = 1;
        character.defenseScore = 0;
        return;
    }
    if (result === "draw" && character.action ==="defense"){
        character.attackScore = 0;
        character.defenseScore = 1;
        return;
    }
}

function applyDamage(player,npc) {
    let playerDamage = npc.attackScore - player.defenseScore;
    if(playerDamage < 0) playerDamage = 0;

    let npcDamage = player.attackScore - npc.defenseScore;
    if(npcDamage < 0) npcDamage = 0;

    player.life -= playerDamage;
    if(player.life < 0) player.life = 0;
    npc.life -= npcDamage;
    if(npc.life < 0) npc.life = 0;
}    

function playTurn (player, npc){
    let playerChoice = getPlayerChoice();
    player.hand = playerChoice.hand;
    player.action = playerChoice.action;

    let npcChoice = getNpcChoice();
    npc.hand = npcChoice.hand;
    npc.action = npcChoice.action;

    let result = judgeJanken(player.hand, npc.hand);

    setScore(player, result);
    setScore(npc, reverseResult(result));

    applyDamage(player,npc);


}


