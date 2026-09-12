#!/usr/bin/env node

const path = require('path');
const fs = require('fs');

const distCli = path.join(__dirname, '..', 'dist', 'cli.js');
const srcCli = path.join(__dirname, '..', 'src', 'cli.ts');

if (fs.existsSync(distCli)) {
  require(distCli);
} else {
  const { spawn } = require('child_process');
  const child = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['tsx', srcCli, ...process.argv.slice(2)], {
    stdio: 'inherit',
    cwd: process.cwd()
  });
  child.on('exit', (code) => process.exit(code || 0));
}
