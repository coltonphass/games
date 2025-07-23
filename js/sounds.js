// Get base path of the current HTML page to sounds folder
// Assuming sounds/ folder is at root of project, alongside index.html
const basePath = window.location.pathname.includes("/html/") ? "../sounds/" : "sounds/";

window.cardFlipSound = new Audio(basePath + "card-flip.wav");

window.playCardFlip = function() {
    if (!window.cardFlipSound.paused) {
        window.cardFlipSound.pause();
        window.cardFlipSound.currentTime = 0;
    }
    window.cardFlipSound.play();
};

window.buttonClickSound = new Audio(basePath + "button-click.mp3");

window.playButtonClick = function() {
    if (!window.buttonClickSound.paused) {
        window.buttonClickSound.pause();
        window.buttonClickSound.currentTime = 0;
    }
    window.buttonClickSound.play();
};

window.youLoseSound = new Audio(basePath + "you-lose.wav")

window.playYouLose = function(){
        if (!window.youLoseSound.paused) {
        window.youLoseSound.pause();
        window.youLoseSound.currentTime = 0;
    }
    window.youLoseSound.play();
}

window.youWinSound = new Audio(basePath + "you-win.wav")

window.playYouWin = function(){
        if (!window.youWinSound.paused) {
        window.youWinSound.pause();
        window.youWinSound.currentTime = 0;
    }
    window.youWinSound.play();
}
