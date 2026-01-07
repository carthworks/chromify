'use client';

import { Palette } from '@/lib/colorUtils';
import { Award, AlertTriangle, Download } from 'lucide-react';
import ColorCard from './ColorCard';
import PalettePreview from './PalettePreview';

interface PaletteCardProps {
    palette: Palette;
    isBest?: boolean;
    onExport: (palette: Palette, format: 'json' | 'css' | 'tailwind' | 'png') => void;
}

export default function PaletteCard({ palette, isBest, onExport }: PaletteCardProps) {
    return (
        <div
            className={`
        card animate-fade-in
        ${isBest ? 'ring-2 ring-yellow-500 shadow-xl shadow-yellow-500/20' : ''}
      `}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{palette.name}</h3>
                        {isBest && (
                            <div className="flex items-center gap-1 px-2 py-0.5 bg-yellow-500/20 rounded-full">
                                <Award className="w-3 h-3 text-yellow-400" />
                                <span className="text-xs font-semibold text-yellow-400">BEST</span>
                            </div>
                        )}
                    </div>
                    <p className="text-xs text-gray-400">{palette.reason}</p>
                </div>

                <div className="px-2 py-1 bg-indigo-500/20 rounded-full">
                    <span className="text-xs font-semibold text-indigo-400">
                        {palette.score}
                    </span>
                </div>
            </div>

            {/* Color Swatches - Compact */}
            <div className="grid grid-cols-5 gap-2 mb-3">
                {palette.colors.map((color, index) => (
                    <div key={index} className="text-center">
                        <div
                            className="w-full h-12 rounded-lg mb-1 border border-white/10 hover:scale-110 transition-transform duration-200 cursor-pointer"
                            style={{ backgroundColor: color.hex }}
                            title={`${color.hex}\nRGB: ${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b}\nHSL: ${color.hsl.h}°, ${color.hsl.s}%, ${color.hsl.l}%`}
                        />
                        <p className="font-mono text-xs">{color.hex}</p>
                    </div>
                ))}
            </div>

            {/* UI Preview - Compact */}
            <div className="mb-3">
                <PalettePreview palette={palette} />
            </div>

            {/* Contrast Issues - Compact */}
            {palette.contrastIssues.length > 0 && (
                <div className="mb-3 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-3 h-3 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="text-xs text-yellow-300">
                            <p className="font-semibold mb-1">Accessibility:</p>
                            <ul className="list-disc list-inside space-y-0.5">
                                {palette.contrastIssues.map((issue, index) => (
                                    <li key={index}>{issue}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Options - Compact */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onExport(palette, 'json')}
                    className="flex items-center gap-1 px-3 py-1.5 glass rounded-lg text-xs
                   hover:glass-strong transition-all duration-300 hover:scale-105"
                >
                    <Download className="w-3 h-3" />
                    JSON
                </button>
                <button
                    onClick={() => onExport(palette, 'css')}
                    className="flex items-center gap-1 px-3 py-1.5 glass rounded-lg text-xs
                   hover:glass-strong transition-all duration-300 hover:scale-105"
                >
                    <Download className="w-3 h-3" />
                    CSS
                </button>
                <button
                    onClick={() => onExport(palette, 'tailwind')}
                    className="flex items-center gap-1 px-3 py-1.5 glass rounded-lg text-xs
                   hover:glass-strong transition-all duration-300 hover:scale-105"
                >
                    <Download className="w-3 h-3" />
                    Tailwind
                </button>
                <button
                    onClick={() => onExport(palette, 'png')}
                    className="flex items-center gap-1 px-3 py-1.5 glass rounded-lg text-xs
                   hover:glass-strong transition-all duration-300 hover:scale-105"
                >
                    <Download className="w-3 h-3" />
                    PNG
                </button>
            </div>
        </div>
    );
}
