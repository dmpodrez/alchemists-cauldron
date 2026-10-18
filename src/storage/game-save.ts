import { DIFFICULTY_SETTINGS } from '../data/difficulty';
import { INGREDIENTS, type Ingredient } from '../data/ingredients';
import { RECIPES, type Difficulty } from '../data/recipes';
import { calculateTimeLeft } from '../logic/timer';
import type { GameState } from '../state/game-state';

const SAVE_KEY = 'alchemists-cauldron:game-save';
const SAVE_VERSION = 2;

interface SavedGame {
  version: number;
  difficulty: Difficulty;
  status: 'playing' | 'paused';
  score: number;
  timeLeft: number;
  lives: number;
  activeRecipe: { id: string };
  cauldronIngredients: { id: string }[];
  shelfStock: Record<string, number>;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isDifficulty(value: unknown): value is Difficulty {
  return value === 'easy' || value === 'medium' || value === 'hard';
}

function getShelfIngredients(difficulty: Difficulty): readonly Ingredient[] {
  return INGREDIENTS.slice(0, DIFFICULTY_SETTINGS[difficulty].shelfSize);
}

function isValidSave(value: unknown): value is SavedGame {
  if (!isRecord(value) || !isDifficulty(value.difficulty)) {
    return false;
  }

  const settings = DIFFICULTY_SETTINGS[value.difficulty];
  const shelfIngredients = getShelfIngredients(value.difficulty);
  const allowedIds = new Set(shelfIngredients.map(({ id }) => id));

  if (
    value.version !== SAVE_VERSION ||
    (value.status !== 'playing' && value.status !== 'paused') ||
    !Number.isSafeInteger(value.score) ||
    (value.score as number) < 0 ||
    !Number.isInteger(value.timeLeft) ||
    (value.timeLeft as number) < 1 ||
    (value.timeLeft as number) > settings.startTime ||
    !Number.isInteger(value.lives) ||
    (value.lives as number) < 1 ||
    (value.lives as number) > settings.lives ||
    !isRecord(value.activeRecipe) ||
    typeof value.activeRecipe.id !== 'string' ||
    !Array.isArray(value.cauldronIngredients) ||
    !isRecord(value.shelfStock)
  ) {
    return false;
  }

  const recipeExists = RECIPES.some(
    (recipe) =>
      recipe.id === (value.activeRecipe as { id: string }).id &&
      recipe.difficulty === value.difficulty,
  );

  if (!recipeExists) {
    return false;
  }

  if (
    value.cauldronIngredients.length > settings.cauldronCapacity ||
    !value.cauldronIngredients.every(
      (ingredient: unknown) =>
        isRecord(ingredient) && typeof ingredient.id === 'string' && allowedIds.has(ingredient.id),
    )
  ) {
    return false;
  }

  const stock = value.shelfStock;
  const stockKeys = Object.keys(stock);

  if (
    stockKeys.length !== shelfIngredients.length ||
    !shelfIngredients.every(({ id }) => {
      const amount = stock[id];

      return (
        Object.prototype.hasOwnProperty.call(stock, id) &&
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
    value.cauldronIngredients.length > 0 || shelfIngredients.some(({ id }) => Number(stock[id]) > 0)
  );
}

export function clearSavedGame(): void {
  try {
    localStorage.removeItem(SAVE_KEY);
  } catch {
    // Unavailable storage must not crash the game.
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

  const shelfIngredients = getShelfIngredients(state.difficulty);

  const snapshot: SavedGame = {
    version: SAVE_VERSION,
    difficulty: state.difficulty,
    status: state.status,
    score: state.score,
    timeLeft,
    lives: state.lives,
    activeRecipe: state.activeRecipe,
    cauldronIngredients: state.cauldronIngredients,
    shelfStock: Object.fromEntries(
      shelfIngredients.map(({ id }) => [id, state.shelfStock[id] ?? 0]),
    ),
  };

  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(snapshot));
  } catch {
    // Full or disabled storage must not crash gameplay.
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

    const recipe = RECIPES.find(
      (item) => item.id === parsed.activeRecipe.id && item.difficulty === parsed.difficulty,
    );

    if (!recipe) {
      clearSavedGame();
      return null;
    }

    const shelfIngredients = getShelfIngredients(parsed.difficulty);

    const ingredients = parsed.cauldronIngredients
      .map(({ id }) => shelfIngredients.find((item) => item.id === id))
      .filter((ingredient): ingredient is Ingredient => ingredient !== undefined);

    if (ingredients.length !== parsed.cauldronIngredients.length) {
      clearSavedGame();
      return null;
    }

    return {
      status: 'paused',
      difficulty: parsed.difficulty,
      score: parsed.score,
      timeLeft: parsed.timeLeft,
      endTime: null,
      lives: parsed.lives,
      activeRecipe: recipe,
      cauldronIngredients: ingredients,
      shelfStock: Object.fromEntries(
        shelfIngredients.map(({ id }) => [id, parsed.shelfStock[id] ?? 0]),
      ),
      gameOverReason: null,
    };
  } catch {
    clearSavedGame();
    return null;
  }
}
