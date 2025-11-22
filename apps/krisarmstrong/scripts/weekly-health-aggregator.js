#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function writeReport(repoRoot, md) {
  const date = new Date().toISOString().slice(0,10);
  const fname = `weekly-health-report-${date}.md`;
  const full = path.join(repoRoot, fname);
  fs.writeFileSync(full, md);
  console.log(`Wrote ${fname}`);
}

function main() {
  const repoRoot = process.cwd();
  let token = '';
  const tPathCjs = path.join(repoRoot, 'scripts','token-usage-test.cjs');
  const tPathJs = path.join(repoRoot, 'scripts','token-usage-test.js');
  if (fs.existsSync(tPathCjs)) { try { token = require('child_process').execSync(`node ${tPathCjs}`, {stdio:'pipe'}).toString(); } catch(e) { token = (e.stdout||'') + (e.stderr||''); } }
  else if (fs.existsSync(tPathJs)) { try { token = require('child_process').execSync(`node ${tPathJs}`, {stdio:'pipe'}).toString(); } catch(e) { token = (e.stdout||'') + (e.stderr||''); } }
  else token = 'token-usage-test not found';

  let security = '';
  const sPath = path.join(repoRoot, 'scripts','security-audit.js');
  if (fs.existsSync(sPath)) {
    try { security = require('child_process').execSync(`node ${sPath}`, {stdio:'pipe'}).toString(); } catch(e) { security = (e.stdout||'') + (e.stderr||''); }
  } else {
    security = 'security-audit.js not found';
  }

  let a11y = '';
  const aPath = path.join(repoRoot, 'scripts','a11y-smoke.js');
  if (fs.existsSync(aPath)) {
    try { a11y = require('child_process').execSync(`node ${aPath}`, {stdio:'pipe'}).toString(); } catch(e) { a11y = (e.stdout||'') + (e.stderr||''); }
  } else {
    a11y = 'a11y-smoke.js not found';
  }

  let outdated = '';
  try { outdated = execSync('npm outdated --json', { encoding: 'utf8' }); } catch (e) { outdated = e.stdout || e.message; }

  const outMd = `# Weekly Health Report\n\nDate: ${new Date().toISOString()}\n\n## Token Usage\n\n${token}\n\n## Security\n\n${security}\n\n## Accessibility\n\n${a11y}\n\n## Dependencies (outdated)\n\n${outdated}\n`;
  writeReport(repoRoot, outMd);
}

main();
