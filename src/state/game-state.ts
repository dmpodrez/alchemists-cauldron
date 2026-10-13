import type { Ingredient } from '../data/ingredients';
import type { Recipe } from '../data/recipes';
import type { ShelfStock } from '../logic/stock';

export type GameStatus = 'menu' | 'playing' | 'game-over';

export type GameOverReason = 'time' | 'lives' | 'ingredients';

export interface GameState {
  status: GameStatus;
  score: number;
  timeLeft: number;
  endTime: number | null;
  lives: number;
  activeRecipe: Recipe | null;
  cauldronIngredients: Ingredient[];
  shelfStock: ShelfStock;
  gameOverReason: GameOverReason | null;
}

export function createMenuState(): GameState {
  return {
    status: 'menu',
    score: 0,
    timeLeft: 0,
    endTime: null,
    lives: 0,
    activeRecipe: null,
    cauldronIngredients: [],
    shelfStock: {},
    gameOverReason: null,
  };
}
