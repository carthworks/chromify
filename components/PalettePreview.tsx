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
            className="rounded-lg p-6 space-y-4 transition-all duration-300"
            style={{ backgroundColor: bg, color: bgText }}
        >
            {/* Headline */}
            <h2 className="text-2xl font-bold" style={{ color: bgText }}>
                Sample Headline
            </h2>

            {/* Body Text */}
            <p className="text-sm opacity-80" style={{ color: bgText }}>
                This is how your body text will look with this color palette.
                The contrast is automatically checked for readability.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3">
                <button
                    className="px-4 py-2 rounded-lg font-semibold transition-transform hover:scale-105"
                    style={{ backgroundColor: primary, color: primaryText }}
                >
                    Primary Button
                </button>
                <button
                    className="px-4 py-2 rounded-lg font-semibold transition-transform hover:scale-105"
                    style={{ backgroundColor: secondary, color: secondaryText }}
                >
                    Secondary
                </button>
                <button
                    className="px-4 py-2 rounded-lg font-semibold border-2 transition-transform hover:scale-105"
                    style={{
                        borderColor: accent,
                        color: accent,
                        backgroundColor: 'transparent'
                    }}
                >
                    Outline
                </button>
            </div>

            {/* Card */}
            <div
                className="p-4 rounded-lg"
                style={{
                    backgroundColor: primaryText === '#ffffff' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                }}
            >
                <h3 className="font-semibold mb-2" style={{ color: bgText }}>
                    Card Component
                </h3>
                <p className="text-sm opacity-70" style={{ color: bgText }}>
                    This demonstrates how cards and containers will appear.
                </p>
            </div>
        </div>
    );
}
