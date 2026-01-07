import chroma from 'chroma-js';
import { ColorInfo } from './colorUtils';

export interface Gradient {
    id: string;
    name: string;
    type: 'linear' | 'radial';
    colors: ColorInfo[];
    css: string;
    angle?: number;
}

/**
 * Generate linear gradient from colors
 */
export function generateLinearGradient(
    colors: ColorInfo[],
    angle: number = 90
): Gradient {
    const colorStops = colors.map(c => c.hex).join(', ');
    const css = `linear-gradient(${angle}deg, ${colorStops})`;

    return {
        id: `linear-${angle}-${Date.now()}`,
        name: `Linear Gradient (${angle}°)`,
        type: 'linear',
        colors,
        css,
        angle,
    };
}

/**
 * Generate radial gradient from colors
 */
export function generateRadialGradient(colors: ColorInfo[]): Gradient {
    const colorStops = colors.map(c => c.hex).join(', ');
    const css = `radial-gradient(circle, ${colorStops})`;

    return {
        id: `radial-${Date.now()}`,
        name: 'Radial Gradient',
        type: 'radial',
        colors,
        css,
    };
}

/**
 * Generate smooth gradient with interpolated colors
 */
export function generateSmoothGradient(
    startColor: ColorInfo,
    endColor: ColorInfo,
    steps: number = 5
): ColorInfo[] {
    const scale = chroma.scale([startColor.hex, endColor.hex]).colors(steps);

    return scale.map(hex => {
        const color = chroma(hex);
        const [h, s, l] = color.hsl();
        const [r, g, b] = color.rgb();

        return {
            hex: color.hex(),
            rgb: { r: Math.round(r), g: Math.round(g), b: Math.round(b) },
            hsl: {
                h: isNaN(h) ? 0 : Math.round(h),
                s: isNaN(s) ? 0 : Math.round(s * 100),
                l: Math.round(l * 100),
            },
        };
    });
}

/**
 * Generate all gradient variations from palette
 */
export function generateAllGradients(colors: ColorInfo[]): Gradient[] {
    if (colors.length < 2) return [];

    const gradients: Gradient[] = [];

    // Linear gradients at different angles
    const angles = [0, 45, 90, 135, 180];
    angles.forEach(angle => {
        gradients.push(generateLinearGradient(colors, angle));
    });

    // Radial gradient
    gradients.push(generateRadialGradient(colors));

    // Two-color smooth gradients
    if (colors.length >= 2) {
        const smoothColors = generateSmoothGradient(colors[0], colors[1], 5);
        gradients.push(generateLinearGradient(smoothColors, 90));
    }

    return gradients;
}

/**
 * Export gradient to CSS
 */
export function exportGradientCSS(gradient: Gradient): string {
    return `.gradient-${gradient.id} {
  background: ${gradient.css};
}`;
}

/**
 * Export gradient to Tailwind
 */
export function exportGradientTailwind(gradient: Gradient): string {
    const colorStops = gradient.colors
        .map((c, i) => `'${c.hex}'`)
        .join(', ');

    return `// Add to tailwind.config.js
backgroundImage: {
  'gradient-${gradient.id}': 'linear-gradient(${gradient.angle || 90}deg, ${colorStops})',
}`;
}
