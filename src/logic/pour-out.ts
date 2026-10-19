import type { GameState } from '../state/game-state';
import { calculateTimeLeft } from './timer';

export const POUR_OUT_PENALTY = 10;

export function pourOutCauldron(state: GameState, now = Date.now()): GameState | null {
  if (
    state.status !== 'playing' ||
    state.endTime === null ||
    state.cauldronIngredients.length === 0
  ) {
    return null;
  }

  const nextEndTime = state.endTime - POUR_OUT_PENALTY * 1000;

  return {
    ...state,
    cauldronIngredients: [],
    endTime: nextEndTime,
    timeLeft: calculateTimeLeft(nextEndTime, now),
  };
}
