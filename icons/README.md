# Icon Files

This directory should contain PNG icon files for the browser extension:

- `icon16.png` - 16x16 pixels
- `icon32.png` - 32x32 pixels
- `icon48.png` - 48x48 pixels
- `icon128.png` - 128x128 pixels

## Creating Icons

You can create these icons using:

1. **Online tools**:
   - [Favicon Generator](https://realfavicongenerator.net/)
   - [ICO Converter](https://icoconvert.com/)

2. **Design software**:
   - Adobe Photoshop
   - GIMP (free)
   - Figma (free)
   - Canva (free)

3. **From the SVG**:
   - Use the provided `icon.svg` file
   - Convert it to PNG at different sizes using:
     - Online converters like CloudConvert
     - Command line tools like ImageMagick: `convert icon.svg -resize 128x128 icon128.png`

## Icon Design Guidelines

- Use a simple, recognizable design
- Ensure good contrast and visibility at small sizes
- Test how it looks on both light and dark backgrounds
- Follow platform-specific guidelines:
  - Chrome: Simple, flat design
  - Firefox: Can be more detailed

## Temporary Solution

Until you create proper PNG icons, you can:
1. Create a simple colored square PNG in any image editor
2. Name them appropriately (icon16.png, icon32.png, etc.)
3. Place them in this directory

The extension will work without icons, but the browser will show a default placeholder.

## Icon Template Suggestions

Consider these icon concepts:
- 📚 A bookmark/ribbon symbol
- 🗂️ A folder with a star
- ⭐ A star with organized lines
- 🔖 A traditional bookmark shape
- 📑 Files with a checkmark

The current SVG provides a gradient background (purple to blue) with a bookmark and star symbol.
