import chroma from 'chroma-js';

// Basic color names mapped to hue ranges
const hueRanges = [
    { min: 0, max: 15, name: 'Red' },
    { min: 15, max: 45, name: 'Orange' },
    { min: 45, max: 70, name: 'Yellow' },
    { min: 70, max: 150, name: 'Green' },
    { min: 150, max: 200, name: 'Cyan' },
    { min: 200, max: 260, name: 'Blue' },
    { min: 260, max: 320, name: 'Purple' },
    { min: 320, max: 360, name: 'Pink' },
];

/**
 * Get a human-readable name for a color based on HSL values
 */
export function getColorName(hex: string): string {
    try {
        const color = chroma(hex);
        const [h, s, l] = color.hsl();

        // Handle grayscale colors
        if (isNaN(h) || s < 10) {
            if (l < 20) return 'Black';
            if (l < 40) return 'Dark Gray';
            if (l < 60) return 'Gray';
            if (l < 80) return 'Light Gray';
            return 'White';
        }

        // Find color name based on hue
        const hueNormalized = h % 360;
        for (const range of hueRanges) {
            if (hueNormalized >= range.min && hueNormalized < range.max) {
                return range.name;
            }
        }

        return 'Red'; // Fallback for 345-360 range
    } catch (error) {
        return 'Unknown';
    }
}

/**
 * Get descriptive color name with lightness and saturation modifiers
 */
export function getDescriptiveColorName(hex: string, hsl: { h: number; s: number; l: number }): string {
    const baseName = getColorName(hex);

    // Handle grayscale separately
    if (baseName.includes('Gray') || baseName === 'Black' || baseName === 'White') {
        return baseName;
    }

    const modifiers: string[] = [];

    // Add lightness modifiers
    if (hsl.l < 20) {
        modifiers.push('Very Dark');
    } else if (hsl.l < 40) {
        modifiers.push('Dark');
    } else if (hsl.l > 85) {
        modifiers.push('Very Light');
    } else if (hsl.l > 70) {
        modifiers.push('Light');
    }

    // Add saturation modifiers for mid-range lightness
    if (hsl.l >= 20 && hsl.l <= 70) {
        if (hsl.s < 20) {
            modifiers.push('Muted');
        } else if (hsl.s > 80) {
            modifiers.push('Vivid');
        }
    }

    return modifiers.length > 0 ? `${modifiers.join(' ')} ${baseName}` : baseName;
}
