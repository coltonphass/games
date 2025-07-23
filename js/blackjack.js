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
            deck.push(values[j] + "-" + types[i]);
        }
    }
}

function shuffleDeck() {
    for (let i = 0; i < deck.length; i++) {
        let j = Math.floor(Math.random() * deck.length);
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
        let card = deck.pop();

        let cardContainer = document.createElement("div");
        cardContainer.classList.add("card-flip");

        let cardImg = document.createElement("img");
        cardImg.src = "../cards/" + card + ".webp";
        cardImg.classList.add("card-face");

        cardContainer.appendChild(cardImg);
        document.getElementById("dealer-cards").appendChild(cardContainer);

        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);

    }

    for (let i = 0; i < 2; i++) {
        let card = deck.pop();

        let cardContainer = document.createElement("div");
        cardContainer.classList.add("card-flip");

        let cardImg = document.createElement("img");
        cardImg.src = "../cards/" + card + ".webp";
        cardImg.classList.add("card-face");

        cardContainer.appendChild(cardImg);
        document.getElementById("your-cards").appendChild(cardContainer);

        yourSum += getValue(card);
        yourAceCount += checkAce(card);

        window.playCardFlip();
    }

    updateYourSumDisplay();

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("retry").addEventListener("click", retry);
}

function updateYourSumDisplay() {
    document.getElementById("your-sum").innerText = yourSum;
}

function hit() {
    if (!canHit) return;

    let card = deck.pop();

    let cardContainer = document.createElement("div");
    cardContainer.classList.add("card-flip");

    let cardImg = document.createElement("img");
    cardImg.src = "../cards/" + card + ".webp";
    cardImg.classList.add("card-face");

    cardContainer.appendChild(cardImg);
    document.getElementById("your-cards").appendChild(cardContainer);

    yourSum += getValue(card);
    yourAceCount += checkAce(card);

    let result = reduceAce(yourSum, yourAceCount);
    yourSum = result.sum;
    yourAceCount = result.aceCount;

    updateYourSumDisplay();

    // Check bust or continue
    if (yourSum > 21) {
        canHit = false;
        document.getElementById("results").innerText = "You Busted!";
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("hidden").src = "../cards/" + hidden + ".webp";

        // Play lose sound
        window.playYouLose();
    } else {
        // Play card flip sound only if not busted
        window.playCardFlip();
    }

    if (yourSum === 21) {
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
    document.getElementById("hidden").src = "../cards/" + hidden + ".webp";

    let message = "";
    if (yourSum > 21) {
        message = "You Lose!";
        window.playYouLose()
    } else if (dealerSum > 21) {
        message = "You Win!";
        window.playYouWin()
    } else if (yourSum === dealerSum) {
        message = "Tie!";
        window.playYouTie()
    } else if (yourSum > dealerSum) {
        message = "You Win!";
        window.playYouWin()
    } else {
        message = "You Lose!";
        window.playYouLose()
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    updateYourSumDisplay();
    document.getElementById("results").innerText = message;
}

function retry() {
    window.playButtonClick();
    setTimeout(() => {
        window.location.reload(true);
    }, 125);  // wait 125ms before reloading
}

function getValue(card) {
    let data = card.split("-");
    let value = data[0];

    if (isNaN(value)) {
        if (value === "A") return 11;
        return 10;
    }
    return parseInt(value);
}

function checkAce(card) {
    return card[0] === "A" ? 1 : 0;
}

function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount--;
    }
    return { sum: playerSum, aceCount: playerAceCount };
}
