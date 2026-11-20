// Leonida Platinum Guide — the entry program (Node 22, standard library
// only). It hands the guide in: it copies the guide (app/) and its
// screenshots (screenshots/) from beside this file into /output, then
// writes /output/dossier.json with the kit's vendored buildDossier, the
// summary the judge reads. Outside the grader, MAKEFUN_OUTPUT_DIR
// stands in for /output, so locally:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
// Run it twice and the two outputs must be byte-identical. Leave
// vendor/makefun-frontend.ts as it is: the scorer requires dossier.json
// to be byte for byte what its own copy of the library writes.

import { copyFileSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const repoRoot = fileURLToPath(new URL('.', import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// Copy a directory tree, file by file, creating folders as needed.
// Symlinks and special files are refused: the gate only takes plain files.
function copyTree(from, to) {
  mkdirSync(to, { recursive: true });
  for (const entry of readdirSync(from, { withFileTypes: true })) {
    const src = join(from, entry.name);
    const dst = join(to, entry.name);
    if (entry.isDirectory()) {
      copyTree(src, dst);
    } else if (entry.isFile()) {
      copyFileSync(src, dst);
    } else {
      throw new Error(`refusing non-regular file in entry: ${src}`);
    }
  }
}

function main() {
  const appDir = join(repoRoot, 'app');
  const shotsDir = join(repoRoot, 'screenshots');
  if (!statSync(appDir).isDirectory()) throw new Error('app/ is missing from the repository');
  if (!statSync(shotsDir).isDirectory()) throw new Error('screenshots/ is missing from the repository');

  mkdirSync(outDir, { recursive: true });
  copyTree(appDir, join(outDir, 'app'));
  copyTree(shotsDir, join(outDir, 'screenshots'));

  // The scorer's own caps (reference/gate.json): only text_max_bytes shapes
  // the bytes; the others refuse an entry the scorer would refuse.
  const dossier = buildDossier(outDir, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 50331648,
  });
  writeFileSync(join(outDir, 'dossier.json'), dossier);
}

main();
