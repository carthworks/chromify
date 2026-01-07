'use client';

import { ColorInfo } from '@/lib/colorUtils';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface ColorCardProps {
    color: ColorInfo;
    size?: 'small' | 'medium' | 'large';
}

export default function ColorCard({ color, size = 'medium' }: ColorCardProps) {
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

    return (
        <div className="glass rounded-lg overflow-hidden group hover:scale-105 transition-transform duration-300">
            <div
                className={`w-full ${sizeClasses[size]} transition-all duration-300`}
                style={{ backgroundColor: color.hex }}
            />

            <div className="p-4 space-y-2">
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
