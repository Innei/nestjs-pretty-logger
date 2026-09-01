import tsPath from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    include: [
      'src/__tests__/**/*.(spec|test).ts',
      'packages/**/*.(spec|test).ts',
    ],
    exclude: ['demo/**', '**/node_modules/**', '**/dist/**'],
  },
  plugins: [tsPath()],
})
