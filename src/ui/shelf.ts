import type { Ingredient } from '../data/ingredients';
import type { ShelfStock } from '../logic/stock';

interface ShelfOptions {
  ingredients: readonly Ingredient[];
  stock: ShelfStock;
  isBlocked: boolean;
  onIngredientClick: (ingredient: Ingredient) => void;
}

function formatValue(value: number): string {
  return value > 0 ? `+${value}` : String(value);
}

function createIngredientVisual(ingredient: Ingredient): HTMLElement {
  if (ingredient.image) {
    const image = document.createElement('img');
    image.className = 'ingredient-card__image';
    image.src = ingredient.image;
    image.alt = ingredient.name;
    image.draggable = false;

    return image;
  }

  const placeholder = document.createElement('span');
  placeholder.className = 'ingredient-card__image ingredient-card__image_placeholder';
  placeholder.setAttribute('aria-hidden', 'true');
  placeholder.textContent = '◇';

  return placeholder;
}

export function createShelf({
  ingredients,
  stock,
  isBlocked,
  onIngredientClick,
}: ShelfOptions): HTMLElement {
  const section = document.createElement('section');
  section.className = 'shelf';

  const title = document.createElement('h2');
  title.className = 'section-title';
  title.textContent = 'Ingredient Shelf';

  const list = document.createElement('div');
  list.className = 'shelf__list';

  for (const ingredient of ingredients) {
    const amount = stock[ingredient.id] ?? 0;
    const isEmpty = amount === 0;

    const button = document.createElement('button');
    button.className = 'ingredient-card';
    button.type = 'button';
    button.disabled = isBlocked || isEmpty;

    if (isEmpty) {
      button.classList.add('ingredient-card_empty');
    }

    if (!isEmpty) {
      button.append(createIngredientVisual(ingredient));
    }

    const name = document.createElement('span');
    name.className = 'ingredient-card__name';
    name.textContent = ingredient.name;

    const stats = document.createElement('span');
    stats.className = 'ingredient-card__stats';
    stats.textContent = isEmpty
      ? 'Empty'
      : `T ${formatValue(ingredient.temperature)} · D ${formatValue(
          ingredient.density,
        )} · M ${formatValue(ingredient.magicPower)}`;

    const badge = document.createElement('span');
    badge.className = 'ingredient-card__stock';
    badge.textContent = String(amount);

    button.append(name, stats, badge);
    button.addEventListener('click', () => onIngredientClick(ingredient));

    list.append(button);
  }

  section.append(title, list);

  return section;
}
