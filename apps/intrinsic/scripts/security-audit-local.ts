import { spawnSync } from 'child_process';
const status = spawnSync('node', ['../../scripts/security-audit.js'], { stdio: 'inherit' }).status;
process.exit(status ?? 1);
