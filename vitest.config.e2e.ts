import { defineConfig } from 'vitest/config';
<<<<<<< HEAD

export default defineConfig({
  resolve: { tsconfigPaths: true },
=======
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
>>>>>>> b37f7d0703a18fc5628a260779c78ff87d45ebf7
  test: {
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
  },
});
