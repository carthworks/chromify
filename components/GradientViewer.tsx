'use client';

import { Gradient } from '@/lib/gradientGenerator';
import { Download, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface GradientViewerProps {
    gradients: Gradient[];
    onExport: (gradient: Gradient, format: 'css' | 'tailwind') => void;
}

export default function GradientViewer({ gradients, onExport }: GradientViewerProps) {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const copyCSS = (gradient: Gradient) => {
        navigator.clipboard.writeText(gradient.css);
        setCopiedId(gradient.id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (gradients.length === 0) return null;

    return (
        <div className="glass rounded-xl p-4 animate-fade-in">
            <h3 className="text-lg font-semibold mb-3">Generated Gradients</h3>

            <div className="space-y-3">
                {gradients.map((gradient) => (
                    <div key={gradient.id} className="glass rounded-lg p-3">
                        {/* Gradient Preview */}
                        <div
                            className="w-full h-24 rounded-lg mb-2 border border-white/10"
                            style={{ background: gradient.css }}
                        />

                        {/* Gradient Info */}
                        <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold">{gradient.name}</span>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => copyCSS(gradient)}
                                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                    title="Copy CSS"
                                >
                                    {copiedId === gradient.id ? (
                                        <Check className="w-4 h-4 text-green-400" />
                                    ) : (
                                        <Copy className="w-4 h-4 text-gray-400" />
                                    )}
                                </button>
                                <button
                                    onClick={() => onExport(gradient, 'css')}
                                    className="p-1.5 hover:bg-white/10 rounded transition-colors"
                                    title="Download CSS"
                                >
                                    <Download className="w-4 h-4 text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* CSS Code */}
                        <div className="p-2 bg-black/30 rounded text-xs font-mono overflow-x-auto">
                            <code className="text-gray-300">{gradient.css}</code>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
