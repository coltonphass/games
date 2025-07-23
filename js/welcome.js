function goToBlackjack() {
    window.location.href = "html/blackjack.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const blackjackButton = document.getElementById("blackjack");

    blackjackButton.addEventListener("click", () => {
        window.playButtonClick();
        // Delay navigation so sound can start playing
        setTimeout(goToBlackjack, 60);
    });
});
