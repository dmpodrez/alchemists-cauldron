# 🧪 Alchemist's Cauldron

Alchemist's Cauldron is a browser game where the player combines ingredients to brew potions.

Each ingredient changes three cauldron parameters:

- Temperature
- Density
- Magic Power

The goal is to combine ingredients so all three values match the target ranges of the current recipe.

## Status

The project is currently in the technical setup stage.

Implemented:

- Vite development and production setup
- TypeScript with strict type checking
- ESLint
- Prettier
- Husky Git hooks
- Commit message validation
- Initial project structure

Gameplay will be implemented progressively according to the RS School task stories.

## Technologies

- TypeScript
- HTML
- CSS
- Vite
- ESLint
- Prettier
- Husky
- Commitlint

No JavaScript frameworks, CSS frameworks or game engines are used.

## Project structure

```text
src/
  assets/
  data/
  logic/
  state/
  storage/
  styles/
  ui/
  main.ts
```

Game logic is kept separate from DOM rendering.

## Run locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Run code-quality checks:

```bash
npm run lint
npm run format:check
```

## Gameplay

The complete game will include:

- ingredient shelf and cauldron;
- potion recipes;
- Temperature, Density and Magic Power parameters;
- ingredient stock;
- timer and lives;
- score system;
- pause;
- leaderboard;
- difficulty levels;
- save and continue;
- drag and drop;
- chemical reactions;
- keyboard controls.

## Task

[RS School — Alchemist's Cauldron](https://github.com/rolling-scopes-school/qualifying-stage/tree/main/tasks/game-alchemists-cauldron)
