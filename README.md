# 🧪 Alchemist's Cauldron

Alchemist's Cauldron is a browser game built with TypeScript. The player combines limited-stock ingredients and tries to match the Temperature, Density and Magic Power ranges of the current recipe before time, lives or ingredients run out.

This repository currently contains the completed **Level 1 — Basic** gameplay.

## Implemented

- Start screen with **Start Game**, **Help** and **Leaderboard**
- 6 Level 1 ingredient cards from the fixed 8-item catalogue
- Random ingredient stock from **2 to 15** for every new run
- Cauldron with a maximum capacity of **4** ingredients
- Temperature, Density and Magic Power calculations
- Recipe target zones and current-value markers
- Fixed 20-recipe catalogue
- Level 1 Medium recipe selection
- Brew validation with **±8** tolerance
- **200 points** for a successful brew
- **+10 seconds** time bonus after a successful brew
- **150 second** timestamp-based timer
- **3 lives**
- Pause / Resume / Exit to Menu flow
- Automatic pause when the browser tab becomes hidden
- Game Over reasons for time, lives and depleted ingredients
- Saving unfinished games to `localStorage` with **Continue Game** (restores paused)
- Top-10 leaderboard stored in `localStorage`
- Player-name validation
- Custom leaderboard clear confirmation
- Responsive layout for desktop and mobile widths
- ESLint, Prettier, Husky and Commitlint

## How to play

1. Press **Start Game**.
2. Read the current recipe and its three target ranges.
3. Select ingredients from the shelf. Every selected ingredient reduces its stock by one.
4. Watch the cauldron parameter bars update.
5. Add up to four ingredients.
6. Press **Brew**.
7. A successful brew awards 200 points, adds a time bonus and gives a new recipe.
8. A failed brew costs one life. The used ingredients are still spent.
9. Continue until the timer reaches zero, all lives are lost, or the ingredient shelf and cauldron are empty.

The **Help** button on the start screen also shows the Level 1 rules in-game.

## Level 1 rules

| Rule                            |  Value |
| ------------------------------- | -----: |
| Difficulty rules                | Medium |
| Shelf ingredients               |      6 |
| Random stock per ingredient     |   2–15 |
| Maximum ingredients in cauldron |      4 |
| Starting time                   |  150 s |
| Starting lives                  |      3 |
| Brew tolerance                  |     ±8 |
| Score per successful brew       |    200 |
| Time bonus                      |  +10 s |

## Technologies

- TypeScript
- HTML
- CSS
- Vite
- ESLint
- Prettier
- Husky
- Commitlint

No JavaScript framework, CSS framework or game engine is used.

## Project structure

```text
src/
  assets/       visual assets
  data/         ingredients and recipes
  logic/        pure gameplay logic
  state/        game state types and initial state
  storage/      leaderboard persistence
  styles/       application styles
  ui/           DOM rendering components
  main.ts       application flow and state transitions
```

Game rules and calculations are kept separate from DOM rendering.

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

## Controls

Level 1 is mouse / pointer based:

- click an ingredient card to add one portion to the cauldron;
- click **Brew** to check the mixture;
- click **Pause** to stop the run;
- use **Resume** or **Exit to Menu** from the pause dialog;
- open **Leaderboard** from the start screen or Game Over screen.

## Persistence

Unfinished Level 1 games are saved to browser `localStorage`. When a valid save exists, **Continue Game** restores it in a paused state. A completed run clears the unfinished save.

The Level 1 Top-10 leaderboard is also stored in `localStorage`. Invalid or corrupted stored data is handled without crashing the game.

## Task

[RS School — Alchemist's Cauldron](https://github.com/rolling-scopes-school/qualifying-stage/tree/main/tasks/game-alchemists-cauldron)
