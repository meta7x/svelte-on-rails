const hypernova = require('hypernova/server');
const renderSvelte = require('./hypernova-svelte.js');
const components = require('./components/index.js');

hypernova({
    devMode: true,
    getComponent(name) {
        if (process.env.NODE_ENV === 'development' && false) {
            component = require(`./components/${name}.js`).default;
        } else {
            component = components[name]
        }
        return component ? renderSvelte(name, component) : null;
    },
    port: 3030,
});