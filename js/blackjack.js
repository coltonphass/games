let dealerSum = 0;
let yourSum = 0;

let dealerAceCount = 0;
let yourAceCount = 0;

let hidden;
let deck;

let gameTurn = "player";
let dealerThinking = false;

let canHit = true;
let gameOver = false;

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
    // Deal initial 2 cards to dealer
    hidden = deck.pop(); // Dealer's hole card (face down)
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    
    // Dealer's face up card
    let dealerUpCard = deck.pop();
    dealerSum += getValue(dealerUpCard);
    dealerAceCount += checkAce(dealerUpCard);
    
    // Display dealer's face up card
    let cardContainer = document.createElement("div");
    cardContainer.classList.add("card-flip");
    
    let cardImg = document.createElement("img");
    cardImg.src = "../cards/" + dealerUpCard + ".webp";
    cardImg.classList.add("card-face");
    
    cardContainer.appendChild(cardImg);
    document.getElementById("dealer-cards").appendChild(cardContainer);

    // Deal initial 2 cards to player
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

    // Reduce aces for player's initial hand
    let result = reduceAce(yourSum, yourAceCount);
    yourSum = result.sum;
    yourAceCount = result.aceCount;

    updateYourSumDisplay();

    // Check for player blackjack
    if (yourSum === 21) {
        canHit = false;
        stay(); // Automatically go to dealer's turn
    }

    document.getElementById("hit").addEventListener("click", hit);
    document.getElementById("stay").addEventListener("click", stay);
    document.getElementById("retry").addEventListener("click", retry);
}

function updateYourSumDisplay() {
    document.getElementById("your-sum").innerText = yourSum;
}

function hit() {
    if (!canHit || gameOver || gameTurn !== "player") return;

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

    // Play card flip sound
    window.playCardFlip();

    // Check if player busted
    if (yourSum > 21) {
        canHit = false;
        gameOver = true;
        document.getElementById("results").innerText = "You Busted!";
        document.getElementById("dealer-sum").innerText = dealerSum;
        document.getElementById("hidden").src = "../cards/" + hidden + ".webp";
        window.playYouLose();
    } else if (yourSum === 21) {
        // Player got 21, automatically stay
        canHit = false;
        stay();
    }
}

function stay() {
    if (gameOver || gameTurn !== "player") return;

    canHit = false;
    gameTurn = "dealer";

    // Reveal dealer's hole card
    document.getElementById("hidden").src = "../cards/" + hidden + ".webp";
    
    // Don't show dealer sum yet - wait until dealer is done

    startDealerTurn();
}

function startDealerTurn() {
    if (gameOver) return;
    
    dealerThinking = true;
    document.getElementById("results").innerText = "Dealer is thinking...";

    function dealerAct() {
        if (gameOver) return;

        // Reduce aces before making decision
        let result = reduceAce(dealerSum, dealerAceCount);
        dealerSum = result.sum;
        dealerAceCount = result.aceCount;

        // Proper blackjack dealer rules: hit on 16 or less, stand on 17 or more
        let action = dealerSum < 17 ? "hit" : "stay";

        if (action === "hit") {
            let card = deck.pop();
            dealerSum += getValue(card);
            dealerAceCount += checkAce(card);

            let cardContainer = document.createElement("div");
            cardContainer.classList.add("card-flip");

            let cardImg = document.createElement("img");
            cardImg.src = "../cards/" + card + ".webp";
            cardImg.classList.add("card-face");

            cardContainer.appendChild(cardImg);
            document.getElementById("dealer-cards").appendChild(cardContainer);

            // Reduce aces after hitting
            let bustCheck = reduceAce(dealerSum, dealerAceCount);
            dealerSum = bustCheck.sum;
            dealerAceCount = bustCheck.aceCount;

            // Update dealer sum display
            document.getElementById("dealer-sum").innerText = dealerSum;

            window.playCardFlip();

            // Check if dealer busted
            if (dealerSum > 21) {
                dealerThinking = false;
                gameOver = true;
                setTimeout(() => {
                    determineWinner();
                }, 500); // Small delay to let the bust sink in
                return; // End immediately on bust
            }

            // Continue dealer's turn after delay if not busted
            setTimeout(dealerAct, 1000);
        } else {
            // Dealer stays
            dealerThinking = false;
            gameOver = true;
            // Show final dealer sum when dealer is done
            document.getElementById("dealer-sum").innerText = dealerSum;
            determineWinner();
        }
    }

    // Initial delay before dealer starts acting
    setTimeout(dealerAct, 1000);
}

function retry() {
    window.playButtonClick();
    setTimeout(() => {
        window.location.reload(true);
    }, 125);
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

function determineWinner() {
    // Final ace reduction for both hands
    let dealerResult = reduceAce(dealerSum, dealerAceCount);
    dealerSum = dealerResult.sum;

    let yourResult = reduceAce(yourSum, yourAceCount);
    yourSum = yourResult.sum;

    let message = "";
    
    if (yourSum > 21) {
        message = "You Lose! (Bust)";
        window.playYouLose();
    } else if (dealerSum > 21) {
        message = "You Win! (Dealer Bust)";
        window.playYouWin();
    } else if (yourSum === dealerSum) {
        message = "Push! (Tie)";
        window.playYouTie();
    } else if (yourSum > dealerSum) {
        message = "You Win!";
        window.playYouWin();
    } else {
        message = "You Lose!";
        window.playYouLose();
    }

    // Update final displays
    document.getElementById("dealer-sum").innerText = dealerSum;
    updateYourSumDisplay();
    document.getElementById("results").innerText = message;
}