import { pickNextRecipe, pickRandomRecipe } from './logic/recipe';
import './styles/style.css';
import { createPauseDialog } from './ui/pause-dialog';
import { isSuccessfulBrew } from './logic/brew';
import { calculateCauldronWithReactions, getNewlyActivatedReactions } from './logic/reactions';
import { REACTIONS } from './data/reactions';
import { addIngredientToCauldron } from './logic/cauldron';
import { createStock, isShelfEmpty } from './logic/stock';
import { selectReactions } from './logic/select-reactions';
import { pourOutCauldron } from './logic/pour-out';
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

function calculateCurrentCauldronValues() {
  const selectedReactions = REACTIONS.filter((reaction) => state.reactionIds.includes(reaction.id));

  return calculateCauldronWithReactions(state.cauldronIngredients, selectedReactions).values;
}

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

function gameOver(reason: GameOverReason, successfulBrew = false): void {
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

  if (successfulBrew) {
    appElement.querySelector('.game-over')?.classList.add('game-over_brew-success');
  }
}

function checkOutOfIngredients(successfulBrew = false): boolean {
  if (state.cauldronIngredients.length === 0 && isShelfEmpty(state.shelfStock)) {
    gameOver('ingredients', successfulBrew);
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
    reactionIds: selectReactions(difficulty).map((reaction) => reaction.id),
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
  if (state.status !== 'playing' || state.endTime === null) {
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

  // Reactions selected for the current game.
  const selectedReactions = REACTIONS.filter((reaction) => state.reactionIds.includes(reaction.id));

  // Only reactions that have just become active can fire.
  const firedReactions = getNewlyActivatedReactions(
    state.cauldronIngredients,
    result.ingredients,
    selectedReactions,
  );

  // Calculate one-time penalties.
  const timePenalty = firedReactions.reduce(
    (total, reaction) => total + (reaction.onActivate?.timePenalty ?? 0),
    0,
  );

  const lifePenalty = firedReactions.reduce(
    (total, reaction) => total + (reaction.onActivate?.lifePenalty ?? 0),
    0,
  );

  const clearCauldron = firedReactions.some(
    (reaction) => reaction.onActivate?.clearCauldron === true,
  );

  // Preserve the existing timer deadline, minus penalties.
  const nextEndTime = state.endTime - timePenalty * 1000;
  const nextTimeLeft = calculateTimeLeft(nextEndTime);
  const nextLives = Math.max(0, state.lives - lifePenalty);

  state = {
    ...state,
    cauldronIngredients: clearCauldron ? [] : result.ingredients,
    shelfStock: result.stock,
    lives: nextLives,
    timeLeft: nextTimeLeft,
    endTime: nextEndTime,
  };

  if (nextLives === 0) {
    gameOver('lives');
    return;
  }

  if (nextTimeLeft === 0) {
    gameOver('time');
    return;
  }

  if (checkOutOfIngredients()) {
    return;
  }

  saveGame(state);
  renderWithAnimatedParameterBars();
}

function handleIngredientDrop(ingredientId: string): void {
  if (state.status !== 'playing') {
    return;
  }

  const shelfIngredients = INGREDIENTS.slice(0, DIFFICULTY_SETTINGS[state.difficulty].shelfSize);

  const ingredient = shelfIngredients.find((item) => item.id === ingredientId);

  if (!ingredient) {
    return;
  }

  addIngredient(ingredient);
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

function handlePourOut(): void {
  const nextState = pourOutCauldron(state);

  if (nextState === null) {
    return;
  }

  state = nextState;

  if (state.timeLeft <= 0) {
    gameOver('time');
    return;
  }

  if (checkOutOfIngredients()) {
    return;
  }

  saveGame(state);
  renderWithAnimatedParameterBars();
}

function brew(): void {
  if (state.status !== 'playing' || !state.activeRecipe || state.cauldronIngredients.length === 0) {
    return;
  }
  const settings = DIFFICULTY_SETTINGS[state.difficulty];
  const currentRecipe = state.activeRecipe;
  const values = calculateCurrentCauldronValues();
  const success = isSuccessfulBrew(values, currentRecipe, settings.tolerance);

  if (success) {
    state = {
      ...state,
      score: state.score + settings.scorePerBrew,
      cauldronIngredients: [],
      activeRecipe: pickNextRecipe(state.difficulty, currentRecipe.id),
    };

    applyTimeBonus();

    if (checkOutOfIngredients(true)) {
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

  if (success) {
    const visual = appElement.querySelector<HTMLElement>('.cauldron-visual');

    if (visual) {
      visual.classList.add('cauldron-visual_brew-success');

      visual.addEventListener('animationend', (event) => {
        if (event.target === visual && event.animationName === 'cauldron-success-flash') {
          visual.classList.remove('cauldron-visual_brew-success');
        }
      });
    }
  }

  if (!success) {
    const game = appElement.querySelector<HTMLElement>('.game');

    const visual = appElement.querySelector<HTMLElement>('.cauldron-visual');

    if (game) {
      game.classList.add('game_brew-failure');

      game.addEventListener('animationend', (event) => {
        if (event.target === game && event.animationName === 'game-failure-shake') {
          game.classList.remove('game_brew-failure');
        }
      });
    }

    if (visual) {
      visual.classList.add('cauldron-visual_brew-failure');

      visual.addEventListener('animationend', (event) => {
        if (event.target === visual && event.animationName === 'cauldron-failure-flash') {
          visual.classList.remove('cauldron-visual_brew-failure');
        }
      });
    }
  }
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

  const cauldronValues = calculateCurrentCauldronValues();

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
      isDropEnabled: state.status === 'playing' && !cauldronIsFull,
      onIngredientDrop: handleIngredientDrop,
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
      onPourOut: handlePourOut,
      isPaused: state.status === 'paused',
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

function handleGameKeydown(event: KeyboardEvent): void {
  if (
    state.status !== 'playing' ||
    event.repeat ||
    event.ctrlKey ||
    event.altKey ||
    event.metaKey
  ) {
    return;
  }

  const target = event.target;

  if (
    target instanceof HTMLElement &&
    (target.isContentEditable || target.closest('input, textarea, select, [role="textbox"]'))
  ) {
    return;
  }

  // Do not activate game shortcuts while a dialog is open.
  if (appElement.querySelector('.leaderboard-overlay')) {
    return;
  }

  const key = event.key.toLowerCase();

  // Pause the active game.
  if (key === 'escape') {
    event.preventDefault();
    pauseGame();
    return;
  }

  // Select ingredients using keys 1–8.
  if (/^[1-8]$/.test(key)) {
    const index = Number(key) - 1;

    const shelfSize = DIFFICULTY_SETTINGS[state.difficulty].shelfSize;

    const capacity = DIFFICULTY_SETTINGS[state.difficulty].cauldronCapacity;

    const ingredient = INGREDIENTS[index];

    if (
      index >= shelfSize ||
      !ingredient ||
      (state.shelfStock[ingredient.id] ?? 0) <= 0 ||
      state.cauldronIngredients.length >= capacity
    ) {
      return;
    }

    event.preventDefault();
    addIngredient(ingredient);
    return;
  }

  // Brew the current mixture.
  if (key === 'b') {
    if (state.cauldronIngredients.length === 0) {
      return;
    }

    event.preventDefault();
    brew();
    return;
  }

  // Pour Out the current mixture.
  if (key === 'x') {
    if (state.cauldronIngredients.length === 0) {
      return;
    }

    event.preventDefault();
    handlePourOut();
  }
}

document.addEventListener('keydown', handleGameKeydown);

document.addEventListener('visibilitychange', () => {
  if (document.hidden && state.status === 'playing') {
    pauseGame();
  }
});

render();
