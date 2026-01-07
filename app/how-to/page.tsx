'use client';

import Link from 'next/link';
import { ArrowLeft, Upload, Palette, Download, Eye, Sparkles, CheckCircle } from 'lucide-react';

export default function HowToPage() {
    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass-strong sticky top-0 z-50 border-b border-white/10">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/"
                            className="p-2 glass rounded-lg hover:glass-strong transition-all duration-300"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-bold gradient-text">How to Use Chromify</h1>
                    </div>
                </div>
            </header>

            {/* Content */}
            <div className="container mx-auto px-4 py-12 max-w-4xl">
                {/* Introduction */}
                <section className="mb-12 animate-fade-in">
                    <div className="glass rounded-xl p-8">
                        <h2 className="text-3xl font-bold mb-4">Welcome to Chromify! 🎨</h2>
                        <p className="text-lg text-gray-300 leading-relaxed">
                            Chromify is a powerful tool that transforms any image into beautiful,
                            accessible color palettes. Whether you're a designer, developer, or
                            creative professional, Chromify helps you extract colors and generate
                            harmonious color schemes instantly.
                        </p>
                    </div>
                </section>

                {/* Steps */}
                <section className="space-y-6">
                    <h3 className="text-2xl font-bold mb-6">Getting Started</h3>

                    {/* Step 1 */}
                    <div className="card animate-slide-in">
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-indigo-500/20 rounded-lg flex-shrink-0">
                                <Upload className="w-6 h-6 text-indigo-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-2">Step 1: Upload Your Image</h4>
                                <p className="text-gray-300 mb-3">
                                    Click the upload area or drag and drop an image file. Chromify supports:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                                    <li>JPG/JPEG files</li>
                                    <li>PNG files (including transparent backgrounds)</li>
                                    <li>WebP files</li>
                                    <li>Maximum file size: 10MB</li>
                                </ul>
                                <div className="mt-4 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                                    <p className="text-sm text-blue-300">
                                        <strong>💡 Tip:</strong> Images with distinct colors work best.
                                        Try photos of nature, artwork, or brand materials.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 */}
                    <div className="card animate-slide-in" style={{ animationDelay: '0.1s' }}>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-lg flex-shrink-0">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-2">Step 2: Color Extraction</h4>
                                <p className="text-gray-300 mb-3">
                                    Chromify automatically analyzes your image and extracts the dominant colors:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                                    <li>Identifies primary, secondary, and accent colors</li>
                                    <li>Removes near-duplicate shades for cleaner palettes</li>
                                    <li>Displays colors in HEX, RGB, and HSL formats</li>
                                    <li>Processing happens instantly in your browser</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 */}
                    <div className="card animate-slide-in" style={{ animationDelay: '0.2s' }}>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-pink-500/20 rounded-lg flex-shrink-0">
                                <Palette className="w-6 h-6 text-pink-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-2">Step 3: Explore Generated Palettes</h4>
                                <p className="text-gray-300 mb-3">
                                    Chromify generates five different palette types based on color theory:
                                </p>
                                <div className="space-y-3 ml-4">
                                    <div className="p-3 glass rounded-lg">
                                        <h5 className="font-semibold text-indigo-400 mb-1">Complementary</h5>
                                        <p className="text-sm text-gray-400">
                                            Colors opposite on the color wheel - creates high contrast and vibrant looks
                                        </p>
                                    </div>
                                    <div className="p-3 glass rounded-lg">
                                        <h5 className="font-semibold text-purple-400 mb-1">Analogous</h5>
                                        <p className="text-sm text-gray-400">
                                            Colors next to each other - creates harmonious, cohesive designs
                                        </p>
                                    </div>
                                    <div className="p-3 glass rounded-lg">
                                        <h5 className="font-semibold text-pink-400 mb-1">Triadic</h5>
                                        <p className="text-sm text-gray-400">
                                            Three colors evenly spaced - balanced and vibrant
                                        </p>
                                    </div>
                                    <div className="p-3 glass rounded-lg">
                                        <h5 className="font-semibold text-cyan-400 mb-1">Monochromatic</h5>
                                        <p className="text-sm text-gray-400">
                                            Variations of a single hue - sophisticated and elegant
                                        </p>
                                    </div>
                                    <div className="p-3 glass rounded-lg">
                                        <h5 className="font-semibold text-yellow-400 mb-1">Split Complementary</h5>
                                        <p className="text-sm text-gray-400">
                                            Base color plus two adjacent to its complement - balanced contrast
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 4 */}
                    <div className="card animate-slide-in" style={{ animationDelay: '0.3s' }}>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-green-500/20 rounded-lg flex-shrink-0">
                                <Eye className="w-6 h-6 text-green-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-2">Step 4: Preview & Evaluate</h4>
                                <p className="text-gray-300 mb-3">
                                    Each palette includes:
                                </p>
                                <ul className="list-disc list-inside space-y-1 text-gray-400 ml-4">
                                    <li><strong>UI Preview:</strong> See how colors look on real components (buttons, cards, text)</li>
                                    <li><strong>Quality Score:</strong> Ranked by readability, contrast, and visual balance</li>
                                    <li><strong>Best Match Badge:</strong> Top-ranked palette clearly marked</li>
                                    <li><strong>WCAG Compliance:</strong> Automatic contrast checking for accessibility</li>
                                    <li><strong>Accessibility Warnings:</strong> Flagged issues with recommendations</li>
                                </ul>
                                <div className="mt-4 p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                                    <p className="text-sm text-green-300">
                                        <strong>✓ Accessibility First:</strong> All palettes are evaluated against
                                        WCAG AA standards (4.5:1 contrast ratio for normal text).
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Step 5 */}
                    <div className="card animate-slide-in" style={{ animationDelay: '0.4s' }}>
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-yellow-500/20 rounded-lg flex-shrink-0">
                                <Download className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <h4 className="text-xl font-bold mb-2">Step 5: Export Your Palette</h4>
                                <p className="text-gray-300 mb-3">
                                    Export in multiple formats for your workflow:
                                </p>
                                <div className="space-y-2 ml-4">
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-white">JSON:</strong>
                                            <span className="text-gray-400"> Design tokens with HEX, RGB, and HSL values</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-white">CSS Variables:</strong>
                                            <span className="text-gray-400"> Ready-to-use CSS custom properties</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-white">Tailwind Config:</strong>
                                            <span className="text-gray-400"> Drop into your tailwind.config.js</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <CheckCircle className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <strong className="text-white">PNG Image:</strong>
                                            <span className="text-gray-400"> Visual color sheet for presentations</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tips & Best Practices */}
                <section className="mt-12 animate-fade-in">
                    <h3 className="text-2xl font-bold mb-6">Tips & Best Practices</h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="glass rounded-lg p-6">
                            <h4 className="font-bold text-indigo-400 mb-2">🎯 Choose the Right Image</h4>
                            <p className="text-sm text-gray-400">
                                Images with 3-5 distinct colors work best. Avoid overly complex or
                                monochromatic images for better palette variety.
                            </p>
                        </div>

                        <div className="glass rounded-lg p-6">
                            <h4 className="font-bold text-purple-400 mb-2">♿ Check Accessibility</h4>
                            <p className="text-sm text-gray-400">
                                Always review the accessibility warnings. Use the UI preview to test
                                readability before implementing in your project.
                            </p>
                        </div>

                        <div className="glass rounded-lg p-6">
                            <h4 className="font-bold text-pink-400 mb-2">🎨 Experiment with Types</h4>
                            <p className="text-sm text-gray-400">
                                Try different palette types for different moods. Monochromatic for
                                elegance, triadic for energy, analogous for harmony.
                            </p>
                        </div>

                        <div className="glass rounded-lg p-6">
                            <h4 className="font-bold text-cyan-400 mb-2">💾 Save Your Favorites</h4>
                            <p className="text-sm text-gray-400">
                                Export palettes you like immediately. All processing happens locally,
                                so refreshing the page will clear your results.
                            </p>
                        </div>
                    </div>
                </section>

                {/* CTA */}
                <section className="mt-12 text-center animate-fade-in">
                    <div className="glass rounded-xl p-8">
                        <h3 className="text-2xl font-bold mb-4">Ready to Create?</h3>
                        <p className="text-gray-300 mb-6">
                            Start generating beautiful color palettes from your images now!
                        </p>
                        <Link
                            href="/"
                            className="btn-primary inline-flex items-center gap-2"
                        >
                            <Palette className="w-5 h-5" />
                            Start Creating
                        </Link>
                    </div>
                </section>
            </div>

            {/* Footer */}
            <footer className="glass-strong border-t border-white/10 mt-20">
                <div className="container mx-auto px-4 py-8">
                    <div className="text-center text-gray-400 text-sm">
                        <p>Built with Next.js, TailwindCSS, and Chroma.js</p>
                        <p className="mt-2">© 2026 Chromify. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
