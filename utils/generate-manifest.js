const fs = require('fs');
const path = require('path');

const browser = process.argv[2];

if (!browser) {
  console.error('Missing browser argument. Usage: node generate-manifest.js <firefox|chrome>');
  process.exit(1);
}

const manifestSrc = path.resolve(__dirname, `manifest-${browser}.json`);
const manifestDest = path.resolve(__dirname, 'build/manifest.json');

if (!fs.existsSync(manifestSrc)) {
  console.error(`Manifest file not found: ${manifestSrc}`);
  process.exit(1);
}

// Ensure build directory exists
fs.mkdirSync(path.dirname(manifestDest), { recursive: true });

// Copy manifest file
fs.copyFileSync(manifestSrc, manifestDest);

console.log(`Generated manifest for ${browser}: ${manifestDest}`);
