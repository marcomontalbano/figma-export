import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul', // or 'v8'
      reporter: ['text', 'text-summary', 'json', 'clover', 'html', 'lcov'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'packages/website/**',
        'lint-staged.config.js',
        '**/_mocks_',
        'output/**',
      ],
    },
  },
});
