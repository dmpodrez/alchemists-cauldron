# 🧪 Alchemist's Cauldron

Alchemist's Cauldron is a browser game built with TypeScript, HTML and CSS. Players combine limited-stock ingredients, balance three alchemical properties and brew potions before time, lives or ingredients run out.

The project implements all three gameplay levels: **Level 1 — Basic, Level 2 — Extended and Level 3 — Full Game**.

## 🎮 Live Demo

[Play Alchemist's Cauldron — Full Game (Story 3)](https://alchemists-cauldron-git-story-3-rs-a221.vercel.app)

## ✨ Implemented Features

### Level 1 — Basic Gameplay

- Ingredient shelf with limited random stock (2–15).
- Eight unique ingredient types in the catalogue.
- Cauldron with a difficulty-dependent capacity.
- Temperature, Density and Magic Power calculations.
- Animated parameter bars with target zones.
- Twenty predefined potion recipes.
- Brew validation with difficulty-specific tolerance.
- Score, lives and countdown timer.
- Pause, Resume and Exit to Menu.
- Automatic pause when the browser tab becomes hidden.
- Game Over with different ending reasons.
- Local leaderboard with Top-10 results.

### Level 2 — Extended Gameplay

- Three difficulties: Easy, Medium and Hard.
- Different rules, ingredient counts and rewards.
- Difficulty selection through Settings.
- Separate leaderboard for each difficulty.
- Automatic game saving using localStorage.
- Continue Game after refreshing or reopening the page.
- Restoring saved games in a paused state.
- Validation of saved data.

### Level 3 — Full Game

- Drag & Drop ingredients into the cauldron.
- Ingredient tooltips showing all three properties.
- Smart tooltip positioning near screen edges.
- Fifteen predefined chemical reactions.
- Random reaction selection based on difficulty.
- Reaction effects and one-time penalties.
- Pour Out action with a 10-second penalty.
- Brew success and failure animations.
- Floating ingredient icons inside the cauldron.
- Keyboard shortcuts for gameplay.

## ⚙️ Difficulty Settings

| Setting           | Easy  | Medium | Hard  |
| ----------------- | ----- | ------ | ----- |
| Shelf ingredients | 4     | 6      | 8     |
| Cauldron capacity | 4     | 4      | 5     |
| Starting time     | 180 s | 150 s  | 150 s |
| Lives             | 5     | 3      | 3     |
| Brew tolerance    | ±12   | ±8     | ±5    |
| Score per success | 100   | 200    | 300   |
| Time bonus        | +15 s | +10 s  | +5 s  |
| Active reactions  | 0     | 2      | 3     |

## 🕹️ How to Play

1. Open Settings and choose a difficulty.
2. Click Start Game.
3. Read the current potion recipe and its target ranges.
4. Add ingredients by clicking, dragging or using number keys.
5. Watch the cauldron parameters change.
6. Try to match all three target ranges.
7. Click Brew or press B to check the mixture.
8. Use Pour Out to discard an unwanted mixture at the cost of 10 seconds.
9. Continue brewing until time, lives or ingredients run out.

A successful brew awards points, adds time and generates a new recipe. A failed brew costs one life. Used ingredients are never returned to the shelf.

## ⌨️ Controls

| Action         | Mouse / Keyboard                            |
| -------------- | ------------------------------------------- |
| Add ingredient | Click, Drag & Drop or keys 1–8              |
| Brew potion    | Brew button or B                            |
| Pour Out       | Pour Out button or X                        |
| Pause game     | Pause button or Escape                      |
| Resume game    | Resume button (Enter or Space when focused) |
| Exit to Menu   | Exit to Menu button                         |

Game shortcuts only work during active gameplay. Standard keyboard navigation is preserved on menu, pause and Game Over screens.

## 🧪 Chemical Reactions

The game includes 15 predefined chemical reactions.

- Easy: no reactions.
- Medium: 2 randomly selected reactions.
- Hard: 3 randomly selected reactions.

Reactions activate when specific ingredient combinations or parameter conditions are met.

They can modify Temperature, Density and Magic Power, subtract time, remove lives or clear the cauldron.

One-time penalties are applied only when a reaction becomes newly active.

## 💾 Saving and Leaderboard

Unfinished games are automatically saved to localStorage.

Continue Game restores the saved difficulty, score, remaining time, lives, current recipe, ingredient stock, cauldron contents and active reactions.

Restored games open in the paused state.

The leaderboard stores the Top-10 scores separately for Easy, Medium and Hard. Entries include player name, score, difficulty and date.

Corrupted or unavailable localStorage data is handled without crashing the game.

## 🛠️ Technologies

- TypeScript
- HTML5
- CSS3
- Vite
- ESLint
- Prettier
- Husky
- Commitlint

No JavaScript frameworks, CSS frameworks or game engines are used.

## 📁 Project Structure

- `src/assets/` — game images, SVG icons and fonts
- `src/data/` — ingredients, recipes, reactions and difficulty settings
- `src/logic/` — game calculations and gameplay logic
- `src/state/` — game state definitions
- `src/storage/` — saving and leaderboard
- `src/ui/` — interface components
- `src/styles/` — styling and animations
- `src/main.ts` — main game flow and event handling

## 🚀 Running Locally

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

## 📋 Task

[RS School — Alchemist's Cauldron](https://github.com/rolling-scopes-school/qualifying-stage/tree/main/tasks/game-alchemists-cauldron)

## 🎨 Asset Credits

See [ASSET_CREDITS.md](./ASSET_CREDITS.md) for asset authors and licensing information.
