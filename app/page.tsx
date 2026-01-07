'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Palette as PaletteIcon, Sparkles, BookOpen, Save, Zap } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import PaletteCard from '@/components/PaletteCard';
import ColorEditor from '@/components/ColorEditor';
import GradientViewer from '@/components/GradientViewer';
import PaletteHistory from '@/components/PaletteHistory';
import { ColorInfo, Palette, rgbToColorInfo, removeDuplicates, generateAllPalettes, exportPalette } from '@/lib/colorUtils';
import { generateAllGradients, Gradient, exportGradientCSS, exportGradientTailwind } from '@/lib/gradientGenerator';
import { getDescriptiveColorName } from '@/lib/colorNaming';
import html2canvas from 'html2canvas';
import Link from 'next/link';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ColorInfo[]>([]);
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const [gradients, setGradients] = useState<Gradient[]>([]);
  const [savedPalettes, setSavedPalettes] = useState<Palette[]>([]);
  const [editingColorIndex, setEditingColorIndex] = useState<number | null>(null);
  const paletteRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Load saved palettes from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('chromify-palettes');
    if (saved) {
      try {
        setSavedPalettes(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to load saved palettes:', e);
      }
    }
  }, []);

  const extractColors = useCallback(async (dataUrl: string) => {
    setIsProcessing(true);

    try {
      // Create image element
      const img = new Image();
      img.src = dataUrl;

      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });

      // Create canvas and get image data
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');

      // Resize for faster processing
      const maxSize = 200;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;

      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const pixels = imageData.data;

      // Color quantization
      const colorMap = new Map<string, number>();

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        if (a < 128) continue;

        const qr = Math.round(r / 10) * 10;
        const qg = Math.round(g / 10) * 10;
        const qb = Math.round(b / 10) * 10;

        const key = `${qr},${qg},${qb}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([color]) => {
          const [r, g, b] = color.split(',').map(Number);
          return [r, g, b] as [number, number, number];
        });

      const uniqueColors = removeDuplicates(sortedColors, 50);
      const colorInfos = uniqueColors.slice(0, 5).map(rgb => rgbToColorInfo(rgb));

      setExtractedColors(colorInfos);

      // Generate palettes
      const generatedPalettes = generateAllPalettes(colorInfos);
      setPalettes(generatedPalettes);

      // Generate gradients
      const generatedGradients = generateAllGradients(colorInfos);
      setGradients(generatedGradients);

    } catch (error) {
      console.error('Error extracting colors:', error);
      alert('Failed to extract colors from image. Please try another image.');
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const handleImageUpload = useCallback((file: File, dataUrl: string) => {
    setUploadedImage(dataUrl);
    extractColors(dataUrl);
  }, [extractColors]);

  const handleExport = useCallback(async (palette: Palette, format: 'json' | 'css' | 'tailwind' | 'png') => {
    if (format === 'png') {
      const paletteElement = paletteRefs.current[palette.id];
      if (!paletteElement) {
        alert('Palette element not found. Please try again.');
        return;
      }

      try {
        // Clone the element to avoid modifying the original
        const clone = paletteElement.cloneNode(true) as HTMLElement;
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        clone.style.top = '0';
        clone.style.width = paletteElement.offsetWidth + 'px';
        document.body.appendChild(clone);

        // Remove problematic Tailwind classes and replace with inline styles
        const removeProblematicClasses = (element: HTMLElement) => {
          // Get computed styles before removing classes
          const computedStyle = window.getComputedStyle(element);

          // Remove all Tailwind utility classes that might use oklab
          const classList = element.classList;
          const classesToRemove: string[] = [];

          classList.forEach((className) => {
            // Remove classes that might use color functions
            if (className.includes('shadow') ||
              className.includes('ring') ||
              className.includes('border') ||
              className.includes('bg-') ||
              className.includes('text-')) {
              classesToRemove.push(className);
            }
          });

          classesToRemove.forEach(c => classList.remove(c));

          // Apply essential inline styles
          element.style.backgroundColor = computedStyle.backgroundColor;
          element.style.color = computedStyle.color;
          element.style.padding = computedStyle.padding;
          element.style.margin = computedStyle.margin;
          element.style.borderRadius = computedStyle.borderRadius;

          // Remove SVG elements as they cause LAB color issues
          const svgs = element.querySelectorAll('svg');
          svgs.forEach(svg => svg.remove());

          // Recursively process children
          Array.from(element.children).forEach(child => {
            if (child instanceof HTMLElement) {
              removeProblematicClasses(child);
            }
          });
        };

        removeProblematicClasses(clone);

        // Use html2canvas on the cleaned clone
        const canvas = await html2canvas(clone, {
          backgroundColor: '#0a0a0a',
          scale: 2,
          logging: false,
          useCORS: true,
          allowTaint: true,
        });

        // Remove clone
        document.body.removeChild(clone);

        canvas.toBlob((blob) => {
          if (!blob) {
            alert('Failed to create image. Please try again.');
            return;
          }

          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.download = `${palette.name.toLowerCase().replace(/\s+/g, '-')}-palette.png`;
          link.href = url;
          link.click();
          URL.revokeObjectURL(url);
        }, 'image/png');
      } catch (error) {
        console.error('Failed to export PNG:', error);
        alert('Failed to export PNG. Try exporting as JSON, CSS, or Tailwind instead.');
      }
    } else {
      const content = exportPalette(palette, format);
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      const extension = format === 'tailwind' ? 'js' : format;
      link.download = `${palette.name.toLowerCase().replace(/\s+/g, '-')}.${extension}`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  const handleGradientExport = useCallback((gradient: Gradient, format: 'css' | 'tailwind') => {
    const content = format === 'css' ? exportGradientCSS(gradient) : exportGradientTailwind(gradient);
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `gradient-${gradient.id}.${format === 'css' ? 'css' : 'js'}`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleSavePalette = useCallback((palette: Palette) => {
    const updated = [...savedPalettes, { ...palette, id: `saved-${Date.now()}` }];
    setSavedPalettes(updated);
    localStorage.setItem('chromify-palettes', JSON.stringify(updated));
  }, [savedPalettes]);

  const handleDeletePalette = useCallback((paletteId: string) => {
    const updated = savedPalettes.filter(p => p.id !== paletteId);
    setSavedPalettes(updated);
    localStorage.setItem('chromify-palettes', JSON.stringify(updated));
  }, [savedPalettes]);

  const handleLoadPalette = useCallback((palette: Palette) => {
    setPalettes([palette, ...palettes.filter(p => p.id !== palette.id)]);
  }, [palettes]);

  const handleColorEdit = useCallback((index: number, newColor: ColorInfo) => {
    const updatedColors = [...extractedColors];
    updatedColors[index] = newColor;
    setExtractedColors(updatedColors);

    // Regenerate palettes and gradients
    const generatedPalettes = generateAllPalettes(updatedColors);
    setPalettes(generatedPalettes);

    const generatedGradients = generateAllGradients(updatedColors);
    setGradients(generatedGradients);
  }, [extractedColors]);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="glass-strong sticky top-0 z-50 border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg">
                <PaletteIcon className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold gradient-text">Chromify</h1>
              <div className="hidden md:flex items-center gap-1 px-2 py-1 bg-yellow-500/20 rounded-full">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-xs font-semibold text-yellow-400">AI Enhanced</span>
              </div>
            </div>

            <Link
              href="/how-to"
              className="flex items-center gap-2 px-4 py-2 glass rounded-lg hover:glass-strong transition-all duration-300"
            >
              <BookOpen className="w-4 h-4" />
              <span>How to Use</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content - Split Layout */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Left Side - Image Upload and Preview */}
          <div className="space-y-6">
            <div className="text-center lg:text-left animate-fade-in">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">
                <span className="gradient-text">Transform Images</span>
                <br />
                into Color Palettes
              </h2>
              <p className="text-lg text-gray-400">
                AI-powered color extraction with smart naming, live editing, and gradient generation.
              </p>
            </div>

            {/* Upload Section */}
            <ImageUpload onImageUpload={handleImageUpload} />

            {/* Uploaded Image Preview */}
            {uploadedImage && (
              <div className="glass rounded-xl p-4 animate-fade-in">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Uploaded Image
                </h3>
                <img
                  src={uploadedImage}
                  alt="Uploaded"
                  className="w-full rounded-lg"
                />
              </div>
            )}

            {/* Palette History */}
            {savedPalettes.length > 0 && (
              <PaletteHistory
                savedPalettes={savedPalettes}
                onLoad={handleLoadPalette}
                onDelete={handleDeletePalette}
                onExport={handleExport}
              />
            )}
          </div>

          {/* Right Side - Color Management */}
          <div className="space-y-6">
            {/* Loading State */}
            {isProcessing && (
              <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
                <div className="spinner mb-4"></div>
                <p className="text-gray-400">Extracting colors with AI...</p>
              </div>
            )}

            {/* Extracted Colors with Names */}
            {extractedColors.length > 0 && !isProcessing && (
              <div className="glass rounded-xl p-4 animate-fade-in">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Extracted Colors
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {extractedColors.map((color, index) => (
                    <div key={index} className="text-center group">
                      <div
                        className="w-full h-16 rounded-lg mb-1 border border-white/10 hover:scale-110 transition-transform duration-300 cursor-pointer relative"
                        style={{ backgroundColor: color.hex }}
                        title={`${getDescriptiveColorName(color.hex, color.hsl)}\n${color.hex}`}
                        onClick={() => setEditingColorIndex(index)}
                      >
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 rounded-lg">
                          <span className="text-xs text-white">Edit</span>
                        </div>
                      </div>
                      <p className="font-mono text-xs mb-1">{color.hex}</p>
                      <p className="text-xs text-gray-400 truncate">
                        {getDescriptiveColorName(color.hex, color.hsl)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Gradients */}
            {gradients.length > 0 && (
              <GradientViewer
                gradients={gradients.slice(0, 3)}
                onExport={handleGradientExport}
              />
            )}

            {/* Generated Palettes */}
            {palettes.length > 0 && (
              <div className="space-y-4 animate-fade-in">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold">Generated Palettes</h3>
                  {palettes.length > 0 && (
                    <button
                      onClick={() => handleSavePalette(palettes[0])}
                      className="flex items-center gap-1 px-3 py-1.5 glass rounded-lg text-xs hover:glass-strong transition-all"
                    >
                      <Save className="w-3 h-3" />
                      Save Best
                    </button>
                  )}
                </div>
                <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                  {palettes.map((palette, index) => (
                    <div
                      key={palette.id}
                      ref={(el) => { paletteRefs.current[palette.id] = el; }}
                    >
                      <PaletteCard
                        palette={palette}
                        isBest={index === 0}
                        onExport={handleExport}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Empty State */}
            {!isProcessing && extractedColors.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <div className="inline-block p-6 glass rounded-full mb-4">
                  <PaletteIcon className="w-12 h-12 text-indigo-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Ready to Get Started?</h3>
                <p className="text-gray-400 mb-4">
                  Upload an image to extract colors and generate palettes.
                </p>
                <div className="flex flex-wrap gap-2 justify-center text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Zap className="w-4 h-4" />
                    <span>AI Color Naming</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    <span>Live Editing</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Save className="w-4 h-4" />
                    <span>Palette History</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Color Editor Modal */}
      {editingColorIndex !== null && (
        <ColorEditor
          color={extractedColors[editingColorIndex]}
          onColorChange={(newColor) => handleColorEdit(editingColorIndex, newColor)}
          onClose={() => setEditingColorIndex(null)}
        />
      )}

      {/* Footer */}
      <footer className="glass-strong border-t border-white/10 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>Built with Next.js, TailwindCSS, and Chroma.js • AI-Enhanced Color Intelligence</p>
            <p className="mt-1">© 2026 Chromify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
