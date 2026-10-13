import type { Ingredient } from '../data/ingredients';

interface CauldronOptions {
  ingredients: readonly Ingredient[];
}

export function createCauldron({ ingredients }: CauldronOptions): HTMLElement {
  const section = document.createElement('section');
  section.className = 'cauldron';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = 'Cauldron';

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

  section.append(title, bowl);

  return section;
}
