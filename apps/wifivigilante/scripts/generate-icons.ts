#!/usr/bin/env node

/**
 * Generate PNG icons from SVG favicon
 * This script uses canvas to generate PNG icons of various sizes
 */

import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const publicDir = path.join(__dirname, '..', 'public');

// Icon sizes to generate
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'icon-512x512.png', size: 512 },
];

/**
 * Draw the Wi-Fi Vigilante shield icon on canvas
 */
function drawIcon(ctx, size) {
  const scale = size / 100;

  // Clear canvas
  ctx.clearRect(0, 0, size, size);

  // Draw shield background
  ctx.fillStyle = '#2563eb';
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 2 * scale;

  ctx.beginPath();
  ctx.moveTo(50 * scale, 5 * scale);
  ctx.lineTo(90 * scale, 20 * scale);
  ctx.lineTo(90 * scale, 50 * scale);
  ctx.quadraticCurveTo(90 * scale, 70 * scale, 50 * scale, 95 * scale);
  ctx.quadraticCurveTo(10 * scale, 70 * scale, 10 * scale, 50 * scale);
  ctx.lineTo(10 * scale, 20 * scale);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Draw Wi-Fi waves
  ctx.strokeStyle = '#ffffff';
  ctx.lineCap = 'round';
  ctx.globalAlpha = 0.95;

  // Outer wave
  ctx.lineWidth = 3 * scale;
  ctx.beginPath();
  ctx.moveTo(25 * scale, 45 * scale);
  ctx.quadraticCurveTo(35 * scale, 35 * scale, 50 * scale, 45 * scale);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(50 * scale, 45 * scale);
  ctx.quadraticCurveTo(65 * scale, 35 * scale, 75 * scale, 45 * scale);
  ctx.stroke();

  // Middle wave
  ctx.beginPath();
  ctx.moveTo(33 * scale, 50 * scale);
  ctx.quadraticCurveTo(40 * scale, 43 * scale, 50 * scale, 50 * scale);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(50 * scale, 50 * scale);
  ctx.quadraticCurveTo(60 * scale, 43 * scale, 67 * scale, 50 * scale);
  ctx.stroke();

  // Inner wave
  ctx.beginPath();
  ctx.moveTo(41 * scale, 55 * scale);
  ctx.quadraticCurveTo(45 * scale, 51 * scale, 50 * scale, 55 * scale);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(50 * scale, 55 * scale);
  ctx.quadraticCurveTo(55 * scale, 51 * scale, 59 * scale, 55 * scale);
  ctx.stroke();

  // Center dot
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(50 * scale, 60 * scale, 4 * scale, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Generate icons
 */
function generateIcons() {
  console.log('Generating Wi-Fi Vigilante icons...\n');

  sizes.forEach(({ name, size }) => {
    const canvas = createCanvas(size, size);
    const ctx = canvas.getContext('2d');

    drawIcon(ctx, size);

    const buffer = canvas.toBuffer('image/png');
    const filePath = path.join(publicDir, name);

    fs.writeFileSync(filePath, buffer);
    console.log(`✓ Generated: ${name} (${size}x${size})`);
  });

  console.log('\n✨ All icons generated successfully!');
  console.log('Icons saved to:', publicDir);
}

// Generate icons
generateIcons();
