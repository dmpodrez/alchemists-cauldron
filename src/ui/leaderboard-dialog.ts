import { formatLeaderboardDate, type LeaderboardEntry } from '../storage/leaderboard';

interface LeaderboardDialogOptions {
  entries: readonly LeaderboardEntry[];
  onClose: () => void;
  onClear: () => boolean;
}

export function createLeaderboardDialog({
  entries,
  onClose,
  onClear,
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

  const eyebrow = document.createElement('span');
  eyebrow.className = 'leaderboard-dialog__eyebrow';
  eyebrow.textContent = 'Hall of alchemists';

  const title = document.createElement('h2');
  title.id = 'leaderboard-title';
  title.className = 'leaderboard-dialog__title';
  title.textContent = 'Leaderboard';

  headingGroup.append(eyebrow, title);

  const closeButton = document.createElement('button');
  closeButton.className = 'leaderboard-dialog__close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', 'Close leaderboard');
  closeButton.textContent = '×';
  closeButton.addEventListener('click', onClose);

  header.append(headingGroup, closeButton);

  const tableWrapper = document.createElement('div');
  tableWrapper.className = 'leaderboard-table-wrapper';

  const table = document.createElement('table');
  table.className = 'leaderboard-table';

  const head = document.createElement('thead');
  const headerRow = document.createElement('tr');

  for (const label of ['#', 'Player', 'Score', 'Date']) {
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
      const cell = document.createElement('td');

      cell.colSpan = 4;
      cell.className = 'leaderboard-table__empty';
      cell.textContent = 'No scores yet. Brew your first potion!';

      row.append(cell);
      body.append(row);
      return;
    }

    currentEntries.forEach((entry, index) => {
      const row = document.createElement('tr');

      const rank = document.createElement('td');
      rank.textContent = String(index + 1);

      const name = document.createElement('td');
      name.textContent = entry.name;

      const score = document.createElement('td');
      score.textContent = String(entry.score);

      const date = document.createElement('td');
      date.textContent = formatLeaderboardDate(entry.createdAt);

      row.append(rank, name, score, date);
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

  const clearButton = document.createElement('button');
  clearButton.className = 'leaderboard-dialog__clear';
  clearButton.type = 'button';
  clearButton.textContent = 'Clear Leaderboard';
  clearButton.disabled = entries.length === 0;

  const doneButton = document.createElement('button');
  doneButton.className = 'leaderboard-dialog__button leaderboard-dialog__button_primary';
  doneButton.type = 'button';
  doneButton.textContent = 'Done';
  doneButton.addEventListener('click', onClose);

  clearButton.addEventListener('click', () => {
    const confirmation = document.createElement('div');
    confirmation.className = 'confirmation-overlay';

    const confirmationDialog = document.createElement('section');
    confirmationDialog.className = 'confirmation-dialog';
    confirmationDialog.setAttribute('role', 'alertdialog');
    confirmationDialog.setAttribute('aria-modal', 'true');

    const confirmationTitle = document.createElement('h3');
    confirmationTitle.textContent = 'Clear leaderboard?';

    const confirmationText = document.createElement('p');
    confirmationText.textContent = 'All saved Level 1 scores will be permanently removed.';

    const confirmationActions = document.createElement('div');
    confirmationActions.className = 'confirmation-dialog__actions';

    const cancelButton = document.createElement('button');
    cancelButton.className = 'leaderboard-dialog__button';
    cancelButton.type = 'button';
    cancelButton.textContent = 'Cancel';
    cancelButton.addEventListener('click', () => {
      confirmation.remove();
    });

    const confirmButton = document.createElement('button');
    confirmButton.className = 'leaderboard-dialog__clear';
    confirmButton.type = 'button';
    confirmButton.textContent = 'Clear';

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

    confirmationDialog.append(confirmationTitle, confirmationText, confirmationActions);

    confirmation.append(confirmationDialog);
    overlay.append(confirmation);

    cancelButton.focus();
  });

  actions.append(clearButton, doneButton);

  dialog.append(header, tableWrapper, status, actions);

  overlay.append(dialog);

  requestAnimationFrame(() => {
    closeButton.focus();
  });

  return overlay;
}
