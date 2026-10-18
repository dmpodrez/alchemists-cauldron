import { LEVEL_ONE_INGREDIENTS, type Ingredient } from '../data/ingredients';
import { RECIPES } from '../data/recipes';
import { LEVEL_ONE_CAULDRON_CAPACITY } from '../logic/cauldron';
import { calculateTimeLeft, LEVEL_ONE_START_TIME } from '../logic/timer';
import type { GameState } from '../state/game-state';

const SAVE_KEY = 'alchemists-cauldron:game-save';
const SAVE_VERSION = 1;
const INGREDIENTS_BY_ID = new Map(
  LEVEL_ONE_INGREDIENTS.map((ingredient) => [ingredient.id, ingredient]),
);

interface SavedGame {
  version: number;
  score: number;
  timeLeft: number;
  lives: number;
  recipeId: string;
  ingredientIds: string[];
  shelfStock: Record<string, number>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isValidSave(value: unknown): value is SavedGame {
  if (!isRecord(value)) {
    return false;
  }

  const { version, score, timeLeft, lives, recipeId, ingredientIds, shelfStock } = value;

  if (
    version !== SAVE_VERSION ||
    typeof score !== 'number' ||
    !Number.isSafeInteger(score) ||
    score < 0 ||
    typeof timeLeft !== 'number' ||
    !Number.isInteger(timeLeft) ||
    timeLeft < 1 ||
    timeLeft > LEVEL_ONE_START_TIME ||
    typeof lives !== 'number' ||
    !Number.isInteger(lives) ||
    lives < 1 ||
    lives > 3 ||
    typeof recipeId !== 'string' ||
    !RECIPES.some((recipe) => recipe.id === recipeId && recipe.difficulty === 'medium') ||
    !Array.isArray(ingredientIds) ||
    ingredientIds.length > LEVEL_ONE_CAULDRON_CAPACITY ||
    !ingredientIds.every((id: unknown) => typeof id === 'string' && INGREDIENTS_BY_ID.has(id)) ||
    !isRecord(shelfStock)
  ) {
    return false;
  }

  const stockKeys = Object.keys(shelfStock);
  if (
    stockKeys.length !== LEVEL_ONE_INGREDIENTS.length ||
    !LEVEL_ONE_INGREDIENTS.every(({ id }) => {
      const amount = shelfStock[id];
      return (
        Object.prototype.hasOwnProperty.call(shelfStock, id) &&
        typeof amount === 'number' &&
        Number.isInteger(amount) &&
        amount >= 0 &&
        amount <= 15
      );
    })
  ) {
    return false;
  }

  return (
    ingredientIds.length > 0 || LEVEL_ONE_INGREDIENTS.some(({ id }) => Number(shelfStock[id]) > 0)
  );
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Disabled storage must not crash the game.
  }
}

export function saveGame(state: GameState): void {
  if ((state.status !== 'playing' && state.status !== 'paused') || !state.activeRecipe) {
    return;
  }

  const timeLeft =
    state.status === 'playing' && state.endTime !== null
      ? calculateTimeLeft(state.endTime)
      : state.timeLeft;

  if (timeLeft <= 0) {
    clearSavedGame();
    return;
  }

  const snapshot: SavedGame = {
    version: SAVE_VERSION,
    score: state.score,
    timeLeft,
    lives: state.lives,
    recipeId: state.activeRecipe.id,
    ingredientIds: state.cauldronIngredients.map((ingredient) => ingredient.id),
    shelfStock: Object.fromEntries(
      LEVEL_ONE_INGREDIENTS.map(({ id }) => [id, state.shelfStock[id] ?? 0]),
    ),
  };

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
  } catch {
    // Disabled or full storage must not crash gameplay.
  }
}

export function loadSavedGame(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (raw === null) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);
    if (!isValidSave(parsed)) {
      clearSavedGame();
      return null;
    }

    const recipe = RECIPES.find((item) => item.id === parsed.recipeId);
    if (!recipe) {
      clearSavedGame();
      return null;
    }

    const ingredients = parsed.ingredientIds
      .map((id) => INGREDIENTS_BY_ID.get(id))
      .filter((ingredient): ingredient is Ingredient => ingredient !== undefined);

    return {
      status: 'paused',
      score: parsed.score,
      timeLeft: parsed.timeLeft,
      endTime: null,
      lives: parsed.lives,
      activeRecipe: recipe,
      cauldronIngredients: ingredients,

      shelfStock: Object.fromEntries(
        LEVEL_ONE_INGREDIENTS.map(({ id }) => [id, parsed.shelfStock[id] ?? 0]),
      ),
      gameOverReason: null,
    };
  } catch {
    clearSavedGame();
    return null;
  }
}
