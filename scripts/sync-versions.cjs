#!/usr/bin/env node
/**
 * Sincroniza a versão do package.json raiz com todos os pacotes em packages/*.
 * Usado pelo @semantic-release/exec.
 */

const fs = require('node:fs');
const path = require('node:path');

const rootDir = path.resolve(__dirname, '..');
const rootPkg = JSON.parse(fs.readFileSync(path.join(rootDir, 'package.json'), 'utf-8'));
const version = rootPkg.version;

const packagesDir = path.join(rootDir, 'packages');
const packageDirs = fs.readdirSync(packagesDir).filter((name) => {
  const stat = fs.statSync(path.join(packagesDir, name));
  return stat.isDirectory();
});

for (const dir of packageDirs) {
  const pkgPath = path.join(packagesDir, dir, 'package.json');
  if (!fs.existsSync(pkgPath)) continue;

  const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
  pkg.version = version;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n');
  console.log(`Synced ${pkg.name} → ${version}`);
}
