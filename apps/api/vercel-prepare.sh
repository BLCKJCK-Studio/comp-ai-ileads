#!/usr/bin/env sh
# Vercel only: ship the `nest build` output instead of letting the NestJS preset
# recompile src/ with plain tsc. `nest build` rewrites the tsconfig path aliases
# (@db, @/*) that the preset leaves unresolved, so the compiled .js files are
# overlaid on src/ and prisma/ and the .ts sources dropped; the preset then picks
# up src/main.js as the entrypoint. Guarded so it never runs on a dev machine.
set -eu

if [ "${VERCEL:-}" != "1" ]; then
  echo "vercel-prepare: VERCEL is not 1, skipping"
  exit 0
fi

cd "$(dirname "$0")"
[ -f dist/src/main.js ] || { echo "vercel-prepare: dist/src/main.js missing, run nest build first"; exit 1; }

cp -R dist/src/. src/
cp -R dist/prisma/. prisma/
find src prisma -name '*.ts' ! -name '*.d.ts' -delete
echo "vercel-prepare: using compiled src/main.js"
