import type { Ingredient } from './ingredients';
import type { CauldronValues } from '../logic/calculate-cauldron';

export interface IReaction {
  id: string;
  name: string;
  type: 'ingredients' | 'stats' | 'mix';

  isActive: (ingredients: readonly Ingredient[], values: CauldronValues) => boolean;

  apply: (values: CauldronValues) => CauldronValues;

  onActivate?: {
    timePenalty?: number;
    lifePenalty?: number;
    clearCauldron?: boolean;
  };
}

function hasPair(ingredients: readonly Ingredient[], first: string, second: string): boolean {
  return (
    ingredients.some((ingredient) => ingredient.id === first) &&
    ingredients.some((ingredient) => ingredient.id === second)
  );
}

export const REACTIONS: readonly IReaction[] = [
  {
    id: 'bubbling',
    name: 'Bubbling',
    type: 'ingredients',
    isActive: (ingredients) => hasPair(ingredients, 'fairy-dust', 'caustic-acid'),
    apply: (values) => ({
      ...values,
      magicPower: values.magicPower * 1.5,
    }),
    onActivate: { timePenalty: 10 },
  },
  {
    id: 'volatile-mix',
    name: 'Volatile Mix',
    type: 'ingredients',
    isActive: (ingredients) => hasPair(ingredients, 'phoenix-feather', 'essence-of-the-void'),
    apply: (values) => ({ ...values }),
    onActivate: {
      lifePenalty: 1,
      clearCauldron: true,
    },
  },
  {
    id: 'solar-frost',
    name: 'Solar Frost',
    type: 'ingredients',
    isActive: (ingredients) => hasPair(ingredients, 'dragon-tears', 'frost-lotus'),
    apply: (values) => ({
      ...values,
      temperature: 0,
      density: values.density * 1.2,
    }),
  },
  {
    id: 'rooted-steam',
    name: 'Rooted Steam',
    type: 'ingredients',
    isActive: (ingredients) => hasPair(ingredients, 'mandrake-root', 'toad-slime'),
    apply: (values) => ({
      ...values,
      density: values.density * 1.25,
      magicPower: values.magicPower * 0.9,
    }),
  },
  {
    id: 'ashen-bloom',
    name: 'Ashen Bloom',
    type: 'ingredients',
    isActive: (ingredients) => hasPair(ingredients, 'phoenix-feather', 'fairy-dust'),
    apply: (values) => ({
      ...values,
      temperature: values.temperature + 10,
      magicPower: values.magicPower * 1.25,
    }),
  },
  {
    id: 'annihilation',
    name: 'Annihilation',
    type: 'stats',
    isActive: (ingredients) =>
      ingredients.some((ingredient) => ingredient.temperature > 15) &&
      ingredients.some((ingredient) => ingredient.temperature < -15),
    apply: (values) => ({
      ...values,
      temperature: 0,
      density: values.density * 2,
    }),
  },
  {
    id: 'pressure-spike',
    name: 'Pressure Spike',
    type: 'stats',
    isActive: (_, values) => values.density >= 70,
    apply: (values) => ({
      ...values,
      density: 70,
      magicPower: values.magicPower * 1.1,
    }),
  },
  {
    id: 'magma-flux',
    name: 'Magma Flux',
    type: 'stats',
    isActive: (_, values) => values.temperature >= 60,
    apply: (values) => ({
      ...values,
      magicPower: values.magicPower * 1.2,
      density: values.density * 0.9,
    }),
  },
  {
    id: 'deep-freeze',
    name: 'Deep Freeze',
    type: 'stats',
    isActive: (_, values) => values.temperature <= -20,
    apply: (values) => ({
      ...values,
      density: values.density * 1.15,
      magicPower: values.magicPower * 0.85,
    }),
  },
  {
    id: 'arcane-saturation',
    name: 'Arcane Saturation',
    type: 'stats',
    isActive: (_, values) => values.magicPower >= 80,
    apply: (values) => ({
      ...values,
      magicPower: 80,
      temperature: values.temperature + 5,
    }),
  },
  {
    id: 'steam-burst',
    name: 'Steam Burst',
    type: 'mix',
    isActive: (ingredients, values) =>
      hasPair(ingredients, 'dragon-tears', 'caustic-acid') && values.temperature >= 35,
    apply: (values) => ({
      ...values,
      temperature: values.temperature + 10,
    }),
    onActivate: { timePenalty: 5 },
  },
  {
    id: 'black-ice',
    name: 'Black Ice',
    type: 'mix',
    isActive: (ingredients, values) =>
      hasPair(ingredients, 'frost-lotus', 'essence-of-the-void') && values.density <= 0,
    apply: (values) => ({
      ...values,
      temperature: values.temperature - 10,
      magicPower: values.magicPower * 1.2,
    }),
  },
  {
    id: 'heavy-spark',
    name: 'Heavy Spark',
    type: 'mix',
    isActive: (ingredients, values) =>
      hasPair(ingredients, 'fairy-dust', 'toad-slime') && values.density >= 40,
    apply: (values) => ({
      ...values,
      density: values.density * 1.2,
      magicPower: values.magicPower * 1.1,
    }),
  },
  {
    id: 'burning-root',
    name: 'Burning Root',
    type: 'mix',
    isActive: (ingredients, values) =>
      hasPair(ingredients, 'mandrake-root', 'phoenix-feather') && values.temperature >= 40,
    apply: (values) => ({
      ...values,
      temperature: values.temperature + 15,
      density: values.density * 0.9,
    }),
  },
  {
    id: 'void-resonance',
    name: 'Void Resonance',
    type: 'mix',
    isActive: (ingredients, values) =>
      hasPair(ingredients, 'essence-of-the-void', 'dragon-tears') && values.magicPower >= 50,
    apply: (values) => ({
      ...values,
      magicPower: values.magicPower * 1.3,
      temperature: values.temperature - 5,
    }),
  },
];
