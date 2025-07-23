const basePath = window.location.pathname.includes("/html/") ? "../../sounds/" : "../sounds/";

// Object to store sounds
window.sounds = {};

// Create and store sound
function createSound(name, filename) {
    window.sounds[name] = new Audio(basePath + filename);
}

// Play sound by name
function playSound(name) {
    const sound = window.sounds[name];
    if (!sound) return;
    if (!sound.paused) {
        sound.pause();
        sound.currentTime = 0;
    }
    sound.play();
}

// Initialize sounds
createSound("cardFlip", "card-flip.wav");
createSound("buttonClick", "button-click.mp3");
createSound("youLose", "you-lose.wav");
createSound("youWin", "you-win.wav");
createSound("youTie", "you-tie.wav");

// Public play functions
window.playCardFlip = () => playSound("cardFlip");
window.playButtonClick = () => playSound("buttonClick");
window.playYouLose = () => playSound("youLose");
window.playYouWin = () => playSound("youWin");
window.playYouTie = () => playSound("youTie");
