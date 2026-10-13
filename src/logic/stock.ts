import type { Ingredient } from '../data/ingredients';

export type ShelfStock = Record<string, number>;

const MIN_STOCK = 2;
const MAX_STOCK = 15;

export function createStock(ingredients: readonly Ingredient[]): ShelfStock {
  return Object.fromEntries(ingredients.map((ingredient) => [ingredient.id, randomStock()]));
}

function randomStock(): number {
  return Math.floor(Math.random() * (MAX_STOCK - MIN_STOCK + 1)) + MIN_STOCK;
}
