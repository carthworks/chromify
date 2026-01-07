'use client';

import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { ColorInfo, rgbToColorInfo } from '@/lib/colorUtils';
import { getDescriptiveColorName } from '@/lib/colorNaming';
import { X, Edit2 } from 'lucide-react';

interface ColorEditorProps {
    color: ColorInfo;
    onColorChange: (newColor: ColorInfo) => void;
    onClose: () => void;
}

export default function ColorEditor({ color, onColorChange, onClose }: ColorEditorProps) {
    const [currentColor, setCurrentColor] = useState(color.hex);

    const handleColorChange = (hex: string) => {
        setCurrentColor(hex);

        // Convert hex to RGB
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);

        const newColor = rgbToColorInfo([r, g, b]);
        onColorChange(newColor);
    };

    const colorName = getDescriptiveColorName(currentColor, color.hsl);

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="glass-strong rounded-xl p-6 max-w-md w-full animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Edit2 className="w-5 h-5 text-indigo-400" />
                        <h3 className="text-xl font-bold">Edit Color</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Color Name */}
                <div className="mb-4 p-3 glass rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Color Name</p>
                    <p className="text-lg font-semibold">{colorName}</p>
                </div>

                {/* Color Picker */}
                <div className="mb-4">
                    <HexColorPicker color={currentColor} onChange={handleColorChange} className="w-full" />
                </div>

                {/* Color Preview */}
                <div className="mb-4">
                    <div
                        className="w-full h-24 rounded-lg border-2 border-white/20"
                        style={{ backgroundColor: currentColor }}
                    />
                </div>

                {/* Color Values */}
                <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between p-2 glass rounded-lg">
                        <span className="text-sm text-gray-400">HEX</span>
                        <span className="font-mono font-semibold">{currentColor}</span>
                    </div>
                    <div className="flex items-center justify-between p-2 glass rounded-lg">
                        <span className="text-sm text-gray-400">RGB</span>
                        <span className="font-mono text-sm">
                            {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                        </span>
                    </div>
                    <div className="flex items-center justify-between p-2 glass rounded-lg">
                        <span className="text-sm text-gray-400">HSL</span>
                        <span className="font-mono text-sm">
                            {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 glass rounded-lg hover:glass-strong transition-all"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onClose}
                        className="flex-1 btn-primary"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
