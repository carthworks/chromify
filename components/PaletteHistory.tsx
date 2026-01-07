'use client';

import { Palette } from '@/lib/colorUtils';
import { History, Trash2, Download } from 'lucide-react';

interface PaletteHistoryProps {
    savedPalettes: Palette[];
    onLoad: (palette: Palette) => void;
    onDelete: (paletteId: string) => void;
    onExport: (palette: Palette, format: 'json' | 'css' | 'tailwind' | 'png') => void;
}

export default function PaletteHistory({ savedPalettes, onLoad, onDelete, onExport }: PaletteHistoryProps) {
    if (savedPalettes.length === 0) {
        return null;
    }

    return (
        <div className="glass rounded-xl p-4 animate-fade-in">
            <div className="flex items-center gap-2 mb-3">
                <History className="w-5 h-5 text-purple-400" />
                <h3 className="text-lg font-semibold">Saved Palettes ({savedPalettes.length})</h3>
            </div>

            <div className="space-y-2 max-h-64 overflow-y-auto pr-2">
                {savedPalettes.map((palette) => (
                    <div
                        key={palette.id}
                        className="glass rounded-lg p-3 hover:glass-strong transition-all cursor-pointer group"
                        onClick={() => onLoad(palette)}
                    >
                        {/* Color Swatches */}
                        <div className="flex gap-1 mb-2">
                            {palette.colors.slice(0, 5).map((color, index) => (
                                <div
                                    key={index}
                                    className="flex-1 h-8 rounded border border-white/10"
                                    style={{ backgroundColor: color.hex }}
                                    title={color.hex}
                                />
                            ))}
                        </div>

                        {/* Palette Info */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-semibold">{palette.name}</p>
                                <p className="text-xs text-gray-400">Score: {palette.score}</p>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onExport(palette, 'json');
                                    }}
                                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                    title="Export"
                                >
                                    <Download className="w-3 h-3 text-gray-400" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onDelete(palette.id);
                                    }}
                                    className="p-1.5 hover:bg-red-500/20 rounded transition-colors"
                                    title="Delete"
                                >
                                    <Trash2 className="w-3 h-3 text-red-400" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {savedPalettes.length > 0 && (
                <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-gray-400 text-center">
                        Click on a palette to load it
                    </p>
                </div>
            )}
        </div>
    );
}
