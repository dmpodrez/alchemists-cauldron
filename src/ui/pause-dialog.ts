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

  const eyebrow = document.createElement('span');
  eyebrow.className = 'pause-dialog__eyebrow';
  eyebrow.textContent = 'Game paused';

  const title = document.createElement('h2');
  title.id = 'pause-title';
  title.className = 'pause-dialog__title';
  title.textContent = 'Take a break';

  const text = document.createElement('p');
  text.className = 'pause-dialog__text';
  text.textContent = 'The timer is stopped and the cauldron is locked until you resume the game.';

  const actions = document.createElement('div');
  actions.className = 'pause-dialog__actions';

  const resumeButton = document.createElement('button');
  resumeButton.className = 'pause-dialog__button pause-dialog__button_primary';
  resumeButton.type = 'button';
  resumeButton.textContent = 'Resume';
  resumeButton.addEventListener('click', onResume);

  const exitButton = document.createElement('button');
  exitButton.className = 'pause-dialog__button';
  exitButton.type = 'button';
  exitButton.textContent = 'Exit to Menu';
  exitButton.addEventListener('click', onExit);

  actions.append(resumeButton, exitButton);
  dialog.append(eyebrow, title, text, actions);
  overlay.append(dialog);

  requestAnimationFrame(() => {
    resumeButton.focus();
  });

  return overlay;
}
