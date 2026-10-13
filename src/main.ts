import './styles/style.css';

import { LEVEL_ONE_INGREDIENTS, type Ingredient } from './data/ingredients';
import { addIngredientToCauldron, LEVEL_ONE_CAULDRON_CAPACITY } from './logic/cauldron';
import { createStock } from './logic/stock';
import { createInitialGameState, type GameState } from './state/game-state';
import { createCauldron } from './ui/cauldron';
import { createShelf } from './ui/shelf';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Application root element was not found.');
}
const appElement = app;
let state: GameState = createInitialGameState(createStock(LEVEL_ONE_INGREDIENTS));

function addIngredient(ingredient: Ingredient): void {
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

function render(): void {
  const game = document.createElement('main');
  game.className = 'game';

  const title = document.createElement('h1');
  title.className = 'game__title';
  title.textContent = "Alchemist's Cauldron";

  const content = document.createElement('div');
  content.className = 'game__content';

  const cauldronIsFull = state.cauldronIngredients.length >= LEVEL_ONE_CAULDRON_CAPACITY;

  content.append(
    createShelf({
      ingredients: LEVEL_ONE_INGREDIENTS,
      stock: state.shelfStock,
      isBlocked: cauldronIsFull,
      onIngredientClick: addIngredient,
    }),
    createCauldron({
      ingredients: state.cauldronIngredients,
      capacity: LEVEL_ONE_CAULDRON_CAPACITY,
    }),
  );

  game.append(title, content);
  appElement.replaceChildren(game);
}

render();
