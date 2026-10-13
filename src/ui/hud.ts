import { formatTime, LEVEL_ONE_START_TIME } from '../logic/timer';

interface HudOptions {
  score: number;
  timeLeft: number;
  lives: number;
  onPause: () => void;
}

export function createHud({ score, timeLeft, lives, onPause }: HudOptions): HTMLElement {
  const hud = document.createElement('section');
  hud.className = 'hud';

  const scoreItem = document.createElement('div');
  scoreItem.className = 'hud__item';

  const scoreLabel = document.createElement('span');
  scoreLabel.className = 'hud__label';
  scoreLabel.textContent = 'Score';

  const scoreValue = document.createElement('strong');
  scoreValue.className = 'hud__value';
  scoreValue.textContent = String(score);

  scoreItem.append(scoreLabel, scoreValue);

  const timerItem = document.createElement('div');
  timerItem.className = 'hud__item hud__timer';

  if (timeLeft < 15) {
    timerItem.classList.add('hud__timer_danger');
  }

  const timerHeader = document.createElement('div');
  timerHeader.className = 'hud__timer-header';

  const timerLabel = document.createElement('span');
  timerLabel.className = 'hud__label';
  timerLabel.textContent = 'Time';

  const timerValue = document.createElement('strong');
  timerValue.className = 'hud__value';
  timerValue.textContent = formatTime(timeLeft);

  timerHeader.append(timerLabel, timerValue);

  const timerTrack = document.createElement('div');
  timerTrack.className = 'hud__timer-track';

  const timerProgress = document.createElement('div');
  timerProgress.className = 'hud__timer-progress';

  const progress = Math.max(0, Math.min(100, (timeLeft / LEVEL_ONE_START_TIME) * 100));

  timerProgress.style.width = `${progress}%`;

  timerTrack.append(timerProgress);
  timerItem.append(timerHeader, timerTrack);

  const livesItem = document.createElement('div');
  livesItem.className = 'hud__item';

  const livesLabel = document.createElement('span');
  livesLabel.className = 'hud__label';
  livesLabel.textContent = 'Lives';

  const livesValue = document.createElement('strong');
  livesValue.className = 'hud__lives';
  livesValue.setAttribute('aria-label', `${lives} ${lives === 1 ? 'life' : 'lives'} remaining`);
  livesValue.textContent = '♥'.repeat(lives);

  livesItem.append(livesLabel, livesValue);

  const pauseButton = document.createElement('button');
  pauseButton.className = 'hud__pause';
  pauseButton.type = 'button';
  pauseButton.textContent = 'Pause';
  pauseButton.addEventListener('click', onPause);

  hud.append(scoreItem, timerItem, livesItem, pauseButton);

  return hud;
}
