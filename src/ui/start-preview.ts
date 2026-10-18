import { DIFFICULTY_SETTINGS } from '../data/difficulty';
import type { Difficulty } from '../data/recipes';
import cauldronImage from '../assets/cauldron/cauldron.png';

function createStat(label: string, value: string): HTMLElement {
  const stat = document.createElement('div');
  stat.className = 'start-preview__stat';

  const name = document.createElement('span');
  name.textContent = label;

  const amount = document.createElement('strong');
  amount.textContent = value;

  stat.append(name, amount);

  return stat;
}

export function createStartPreview(difficulty: Difficulty): HTMLElement {
  const settings = DIFFICULTY_SETTINGS[difficulty];

  const preview = document.createElement('section');
  preview.className = 'start-preview';
  preview.setAttribute('aria-label', 'Laboratory before starting');

  const hud = document.createElement('div');
  hud.className = 'start-preview__hud';

  hud.append(createStat('Score', '0'), createStat('Time', '00:00'));

  const workbench = document.createElement('div');
  workbench.className = 'start-preview__workbench';

  const shelf = document.createElement('div');
  shelf.className = 'start-preview__shelf';

  const shelfTitle = document.createElement('span');
  shelfTitle.className = 'start-preview__title';
  shelfTitle.textContent = 'Empty Shelf';

  const slots = document.createElement('div');
  slots.className = 'start-preview__slots';

  for (let index = 0; index < settings.shelfSize; index += 1) {
    const slot = document.createElement('span');
    slot.className = 'start-preview__slot';
    slot.setAttribute('aria-hidden', 'true');
    slots.append(slot);
  }

  shelf.append(shelfTitle, slots);

  const cauldron = document.createElement('div');
  cauldron.className = 'start-preview__cauldron';

  const image = document.createElement('img');
  image.src = cauldronImage;
  image.alt = 'Cauldron before brewing';
  image.draggable = false;

  cauldron.append(image);

  workbench.append(shelf, cauldron);
  preview.append(hud, workbench);

  return preview;
}
