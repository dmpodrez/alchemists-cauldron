import dragonTearsImage from '../assets/ingredients/dragon-tears.png';
import fairyDustImage from '../assets/ingredients/fairy-dust.png';
import frostLotusImage from '../assets/ingredients/frost-lotus.png';
import mandrakeRootImage from '../assets/ingredients/mandrake-root.png';
import causticAcidImage from '../assets/ingredients/caustic-acid.png';
import essenceVoidImage from '../assets/ingredients/essence-of-the-void.png';

export interface Ingredient {
  id: string;
  name: string;
  image?: string;
  temperature: number;
  density: number;
  magicPower: number;
}

export const INGREDIENTS: readonly Ingredient[] = [
  {
    id: 'dragon-tears',
    name: 'Dragon Tears',
    image: dragonTearsImage,
    temperature: 25,
    density: 8,
    magicPower: 10,
  },
  {
    id: 'fairy-dust',
    name: 'Fairy Dust',
    image: fairyDustImage,
    temperature: 12,
    density: 9,
    magicPower: 12,
  },
  {
    id: 'frost-lotus',
    name: 'Frost Lotus',
    image: frostLotusImage,
    temperature: -18,
    density: 4,
    magicPower: 14,
  },
  {
    id: 'mandrake-root',
    name: 'Mandrake Root',
    image: mandrakeRootImage,
    temperature: -5,
    density: 20,
    magicPower: 8,
  },
  {
    id: 'caustic-acid',
    name: 'Caustic Acid',
    image: causticAcidImage,
    temperature: 10,
    density: 14,
    magicPower: 22,
  },
  {
    id: 'essence-of-the-void',
    name: 'Essence of the Void',
    image: essenceVoidImage,
    temperature: -20,
    density: -10,
    magicPower: 40,
  },
  { id: 'phoenix-feather', name: 'Phoenix Feather', temperature: 50, density: -10, magicPower: 30 },
  { id: 'toad-slime', name: 'Toad Slime', temperature: 5, density: 30, magicPower: 0 },
];

export const LEVEL_ONE_INGREDIENTS = INGREDIENTS.slice(0, 6);
