function goToGame(gameName) {
  window.location.href = 'html/' + gameName + '.html';
}

document.addEventListener('DOMContentLoaded', () => {
  // Select all buttons inside the game-button div
  let buttons = document.querySelectorAll('.game-button button');

  for (let button of buttons) {
    button.addEventListener('click', (event) => {
      window.playButtonClick();
      const gameName = event.currentTarget.id;
      setTimeout(() => goToGame(gameName), 60);
    });
  }
});
