import type { Recipe } from '../data/recipes';

interface RecipePanelOptions {
  recipe: Recipe;
  ingredientCount: number;
  capacity: number;
  onBrew: () => void;
  onPourOut: () => void;
  isPaused: boolean;
}

function formatRange(min: number, max: number): string {
  return `${min}…${max}`;
}

export function createRecipePanel({
  recipe,
  ingredientCount,
  capacity,
  onBrew,
  onPourOut,
  isPaused,
}: RecipePanelOptions): HTMLElement {
  const section = document.createElement('section');
  section.className = 'recipe';

  const header = document.createElement('div');
  header.className = 'recipe__header';

  const headingGroup = document.createElement('div');

  const eyebrow = document.createElement('span');
  eyebrow.className = 'recipe__eyebrow';
  eyebrow.textContent = 'Current Recipe';

  const title = document.createElement('h2');
  title.className = 'recipe__title';
  title.textContent = recipe.name;
  header.append(headingGroup);
  headingGroup.append(eyebrow, title);

  const ranges = document.createElement('div');
  ranges.className = 'recipe__ranges';

  const values = [
    ['Temperature', recipe.temperature.min, recipe.temperature.max],
    ['Density', recipe.density.min, recipe.density.max],
    ['Magic Power', recipe.magicPower.min, recipe.magicPower.max],
  ] as const;

  for (const [label, min, max] of values) {
    const item = document.createElement('div');
    item.className = 'recipe__range';

    const name = document.createElement('span');
    name.textContent = label;

    const value = document.createElement('strong');
    value.textContent = formatRange(min, max);

    item.append(name, value);
    ranges.append(item);
  }

  const footer = document.createElement('div');
  footer.className = 'recipe__footer';

  const counter = document.createElement('strong');
  counter.className = 'recipe__counter';
  counter.textContent = `Ingredients: ${ingredientCount} / ${capacity}`;

  if (ingredientCount >= capacity) {
    counter.classList.add('recipe__counter_full');
  }

  const brewButton = document.createElement('button');
  brewButton.className = 'brew-button';
  brewButton.type = 'button';
  brewButton.textContent = 'Brew';
  brewButton.disabled = ingredientCount === 0 || isPaused;
  brewButton.addEventListener('click', onBrew);

  const pourOutButton = document.createElement('button');

  pourOutButton.className = 'pour-out-button';
  pourOutButton.type = 'button';
  pourOutButton.textContent = 'Pour Out (-10s)';
  pourOutButton.disabled = ingredientCount === 0 || isPaused;

  pourOutButton.addEventListener('click', onPourOut);

  const actions = document.createElement('div');
  actions.className = 'recipe__actions';

  actions.append(pourOutButton, brewButton);

  footer.append(counter, actions);

  section.append(header, ranges, footer);

  return section;
}
