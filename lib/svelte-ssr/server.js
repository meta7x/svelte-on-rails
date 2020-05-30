const hypernova = require('hypernova/server');
const { renderSvelte } = require('hypernova-svelte');

const path = require('path');
const components = require(path.resolve('./lib/svelte-ssr/dist/components/index.js'));

const mode = process.env.NODE_ENV || 'development';

hypernova({
    devMode: mode === 'development',
    getComponent(name) {
        const component = components[name];
        return component ? renderSvelte(name, component) : null;
    },
    port: 3030,
});