import './styles/style.css';

import { LEVEL_ONE_INGREDIENTS, type Ingredient } from './data/ingredients';
import { isSuccessfulBrew } from './logic/brew';
import { calculateCauldron } from './logic/calculate-cauldron';
import { addIngredientToCauldron, LEVEL_ONE_CAULDRON_CAPACITY } from './logic/cauldron';
import { pickRandomRecipe } from './logic/recipe';
import { createStock } from './logic/stock';
import { createMenuState, type GameState } from './state/game-state';
import { createCauldron } from './ui/cauldron';
import { createParameterBars } from './ui/parameter-bars';
import { createRecipePanel } from './ui/recipe-panel';
import { createShelf } from './ui/shelf';
import { createStartScreen } from './ui/start-screen';

const LEVEL_ONE_SCORE_PER_BREW = 200;
const LEVEL_ONE_START_TIME = 150;
const LEVEL_ONE_START_LIVES = 3;
const LEVEL_ONE_TIME_BONUS = 10;
const LEVEL_ONE_BONUS_CAP = 120;

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Application root element was not found.');
}

const appElement = app;
let state: GameState = createMenuState();

function startGame(): void {
  state = {
    status: 'playing',
    score: 0,
    timeLeft: LEVEL_ONE_START_TIME,
    lives: LEVEL_ONE_START_LIVES,
    activeRecipe: pickRandomRecipe('medium'),
    cauldronIngredients: [],
    shelfStock: createStock(LEVEL_ONE_INGREDIENTS),
  };

  render();
}

function addIngredient(ingredient: Ingredient): void {
  if (state.status !== 'playing') {
    return;
  }

  const result = addIngredientToCauldron(ingredient, state.cauldronIngredients, state.shelfStock);

  if (!result.added) {
    return;
  }

  state = {
    ...state,
    cauldronIngredients: result.ingredients,
    shelfStock: result.stock,
  };

  render();
}

function addTimeBonus(timeLeft: number): number {
  if (timeLeft >= LEVEL_ONE_BONUS_CAP) {
    return timeLeft;
  }

  return Math.min(timeLeft + LEVEL_ONE_TIME_BONUS, LEVEL_ONE_BONUS_CAP);
}

function brew(): void {
  if (state.status !== 'playing' || !state.activeRecipe || state.cauldronIngredients.length === 0) {
    return;
  }

  const values = calculateCauldron(state.cauldronIngredients);
  const success = isSuccessfulBrew(values, state.activeRecipe);

  if (success) {
    state = {
      ...state,
      score: state.score + LEVEL_ONE_SCORE_PER_BREW,
      timeLeft: addTimeBonus(state.timeLeft),
      cauldronIngredients: [],
      activeRecipe: pickRandomRecipe('medium'),
    };
  } else {
    state = {
      ...state,
      lives: Math.max(0, state.lives - 1),
      cauldronIngredients: [],
    };
  }

  render();
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

  const content = document.createElement('div');
  content.className = 'game__content';

  const cauldronIsFull = state.cauldronIngredients.length >= LEVEL_ONE_CAULDRON_CAPACITY;

  const cauldronValues = calculateCauldron(state.cauldronIngredients);

  const shelf = createShelf({
    ingredients: LEVEL_ONE_INGREDIENTS,
    stock: state.shelfStock,
    isBlocked: cauldronIsFull,
    onIngredientClick: addIngredient,
  });

  const rightColumn = document.createElement('div');
  rightColumn.className = 'game__right-column';

  rightColumn.append(
    createRecipePanel({
      recipe: state.activeRecipe,
      ingredientCount: state.cauldronIngredients.length,
      capacity: LEVEL_ONE_CAULDRON_CAPACITY,
      score: state.score,
      onBrew: brew,
    }),
    createCauldron({
      ingredients: state.cauldronIngredients,
    }),
    createParameterBars(cauldronValues, state.activeRecipe),
  );

  content.append(shelf, rightColumn);

  game.append(title, content);

  return game;
}

function render(): void {
  if (state.status === 'menu') {
    appElement.replaceChildren(
      createStartScreen({
        onStart: startGame,
      }),
    );
    return;
  }

  appElement.replaceChildren(renderGame());
}

render();
