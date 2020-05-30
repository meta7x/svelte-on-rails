const hypernova = require('hypernova/server');
const { renderSvelte } = require('hypernova-svelte');

const path = require('path');
const components = require(path.resolve('./lib/assets/svelte-ssr/dist/components/index.js'));

hypernova({
    devMode: process.env.NODE_ENV == 'development',
    getComponent(name) {
        const component = components[name];
        return component ? renderSvelte(name, component) : null;
    },
    port: 3030,
});