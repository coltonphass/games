function blackJack() {
    window.location.href = "html/blackjack.html";
}

document.addEventListener("DOMContentLoaded", () => {
    const blackjackButton = document.getElementById("blackjack");
    blackjackButton.addEventListener("click", blackJack);
});