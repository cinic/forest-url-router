import {babel} from '@rollup/plugin-babel'
import {terser} from 'rollup-plugin-terser'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import pkg from './package.json'

const extensions = ['.mjs', '.node', '.js', '.ts', '.tsx']
const plugins = [
  babel({
    babelHelpers: 'bundled',
    extensions,
    include: ['src/**/*'],
  }),
  nodeResolve({extensions}),
  terser(),
]

export default [
  {
    input: 'src/index.ts',
    external: [...Object.keys(pkg.peerDependencies || {})],
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'esm',
      },
    ],
    plugins,
  },
  {
    input: 'src/index.ts',
    output: [
      {
        name: 'forest-router',
        file: pkg.browser,
        format: 'umd',
      },
    ],
    plugins,
  },
]
