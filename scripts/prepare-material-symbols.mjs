import { mkdir, access, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

const VERSION = '0.47.3';
const FONT_URL = `https://unpkg.com/material-symbols@${VERSION}/material-symbols-outlined.woff2`;
const outputDir = path.resolve('public/fonts');
const outputPath = path.join(outputDir, 'material-symbols-outlined.woff2');

try {
  await access(outputPath, constants.F_OK);
  console.log(`[material-symbols] using existing ${outputPath}`);
  process.exit(0);
} catch {
  // The font is generated into public/ so Vite serves it from the same origin.
}

console.log(`[material-symbols] downloading ${FONT_URL}`);
const response = await fetch(FONT_URL);

if (!response.ok) {
  throw new Error(
    `Failed to download Material Symbols: ${response.status} ${response.statusText}`,
  );
}

const font = Buffer.from(await response.arrayBuffer());

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, font);

console.log(
  `[material-symbols] self-hosted font ready: ${outputPath} (${font.byteLength} bytes)`,
);
