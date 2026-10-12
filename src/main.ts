import './styles/style.css';

const app = document.querySelector<HTMLDivElement>('#app');

if (!app) {
  throw new Error('Application root element was not found.');
}

const title = document.createElement('h1');
title.textContent = "Alchemist's Cauldron";

app.append(title);
