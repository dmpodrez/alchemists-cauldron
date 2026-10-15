interface StartScreenOptions {
  onStart: () => void;
  onLeaderboard: () => void;
}

export function createStartScreen({ onStart, onLeaderboard }: StartScreenOptions): HTMLElement {
  const screen = document.createElement('main');
  screen.className = 'start-screen';

  const veil = document.createElement('div');
  veil.className = 'start-screen__veil';
  veil.setAttribute('aria-hidden', 'true');

  const content = document.createElement('section');
  content.className = 'start-screen__content';

  const sigil = document.createElement('div');
  sigil.className = 'start-screen__sigil';
  sigil.setAttribute('aria-hidden', 'true');

  const sigilCore = document.createElement('span');
  sigilCore.className = 'start-screen__sigil-core';

  const sigilRing = document.createElement('span');
  sigilRing.className = 'start-screen__sigil-ring';

  const sigilLine = document.createElement('span');
  sigilLine.className = 'start-screen__sigil-line';

  sigil.append(sigilCore, sigilRing, sigilLine);

  const eyebrow = document.createElement('span');
  eyebrow.className = 'start-screen__eyebrow';
  eyebrow.textContent = 'The Laboratory Awaits';

  const title = document.createElement('h1');
  title.className = 'start-screen__title';
  title.textContent = "Alchemist's Cauldron";

  const ornament = document.createElement('div');
  ornament.className = 'start-screen__ornament';
  ornament.setAttribute('aria-hidden', 'true');

  const text = document.createElement('p');
  text.className = 'start-screen__text';
  text.textContent =
    'Combine rare ingredients, balance all three alchemical properties, and brew the correct recipe before time and resources run out.';

  const actions = document.createElement('div');
  actions.className = 'start-screen__actions';

  const startButton = document.createElement('button');
  startButton.className = 'start-button start-screen__primary';
  startButton.type = 'button';
  startButton.textContent = 'Start Game';
  startButton.addEventListener('click', onStart);

  const leaderboardButton = document.createElement('button');
  leaderboardButton.className = 'secondary-button start-screen__secondary';
  leaderboardButton.type = 'button';
  leaderboardButton.textContent = 'Leaderboard';
  leaderboardButton.addEventListener('click', onLeaderboard);

  actions.append(startButton, leaderboardButton);
  content.append(sigil, eyebrow, title, ornament, text, actions);
  screen.append(veil, content);

  return screen;
}
