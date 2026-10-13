import type { GameOverReason } from '../state/game-state';

interface GameOverOptions {
  score: number;
  reason: GameOverReason;
  onPlayAgain: () => void;
}

const REASON_TEXT: Record<GameOverReason, string> = {
  time: 'Time is up',
  lives: 'No lives left',
  ingredients: 'Out of ingredients',
};

export function createGameOverScreen({ score, reason, onPlayAgain }: GameOverOptions): HTMLElement {
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

  const playAgain = document.createElement('button');
  playAgain.className = 'start-button';
  playAgain.type = 'button';
  playAgain.textContent = 'Play Again';
  playAgain.addEventListener('click', onPlayAgain);

  content.append(eyebrow, title, scoreLabel, scoreValue, playAgain);

  screen.append(content);

  return screen;
}
