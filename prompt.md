**PRO / VibeCode Build Prompt**

Create a web app where users upload an image and automatically get a color system built from it. The app must:

1. **Image Upload**

* Accept JPG, PNG, WebP
* Show a thumbnail preview
* Handle up to 10MB
* Fail gracefully with clear error messages

2. **Color Extraction**

* Detect the primary, secondary, and accent colors from the image
* Remove near-duplicate shades
* Show HEX, RGB, and HSL values

3. **Smart Theme Generator**
   Generate multiple palettes based on extracted colors:

* Complementary
* Analogous
* Triadic
* Monochromatic
* Split-complementary

For each generated palette:

* Preview on real UI components (button, card, headline, body text, background)
* Automatically evaluate contrast (WCAG AA+)
* Flag bad combinations and replace them with better variants

4. **“Best Theme” Recommendation**

* Rank palettes using readability, contrast, and visual balance
* Clearly mark the top recommended theme as: **BEST MATCH FOR THIS IMAGE**
* Explain briefly *why* it’s recommended

5. **Manual Color Picker**

* Allow users to tweak colors with a live color picker
* Automatically update dependent shades and contrast checks

6. **Save & Export**

* Save palettes locally (localStorage)
* Export options:

  * PNG color sheet
  * JSON (tokens)
  * CSS variables
  * tailwindcss custom css code file

* Include copy-to-clipboard for individual colors

7. **UX Requirements**

* Minimal UI, fast, no clutter
* Responsive (mobile → desktop)
* Show loading states
* No backend unless absolutely required

8. **Non-negotiables**

* Colors must be usable in real UI themes, not random swatches
* Avoid unreadable light-on-light or dark-on-dark
* Performance first; image processing must feel instant

forces contrast rules, ranking, and UI previews — exactly what turns it into a practical design tool.

Deliverables:

* Working app
* Clean, commented code
* Short README explaining architecture and limitations.