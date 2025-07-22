let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0; 

let hidden;
let deck;

let canHit = true; 

window.onload = function() {
    buildDeck();
    shuffleDeck();
    startGame();
}

function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
        let temp = deck[i];
        deck[i] = deck[j];
        deck[j] = temp;
    }
    console.log(deck);
}

function startGame() {
    hidden = deck.pop();
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);

    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "../cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "../cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
    }

    updateYourSumDisplay(); 

    console.log(yourSum);
    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("retry").addEventListener("click", retry);
}

function updateYourSumDisplay() {
    document.getElementById("your-sum").innerText = yourSum;
}

function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "../cards/" + card + ".png";
    document.getElementById("your-cards").append(cardImg);

    yourSum += getValue(card);
    yourAceCount += checkAce(card);

    // Apply ace reduction and update both sum and ace count
    let result = reduceAce(yourSum, yourAceCount);
    yourSum = result.sum;
    yourAceCount = result.aceCount;

    updateYourSumDisplay();

    if (yourSum > 21) {
        canHit = false;
        document.getElementById("results").innerText = "You Busted!";
        document.getElementById("hidden").src = "../cards/" + hidden + ".png";
    } else if (yourSum === 21) {
        canHit = false;
    }
}

function stay() {
    let dealerResult = reduceAce(dealerSum, dealerAceCount);
    dealerSum = dealerResult.sum;
    dealerAceCount = dealerResult.aceCount;
    
    let yourResult = reduceAce(yourSum, yourAceCount);
    yourSum = yourResult.sum;
    yourAceCount = yourResult.aceCount;

    canHit = false;
    document.getElementById("hidden").src = "../cards/" + hidden + ".png";

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
    }
    else if (dealerSum > 21) {
        message = "You win!";
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message = "Tie!";
    }
    else if (yourSum > dealerSum) {
        message = "You Win!";
    }
    else if (yourSum < dealerSum) {
        message = "You Lose!";
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    updateYourSumDisplay(); 
    document.getElementById("results").innerText = message;
}

function retry(){
    window.location.reload(true);
}

function getValue(card) {
    let data = card.split("-"); // "4-C" -> ["4", "C"]
    let value = data[0];

    if (isNaN(value)) { //A J Q K
        if (value == "A") {
            return 11;
        }
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    if (card[0] == "A") {
        return 1;
    }
    return 0;
}

// MODIFIED: Now returns both sum and ace count
function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return {sum: playerSum, aceCount: playerAceCount};
}