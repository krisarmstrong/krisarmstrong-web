#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, '..');

const pkgPath = path.join(projectRoot, 'package.json');
const readmePath = path.join(projectRoot, 'README.md');
const versionFilePath = path.join(projectRoot, 'VERSION');

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const version = pkg.version;

// Update README badge
const badgeRegex = /Version-[0-9]+\.[0-9]+\.[0-9]+-blue/;
const readme = fs.readFileSync(readmePath, 'utf8');
const nextReadme = readme.replace(badgeRegex, `Version-${version}-blue`);
if (!badgeRegex.test(readme)) {
  console.warn('Version badge not found in README.md – skipping badge update.');
} else if (nextReadme !== readme) {
  fs.writeFileSync(readmePath, nextReadme);
}

// Update VERSION file
fs.writeFileSync(versionFilePath, `${version}\n`);

console.log(`Synchronized version files to ${version}`);
