'use client';

import { Palette, getBestTextColor } from '@/lib/colorUtils';

interface PalettePreviewProps {
    palette: Palette;
}

export default function PalettePreview({ palette }: PalettePreviewProps) {
    const colors = palette.colors;
    const bg = colors[0]?.hex || '#000000';
    const primary = colors[1]?.hex || colors[0]?.hex || '#6366f1';
    const secondary = colors[2]?.hex || colors[1]?.hex || '#8b5cf6';
    const accent = colors[3]?.hex || colors[2]?.hex || '#ec4899';

    const bgText = getBestTextColor(bg);
    const primaryText = getBestTextColor(primary);
    const secondaryText = getBestTextColor(secondary);

    return (
        <div
            className="rounded-lg p-3 space-y-2 transition-all duration-300"
            style={{ backgroundColor: bg, color: bgText }}
        >
            {/* Headline */}
            <h2 className="text-sm font-bold" style={{ color: bgText }}>
                Sample Headline
            </h2>

            {/* Body Text */}
            <p className="text-xs opacity-80" style={{ color: bgText }}>
                Body text preview with this palette.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-2">
                <button
                    className="px-3 py-1 rounded text-xs font-semibold transition-transform hover:scale-105"
                    style={{ backgroundColor: primary, color: primaryText }}
                >
                    Primary
                </button>
                <button
                    className="px-3 py-1 rounded text-xs font-semibold transition-transform hover:scale-105"
                    style={{ backgroundColor: secondary, color: secondaryText }}
                >
                    Secondary
                </button>
                <button
                    className="px-3 py-1 rounded text-xs font-semibold border transition-transform hover:scale-105"
                    style={{
                        borderColor: accent,
                        color: accent,
                        backgroundColor: 'transparent'
                    }}
                >
                    Outline
                </button>
            </div>
        </div>
    );
}
