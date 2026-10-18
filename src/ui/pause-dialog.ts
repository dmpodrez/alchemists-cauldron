interface PauseDialogOptions {
  onResume: () => void;
  onExit: () => void;
}

export function createPauseDialog({ onResume, onExit }: PauseDialogOptions): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'pause-overlay';

  const dialog = document.createElement('section');
  dialog.className = 'pause-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'pause-title');

  const ornament = document.createElement('div');
  ornament.className = 'pause-dialog__ornament';
  ornament.setAttribute('aria-hidden', 'true');

  const ornamentRing = document.createElement('span');
  ornamentRing.className = 'pause-dialog__ornament-ring';

  const ornamentMark = document.createElement('span');
  ornamentMark.className = 'pause-dialog__ornament-mark';
  ornamentMark.textContent = 'Ⅱ';

  ornament.append(ornamentRing, ornamentMark);

  const eyebrow = document.createElement('span');
  eyebrow.className = 'pause-dialog__eyebrow';
  eyebrow.textContent = 'Game Paused';

  const title = document.createElement('h2');
  title.id = 'pause-title';
  title.className = 'pause-dialog__title';
  title.textContent = 'Take a break';

  const divider = document.createElement('div');
  divider.className = 'pause-dialog__divider';
  divider.setAttribute('aria-hidden', 'true');

  const text = document.createElement('p');
  text.className = 'pause-dialog__text';
  text.textContent =
    'The timer is stopped and the cauldron is sealed until you return to the ritual.';

  const actions = document.createElement('div');
  actions.className = 'pause-dialog__actions';

  const resumeButton = document.createElement('button');
  resumeButton.className = 'pause-dialog__button pause-dialog__button_primary';
  resumeButton.type = 'button';

  const resumeIcon = document.createElement('span');
  resumeIcon.className = 'pause-dialog__button-icon';
  resumeIcon.textContent = '▶';
  resumeIcon.setAttribute('aria-hidden', 'true');

  const resumeText = document.createElement('span');
  resumeText.textContent = 'Resume';

  resumeButton.append(resumeIcon, resumeText);
  resumeButton.addEventListener('click', onResume);

  const exitButton = document.createElement('button');
  exitButton.className = 'pause-dialog__button pause-dialog__button_secondary';
  exitButton.type = 'button';

  const exitIcon = document.createElement('span');
  exitIcon.className = 'pause-dialog__button-icon';
  exitIcon.textContent = '⌂';
  exitIcon.setAttribute('aria-hidden', 'true');

  const exitText = document.createElement('span');
  exitText.textContent = 'Exit to Menu';

  exitButton.append(exitIcon, exitText);
  exitButton.addEventListener('click', onExit);

  actions.append(resumeButton, exitButton);
  dialog.append(ornament, eyebrow, title, divider, text, actions);
  overlay.append(dialog);

  requestAnimationFrame(() => {
    resumeButton.focus();
  });

  return overlay;
}
