
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import pkg from './package.json';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const onwarn = (warning, onwarn) => (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning);

import fs from 'fs';
const components = fs.readdirSync('./app/javascript/components')
                .map(f => f.replace('.svelte', ''))

export default {
    input: './ssr/components.js',
    output: {
        dir: './ssr/components',
        entryFileNames: 'index.js',
        chunkFileNames: '[name].js',
        format: 'cjs'
    },
    plugins: [
        replace({
            'COMPONENT_LIST': components,
            'process.browser': false,
            'process.env.NODE_ENV': JSON.stringify(mode)
        }),
        svelte({
            generate: 'ssr',
            hydratable: true,
            css(css) {
                css.write('./public/styles/svelte.css');
            },
            dev
        }),
        resolve({
            dedupe: ['svelte']
        }),
        commonjs(),
    ],
    external: Object.keys(pkg.dependencies).concat(
        require('module').builtinModules || Object.keys(process.binding('natives'))
    ),

    preserveEntrySignatures: 'strict',
    onwarn,
}