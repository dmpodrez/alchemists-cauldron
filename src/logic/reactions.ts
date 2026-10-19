import type { Ingredient } from '../data/ingredients';
import type { IReaction } from '../data/reactions';
import { calculateCauldron, type CauldronValues } from './calculate-cauldron';

export interface ReactionCalculation {
  values: CauldronValues;
  activeReactions: readonly IReaction[];
}

export function calculateCauldronWithReactions(
  ingredients: readonly Ingredient[],
  reactions: readonly IReaction[],
): ReactionCalculation {
  const baseValues = calculateCauldron(ingredients);

  const activeReactions = reactions.filter((reaction) =>
    reaction.isActive(ingredients, baseValues),
  );

  const values = activeReactions.reduce(
    (currentValues, reaction) => reaction.apply(currentValues),
    baseValues,
  );

  return {
    values,
    activeReactions,
  };
}

export function getNewlyActivatedReactions(
  before: readonly Ingredient[],
  after: readonly Ingredient[],
  reactions: readonly IReaction[],
): readonly IReaction[] {
  const beforeValues = calculateCauldron(before);
  const afterValues = calculateCauldron(after);

  return reactions.filter(
    (reaction) => !reaction.isActive(before, beforeValues) && reaction.isActive(after, afterValues),
  );
}
