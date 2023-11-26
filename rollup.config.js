// @ts-check
import { readFileSync } from 'fs'
import { minify } from 'rollup-plugin-esbuild'
import peerDepsExternal from 'rollup-plugin-peer-deps-external'

import commonjs from '@rollup/plugin-commonjs'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'

const packageJson = JSON.parse(
  readFileSync('./package.json', { encoding: 'utf-8' }),
)

const globals = {
  // @ts-ignore
  ...(packageJson?.dependencies || {}),
}

const dir = 'dist'

/**
 * @type {import('rollup').RollupOptions[]}
 */
const config = [
  {
    input: 'src/index.ts',
    // ignore lib
    external: [...Object.keys(globals)],

    output: [
      {
        file: `${dir}/index.cjs`,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: `${dir}/index.min.cjs`,
        format: 'cjs',
        sourcemap: true,
        plugins: [minify()],
      },
      {
        file: `${dir}/index.js`,
        format: 'esm',
        sourcemap: true,
      },
      {
        file: `${dir}/index.min.js`,
        format: 'esm',
        sourcemap: true,
        plugins: [minify()],
      },
    ],
    plugins: [
      nodeResolve(),
      commonjs({ include: 'node_modules/**' }),
      typescript({
        tsconfig: './tsconfig.build.json',
        declaration: false,
      }),
      // @ts-ignore
      peerDepsExternal(),
    ],

    treeshake: true,
  },
]

export default config
