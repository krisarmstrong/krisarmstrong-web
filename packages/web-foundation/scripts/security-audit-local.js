const { spawnSync } = require('child_process');
const status = spawnSync('node', ['../../scripts/security-audit.js'], { stdio: 'inherit' }).status;
process.exit(status);
