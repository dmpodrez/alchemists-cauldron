import type { Difficulty } from '../data/recipes';

export interface LeaderboardEntry {
  name: string;
  score: number;
  createdAt: number;
}

const LEADERBOARD_KEY = 'alchemists-cauldron:leaderboard';
const MAX_LEADERBOARD_ENTRIES = 10;

function getLeaderboardKey(difficulty: Difficulty): string {
  if (difficulty === 'medium') {
    return LEADERBOARD_KEY;
  }

  return `${LEADERBOARD_KEY}:${difficulty}`;
}

const PLAYER_NAME_PATTERN = /^[\p{L}\p{N} _-]{2,15}$/u;

export function isValidPlayerName(name: string): boolean {
  return PLAYER_NAME_PATTERN.test(name.trim());
}

function isLeaderboardEntry(value: unknown): value is LeaderboardEntry {
  if (typeof value !== 'object' || value === null) {
    return false;
  }

  const entry = value as Record<string, unknown>;

  return (
    typeof entry.name === 'string' &&
    entry.name === entry.name.trim() &&
    isValidPlayerName(entry.name) &&
    typeof entry.score === 'number' &&
    Number.isFinite(entry.score) &&
    entry.score >= 0 &&
    typeof entry.createdAt === 'number' &&
    Number.isFinite(entry.createdAt) &&
    entry.createdAt > 0
  );
}

function sortLeaderboard(entries: readonly LeaderboardEntry[]): LeaderboardEntry[] {
  return [...entries]
    .sort((first, second) => {
      if (second.score !== first.score) {
        return second.score - first.score;
      }

      return first.createdAt - second.createdAt;
    })
    .slice(0, MAX_LEADERBOARD_ENTRIES);
}

function removeBrokenLeaderboard(difficulty: Difficulty): void {
  try {
    localStorage.removeItem(getLeaderboardKey(difficulty));
  } catch {
    // Storage can be unavailable.
  }
}

export function loadLeaderboard(difficulty: Difficulty = 'medium'): LeaderboardEntry[] {
  try {
    const rawValue = localStorage.getItem(getLeaderboardKey(difficulty));

    if (!rawValue) {
      return [];
    }

    const parsed: unknown = JSON.parse(rawValue);

    if (!Array.isArray(parsed) || !parsed.every((entry) => isLeaderboardEntry(entry))) {
      removeBrokenLeaderboard(difficulty);
      return [];
    }

    return sortLeaderboard(parsed);
  } catch {
    return [];
  }
}

export function qualifiesForLeaderboard(score: number, difficulty: Difficulty = 'medium'): boolean {
  const entries = loadLeaderboard(difficulty);

  if (entries.length < MAX_LEADERBOARD_ENTRIES) {
    return true;
  }

  const lastEntry = entries[MAX_LEADERBOARD_ENTRIES - 1];

  if (!lastEntry) {
    return true;
  }

  return score > lastEntry.score;
}

export function addLeaderboardEntry(
  name: string,
  score: number,
  createdAt = Date.now(),
  difficulty: Difficulty = 'medium',
): boolean {
  const normalizedName = name.trim();

  if (!isValidPlayerName(normalizedName)) {
    return false;
  }

  const currentEntries = loadLeaderboard(difficulty);

  if (
    currentEntries.length >= MAX_LEADERBOARD_ENTRIES &&
    !qualifiesForLeaderboard(score, difficulty)
  ) {
    return false;
  }

  const nextEntries = sortLeaderboard([
    ...currentEntries,
    {
      name: normalizedName,
      score,
      createdAt,
    },
  ]);

  try {
    localStorage.setItem(getLeaderboardKey(difficulty), JSON.stringify(nextEntries));

    return true;
  } catch {
    return false;
  }
}

export function clearLeaderboard(difficulty: Difficulty = 'medium'): boolean {
  try {
    localStorage.removeItem(getLeaderboardKey(difficulty));
    return true;
  } catch {
    return false;
  }
}

export function formatLeaderboardDate(timestamp: number): string {
  const date = new Date(timestamp);

  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();

  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}
