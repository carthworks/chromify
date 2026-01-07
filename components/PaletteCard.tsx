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
        ${isBest ? 'ring-2 ring-yellow-500 shadow-2xl shadow-yellow-500/20' : ''}
      `}
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-xl font-bold text-white">{palette.name}</h3>
                        {isBest && (
                            <div className="flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
                                <Award className="w-4 h-4 text-yellow-400" />
                                <span className="text-xs font-semibold text-yellow-400">BEST MATCH</span>
                            </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-400">{palette.reason}</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-indigo-500/20 rounded-full">
                        <span className="text-sm font-semibold text-indigo-400">
                            Score: {palette.score}
                        </span>
                    </div>
                </div>
            </div>

            {/* Color Swatches */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
                {palette.colors.map((color, index) => (
                    <ColorCard key={index} color={color} size="small" />
                ))}
            </div>

            {/* UI Preview */}
            <div className="mb-4">
                <h4 className="text-sm font-semibold text-gray-400 mb-2">UI Preview</h4>
                <PalettePreview palette={palette} />
            </div>

            {/* Contrast Issues */}
            {palette.contrastIssues.length > 0 && (
                <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
                    <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-yellow-300">
                            <p className="font-semibold mb-1">Accessibility Notes:</p>
                            <ul className="list-disc list-inside space-y-1">
                                {palette.contrastIssues.map((issue, index) => (
                                    <li key={index}>{issue}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Options */}
            <div className="flex flex-wrap gap-2">
                <button
                    onClick={() => onExport(palette, 'json')}
                    className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm
                   hover:glass-strong transition-all duration-300 hover:scale-105"
                >
                    <Download className="w-4 h-4" />
                    JSON
                </button>
                <button
                    onClick={() => onExport(palette, 'css')}
                    className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm
                   hover:glass-strong transition-all duration-300 hover:scale-105"
                >
                    <Download className="w-4 h-4" />
                    CSS
                </button>
                <button
                    onClick={() => onExport(palette, 'tailwind')}
                    className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm
                   hover:glass-strong transition-all duration-300 hover:scale-105"
                >
                    <Download className="w-4 h-4" />
                    Tailwind
                </button>
                <button
                    onClick={() => onExport(palette, 'png')}
                    className="flex items-center gap-2 px-4 py-2 glass rounded-lg text-sm
                   hover:glass-strong transition-all duration-300 hover:scale-105"
                >
                    <Download className="w-4 h-4" />
                    PNG
                </button>
            </div>
        </div>
    );
}
