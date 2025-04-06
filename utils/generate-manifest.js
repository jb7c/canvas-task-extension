const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

const browser = process.argv[2];
if (!browser) {
  console.error('Missing browser argument. Usage: node generate-manifest.js <firefox|chrome>');
  process.exit(1);
}

// Get URLs from environment variables
const universityUrl = process.env.UNIVERSITYURL;
const instructureUrl = process.env.INSTRUCTUREURL;

if (!universityUrl || !instructureUrl) {
  console.error('Missing required environment variables: UNIVERSITYURL and/or INSTRUCTUREURL');
  console.error('Please set these in your .env file');
  process.exit(1);
}

// Format URLs for manifest (ensure they have /* at the end)
const formatUrl = (url) => {
  // Remove trailing slash if present
  const cleanUrl = url.endsWith('/') ? url.slice(0, -1) : url;
  // Add wildcard pattern
  return `${cleanUrl}/*`;
};

const universityUrlPattern = formatUrl(universityUrl);
const instructureUrlPattern = formatUrl(instructureUrl);

// Source and destination paths
const manifestSrc = path.resolve(__dirname, '..', `src/manifest-${browser}.json`);
const manifestDest = path.resolve(__dirname, '..', 'dist/manifest.json');

if (!fs.existsSync(manifestSrc)) {
  console.error(`Manifest file not found: ${manifestSrc}`);
  process.exit(1);
}

// Read the manifest template
let manifestContent = fs.readFileSync(manifestSrc, 'utf8');

// Create the array of URL patterns as a JSON string
const urlPatternsJson = JSON.stringify([universityUrlPattern, instructureUrlPattern]);

// Replace the placeholder with the actual URL patterns
manifestContent = manifestContent.replace(
  '"PLACEHOLDER_MATCHES"', 
  urlPatternsJson.substring(1, urlPatternsJson.length - 1) // Remove the outer brackets
);

// Ensure build directory exists
fs.mkdirSync(path.dirname(manifestDest), { recursive: true });

// Write the updated manifest
fs.writeFileSync(manifestDest, manifestContent);

console.log(`Generated manifest for ${browser} with custom URLs: ${manifestDest}`);
console.log(`URLs: ${universityUrlPattern}, ${instructureUrlPattern}`);