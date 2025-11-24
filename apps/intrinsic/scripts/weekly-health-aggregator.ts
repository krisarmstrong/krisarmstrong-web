#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function writeReport(repoRoot: string, md: string) {
  const date = new Date().toISOString().slice(0, 10);
  const fname = `weekly-health-report-${date}.md`;
  const full = path.join(repoRoot, fname);
  fs.writeFileSync(full, md);
  console.log(`Wrote ${fname}`);
}

function main() {
  const repoRoot = process.cwd();
  let token = '';
  const tPathTs = path.join(repoRoot, 'scripts', 'token-usage-test.ts');
  if (fs.existsSync(tPathTs)) {
    try {
      token = execSync(`node ${tPathTs}`, { stdio: 'pipe' }).toString();
    } catch (e: unknown) {
      const err = e as { stdout?: Buffer; stderr?: Buffer };
      token = (err.stdout?.toString() || '') + (err.stderr?.toString() || '');
    }
  } else token = 'token-usage-test not found';

  let security = '';
  const sPath = path.join(repoRoot, 'scripts', 'security-audit.ts');
  if (fs.existsSync(sPath)) {
    try {
      security = execSync(`node ${sPath}`, { stdio: 'pipe' }).toString();
    } catch (e: unknown) {
      const err = e as { stdout?: Buffer; stderr?: Buffer };
      security = (err.stdout?.toString() || '') + (err.stderr?.toString() || '');
    }
  } else {
    security = 'security-audit.ts not found';
  }

  let a11y = '';
  const aPath = path.join(repoRoot, 'scripts', 'a11y-smoke.ts');
  if (fs.existsSync(aPath)) {
    try {
      a11y = execSync(`node ${aPath}`, { stdio: 'pipe' }).toString();
    } catch (e: unknown) {
      const err = e as { stdout?: Buffer; stderr?: Buffer };
      a11y = (err.stdout?.toString() || '') + (err.stderr?.toString() || '');
    }
  } else {
    a11y = 'a11y-smoke.ts not found';
  }

  let outdated = '';
  try {
    outdated = execSync('npm outdated --json', { encoding: 'utf8' });
  } catch (e: unknown) {
    const err = e as { stdout?: string; message?: string };
    outdated = err.stdout || err.message || '';
  }

  const outMd = `# Weekly Health Report\n\nDate: ${new Date().toISOString()}\n\n## Token Usage\n\n${token}\n\n## Security\n\n${security}\n\n## Accessibility\n\n${a11y}\n\n## Dependencies (outdated)\n\n${outdated}\n`;
  writeReport(repoRoot, outMd);
}

main();
