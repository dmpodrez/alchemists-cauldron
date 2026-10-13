export const LEVEL_ONE_START_TIME = 150;
export const LEVEL_ONE_TIME_BONUS = 10;

export function createEndTime(seconds: number, now = Date.now()): number {
  return now + seconds * 1000;
}

export function calculateTimeLeft(endTime: number, now = Date.now()): number {
  return Math.max(0, Math.ceil((endTime - now) / 1000));
}

export function addTimeBonus(
  timeLeft: number,
  bonus = LEVEL_ONE_TIME_BONUS,
  maximum = LEVEL_ONE_START_TIME,
): number {
  return Math.min(timeLeft + bonus, maximum);
}

export function formatTime(seconds: number): string {
  const safeSeconds = Math.max(0, seconds);
  const minutes = Math.floor(safeSeconds / 60);
  const remainingSeconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}
