import chroma from 'chroma-js';

export interface ColorInfo {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
}

export interface Palette {
  id: string;
  name: string;
  type: 'complementary' | 'analogous' | 'triadic' | 'monochromatic' | 'split-complementary';
  colors: ColorInfo[];
  score: number;
  reason: string;
  contrastIssues: string[];
}

/**
 * Convert RGB array to ColorInfo object
 */
export function rgbToColorInfo(rgb: [number, number, number]): ColorInfo {
  const color = chroma(rgb);
  const [h, s, l] = color.hsl();

  return {
    hex: color.hex(),
    rgb: { r: rgb[0], g: rgb[1], b: rgb[2] },
    hsl: {
      h: isNaN(h) ? 0 : Math.round(h),
      s: isNaN(s) ? 0 : Math.round(s * 100),
      l: Math.round(l * 100)
    },
  };
}

/**
 * Calculate color distance using Euclidean RGB distance
 */
export function colorDistance(color1: [number, number, number], color2: [number, number, number]): number {
  const rDiff = color1[0] - color2[0];
  const gDiff = color1[1] - color2[1];
  const bDiff = color1[2] - color2[2];
  return Math.sqrt(rDiff * rDiff + gDiff * gDiff + bDiff * bDiff);
}

/**
 * Remove near-duplicate colors from palette
 */
export function removeDuplicates(colors: [number, number, number][], threshold = 50): [number, number, number][] {
  const unique: [number, number, number][] = [];

  for (const color of colors) {
    const isDuplicate = unique.some(uniqueColor =>
      colorDistance(color, uniqueColor) < threshold
    );

    if (!isDuplicate) {
      unique.push(color);
    }
  }

  return unique;
}

/**
 * Calculate WCAG contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  return chroma.contrast(color1, color2);
}

/**
 * Check if contrast meets WCAG AA standard (4.5:1 for normal text)
 */
export function meetsWCAGAA(color1: string, color2: string): boolean {
  return getContrastRatio(color1, color2) >= 4.5;
}

/**
 * Check if contrast meets WCAG AAA standard (7:1 for normal text)
 */
export function meetsWCAGAAA(color1: string, color2: string): boolean {
  return getContrastRatio(color1, color2) >= 7;
}

/**
 * Find best contrasting color (black or white) for a given background
 */
export function getBestTextColor(backgroundColor: string): string {
  const contrastWithWhite = getContrastRatio(backgroundColor, '#ffffff');
  const contrastWithBlack = getContrastRatio(backgroundColor, '#000000');

  return contrastWithWhite > contrastWithBlack ? '#ffffff' : '#000000';
}

/**
 * Generate complementary color palette
 */
export function generateComplementary(baseColor: ColorInfo): ColorInfo[] {
  const base = chroma(baseColor.hex);
  const complement = base.set('hsl.h', '+180');

  return [
    baseColor,
    rgbToColorInfo(complement.rgb() as [number, number, number]),
  ];
}

/**
 * Generate analogous color palette
 */
export function generateAnalogous(baseColor: ColorInfo): ColorInfo[] {
  const base = chroma(baseColor.hex);

  return [
    rgbToColorInfo(base.set('hsl.h', '-30').rgb() as [number, number, number]),
    baseColor,
    rgbToColorInfo(base.set('hsl.h', '+30').rgb() as [number, number, number]),
  ];
}

/**
 * Generate triadic color palette
 */
export function generateTriadic(baseColor: ColorInfo): ColorInfo[] {
  const base = chroma(baseColor.hex);

  return [
    baseColor,
    rgbToColorInfo(base.set('hsl.h', '+120').rgb() as [number, number, number]),
    rgbToColorInfo(base.set('hsl.h', '+240').rgb() as [number, number, number]),
  ];
}

/**
 * Generate monochromatic color palette
 */
export function generateMonochromatic(baseColor: ColorInfo): ColorInfo[] {
  const base = chroma(baseColor.hex);

  return [
    rgbToColorInfo(base.set('hsl.l', 0.2).rgb() as [number, number, number]),
    rgbToColorInfo(base.set('hsl.l', 0.4).rgb() as [number, number, number]),
    baseColor,
    rgbToColorInfo(base.set('hsl.l', 0.7).rgb() as [number, number, number]),
    rgbToColorInfo(base.set('hsl.l', 0.9).rgb() as [number, number, number]),
  ];
}

/**
 * Generate split-complementary color palette
 */
export function generateSplitComplementary(baseColor: ColorInfo): ColorInfo[] {
  const base = chroma(baseColor.hex);

  return [
    baseColor,
    rgbToColorInfo(base.set('hsl.h', '+150').rgb() as [number, number, number]),
    rgbToColorInfo(base.set('hsl.h', '+210').rgb() as [number, number, number]),
  ];
}

/**
 * Evaluate palette quality based on contrast and visual balance
 */
export function evaluatePalette(colors: ColorInfo[]): { score: number; issues: string[]; reason: string } {
  let score = 100;
  const issues: string[] = [];
  const reasons: string[] = [];

  // Check if we have enough color variety
  const lightnessValues = colors.map(c => c.hsl.l);
  const lightnessRange = Math.max(...lightnessValues) - Math.min(...lightnessValues);

  if (lightnessRange < 30) {
    score -= 20;
    issues.push('Limited lightness range - may lack visual hierarchy');
  } else {
    reasons.push('Good lightness range for visual hierarchy');
  }

  // Check for good contrast combinations
  let goodContrastPairs = 0;
  let totalPairs = 0;

  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      totalPairs++;
      if (meetsWCAGAA(colors[i].hex, colors[j].hex)) {
        goodContrastPairs++;
      }
    }
  }

  const contrastRatio = totalPairs > 0 ? goodContrastPairs / totalPairs : 0;

  if (contrastRatio < 0.3) {
    score -= 30;
    issues.push('Poor contrast - many color pairs fail WCAG AA');
  } else if (contrastRatio < 0.5) {
    score -= 15;
    issues.push('Moderate contrast - some pairs may be hard to read');
  } else {
    reasons.push(`Excellent contrast (${Math.round(contrastRatio * 100)}% of pairs meet WCAG AA)`);
  }

  // Check saturation balance
  const saturations = colors.map(c => c.hsl.s);
  const avgSaturation = saturations.reduce((a, b) => a + b, 0) / saturations.length;

  if (avgSaturation < 20) {
    score -= 10;
    issues.push('Low saturation - colors may appear dull');
  } else if (avgSaturation > 80) {
    score -= 10;
    issues.push('Very high saturation - may be overwhelming');
  } else {
    reasons.push('Balanced saturation levels');
  }

  const reason = reasons.length > 0 ? reasons.join(', ') : 'Standard color harmony';

  return { score: Math.max(0, score), issues, reason };
}

/**
 * Generate all palette types from extracted colors
 */
export function generateAllPalettes(extractedColors: ColorInfo[]): Palette[] {
  const palettes: Palette[] = [];

  if (extractedColors.length === 0) return palettes;

  const primary = extractedColors[0];

  // Complementary
  const complementaryColors = generateComplementary(primary);
  const complementaryEval = evaluatePalette(complementaryColors);
  palettes.push({
    id: 'complementary',
    name: 'Complementary',
    type: 'complementary',
    colors: complementaryColors,
    score: complementaryEval.score,
    reason: complementaryEval.reason,
    contrastIssues: complementaryEval.issues,
  });

  // Analogous
  const analogousColors = generateAnalogous(primary);
  const analogousEval = evaluatePalette(analogousColors);
  palettes.push({
    id: 'analogous',
    name: 'Analogous',
    type: 'analogous',
    colors: analogousColors,
    score: analogousEval.score,
    reason: analogousEval.reason,
    contrastIssues: analogousEval.issues,
  });

  // Triadic
  const triadicColors = generateTriadic(primary);
  const triadicEval = evaluatePalette(triadicColors);
  palettes.push({
    id: 'triadic',
    name: 'Triadic',
    type: 'triadic',
    colors: triadicColors,
    score: triadicEval.score,
    reason: triadicEval.reason,
    contrastIssues: triadicEval.issues,
  });

  // Monochromatic
  const monochromaticColors = generateMonochromatic(primary);
  const monochromaticEval = evaluatePalette(monochromaticColors);
  palettes.push({
    id: 'monochromatic',
    name: 'Monochromatic',
    type: 'monochromatic',
    colors: monochromaticColors,
    score: monochromaticEval.score,
    reason: monochromaticEval.reason,
    contrastIssues: monochromaticEval.issues,
  });

  // Split Complementary
  const splitComplementaryColors = generateSplitComplementary(primary);
  const splitComplementaryEval = evaluatePalette(splitComplementaryColors);
  palettes.push({
    id: 'split-complementary',
    name: 'Split Complementary',
    type: 'split-complementary',
    colors: splitComplementaryColors,
    score: splitComplementaryEval.score,
    reason: splitComplementaryEval.reason,
    contrastIssues: splitComplementaryEval.issues,
  });

  // Sort by score (highest first)
  return palettes.sort((a, b) => b.score - a.score);
}

/**
 * Export palette to various formats
 */
export function exportPalette(palette: Palette, format: 'json' | 'css' | 'tailwind'): string {
  switch (format) {
    case 'json':
      return JSON.stringify({
        name: palette.name,
        type: palette.type,
        colors: palette.colors.map(c => ({
          hex: c.hex,
          rgb: c.rgb,
          hsl: c.hsl,
        })),
      }, null, 2);

    case 'css':
      return `:root {\n${palette.colors.map((c, i) =>
        `  --color-${palette.type}-${i + 1}: ${c.hex};`
      ).join('\n')}\n}`;

    case 'tailwind':
      return `module.exports = {
  theme: {
    extend: {
      colors: {
        '${palette.type}': {
${palette.colors.map((c, i) => `          ${(i + 1) * 100}: '${c.hex}',`).join('\n')}
        },
      },
    },
  },
}`;

    default:
      return '';
  }
}
