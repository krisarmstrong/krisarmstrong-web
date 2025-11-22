# Icon Generation Instructions

The Wi-Fi Vigilante favicon has been created as `favicon.svg`. To generate PNG versions for various devices, follow these instructions:

## Required Icons

The following PNG icons need to be generated from `favicon.svg`:

- `favicon-16x16.png` - 16x16 pixels (browser tab)
- `favicon-32x32.png` - 32x32 pixels (browser tab)
- `apple-touch-icon.png` - 180x180 pixels (iOS home screen)
- `icon-192x192.png` - 192x192 pixels (Android home screen)
- `icon-512x512.png` - 512x512 pixels (Android splash screen)

## Option 1: Using Online Tool (Easiest)

1. Visit https://realfavicongenerator.net/
2. Upload `favicon.svg`
3. Download the generated package
4. Copy the PNG files to this directory

## Option 2: Using ImageMagick (Command Line)

If you have ImageMagick installed:

```bash
# Navigate to the public directory
cd public/

# Generate all sizes
convert favicon.svg -resize 16x16 favicon-16x16.png
convert favicon.svg -resize 32x32 favicon-32x32.png
convert favicon.svg -resize 180x180 apple-touch-icon.png
convert favicon.svg -resize 192x192 icon-192x192.png
convert favicon.svg -resize 512x512 icon-512x512.png
```

## Option 3: Using the HTML Generator

1. Open `scripts/generate-icons.html` in your browser
2. The icons will automatically download
3. Move them from Downloads to the `public/` directory

## Option 4: Using Sharp (Node.js)

Install sharp: `npm install --save-dev sharp`

Create and run this script:

```javascript
const sharp = require('sharp');
const fs = require('fs');

const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
];

const svg = fs.readFileSync('public/favicon.svg');

Promise.all(
  sizes.map(({ name, size }) =>
    sharp(svg)
      .resize(size, size)
      .png()
      .toFile(`public/${name}`)
  )
).then(() => console.log('Icons generated!'));
```

## Verification

After generating icons, verify they exist:

```bash
ls -lh public/*.png
```

You should see all 5 PNG files.
