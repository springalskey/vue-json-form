import vue from 'rollup-plugin-vue';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { babel } from '@rollup/plugin-babel';
import scss from 'rollup-plugin-scss';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
// 压缩
import terser from '@rollup/plugin-terser';
import { cleandir } from 'rollup-plugin-cleandir';

const baseConfig = config => {
  return {
    plugins: [
      cleandir(config.outputDir),
      vue(),
      scss({
        fileName: config.styleName,
        outputStyle: 'compressed'
      }),
      json(),
      // built-in module 'buffer'
      nodeResolve({ preferBuiltins: true, extensions: ['.js', '.vue'] }),
      commonjs(),
      image(),
      babel({
        exclude: 'node_modules/**',
        plugins: ['@babel/plugin-transform-runtime'],
        babelHelpers: 'runtime'
      })
    ],
    external: ['vue', 'element-ui', 'crypto-js']
  };
};

let configs = [
  {
    input: {
      index: './src/components/index.js'
    },
    output: [
      {
        dir: 'lib/vue-json-form',
        format: 'esm',
        freeze: false,
        chunkFileNames: 'index-[hash].min.js',
        plugins: [
          terser({
            output: {
              ecma: 6
            }
          })
        ]
      }
    ],
    ...baseConfig({
      outputDir: 'lib',
      styleName: 'index.css'
    })
  }
];

export default configs;
