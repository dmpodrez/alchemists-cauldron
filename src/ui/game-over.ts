import type { GameOverReason } from '../state/game-state';

interface GameOverOptions {
  score: number;
  reason: GameOverReason;
  askForName: boolean;
  onSubmitScore: (name: string) => string | null;
  onPlayAgain: () => void;
  onLeaderboard: () => void;
}

interface ReasonPresentation {
  eyebrow: string;
  mark: string;
}

const REASON_PRESENTATION: Record<GameOverReason, ReasonPresentation> = {
  time: {
    eyebrow: 'Time Has Run Out',
    mark: '◷',
  },
  lives: {
    eyebrow: 'No Lives Left',
    mark: '☠',
  },
  ingredients: {
    eyebrow: 'Ingredients Depleted',
    mark: '◇',
  },
};

function createButton(
  text: string,
  className: string,
  onClick: () => void,
  icon: string,
): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = className;
  button.type = 'button';

  const iconElement = document.createElement('span');
  iconElement.className = 'game-over__button-icon';
  iconElement.textContent = icon;
  iconElement.setAttribute('aria-hidden', 'true');

  const label = document.createElement('span');
  label.textContent = text;

  button.append(iconElement, label);
  button.addEventListener('click', onClick);

  return button;
}

export function createGameOverScreen({
  score,
  reason,
  askForName,
  onSubmitScore,
  onPlayAgain,
  onLeaderboard,
}: GameOverOptions): HTMLElement {
  const presentation = REASON_PRESENTATION[reason];

  const screen = document.createElement('main');
  screen.className = `game-over game-over_reason-${reason}`;

  const veil = document.createElement('div');
  veil.className = 'game-over__veil';
  veil.setAttribute('aria-hidden', 'true');

  const content = document.createElement('section');
  content.className = 'game-over__content';

  const mark = document.createElement('div');
  mark.className = 'game-over__mark';
  mark.textContent = presentation.mark;
  mark.setAttribute('aria-hidden', 'true');

  const eyebrow = document.createElement('span');
  eyebrow.className = 'game-over__eyebrow';
  eyebrow.textContent = presentation.eyebrow;

  const title = document.createElement('h1');
  title.className = 'game-over__title';
  title.textContent = 'Game Over';

  const divider = document.createElement('div');
  divider.className = 'game-over__divider';
  divider.setAttribute('aria-hidden', 'true');

  const scoreLabel = document.createElement('p');
  scoreLabel.className = 'game-over__score-label';
  scoreLabel.textContent = 'Final Score';

  const scoreValue = document.createElement('strong');
  scoreValue.className = 'game-over__score';
  scoreValue.textContent = String(score);

  content.append(mark, eyebrow, title, divider, scoreLabel, scoreValue);

  if (askForName) {
    const form = document.createElement('form');
    form.className = 'score-entry';

    const topTen = document.createElement('span');
    topTen.className = 'score-entry__eyebrow';
    topTen.textContent = 'Hall of Alchemists';

    const label = document.createElement('label');
    label.className = 'score-entry__label';
    label.htmlFor = 'player-name';
    label.textContent = 'You reached the Top 10 — enter your name';

    const input = document.createElement('input');
    input.id = 'player-name';
    input.className = 'score-entry__input';
    input.type = 'text';
    input.minLength = 2;
    input.maxLength = 15;
    input.autocomplete = 'off';
    input.placeholder = 'Alchemist';

    const hint = document.createElement('span');
    hint.className = 'score-entry__hint';
    hint.textContent = '2–15 characters: letters, digits, space, _ or -';

    const error = document.createElement('p');
    error.className = 'score-entry__error';
    error.setAttribute('aria-live', 'polite');

    const saveButton = document.createElement('button');
    saveButton.className = 'score-entry__save';
    saveButton.type = 'submit';

    const saveIcon = document.createElement('span');
    saveIcon.className = 'game-over__button-icon';
    saveIcon.textContent = '◆';
    saveIcon.setAttribute('aria-hidden', 'true');

    const saveText = document.createElement('span');
    saveText.textContent = 'Save Score';

    saveButton.append(saveIcon, saveText);

    form.append(topTen, label, input, hint, error, saveButton);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const result = onSubmitScore(input.value);

      if (result) {
        error.textContent = result;
        input.focus();
        return;
      }

      const saved = document.createElement('p');
      saved.className = 'score-entry__success';
      saved.textContent = 'Score saved to the Hall of Alchemists.';

      form.replaceChildren(saved);
    });

    content.append(form);

    requestAnimationFrame(() => {
      input.focus();
    });
  }

  const actions = document.createElement('div');
  actions.className = 'game-over__actions';

  const playAgain = createButton(
    'Play Again',
    'game-over__button game-over__button_primary',
    onPlayAgain,
    '↻',
  );

  const leaderboard = createButton(
    'Leaderboard',
    'game-over__button game-over__button_secondary',
    onLeaderboard,
    '▥',
  );

  actions.append(playAgain, leaderboard);
  content.append(actions);

  screen.append(veil, content);

  return screen;
}
