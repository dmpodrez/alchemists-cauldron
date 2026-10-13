import { RECIPES, type Difficulty, type Recipe } from '../data/recipes';

export function getRecipesByDifficulty(difficulty: Difficulty): readonly Recipe[] {
  return RECIPES.filter((recipe) => recipe.difficulty === difficulty);
}

export function pickRandomRecipe(difficulty: Difficulty): Recipe {
  const availableRecipes = getRecipesByDifficulty(difficulty);

  if (availableRecipes.length === 0) {
    throw new Error(`No recipes available for difficulty: ${difficulty}`);
  }

  const index = Math.floor(Math.random() * availableRecipes.length);
  const recipe = availableRecipes[index];

  if (!recipe) {
    throw new Error('Failed to select a recipe.');
  }

  return recipe;
}
