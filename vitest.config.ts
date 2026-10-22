import { defineConfig } from 'vitest/config';
<<<<<<< HEAD

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`. Requires Vite 8, which ships this option.
  resolve: { tsconfigPaths: true },
=======
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  // Resolves the path aliases declared in tsconfig.json, including the ones
  // added by `nest g library`.
  plugins: [tsconfigPaths()],
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7
  test: {
    globals: true,
    root: './',
    include: ['**/*.spec.ts'],
  },
});
