# Chromify 🎨

Transform images into perfect color palettes with accessibility in mind.

## Overview

Chromify is a modern web application that extracts dominant colors from images and generates harmonious color palettes based on color theory. Built with Next.js 15, TailwindCSS, and Chroma.js, it provides designers and developers with an instant, accessible color scheme generator.

## Features

### 🖼️ Image Upload
- **Supported Formats**: JPG, PNG, WebP
- **File Size**: Up to 10MB
- **Drag & Drop**: Intuitive upload interface
- **Preview**: Instant thumbnail preview
- **Error Handling**: Clear, user-friendly error messages

### 🎨 Color Extraction
- **Smart Detection**: Automatically identifies primary, secondary, and accent colors
- **Deduplication**: Removes near-duplicate shades for cleaner palettes
- **Multiple Formats**: Displays colors in HEX, RGB, and HSL
- **Fast Processing**: Client-side processing for instant results

### 🌈 Smart Theme Generator
Generates five palette types based on color theory:

1. **Complementary**: Colors opposite on the color wheel - high contrast and vibrant
2. **Analogous**: Adjacent colors - harmonious and cohesive
3. **Triadic**: Three evenly spaced colors - balanced and vibrant
4. **Monochromatic**: Variations of a single hue - sophisticated and elegant
5. **Split-Complementary**: Base color plus two adjacent to its complement - balanced contrast

### ✅ Accessibility First
- **WCAG Compliance**: Automatic contrast checking (AA standard: 4.5:1)
- **Quality Scoring**: Palettes ranked by readability, contrast, and visual balance
- **Best Match**: Top-ranked palette clearly marked with reasoning
- **Contrast Warnings**: Flags problematic color combinations
- **UI Preview**: Real component previews (buttons, cards, text) for each palette

### 📦 Export Options
- **JSON**: Design tokens with all color formats
- **CSS Variables**: Ready-to-use custom properties
- **Tailwind Config**: Drop into your tailwind.config.js
- **PNG**: Visual color sheet for presentations
- **Copy to Clipboard**: Individual color values

### 💾 Local Storage
- Save favorite palettes locally
- No backend required
- Privacy-focused (all processing happens in browser)

## Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: TailwindCSS 4
- **Language**: TypeScript
- **Color Processing**: Chroma.js
- **Icons**: Lucide React
- **Export**: html2canvas (PNG generation)

### Project Structure
```
chromify/
├── app/
│   ├── page.tsx              # Main application page
│   ├── how-to/
│   │   └── page.tsx          # How to use guide
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── ImageUpload.tsx       # Image upload component
│   ├── ColorCard.tsx         # Individual color display
│   ├── PaletteCard.tsx       # Palette display with export
│   └── PalettePreview.tsx    # UI component preview
├── lib/
│   └── colorUtils.ts         # Color manipulation utilities
└── public/                   # Static assets
```

### Key Algorithms

#### Color Extraction
1. Image is resized to 200x200px for faster processing
2. Pixels are quantized to reduce similar colors
3. Colors are sorted by frequency
4. Near-duplicates are removed using Delta E (CIE76) color distance
5. Top 5 dominant colors are selected

#### Palette Generation
Each palette type uses color theory principles:
- **Hue rotation** for complementary and triadic schemes
- **Lightness variation** for monochromatic schemes
- **Adjacent hues** for analogous schemes

#### Quality Scoring
Palettes are evaluated based on:
- **Lightness Range**: Ensures visual hierarchy (30+ range preferred)
- **Contrast Ratio**: Percentage of color pairs meeting WCAG AA
- **Saturation Balance**: Avoids overly dull or overwhelming colors
- **Score Range**: 0-100, with higher scores indicating better usability

## Limitations

### Performance
- **Large Images**: Files over 5MB may take longer to process
- **Browser Dependent**: Performance varies by device and browser
- **Memory**: Very large images may cause memory issues on low-end devices

### Color Extraction
- **Complex Images**: Photos with many colors may not extract cleanly
- **Monochromatic Images**: Limited palette variety from single-color images
- **Transparent Backgrounds**: PNG transparency is handled, but may affect extraction

### Accessibility
- **Not All Combinations**: Some color combinations may not meet WCAG AAA (7:1)
- **Context Matters**: Contrast ratios are calculated for normal text, not large text or graphics
- **Manual Review**: Always test colors in your actual design context

### Export
- **PNG Quality**: Depends on browser canvas rendering
- **No Cloud Sync**: Palettes are stored locally only
- **Browser Storage**: Limited by localStorage capacity (~5-10MB)

## Getting Started

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd chromify

# Install dependencies
npm install

# Run development server
npm run dev
```

### Development
```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint
```

### Environment
No environment variables required - the app runs entirely client-side.

## Usage Tips

### Best Images
- **Nature Photos**: Flowers, landscapes, sunsets
- **Artwork**: Paintings, illustrations, digital art
- **Brand Materials**: Logos, marketing materials
- **3-5 Distinct Colors**: Works best with clear color separation

### Palette Selection
- **Complementary**: Use for high-energy, attention-grabbing designs
- **Analogous**: Best for calm, cohesive interfaces
- **Triadic**: Balanced option for vibrant, playful designs
- **Monochromatic**: Sophisticated, professional applications
- **Split-Complementary**: Versatile middle ground

### Accessibility
- Always check the contrast warnings
- Use the UI preview to test readability
- Consider color blindness when selecting palettes
- Test with actual content before finalizing

## Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Opera 76+

## License
MIT License - feel free to use in personal and commercial projects.

## Credits
Built with:
- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Chroma.js](https://gka.github.io/chroma.js/)
- [Lucide Icons](https://lucide.dev/)
- [html2canvas](https://html2canvas.hertzen.com/)

---

**Made with ❤️ for designers and developers**
