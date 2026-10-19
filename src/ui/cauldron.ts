import cauldronImageUrl from '../assets/cauldron/cauldron.png';
import type { Ingredient } from '../data/ingredients';

interface CauldronOptions {
  ingredients: readonly Ingredient[];
  isDropEnabled: boolean;
  onIngredientDrop: (ingredientId: string) => void;
}

const STEAM_PUFF_COUNT = 12;
const BUBBLE_COUNT = 8;
const FLAME_COUNT = 9;
const EMBER_COUNT = 10;

function createSteam(): HTMLElement {
  const steam = document.createElement('div');
  steam.className = 'cauldron-steam';
  steam.setAttribute('aria-hidden', 'true');

  for (let index = 1; index <= STEAM_PUFF_COUNT; index += 1) {
    const puff = document.createElement('span');
    puff.className = `cauldron-steam__puff cauldron-steam__puff_${index}`;
    steam.append(puff);
  }

  return steam;
}

function createBubbles(): HTMLElement {
  const bubbles = document.createElement('div');
  bubbles.className = 'cauldron-bubbles';
  bubbles.setAttribute('aria-hidden', 'true');

  for (let index = 1; index <= BUBBLE_COUNT; index += 1) {
    const bubble = document.createElement('span');
    bubble.className = `cauldron-bubble cauldron-bubble_${index}`;
    bubbles.append(bubble);
  }

  return bubbles;
}

function createFire(): HTMLElement {
  const fire = document.createElement('div');
  fire.className = 'cauldron-fire';
  fire.setAttribute('aria-hidden', 'true');

  const floorGlow = document.createElement('div');
  floorGlow.className = 'cauldron-fire__glow';

  const flames = document.createElement('div');
  flames.className = 'cauldron-fire__flames';

  for (let index = 1; index <= FLAME_COUNT; index += 1) {
    const flame = document.createElement('span');
    flame.className = `cauldron-flame cauldron-flame_${index}`;
    flames.append(flame);
  }

  const embers = document.createElement('div');
  embers.className = 'cauldron-embers';

  for (let index = 1; index <= EMBER_COUNT; index += 1) {
    const ember = document.createElement('span');
    ember.className = `cauldron-ember cauldron-ember_${index}`;
    embers.append(ember);
  }

  fire.append(floorGlow, flames, embers);

  return fire;
}

export function createCauldron({
  ingredients,
  isDropEnabled,
  onIngredientDrop,
}: CauldronOptions): HTMLElement {
  const section = document.createElement('section');
  section.className = 'cauldron cauldron-section';

  section.addEventListener('dragover', (event: DragEvent) => {
    if (!isDropEnabled || !event.dataTransfer?.types.includes('text/plain')) {
      return;
    }

    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';

    section.classList.add('cauldron_drop-active');
  });

  section.addEventListener('dragleave', (event: DragEvent) => {
    const nextTarget = event.relatedTarget;

    if (!(nextTarget instanceof Node) || !section.contains(nextTarget)) {
      section.classList.remove('cauldron_drop-active');
    }
  });

  section.addEventListener('drop', (event: DragEvent) => {
    section.classList.remove('cauldron_drop-active');

    if (!isDropEnabled || !event.dataTransfer) {
      return;
    }

    event.preventDefault();

    const ingredientId = event.dataTransfer.getData('text/plain');

    if (ingredientId) {
      onIngredientDrop(ingredientId);
    }
  });

  const visual = document.createElement('div');
  visual.className = 'cauldron-visual';

  if (ingredients.length > 0) {
    visual.classList.add('cauldron-visual_active');
  } else {
    visual.classList.add('cauldron-visual_empty');
  }

  const shadow = document.createElement('div');
  shadow.className = 'cauldron-shadow';
  shadow.setAttribute('aria-hidden', 'true');

  const ambientGlow = document.createElement('div');
  ambientGlow.className = 'cauldron-ambient-glow';
  ambientGlow.setAttribute('aria-hidden', 'true');

  const fire = createFire();

  const image = document.createElement('img');
  image.className = 'cauldron-image';
  image.src = cauldronImageUrl;
  image.alt = 'Black metal alchemist cauldron';
  image.draggable = false;

  const brewGlow = document.createElement('div');
  brewGlow.className = 'cauldron-brew-glow';
  brewGlow.setAttribute('aria-hidden', 'true');

  const bubbles = createBubbles();
  const steam = createSteam();

  visual.append(shadow, ambientGlow, fire, image, brewGlow, bubbles, steam);

  const hint = document.createElement('p');
  hint.className = 'cauldron-hint';

  if (ingredients.length === 0) {
    hint.textContent = 'Drop your ingredients into the brew';
  } else {
    const noun = ingredients.length === 1 ? 'ingredient' : 'ingredients';
    hint.textContent = `${ingredients.length} ${noun} bubbling in the cauldron`;
  }

  section.append(visual, hint);

  return section;
}
