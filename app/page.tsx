'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Palette as PaletteIcon, Sparkles, Download, BookOpen } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';
import PaletteCard from '@/components/PaletteCard';
import { ColorInfo, Palette, rgbToColorInfo, removeDuplicates, generateAllPalettes, exportPalette } from '@/lib/colorUtils';
import html2canvas from 'html2canvas';
import Link from 'next/link';

export default function Home() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [extractedColors, setExtractedColors] = useState<ColorInfo[]>([]);
  const [palettes, setPalettes] = useState<Palette[]>([]);
  const paletteRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

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

      // Color quantization using median cut algorithm (simplified)
      const colorMap = new Map<string, number>();

      for (let i = 0; i < pixels.length; i += 4) {
        const r = pixels[i];
        const g = pixels[i + 1];
        const b = pixels[i + 2];
        const a = pixels[i + 3];

        // Skip transparent pixels
        if (a < 128) continue;

        // Quantize to reduce similar colors
        const qr = Math.round(r / 10) * 10;
        const qg = Math.round(g / 10) * 10;
        const qb = Math.round(b / 10) * 10;

        const key = `${qr},${qg},${qb}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }

      // Sort by frequency and get top colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 20)
        .map(([color]) => {
          const [r, g, b] = color.split(',').map(Number);
          return [r, g, b] as [number, number, number];
        });

      // Remove duplicates
      const uniqueColors = removeDuplicates(sortedColors, 50);

      // Convert to ColorInfo and take top 5
      const colorInfos = uniqueColors.slice(0, 5).map(rgb => rgbToColorInfo(rgb));

      setExtractedColors(colorInfos);

      // Generate palettes
      const generatedPalettes = generateAllPalettes(colorInfos);
      setPalettes(generatedPalettes);

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
        const canvas = await html2canvas(paletteElement, {
          backgroundColor: '#0a0a0a',
          scale: 2,
        });

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
        alert('Failed to export PNG. Please try again.');
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
                Upload an image and generate beautiful, accessible color schemes instantly.
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
          </div>

          {/* Right Side - Color Management */}
          <div className="space-y-6">
            {/* Loading State */}
            {isProcessing && (
              <div className="flex flex-col items-center justify-center py-12 animate-fade-in">
                <div className="spinner mb-4"></div>
                <p className="text-gray-400">Extracting colors...</p>
              </div>
            )}

            {/* Extracted Colors */}
            {extractedColors.length > 0 && !isProcessing && (
              <div className="glass rounded-xl p-4 animate-fade-in">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-yellow-400" />
                  Extracted Colors
                </h3>
                <div className="grid grid-cols-5 gap-2">
                  {extractedColors.map((color, index) => (
                    <div key={index} className="text-center">
                      <div
                        className="w-full h-16 rounded-lg mb-1 border border-white/10 hover:scale-110 transition-transform duration-300 cursor-pointer"
                        style={{ backgroundColor: color.hex }}
                        title={color.hex}
                      />
                      <p className="font-mono text-xs">{color.hex}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Generated Palettes */}
            {palettes.length > 0 && (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-xl font-bold">Generated Palettes</h3>
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
                <p className="text-gray-400">
                  Upload an image to extract colors and generate palettes.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="glass-strong border-t border-white/10 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-gray-400 text-sm">
            <p>Built with Next.js, TailwindCSS, and Chroma.js</p>
            <p className="mt-1">© 2026 Chromify. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
