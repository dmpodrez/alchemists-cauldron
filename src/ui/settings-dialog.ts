import { DIFFICULTY_SETTINGS } from '../data/difficulty';
import type { Difficulty } from '../data/recipes';

interface SettingsDialogOptions {
  selectedDifficulty: Difficulty;
  onSelect: (difficulty: Difficulty) => void;
  onClose: () => void;
}

const DIFFICULTIES: readonly Difficulty[] = ['easy', 'medium', 'hard'];

export function createSettingsDialog({
  selectedDifficulty,
  onSelect,
  onClose,
}: SettingsDialogOptions): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'help-overlay settings-overlay';

  const dialog = document.createElement('section');
  dialog.className = 'help-dialog settings-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'settings-title');

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.className = 'help-dialog__close';
  closeButton.textContent = '×';
  closeButton.setAttribute('aria-label', 'Close settings');
  closeButton.addEventListener('click', onClose);

  const eyebrow = document.createElement('span');
  eyebrow.className = 'help-dialog__eyebrow';
  eyebrow.textContent = 'Alchemist Configuration';

  const title = document.createElement('h2');
  title.id = 'settings-title';
  title.className = 'help-dialog__title';
  title.textContent = 'Choose Your Difficulty';

  const description = document.createElement('p');
  description.className = 'settings-dialog__description';
  description.textContent = 'Choose the rules for your next alchemical experiment.';

  const options = document.createElement('div');
  options.className = 'settings-dialog__options';

  for (const difficulty of DIFFICULTIES) {
    const settings = DIFFICULTY_SETTINGS[difficulty];
    const selected = difficulty === selectedDifficulty;

    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'settings-dialog__option';
    button.setAttribute('aria-pressed', String(selected));

    if (selected) {
      button.classList.add('settings-dialog__option_selected');
    }

    const name = document.createElement('strong');
    name.className = 'settings-dialog__option-name';
    name.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

    const details = document.createElement('span');
    details.className = 'settings-dialog__option-details';
    details.textContent =
      `${settings.shelfSize} ingredients · ` +
      `${settings.startTime}s · ` +
      `${settings.lives} lives · ±${settings.tolerance}`;

    const indicator = document.createElement('span');
    indicator.className = 'settings-dialog__indicator';
    indicator.textContent = selected ? '✓ Selected' : 'Select';

    button.append(name, details, indicator);
    button.addEventListener('click', () => onSelect(difficulty));

    options.append(button);
  }

  dialog.append(closeButton, eyebrow, title, description, options);

  overlay.append(dialog);

  requestAnimationFrame(() => {
    closeButton.focus();
  });

  return overlay;
}
