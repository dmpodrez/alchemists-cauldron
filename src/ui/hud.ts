import { formatTime, LEVEL_ONE_START_TIME } from '../logic/timer';

interface HudOptions {
  score: number;
  timeLeft: number;
  lives: number;
  onPause: () => void;
}

const MAX_LIVES = 3;

function createHudLabel(text: string): HTMLSpanElement {
  const label = document.createElement('span');
  label.className = 'hud__label';
  label.textContent = text;
  return label;
}

function createLifeIcon(isActive: boolean): HTMLSpanElement {
  const heart = document.createElement('span');
  heart.className = 'hud__heart';

  if (isActive) {
    heart.classList.add('hud__heart_active');
    heart.textContent = '♥';
  } else {
    heart.classList.add('hud__heart_empty');
    heart.textContent = '♡';
  }

  heart.setAttribute('aria-hidden', 'true');

  return heart;
}

export function createHud({ score, timeLeft, lives, onPause }: HudOptions): HTMLElement {
  const hud = document.createElement('section');
  hud.className = 'hud';
  hud.setAttribute('aria-label', 'Game status');

  const scoreItem = document.createElement('div');
  scoreItem.className = 'hud__item hud__score';

  const scoreDecor = document.createElement('span');
  scoreDecor.className = 'hud__decor';
  scoreDecor.setAttribute('aria-hidden', 'true');

  const scoreValue = document.createElement('strong');
  scoreValue.className = 'hud__value';
  scoreValue.textContent = String(score);

  scoreItem.append(createHudLabel('Score'), scoreValue, scoreDecor);

  const timerItem = document.createElement('div');
  timerItem.className = 'hud__item hud__timer';

  if (timeLeft < 15) {
    timerItem.classList.add('hud__timer_danger');
  }

  const timerHeader = document.createElement('div');
  timerHeader.className = 'hud__timer-header';

  const timerValue = document.createElement('strong');
  timerValue.className = 'hud__value';
  timerValue.textContent = formatTime(timeLeft);

  timerHeader.append(createHudLabel('Time'), timerValue);

  const timerTrack = document.createElement('div');
  timerTrack.className = 'hud__timer-track';
  timerTrack.setAttribute('aria-hidden', 'true');

  const timerProgress = document.createElement('div');
  timerProgress.className = 'hud__timer-progress';

  const progress = Math.max(0, Math.min(100, (timeLeft / LEVEL_ONE_START_TIME) * 100));
  timerProgress.style.width = `${progress}%`;

  timerTrack.append(timerProgress);
  timerItem.append(timerHeader, timerTrack);

  const livesItem = document.createElement('div');
  livesItem.className = 'hud__item hud__lives-item';

  const livesValue = document.createElement('div');
  livesValue.className = 'hud__lives';
  livesValue.setAttribute('aria-label', `${lives} ${lives === 1 ? 'life' : 'lives'} remaining`);

  for (let index = 0; index < MAX_LIVES; index += 1) {
    livesValue.append(createLifeIcon(index < lives));
  }

  livesItem.append(createHudLabel('Lives'), livesValue);

  const pauseButton = document.createElement('button');
  pauseButton.className = 'hud__pause';
  pauseButton.type = 'button';
  pauseButton.setAttribute('aria-label', 'Pause game');

  const pauseIcon = document.createElement('span');
  pauseIcon.className = 'hud__pause-icon';
  pauseIcon.textContent = 'Ⅱ';
  pauseIcon.setAttribute('aria-hidden', 'true');

  const pauseText = document.createElement('span');
  pauseText.textContent = 'Pause';

  pauseButton.append(pauseIcon, pauseText);
  pauseButton.addEventListener('click', onPause);

  hud.append(scoreItem, timerItem, livesItem, pauseButton);

  return hud;
}
