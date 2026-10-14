import type { GameOverReason } from '../state/game-state';

interface GameOverOptions {
  score: number;
  reason: GameOverReason;
  askForName: boolean;
  onSubmitScore: (name: string) => string | null;
  onPlayAgain: () => void;
  onLeaderboard: () => void;
}

const REASON_TEXT: Record<GameOverReason, string> = {
  time: 'Time is up',
  lives: 'No lives left',
  ingredients: 'Out of ingredients',
};

export function createGameOverScreen({
  score,
  reason,
  askForName,
  onSubmitScore,
  onPlayAgain,
  onLeaderboard,
}: GameOverOptions): HTMLElement {
  const screen = document.createElement('main');
  screen.className = 'game-over';

  const content = document.createElement('div');
  content.className = 'game-over__content';

  const eyebrow = document.createElement('span');
  eyebrow.className = 'game-over__eyebrow';
  eyebrow.textContent = REASON_TEXT[reason];

  const title = document.createElement('h1');
  title.className = 'game-over__title';
  title.textContent = 'Game Over';

  const scoreLabel = document.createElement('p');
  scoreLabel.className = 'game-over__score-label';
  scoreLabel.textContent = 'Final Score';

  const scoreValue = document.createElement('strong');
  scoreValue.className = 'game-over__score';
  scoreValue.textContent = String(score);

  content.append(eyebrow, title, scoreLabel, scoreValue);

  if (askForName) {
    const form = document.createElement('form');
    form.className = 'score-entry';

    const label = document.createElement('label');
    label.className = 'score-entry__label';
    label.htmlFor = 'player-name';
    label.textContent = 'You reached the Top 10! Enter your name';

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
    saveButton.className = 'start-button';
    saveButton.type = 'submit';
    saveButton.textContent = 'Save Score';

    form.append(label, input, hint, error, saveButton);

    form.addEventListener('submit', (event) => {
      event.preventDefault();

      const result = onSubmitScore(input.value);

      if (result) {
        error.textContent = result;
        return;
      }

      const saved = document.createElement('p');
      saved.className = 'score-entry__success';
      saved.textContent = 'Score saved to the leaderboard.';

      form.replaceChildren(saved);
    });

    content.append(form);
  }

  const actions = document.createElement('div');
  actions.className = 'game-over__actions';

  const playAgain = document.createElement('button');
  playAgain.className = 'start-button';
  playAgain.type = 'button';
  playAgain.textContent = 'Play Again';
  playAgain.addEventListener('click', onPlayAgain);

  const leaderboard = document.createElement('button');
  leaderboard.className = 'secondary-button';
  leaderboard.type = 'button';
  leaderboard.textContent = 'Leaderboard';
  leaderboard.addEventListener('click', onLeaderboard);

  actions.append(playAgain, leaderboard);
  content.append(actions);

  screen.append(content);

  return screen;
}
