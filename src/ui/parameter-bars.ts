import type { ParameterRange, RecipeTargets } from '../data/recipes';
import type { CauldronValues } from '../logic/calculate-cauldron';

interface ParameterConfig {
  key: keyof CauldronValues;
  label: string;
  min: number;
  max: number;
  supportsNegative: boolean;
  tone: 'temperature' | 'density' | 'magic';
}

const PARAMETER_CONFIGS: readonly ParameterConfig[] = [
  {
    key: 'temperature',
    label: 'Temperature',
    min: -100,
    max: 100,
    supportsNegative: true,
    tone: 'temperature',
  },
  {
    key: 'density',
    label: 'Density',
    min: -100,
    max: 100,
    supportsNegative: true,
    tone: 'density',
  },
  {
    key: 'magicPower',
    label: 'Magic Power',
    min: 0,
    max: 200,
    supportsNegative: false,
    tone: 'magic',
  },
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function toPercent(value: number, min: number, max: number): number {
  const clampedValue = clamp(value, min, max);

  return ((clampedValue - min) / (max - min)) * 100;
}

function isInsideRange(value: number, range: ParameterRange): boolean {
  return value >= range.min && value <= range.max;
}

function createParameterBar(
  config: ParameterConfig,
  value: number,
  target: ParameterRange,
): HTMLElement {
  const item = document.createElement('div');
  item.className = `parameter-bar parameter-bar_${config.tone}`;

  const header = document.createElement('div');
  header.className = 'parameter-bar__header';

  const label = document.createElement('span');
  label.className = 'parameter-bar__label';
  label.textContent = config.label;

  const valueElement = document.createElement('strong');
  valueElement.className = 'parameter-bar__value';

  valueElement.textContent = String(Number(value.toFixed(2)));

  header.append(label, valueElement);

  const track = document.createElement('div');
  track.className = 'parameter-bar__track';

  const targetZone = document.createElement('div');
  targetZone.className = 'parameter-bar__target';

  const targetStart = toPercent(target.min, config.min, config.max);
  const targetEnd = toPercent(target.max, config.min, config.max);

  targetZone.style.left = `${targetStart}%`;
  targetZone.style.width = `${targetEnd - targetStart}%`;

  const marker = document.createElement('div');
  marker.className = 'parameter-bar__marker';
  marker.style.left = `${toPercent(value, config.min, config.max)}%`;

  if (isInsideRange(value, target)) {
    marker.classList.add('parameter-bar__marker_inside');
    track.classList.add('parameter-bar__track_inside');
  }

  track.append(targetZone, marker);

  if (config.supportsNegative) {
    const zeroLine = document.createElement('span');
    zeroLine.className = 'parameter-bar__zero';
    zeroLine.style.left = `${toPercent(0, config.min, config.max)}%`;
    track.append(zeroLine);
  }

  const limits = document.createElement('div');
  limits.className = 'parameter-bar__limits';

  const minimum = document.createElement('span');
  minimum.textContent = String(config.min);

  const targetText = document.createElement('span');
  targetText.className = 'parameter-bar__target-text';
  targetText.textContent = `Target: ${target.min}…${target.max}`;

  const maximum = document.createElement('span');
  maximum.textContent = String(config.max);

  limits.append(minimum, targetText, maximum);
  item.append(header, track, limits);

  return item;
}

export function createParameterBars(values: CauldronValues, targets: RecipeTargets): HTMLElement {
  const section = document.createElement('section');
  section.className = 'parameters';

  const heading = document.createElement('div');
  heading.className = 'parameters__heading';

  const eyebrow = document.createElement('span');
  eyebrow.className = 'parameters__eyebrow';
  eyebrow.textContent = 'Brew Analysis';

  const title = document.createElement('h2');
  title.className = 'section-title parameters__title';
  title.textContent = 'Cauldron Parameters';

  heading.append(eyebrow, title);

  const list = document.createElement('div');
  list.className = 'parameters__list';

  for (const config of PARAMETER_CONFIGS) {
    list.append(createParameterBar(config, values[config.key], targets[config.key]));
  }

  section.append(heading, list);

  return section;
}
