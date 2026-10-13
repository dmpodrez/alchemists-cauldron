import type { Ingredient } from '../data/ingredients';
import type { Recipe } from '../data/recipes';
import type { ShelfStock } from '../logic/stock';

export type GameStatus = 'menu' | 'playing';

export interface GameState {
  status: GameStatus;
  score: number;
  timeLeft: number;
  lives: number;
  activeRecipe: Recipe | null;
  cauldronIngredients: Ingredient[];
  shelfStock: ShelfStock;
}

export function createMenuState(): GameState {
  return {
    status: 'menu',
    score: 0,
    timeLeft: 0,
    lives: 0,
    activeRecipe: null,
    cauldronIngredients: [],
    shelfStock: {},
  };
}
