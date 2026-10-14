interface StartScreenOptions {
  onStart: () => void;
  onLeaderboard: () => void;
}

export function createStartScreen({ onStart, onLeaderboard }: StartScreenOptions): HTMLElement {
  const screen = document.createElement('main');
  screen.className = 'start-screen';

  const content = document.createElement('div');
  content.className = 'start-screen__content';

  const eyebrow = document.createElement('span');
  eyebrow.className = 'start-screen__eyebrow';
  eyebrow.textContent = 'Alchemy awaits';

  const title = document.createElement('h1');
  title.className = 'start-screen__title';
  title.textContent = "Alchemist's Cauldron";

  const text = document.createElement('p');
  text.className = 'start-screen__text';
  text.textContent =
    'Combine ingredients and match all three recipe ranges before your resources run out.';

  const actions = document.createElement('div');
  actions.className = 'start-screen__actions';

  const startButton = document.createElement('button');
  startButton.className = 'start-button';
  startButton.type = 'button';
  startButton.textContent = 'Start Game';
  startButton.addEventListener('click', onStart);

  const leaderboardButton = document.createElement('button');
  leaderboardButton.className = 'secondary-button';
  leaderboardButton.type = 'button';
  leaderboardButton.textContent = 'Leaderboard';
  leaderboardButton.addEventListener('click', onLeaderboard);

  actions.append(startButton, leaderboardButton);
  content.append(eyebrow, title, text, actions);
  screen.append(content);

  return screen;
}
