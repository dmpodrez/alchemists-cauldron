import { DIFFICULTY_SETTINGS } from '../data/difficulty';
import type { Difficulty } from '../data/recipes';
import { REACTIONS, type IReaction } from '../data/reactions';

const HARD_ONLY_REACTION_IDS = new Set([
  'volatile-mix',
  'rooted-steam',
  'ashen-bloom',
  'heavy-spark',
  'burning-root',
]);

export function selectReactions(difficulty: Difficulty): readonly IReaction[] {
  const reactionCount = DIFFICULTY_SETTINGS[difficulty].reactionCount;

  if (reactionCount === 0) {
    return [];
  }

  const availableReactions = REACTIONS.filter(
    (reaction) => difficulty === 'hard' || !HARD_ONLY_REACTION_IDS.has(reaction.id),
  );

  const selected: IReaction[] = [];

  for (let index = 0; index < reactionCount && availableReactions.length > 0; index++) {
    const randomIndex = Math.floor(Math.random() * availableReactions.length);

    const [reaction] = availableReactions.splice(randomIndex, 1);

    if (reaction) {
      selected.push(reaction);
    }
  }

  return selected;
}
