import type { Ingredient } from '../data/ingredients';
import type { ShelfStock } from './stock';

export const LEVEL_ONE_CAULDRON_CAPACITY = 4;

export interface AddIngredientResult {
  ingredients: Ingredient[];
  stock: ShelfStock;
  added: boolean;
}

export function addIngredientToCauldron(
  ingredient: Ingredient,
  currentIngredients: readonly Ingredient[],
  currentStock: ShelfStock,
  capacity = LEVEL_ONE_CAULDRON_CAPACITY,
): AddIngredientResult {
  const availableStock = currentStock[ingredient.id] ?? 0;

  if (currentIngredients.length >= capacity || availableStock <= 0) {
    return {
      ingredients: [...currentIngredients],
      stock: { ...currentStock },
      added: false,
    };
  }

  return {
    ingredients: [...currentIngredients, ingredient],
    stock: {
      ...currentStock,
      [ingredient.id]: availableStock - 1,
    },
    added: true,
  };
}
