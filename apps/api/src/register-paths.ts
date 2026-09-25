import path from 'path';
import { register } from 'tsconfig-paths';

// `nest build` rewrites the tsconfig path aliases below into relative imports,
// but Vercel's NestJS preset compiles src/ with plain tsc and leaves them as-is.
// Registering them at runtime makes both builds resolve `@db` and `@/*`.
// Must stay the first import of main.ts.
register({
  baseUrl: path.resolve(__dirname, '..'),
  paths: {
    '@/*': ['./src/*'],
    '@db': ['./prisma/index'],
  },
});
