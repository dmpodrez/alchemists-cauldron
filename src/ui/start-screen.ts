interface StartScreenOptions {
  onStart: () => void;
}

export function createStartScreen({ onStart }: StartScreenOptions): HTMLElement {
  const screen = document.createElement('main');
  screen.className = 'start-screen';

  const content = document.createElement('div');
  content.className = 'start-screen__content';

  const eyebrow = document.createElement('span');
  eyebrow.className = 'start-screen__eyebrow';
  eyebrow.textContent = 'Alchemy awaits';

  const title = document.createElement('h1');
  title.className = 'start-screen__title';
  title.textContent = "Alchemist's Cauldron";

  const text = document.createElement('p');
  text.className = 'start-screen__text';
  text.textContent =
    'Combine ingredients and match all three recipe ranges before your resources run out.';

  const button = document.createElement('button');
  button.className = 'start-button';
  button.type = 'button';
  button.textContent = 'Start Game';
  button.addEventListener('click', onStart);

  content.append(eyebrow, title, text, button);
  screen.append(content);

  return screen;
}
