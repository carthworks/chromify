'use client';

import { ColorInfo } from '@/lib/colorUtils';
import { getDescriptiveColorName } from '@/lib/colorNaming';
import { Copy, Check, Edit2 } from 'lucide-react';
import { useState } from 'react';

interface ColorCardProps {
    color: ColorInfo;
    size?: 'small' | 'medium' | 'large';
    onEdit?: () => void;
    showName?: boolean;
}

export default function ColorCard({ color, size = 'medium', onEdit, showName = true }: ColorCardProps) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const sizeClasses = {
        small: 'h-20',
        medium: 'h-32',
        large: 'h-48',
    };

    const colorName = getDescriptiveColorName(color.hex, color.hsl);

    return (
        <div className="glass rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div
                className={`w-full ${sizeClasses[size]} transition-all duration-300 relative`}
                style={{ backgroundColor: color.hex }}
            >
                {onEdit && (
                    <button
                        onClick={onEdit}
                        className="absolute top-2 right-2 p-1.5 bg-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                        title="Edit color"
                    >
                        <Edit2 className="w-3 h-3 text-white" />
                    </button>
                )}
            </div>

            <div className="p-4 space-y-2">
                {showName && (
                    <div className="mb-2">
                        <p className="text-xs font-semibold text-indigo-400">{colorName}</p>
                    </div>
                )}

                <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-white">{color.hex}</span>
                    <button
                        onClick={() => copyToClipboard(color.hex)}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors duration-200"
                        title="Copy HEX"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-400" />
                        ) : (
                            <Copy className="w-4 h-4 text-gray-400" />
                        )}
                    </button>
                </div>

                <div className="text-sm space-y-1 text-gray-400">
                    <div className="flex justify-between">
                        <span>RGB:</span>
                        <span className="font-mono">
                            {color.rgb.r}, {color.rgb.g}, {color.rgb.b}
                        </span>
                    </div>
                    <div className="flex justify-between">
                        <span>HSL:</span>
                        <span className="font-mono">
                            {color.hsl.h}°, {color.hsl.s}%, {color.hsl.l}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
