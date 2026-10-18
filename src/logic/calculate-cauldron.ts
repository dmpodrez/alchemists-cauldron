import type { Ingredient } from '../data/ingredients';

export interface CauldronValues {
  temperature: number;
  density: number;
  magicPower: number;
}

export function calculateCauldron(ingredients: readonly Ingredient[]): CauldronValues {
  return ingredients.reduce<CauldronValues>(
    (values, ingredient) => ({
      temperature: values.temperature + ingredient.temperature,
      density: values.density + ingredient.density,
      magicPower: values.magicPower + ingredient.magicPower,
    }),
    {
      temperature: 0,
      density: 0,
      magicPower: 0,
    },
  );
}
