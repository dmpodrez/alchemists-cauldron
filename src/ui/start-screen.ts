import type { Difficulty } from '../data/recipes';
import { createSettingsDialog } from './settings-dialog';
import { DIFFICULTY_SETTINGS } from '../data/difficulty';
import { createStartPreview } from './start-preview';

interface StartScreenOptions {
  onStart: () => void;
  onContinue: () => void;
  hasSavedGame: boolean;
  onLeaderboard: () => void;
  selectedDifficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

function createHelpDialog(difficulty: Difficulty, onClose: () => void): HTMLElement {
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const difficultyName = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

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
    `Choose ingredients from the shelf. This difficulty has ${settings.shelfSize} available ingredient types.`,
    `Place up to ${settings.cauldronCapacity} ingredients into the cauldron.`,
    'Balance Temperature, Density and Magic Power to match the current recipe.',
    `Recipe ranges have an additional tolerance of ±${settings.tolerance}.`,
    `A successful Brew gives ${settings.scorePerBrew} points and adds ${settings.timeBonus} seconds, without exceeding the starting time.`,
    'A failed Brew costs one life. Used ingredients are always consumed.',
    'The game ends when time runs out, all lives are lost, or no ingredients remain.',
  ];
  for (const text of ruleTexts) {
    const item = document.createElement('li');
    item.textContent = text;
    rules.append(item);
  }

  const note = document.createElement('p');
  note.className = 'help-dialog__note';

  note.textContent =
    `${difficultyName} difficulty: ` +
    `${settings.startTime} seconds, ` +
    `${settings.lives} lives, ` +
    `${settings.cauldronCapacity} cauldron slots.`;

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

export function createStartScreen({
  onStart,
  onContinue,
  hasSavedGame,
  onLeaderboard,
  selectedDifficulty,
  onDifficultyChange,
}: StartScreenOptions): HTMLElement {
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
    screen.append(createHelpDialog(selectedDifficulty, closeHelp));
  });

  const settingsButton = document.createElement('button');
  settingsButton.className = 'secondary-button start-screen__secondary';
  settingsButton.type = 'button';
  settingsButton.textContent = 'Settings';

  settingsButton.addEventListener('click', () => {
    const closeSettings = (): void => {
      screen.querySelector('.settings-overlay')?.remove();
      settingsButton.focus();
    };

    screen.querySelector('.settings-overlay')?.remove();

    screen.append(
      createSettingsDialog({
        selectedDifficulty,
        onSelect: onDifficultyChange,
        onClose: closeSettings,
      }),
    );
  });

  secondaryActions.append(settingsButton, helpButton, leaderboardButton);

  actions.append(startButton);

  if (hasSavedGame) {
    const continueButton = document.createElement('button');
    continueButton.className = 'secondary-button start-screen__secondary';
    continueButton.type = 'button';
    continueButton.textContent = 'Continue Game';
    continueButton.addEventListener('click', onContinue);
    actions.append(continueButton);
  }

  actions.append(secondaryActions);

  const preview = createStartPreview(selectedDifficulty);

  content.append(sigil, eyebrow, title, ornament, text, preview, actions);

  screen.append(veil, content);

  return screen;
}
