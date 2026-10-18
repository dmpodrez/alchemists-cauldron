import { formatLeaderboardDate, type LeaderboardEntry } from '../storage/leaderboard';

import type { Difficulty } from '../data/recipes';

interface LeaderboardDialogOptions {
  entries: readonly LeaderboardEntry[];
  onClose: () => void;
  onClear: () => boolean;
  difficulty: Difficulty;
  onDifficultyChange: (difficulty: Difficulty) => void;
}

function createActionButton(text: string, className: string, icon: string): HTMLButtonElement {
  const button = document.createElement('button');
  button.className = className;
  button.type = 'button';

  const iconElement = document.createElement('span');
  iconElement.className = 'leaderboard-dialog__button-icon';
  iconElement.textContent = icon;
  iconElement.setAttribute('aria-hidden', 'true');

  const label = document.createElement('span');
  label.textContent = text;

  button.append(iconElement, label);

  return button;
}

export function createLeaderboardDialog({
  entries,
  difficulty,
  onClose,
  onClear,
  onDifficultyChange,
}: LeaderboardDialogOptions): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'leaderboard-overlay';

  const dialog = document.createElement('section');
  dialog.className = 'leaderboard-dialog';
  dialog.setAttribute('role', 'dialog');
  dialog.setAttribute('aria-modal', 'true');
  dialog.setAttribute('aria-labelledby', 'leaderboard-title');

  const header = document.createElement('div');
  header.className = 'leaderboard-dialog__header';

  const headingGroup = document.createElement('div');
  headingGroup.className = 'leaderboard-dialog__heading';

  const eyebrow = document.createElement('span');
  eyebrow.className = 'leaderboard-dialog__eyebrow';
  eyebrow.textContent = 'Hall of Alchemists';

  const title = document.createElement('h2');
  title.id = 'leaderboard-title';
  title.className = 'leaderboard-dialog__title';
  title.textContent = 'Leaderboard';

  const ornament = document.createElement('div');
  ornament.className = 'leaderboard-dialog__ornament';
  ornament.setAttribute('aria-hidden', 'true');

  headingGroup.append(eyebrow, title, ornament);

  const closeButton = document.createElement('button');
  closeButton.className = 'leaderboard-dialog__close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close leaderboard');
  closeButton.textContent = '×';
  closeButton.addEventListener('click', onClose);

  header.append(headingGroup, closeButton);

  const difficultySwitch = document.createElement('div');
  difficultySwitch.className = 'leaderboard-dialog__difficulties';
  difficultySwitch.setAttribute('role', 'group');
  difficultySwitch.setAttribute('aria-label', 'Leaderboard difficulty');

  const difficulties: readonly Difficulty[] = ['easy', 'medium', 'hard'];

  for (const level of difficulties) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'leaderboard-dialog__difficulty-button';

    button.textContent = level.charAt(0).toUpperCase() + level.slice(1);

    const selected = level === difficulty;

    button.setAttribute('aria-pressed', String(selected));

    if (selected) {
      button.classList.add('leaderboard-dialog__difficulty-button_active');
    }

    button.addEventListener('click', () => {
      onDifficultyChange(level);
    });

    difficultySwitch.append(button);
  }

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'leaderboard-table-wrapper';

  const table = document.createElement('table');
  table.className = 'leaderboard-table';

  const head = document.createElement('thead');
  const headerRow = document.createElement('tr');

  for (const label of ['#', 'Player', 'Score', 'Difficulty', 'Date']) {
    const cell = document.createElement('th');
    cell.scope = 'col';
    cell.textContent = label;
    headerRow.append(cell);
  }

  head.append(headerRow);

  const body = document.createElement('tbody');

  function renderRows(currentEntries: readonly LeaderboardEntry[]): void {
    body.replaceChildren();

    if (currentEntries.length === 0) {
      const row = document.createElement('tr');
      row.className = 'leaderboard-table__empty-row';

      const cell = document.createElement('td');
      cell.colSpan = 5;
      cell.className = 'leaderboard-table__empty';
      cell.textContent = 'No scores yet. Brew your first potion!';

      row.append(cell);
      body.append(row);
      return;
    }

    currentEntries.forEach((entry, index) => {
      const row = document.createElement('tr');
      row.className = 'leaderboard-table__row';

      if (index < 3) {
        row.classList.add(`leaderboard-table__row_rank-${index + 1}`);
      }

      const rank = document.createElement('td');
      rank.className = 'leaderboard-table__rank';

      const rankBadge = document.createElement('span');
      rankBadge.className = 'leaderboard-table__rank-badge';
      rankBadge.textContent = String(index + 1);

      rank.append(rankBadge);

      const name = document.createElement('td');
      name.className = 'leaderboard-table__player';
      name.textContent = entry.name;

      const score = document.createElement('td');
      score.className = 'leaderboard-table__score';
      score.textContent = String(entry.score);

      const difficultyCell = document.createElement('td');
      difficultyCell.className = 'leaderboard-table__difficulty';
      difficultyCell.textContent = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);

      const date = document.createElement('td');
      date.className = 'leaderboard-table__date';
      date.textContent = formatLeaderboardDate(entry.createdAt);

      row.append(rank, name, score, difficultyCell, date);
      body.append(row);
    });
  }

  renderRows(entries);

  table.append(head, body);
  tableWrapper.append(table);

  const status = document.createElement('p');
  status.className = 'leaderboard-dialog__status';
  status.setAttribute('aria-live', 'polite');

  const actions = document.createElement('div');
  actions.className = 'leaderboard-dialog__actions';

  const clearButton = createActionButton('Clear Leaderboard', 'leaderboard-dialog__clear', '♜');
  clearButton.disabled = entries.length === 0;

  const doneButton = createActionButton(
    'Done',
    'leaderboard-dialog__button leaderboard-dialog__button_primary',
    '◆',
  );
  doneButton.addEventListener('click', onClose);

  clearButton.addEventListener('click', () => {
    const confirmation = document.createElement('div');
    confirmation.className = 'confirmation-overlay';

    const confirmationDialog = document.createElement('section');
    confirmationDialog.className = 'confirmation-dialog';
    confirmationDialog.setAttribute('role', 'alertdialog');
    confirmationDialog.setAttribute('aria-modal', 'true');
    confirmationDialog.setAttribute('aria-labelledby', 'clear-leaderboard-title');

    const confirmationMark = document.createElement('div');
    confirmationMark.className = 'confirmation-dialog__mark';
    confirmationMark.textContent = '!';
    confirmationMark.setAttribute('aria-hidden', 'true');

    const confirmationTitle = document.createElement('h3');
    confirmationTitle.id = 'clear-leaderboard-title';
    confirmationTitle.textContent = 'Clear leaderboard?';

    const confirmationText = document.createElement('p');
    confirmationText.textContent = `All saved ${difficulty} scores will be permanently removed.`;

    const confirmationActions = document.createElement('div');
    confirmationActions.className = 'confirmation-dialog__actions';

    const cancelButton = createActionButton('Cancel', 'leaderboard-dialog__button', '×');
    cancelButton.addEventListener('click', () => {
      confirmation.remove();
      clearButton.focus();
    });

    const confirmButton = createActionButton('Clear', 'leaderboard-dialog__clear', '♜');

    confirmButton.addEventListener('click', () => {
      const cleared = onClear();

      if (!cleared) {
        status.textContent = 'The leaderboard could not be cleared. Storage may be unavailable.';
        confirmation.remove();
        return;
      }

      renderRows([]);
      clearButton.disabled = true;
      status.textContent = 'Leaderboard cleared.';
      confirmation.remove();
    });

    confirmationActions.append(cancelButton, confirmButton);
    confirmationDialog.append(
      confirmationMark,
      confirmationTitle,
      confirmationText,
      confirmationActions,
    );

    confirmation.append(confirmationDialog);
    overlay.append(confirmation);

    cancelButton.focus();
  });

  actions.append(clearButton, doneButton);
  dialog.append(header, difficultySwitch, tableWrapper, status, actions);
  overlay.append(dialog);

  requestAnimationFrame(() => {
    closeButton.focus();
  });

  return overlay;
}
