
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import svelte from 'rollup-plugin-svelte';
import pkg from './package.json';

import fs from 'fs';
import path from 'path';

const mode = process.env.NODE_ENV || 'development';
const dev = mode === 'development';

const onwarn = (warning, onwarn) => (warning.code === 'CIRCULAR_DEPENDENCY' && /[/\\]@sapper[/\\]/.test(warning.message)) || onwarn(warning);

const COMPONENTS_PATH = path.resolve('app/javascript/components');
const DIST_PATH = path.resolve('lib/svelte-ssr/dist');
const TMP_PATH = path.resolve('tmp/ssr');
const TMP_FILENAME = 'components.js';

const components = fs.readdirSync(COMPONENTS_PATH)
    .filter(name => name.match(/.svelte$/))
    .map(name => name.replace(/.svelte$/, ''));

// generate single file with all components, useful for performance
// (load everything in the beginning, serve from memory)
const source = components.reduce((string, name) => {
    return string + `import ${name} from '${path.join(COMPONENTS_PATH, name + '.svelte')}';\nexport { ${name} };\n`;
}, '');
if (!fs.existsSync(TMP_PATH)){
    fs.mkdirSync(TMP_PATH);
}
fs.writeFileSync(path.join(TMP_PATH, TMP_FILENAME), source);

export default {
    input: path.join(TMP_PATH, TMP_FILENAME),
    output: {
        file: path.join(DIST_PATH, 'components', 'index.js'),
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
            emitCss: false,
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