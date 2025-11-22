#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const pkg = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
const version = pkg.version;

const readmePath = path.join(projectRoot, 'README.md');
const badgeRegex = /Version-[0-9]+\.[0-9]+\.[0-9]+-blue/;
const readme = fs.readFileSync(readmePath, 'utf8');
if (badgeRegex.test(readme)) {
  const nextReadme = readme.replace(badgeRegex, `Version-${version}-blue`);
  if (nextReadme !== readme) {
    fs.writeFileSync(readmePath, nextReadme);
  }
} else {
  console.warn('Version badge not found in README.md – skipping badge update.');
}

console.log(`Updated README version badge to ${version}`);
