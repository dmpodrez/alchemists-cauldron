import type { Ingredient } from '../data/ingredients';

interface CauldronOptions {
  ingredients: readonly Ingredient[];
  capacity: number;
}

export function createCauldron({ ingredients, capacity }: CauldronOptions): HTMLElement {
  const section = document.createElement('section');
  section.className = 'cauldron';

  const header = document.createElement('div');
  header.className = 'cauldron__header';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = 'Cauldron';

  const counter = document.createElement('strong');
  counter.className = 'cauldron__counter';
  counter.textContent = `Ingredients: ${ingredients.length} / ${capacity}`;

  if (ingredients.length >= capacity) {
    counter.classList.add('cauldron__counter_full');
  }

  header.append(title, counter);

  const bowl = document.createElement('div');
  bowl.className = 'cauldron__bowl';

  if (ingredients.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'cauldron__empty';
    empty.textContent = 'The cauldron is empty';
    bowl.append(empty);
  } else {
    const list = document.createElement('ol');
    list.className = 'cauldron__ingredients';

    for (const ingredient of ingredients) {
      const item = document.createElement('li');
      item.className = 'cauldron__ingredient';
      item.textContent = `${ingredient.icon} ${ingredient.name}`;
      list.append(item);
    }

    bowl.append(list);
  }

  section.append(header, bowl);

  return section;
}
