import { pickNextRecipe, pickRandomRecipe } from './logic/recipe';
import './styles/style.css';
import { createPauseDialog } from './ui/pause-dialog';
import { isSuccessfulBrew } from './logic/brew';
import { calculateCauldron } from './logic/calculate-cauldron';
import { addIngredientToCauldron } from './logic/cauldron';
import { createStock, isShelfEmpty } from './logic/stock';

import { addTimeBonus, calculateTimeLeft, createEndTime, formatTime } from './logic/timer';

import { createMenuState, type GameOverReason, type GameState } from './state/game-state';
import { clearSavedGame, loadSavedGame, saveGame } from './storage/game-save';
import { createCauldron } from './ui/cauldron';
import { INGREDIENTS, type Ingredient } from './data/ingredients';
import { createGameOverScreen } from './ui/game-over';
import { createHud } from './ui/hud';
import { createParameterBars } from './ui/parameter-bars';
import { createRecipePanel } from './ui/recipe-panel';
import { createShelf } from './ui/shelf';
import { createStartScreen } from './ui/start-screen';
import {
  addLeaderboardEntry,
  clearLeaderboard,
  isValidPlayerName,
  loadLeaderboard,
  qualifiesForLeaderboard,
} from './storage/leaderboard';
import { createLeaderboardDialog } from './ui/leaderboard-dialog';
import type { Difficulty } from './data/recipes';
import { DIFFICULTY_SETTINGS } from './data/difficulty';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Application root element was not found.');
}

const appElement = app;

let state: GameState = createMenuState();
let timerFrame: number | null = null;
let lastRenderedSecond: number | null = null;
let scoreSubmittedForCurrentRun = false;

function stopTimerLoop(): void {
  if (timerFrame !== null) {
    cancelAnimationFrame(timerFrame);
    timerFrame = null;
  }
}

function updateTimerUi(timeLeft: number): void {
  const timer = appElement.querySelector<HTMLElement>('.hud__timer');
  const value = timer?.querySelector<HTMLElement>('.hud__value');
  const progress = timer?.querySelector<HTMLElement>('.hud__timer-progress');

  if (!timer || !value || !progress) {
    return;
  }

  value.textContent = formatTime(timeLeft);

  const startTime = DIFFICULTY_SETTINGS[state.difficulty].startTime;
  const percentage = Math.max(0, Math.min(100, (timeLeft / startTime) * 100));

  progress.style.width = `${percentage}%`;
  timer.classList.toggle('hud__timer_danger', timeLeft < 15);
}

function gameOver(reason: GameOverReason): void {
  stopTimerLoop();
  clearSavedGame();

  state = {
    ...state,
    status: 'game-over',
    timeLeft: state.endTime === null ? state.timeLeft : calculateTimeLeft(state.endTime),
    endTime: null,
    gameOverReason: reason,
  };

  render();
}

function checkOutOfIngredients(): boolean {
  if (state.cauldronIngredients.length === 0 && isShelfEmpty(state.shelfStock)) {
    gameOver('ingredients');
    return true;
  }

  return false;
}

function timerTick(): void {
  if (state.status !== 'playing' || state.endTime === null) {
    timerFrame = null;
    return;
  }

  const timeLeft = calculateTimeLeft(state.endTime);

  if (timeLeft <= 0) {
    state = {
      ...state,
      timeLeft: 0,
    };

    updateTimerUi(0);
    gameOver('time');
    return;
  }

  if (timeLeft !== lastRenderedSecond) {
    lastRenderedSecond = timeLeft;

    state = {
      ...state,
      timeLeft,
    };

    // Only update the HUD timer. Re-rendering the whole game every second
    // would restart the cauldron smoke/bubble animations.
    updateTimerUi(timeLeft);
    saveGame(state);
  }

  timerFrame = requestAnimationFrame(timerTick);
}

function startTimerLoop(): void {
  stopTimerLoop();
  lastRenderedSecond = null;
  timerFrame = requestAnimationFrame(timerTick);
}

function pauseGame(): void {
  if (state.status !== 'playing' || state.endTime === null) {
    return;
  }

  const timeLeft = calculateTimeLeft(state.endTime);

  if (timeLeft <= 0) {
    state = {
      ...state,
      timeLeft: 0,
    };

    gameOver('time');
    return;
  }

  stopTimerLoop();

  state = {
    ...state,
    status: 'paused',
    timeLeft,
    endTime: null,
  };

  saveGame(state);
  render();
}

function resumeGame(): void {
  if (state.status !== 'paused') {
    return;
  }

  state = {
    ...state,
    status: 'playing',
    endTime: createEndTime(state.timeLeft),
  };

  saveGame(state);
  render();
  startTimerLoop();
}

function exitToMenu(): void {
  stopTimerLoop();
  clearSavedGame();

  state = createMenuState();
  render();
}

function startGame(): void {
  const difficulty = state.difficulty;
  const settings = DIFFICULTY_SETTINGS[difficulty];
  const shelfIngredients = INGREDIENTS.slice(0, settings.shelfSize);

  scoreSubmittedForCurrentRun = false;

  state = {
    status: 'playing',
    difficulty,
    score: 0,
    timeLeft: settings.startTime,
    endTime: createEndTime(settings.startTime),
    lives: settings.lives,
    activeRecipe: pickRandomRecipe(difficulty),
    cauldronIngredients: [],
    shelfStock: createStock(shelfIngredients),
    gameOverReason: null,
  };

  saveGame(state);
  render();
  startTimerLoop();
}

function continueGame(): void {
  const savedState = loadSavedGame();
  if (!savedState) {
    render();
    return;
  }

  stopTimerLoop();
  scoreSubmittedForCurrentRun = false;
  state = savedState;
  render();
}

function showLeaderboard(difficulty: Difficulty): void {
  appElement.querySelector('.leaderboard-overlay')?.remove();

  const closeLeaderboard = (): void => {
    appElement.querySelector('.leaderboard-overlay')?.remove();
  };

  const dialog = createLeaderboardDialog({
    entries: loadLeaderboard(difficulty),
    difficulty,
    onClose: closeLeaderboard,
    onClear: () => clearLeaderboard(difficulty),
    onDifficultyChange: showLeaderboard,
  });

  appElement.append(dialog);
}

function openLeaderboard(): void {
  showLeaderboard(state.difficulty);
}

function submitLeaderboardScore(name: string): string | null {
  const normalizedName = name.trim();

  if (!isValidPlayerName(normalizedName)) {
    return 'Use 2–15 characters: letters, digits, space, _ or -.';
  }

  const saved = addLeaderboardEntry(normalizedName, state.score, Date.now(), state.difficulty);

  if (!saved) {
    return 'The score could not be saved. Storage may be unavailable.';
  }

  scoreSubmittedForCurrentRun = true;

  return null;
}

function addIngredient(ingredient: Ingredient): void {
  if (state.status !== 'playing') {
    return;
  }

  const result = addIngredientToCauldron(
    ingredient,
    state.cauldronIngredients,
    state.shelfStock,
    DIFFICULTY_SETTINGS[state.difficulty].cauldronCapacity,
  );

  if (!result.added) {
    return;
  }

  state = {
    ...state,
    cauldronIngredients: result.ingredients,
    shelfStock: result.stock,
  };

  saveGame(state);
  renderWithAnimatedParameterBars();
}

function applyTimeBonus(): void {
  if (state.endTime === null) {
    return;
  }

  const settings = DIFFICULTY_SETTINGS[state.difficulty];
  const currentTime = calculateTimeLeft(state.endTime);

  const nextTime = addTimeBonus(currentTime, settings.timeBonus, settings.startTime);

  state = {
    ...state,
    timeLeft: nextTime,
    endTime: createEndTime(nextTime),
  };
}

function brew(): void {
  if (state.status !== 'playing' || !state.activeRecipe || state.cauldronIngredients.length === 0) {
    return;
  }
  const settings = DIFFICULTY_SETTINGS[state.difficulty];
  const currentRecipe = state.activeRecipe;
  const values = calculateCauldron(state.cauldronIngredients);
  const success = isSuccessfulBrew(values, currentRecipe, settings.tolerance);

  if (success) {
    state = {
      ...state,
      score: state.score + settings.scorePerBrew,
      cauldronIngredients: [],
      activeRecipe: pickNextRecipe(state.difficulty, currentRecipe.id),
    };

    applyTimeBonus();

    if (checkOutOfIngredients()) {
      return;
    }
  } else {
    const nextLives = Math.max(0, state.lives - 1);

    if (nextLives === 0) {
      state = {
        ...state,
        lives: 0,
        cauldronIngredients: [],
      };

      gameOver('lives');
      return;
    }

    state = {
      ...state,
      lives: nextLives,
      cauldronIngredients: [],
    };

    if (checkOutOfIngredients()) {
      return;
    }
  }

  saveGame(state);
  renderWithAnimatedParameterBars();
}

function renderGame(): HTMLElement {
  if (!state.activeRecipe) {
    throw new Error('Active game requires a recipe.');
  }

  const game = document.createElement('main');
  game.className = 'game';

  const title = document.createElement('h1');
  title.className = 'game__title';
  title.textContent = "Alchemist's Cauldron";

  if (state.status === 'paused') {
    game.classList.add('game_paused');
  }

  const cauldronCapacity = DIFFICULTY_SETTINGS[state.difficulty].cauldronCapacity;
  const cauldronIsFull = state.cauldronIngredients.length >= cauldronCapacity;

  const cauldronValues = calculateCauldron(state.cauldronIngredients);

  const settings = DIFFICULTY_SETTINGS[state.difficulty];

  const hud = createHud({
    score: state.score,
    timeLeft: state.timeLeft,
    lives: state.lives,
    maxLives: settings.lives,
    startTime: settings.startTime,
    onPause: pauseGame,
  });

  const content = document.createElement('div');
  content.className = 'game__content';

  const shelf = createShelf({
    ingredients: INGREDIENTS.slice(0, DIFFICULTY_SETTINGS[state.difficulty].shelfSize),
    stock: state.shelfStock,
    isBlocked: cauldronIsFull || state.status === 'paused',
    onIngredientClick: addIngredient,
  });

  const centerColumn = document.createElement('div');
  centerColumn.className = 'game__center-column';
  centerColumn.append(
    createCauldron({
      ingredients: state.cauldronIngredients,
    }),
  );

  const rightColumn = document.createElement('div');
  rightColumn.className = 'game__right-column';
  rightColumn.append(
    createRecipePanel({
      recipe: state.activeRecipe,
      ingredientCount: state.cauldronIngredients.length,
      capacity: cauldronCapacity,
      onBrew: brew,
    }),
    createParameterBars(cauldronValues, state.activeRecipe),
  );

  content.append(shelf, centerColumn, rightColumn);
  game.append(title, hud, content);

  return game;
}

function selectDifficulty(difficulty: Difficulty): void {
  if (state.status !== 'menu') {
    return;
  }

  state = {
    ...state,
    difficulty,
  };

  render();
}

function render(): void {
  if (state.status === 'menu') {
    appElement.replaceChildren(
      createStartScreen({
        onStart: startGame,
        onContinue: continueGame,
        hasSavedGame: loadSavedGame() !== null,
        onLeaderboard: openLeaderboard,
        selectedDifficulty: state.difficulty,
        onDifficultyChange: selectDifficulty,
      }),
    );
    return;
  }

  if (state.status === 'game-over') {
    if (!state.gameOverReason) {
      throw new Error('Game Over requires a reason.');
    }

    const askForName =
      !scoreSubmittedForCurrentRun && qualifiesForLeaderboard(state.score, state.difficulty);

    appElement.replaceChildren(
      createGameOverScreen({
        score: state.score,
        reason: state.gameOverReason,
        askForName,
        onSubmitScore: submitLeaderboardScore,
        onPlayAgain: startGame,
        onLeaderboard: openLeaderboard,
      }),
    );

    return;
  }

  if (state.status === 'paused') {
    appElement.replaceChildren(
      renderGame(),
      createPauseDialog({
        onResume: resumeGame,
        onExit: exitToMenu,
      }),
    );

    return;
  }

  appElement.replaceChildren(renderGame());
}

function renderWithAnimatedParameterBars(): void {
  const previousPositions = Array.from(
    appElement.querySelectorAll<HTMLElement>('.parameter-bar__marker'),
    (marker) => marker.style.left,
  );

  render();

  const markers = appElement.querySelectorAll<HTMLElement>('.parameter-bar__marker');

  markers.forEach((marker, index) => {
    const previousPosition = previousPositions[index];

    if (previousPosition === undefined) {
      return;
    }

    const nextPosition = marker.style.left;

    if (previousPosition === nextPosition) {
      return;
    }

    marker.style.transition = 'none';
    marker.style.left = previousPosition;

    marker.getBoundingClientRect();

    marker.style.removeProperty('transition');
    marker.style.left = nextPosition;
  });
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.status === 'playing') {
    pauseGame();
  }
});

render();
