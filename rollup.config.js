import {babel} from '@rollup/plugin-babel'
import {terser} from 'rollup-plugin-terser'
import {nodeResolve} from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import pkg from './package.json'

const extensions = ['.mjs', '.node', '.js', '.ts', '.tsx']

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
        format: 'es',
      },
    ],
    plugins: [
      babel({
        babelrc: false,
        babelHelpers: 'bundled',
        extensions,
        exclude: /(node_modules.*)/,
      }),
      nodeResolve({extensions}),
      commonjs(),
      terser(),
    ],
  },
]
