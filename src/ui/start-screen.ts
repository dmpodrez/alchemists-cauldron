interface StartScreenOptions {
  onStart: () => void;
  onLeaderboard: () => void;
}

function createHelpDialog(onClose: () => void): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'help-overlay';

  const dialog = document.createElement('section');
  dialog.className = 'help-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'help-title');

  const closeButton = document.createElement('button');
  closeButton.className = 'help-dialog__close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close rules');
  closeButton.textContent = '×';
  closeButton.addEventListener('click', onClose);

  const eyebrow = document.createElement('span');
  eyebrow.className = 'help-dialog__eyebrow';
  eyebrow.textContent = 'Alchemist Handbook';

  const title = document.createElement('h2');
  title.id = 'help-title';
  title.className = 'help-dialog__title';
  title.textContent = 'How to Play';

  const rules = document.createElement('ol');
  rules.className = 'help-dialog__rules';

  const ruleTexts = [
    'Choose ingredients from the shelf. Each ingredient changes Temperature, Density and Magic Power.',
    'You can place up to 4 ingredients into the cauldron.',
    'Match all three cauldron values with the current recipe target ranges.',
    'Press Brew when you are ready. A successful potion gives 200 points and a time bonus.',
    'A failed brew costs one life. Used ingredients are always spent.',
    'The run ends when time reaches zero, all lives are lost, or no ingredients remain.',
  ];

  for (const text of ruleTexts) {
    const item = document.createElement('li');
    item.textContent = text;
    rules.append(item);
  }

  const note = document.createElement('p');
  note.className = 'help-dialog__note';
  note.textContent = 'Level 1 uses Medium rules: 150 seconds, 3 lives and ±8 brew tolerance.';

  const doneButton = document.createElement('button');
  doneButton.className = 'help-dialog__done';
  doneButton.type = 'button';
  doneButton.textContent = 'Got It';
  doneButton.addEventListener('click', onClose);

  dialog.append(closeButton, eyebrow, title, rules, note, doneButton);
  overlay.append(dialog);

  requestAnimationFrame(() => {
    closeButton.focus();
  });

  return overlay;
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

  const secondaryActions = document.createElement('div');
  secondaryActions.className = 'start-screen__secondary-actions';

  const helpButton = document.createElement('button');
  helpButton.className = 'secondary-button start-screen__secondary';
  helpButton.type = 'button';
  helpButton.textContent = 'Help';

  const leaderboardButton = document.createElement('button');
  leaderboardButton.className = 'secondary-button start-screen__secondary';
  leaderboardButton.type = 'button';
  leaderboardButton.textContent = 'Leaderboard';
  leaderboardButton.addEventListener('click', onLeaderboard);

  helpButton.addEventListener('click', () => {
    const closeHelp = (): void => {
      screen.querySelector('.help-overlay')?.remove();
      helpButton.focus();
    };

    screen.querySelector('.help-overlay')?.remove();
    screen.append(createHelpDialog(closeHelp));
  });

  secondaryActions.append(helpButton, leaderboardButton);
  actions.append(startButton, secondaryActions);
  content.append(sigil, eyebrow, title, ornament, text, actions);
  screen.append(veil, content);

  return screen;
}
