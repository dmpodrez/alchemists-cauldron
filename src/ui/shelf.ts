import type { Ingredient } from '../data/ingredients';
import type { ShelfStock } from '../logic/stock';

interface ShelfOptions {
  ingredients: readonly Ingredient[];
  stock: ShelfStock;
  isBlocked: boolean;
  onIngredientClick: (ingredient: Ingredient) => void;
}

function formatValue(value: number): string {
  if (value > 0) {
    return `+${value}`;
  }

  if (value < 0) {
    return `−${Math.abs(value)}`;
  }

  return '0';
}

function createIngredientTooltip(ingredient: Ingredient): HTMLElement {
  const tooltip = document.createElement('span');
  tooltip.className = 'ingredient-tooltip';
  tooltip.id = `tooltip-${ingredient.id}`;
  tooltip.setAttribute('role', 'tooltip');

  const title = document.createElement('span');
  title.className = 'ingredient-tooltip__title';
  title.textContent = ingredient.name;

  tooltip.append(title);

  const properties = [
    ['Temperature', ingredient.temperature],
    ['Density', ingredient.density],
    ['Magic Power', ingredient.magicPower],
  ] as const;

  for (const [label, value] of properties) {
    const row = document.createElement('span');
    row.className = 'ingredient-tooltip__row';

    const propertyName = document.createElement('span');
    propertyName.textContent = label;

    const propertyValue = document.createElement('strong');
    propertyValue.textContent = formatValue(value);

    row.append(propertyName, propertyValue);
    tooltip.append(row);
  }

  return tooltip;
}

function positionIngredientTooltip(button: HTMLButtonElement, tooltip: HTMLElement): void {
  const cardRect = button.getBoundingClientRect();

  const tooltipWidth = tooltip.offsetWidth;
  const tooltipHeight = tooltip.offsetHeight;

  const gap = 12;
  const margin = 10;

  const viewportWidth = document.documentElement.clientWidth;
  const viewportHeight = window.innerHeight;

  const spaceRight = viewportWidth - cardRect.right;
  const spaceLeft = cardRect.left;

  const openLeft = spaceRight < tooltipWidth + gap && spaceLeft > spaceRight;

  const desiredLeft = openLeft ? cardRect.left - tooltipWidth - gap : cardRect.right + gap;

  const maxLeft = Math.max(margin, viewportWidth - tooltipWidth - margin);

  const left = Math.min(Math.max(desiredLeft, margin), maxLeft);

  const centeredTop = cardRect.top + (cardRect.height - tooltipHeight) / 2;

  const openUp = centeredTop + tooltipHeight > viewportHeight - margin;

  const desiredTop = openUp ? cardRect.top - tooltipHeight - gap : centeredTop;

  const maxTop = Math.max(margin, viewportHeight - tooltipHeight - margin);

  const top = Math.min(Math.max(desiredTop, margin), maxTop);

  tooltip.style.left = `${left - cardRect.left}px`;
  tooltip.style.top = `${top - cardRect.top}px`;

  tooltip.classList.toggle('ingredient-tooltip--left', openLeft);

  tooltip.classList.toggle('ingredient-tooltip--up', openUp);
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

    button.draggable = !isBlocked && !isEmpty;

    button.addEventListener('dragstart', (event: DragEvent) => {
      if (isBlocked || isEmpty || !event.dataTransfer) {
        event.preventDefault();
        return;
      }

      event.dataTransfer.setData('text/plain', ingredient.id);
      event.dataTransfer.effectAllowed = 'copy';

      const image = button.querySelector<HTMLImageElement>('.ingredient-card__image');

      if (image && image.complete && image.naturalWidth > 0) {
        const bounds = image.getBoundingClientRect();

        event.dataTransfer.setDragImage(image, bounds.width / 2, bounds.height / 2);
      }

      button.classList.add('ingredient-card_dragging');
    });

    button.addEventListener('dragend', () => {
      button.classList.remove('ingredient-card_dragging');
    });

    if (isEmpty) {
      button.classList.add('ingredient-card_empty');
    }

    if (!isEmpty) {
      button.append(createIngredientVisual(ingredient));
    }

    const name = document.createElement('span');
    name.className = 'ingredient-card__name';
    name.textContent = ingredient.name;

    const badge = document.createElement('span');
    badge.className = 'ingredient-card__stock';
    badge.textContent = String(amount);

    button.append(name, badge);

    if (!isEmpty) {
      const tooltip = createIngredientTooltip(ingredient);

      button.setAttribute('aria-describedby', tooltip.id);
      button.append(tooltip);

      const updateTooltipPosition = (): void => {
        positionIngredientTooltip(button, tooltip);
      };

      button.addEventListener('mouseenter', updateTooltipPosition);

      button.addEventListener('focus', updateTooltipPosition);
    }

    button.addEventListener('click', () => onIngredientClick(ingredient));

    list.append(button);
  }

  section.append(title, list);

  return section;
}
