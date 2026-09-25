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
# `vercel build` on a laptop also sets VERCEL=1; this script deletes sources,
# so additionally require Vercel's build container (/vercel/path0/...).
case "$(pwd -P)" in
  /vercel/*) ;;
  *) echo "vercel-prepare: not inside Vercel's build container, skipping"; exit 0 ;;
esac
[ -f dist/src/main.js ] || { echo "vercel-prepare: dist/src/main.js missing, run nest build first"; exit 1; }

cp -R dist/src/. src/
cp -R dist/prisma/. prisma/
find src prisma -name '*.ts' ! -name '*.d.ts' -delete
echo "vercel-prepare: using compiled src/main.js"

# @trycompai/utils ships raw .ts (exports -> src/*.ts). Vercel doesn't bundle
# those and Node won't strip types under node_modules, so transpile in place
# and point its exports at the .js files.
UTILS=../../packages/utils
UTILS_SRC=$(ls "$UTILS"/src/*.ts | grep -v '\.test\.ts$')
# shellcheck disable=SC2086
../../node_modules/.bin/esbuild $UTILS_SRC --outdir="$UTILS/src" --format=cjs --platform=node --target=node22 --log-level=warning
sed -i.bak -E 's#(\./)?src/([a-z-]+)\.ts"#./src/\2.js"#g' "$UTILS/package.json" && rm -f "$UTILS/package.json.bak"
echo "vercel-prepare: transpiled @trycompai/utils"
