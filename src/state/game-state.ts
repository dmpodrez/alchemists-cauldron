import type { Ingredient } from '../data/ingredients';
import type { ShelfStock } from '../logic/stock';

export interface GameState {
  cauldronIngredients: Ingredient[];
  shelfStock: ShelfStock;
}

export function createInitialGameState(stock: ShelfStock): GameState {
  return {
    cauldronIngredients: [],
    shelfStock: stock,
  };
}
