export interface ParameterRange {
  min: number;
  max: number;
}

export interface RecipeTargets {
  temperature: ParameterRange;
  density: ParameterRange;
  magicPower: ParameterRange;
}

export const LEVEL_ONE_PREVIEW_RECIPE: RecipeTargets = {
  temperature: {
    min: 17,
    max: 27,
  },
  density: {
    min: 18,
    max: 28,
  },
  magicPower: {
    min: 29,
    max: 39,
  },
};
