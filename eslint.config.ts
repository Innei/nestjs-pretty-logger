import { defineConfig } from 'eslint-config-hyoban'

export default defineConfig(
  {
    react: false,
    formatting: false,
  },
  [
    {
      languageOptions: {
        parserOptions: {
          emitDecoratorMetadata: true,
          experimentalDecorators: true,
        },
      },
    },
  ],
)
