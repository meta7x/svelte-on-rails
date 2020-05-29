
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import pkg from './package.json';

import fs from 'fs';
import path from 'path';

const mode = process.env.NODE_ENV;
const dev = mode === 'development';

const onwarn = (warning, onwarn) => (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning);

const COMPONENTS_PATH = path.resolve('app/javascript/components');
const PUBLIC_PATH = path.resolve('public')
const SSR_PATH = path.resolve('ssr');
const TMP_PATH = path.resolve('tmp');
const TMP_FILENAME = 'rollup-components.js';

const components = fs.readdirSync(COMPONENTS_PATH)
    .filter(name => name.endsWith('.svelte'))
    .map(name => name.replace('.svelte', ''));

// generate separate file for each component, useful during development
const modules = components.map(name => {
    return {
        input: path.join(COMPONENTS_PATH, `${name}.svelte`),
        output: {
            file: path.join(SSR_PATH, 'components', `${name}.js`),
            format: 'cjs'
        },
        plugins: [
            replace({
                'process.browser': false,
                'process.env.NODE_ENV': JSON.stringify(mode)
            }),
            svelte({
                generate: 'ssr',
                hydratable: true,
                css(css) { /* ignore css */ },
                dev
            }),
            resolve({
                dedupe: ['svelte']
            }),
            commonjs()
        ],
        external: Object.keys(pkg.dependencies).concat(
            require('module').builtinModules || Object.keys(process.binding('natives'))
        ),
        preserveEntrySignatures: 'strict',
        onwarn,
    }
})

// generate single file with all components, useful for performance
// (load everything in the beginning, serve from memory)
const source = components.reduce((string, name) => {
    return string + `import ${name} from '${path.join(COMPONENTS_PATH, name + '.svelte')}';\nexport { ${name} };\n`;
}, '');
fs.writeFileSync(path.join(TMP_PATH, TMP_FILENAME), source);

modules.push({
    input: path.join(TMP_PATH, TMP_FILENAME),
    output: {
        file: path.join(SSR_PATH, 'components', 'index.js'),
        format: 'cjs'
    },
    plugins: [
        replace({
            'process.browser': false,
            'process.env.NODE_ENV': JSON.stringify(mode)
        }),
        svelte({
            generate: 'ssr',
            hydratable: true,
            css(css) {
                css.write(path.join(PUBLIC_PATH, 'packs', 'css', 'svelte.css'));
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
})

export default modules