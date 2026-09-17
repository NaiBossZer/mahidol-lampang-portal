import { access, mkdir, rename, writeFile } from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

const VERSION = '0.47.3';
const FONT_PATH = `material-symbols@${VERSION}/material-symbols-outlined.woff2`;
const FONT_URLS = [
  `https://unpkg.com/${FONT_PATH}`,
  `https://cdn.jsdelivr.net/npm/${FONT_PATH}`,
];
const outputDir = path.resolve('public/fonts');
const outputPath = path.join(outputDir, 'material-symbols-outlined.woff2');
const tempPath = `${outputPath}.tmp`;

try {
  await access(outputPath, constants.F_OK);
  console.log(`[material-symbols] using existing ${outputPath}`);
  process.exit(0);
} catch {
  // Generate the font into public/ so Vite serves it from the same origin.
}

function isValidWoff2(font) {
  return font.byteLength >= 1024 && font.subarray(0, 4).toString('ascii') === 'wOF2';
}

let lastError;

for (const url of FONT_URLS) {
  try {
    console.log(`[material-symbols] downloading ${url}`);
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`${response.status} ${response.statusText}`);
    }

    const font = Buffer.from(await response.arrayBuffer());

    if (!isValidWoff2(font)) {
      throw new Error(`invalid WOFF2 payload (${font.byteLength} bytes)`);
    }

    await mkdir(outputDir, { recursive: true });
    await writeFile(tempPath, font);
    await rename(tempPath, outputPath);

    console.log(
      `[material-symbols] self-hosted font ready: ${outputPath} (${font.byteLength} bytes)`,
    );
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.warn(`[material-symbols] source failed: ${url}`, error);
  }
}

throw new Error(`Unable to prepare Material Symbols ${VERSION}: ${lastError?.message ?? 'unknown error'}`);
