import type { Recipe, RecipeTargets, ParameterRange } from '../data/recipes';
import type { CauldronValues } from './calculate-cauldron';

export const LEVEL_ONE_TOLERANCE = 8;

function expandRange(range: ParameterRange, tolerance: number): ParameterRange {
  return {
    min: range.min - tolerance,
    max: range.max + tolerance,
  };
}

function isInside(value: number, range: ParameterRange): boolean {
  return value >= range.min && value <= range.max;
}

export function getCheckedRanges(recipe: Recipe, tolerance = LEVEL_ONE_TOLERANCE): RecipeTargets {
  return {
    temperature: expandRange(recipe.temperature, tolerance),
    density: expandRange(recipe.density, tolerance),
    magicPower: expandRange(recipe.magicPower, tolerance),
  };
}

export function isSuccessfulBrew(
  values: CauldronValues,
  recipe: Recipe,
  tolerance = LEVEL_ONE_TOLERANCE,
): boolean {
  const checkedRanges = getCheckedRanges(recipe, tolerance);

  return (
    isInside(values.temperature, checkedRanges.temperature) &&
    isInside(values.density, checkedRanges.density) &&
    isInside(values.magicPower, checkedRanges.magicPower)
  );
}
