import renderSvelte from './hypernova-svelte.js';

const name = 'App'
let App;
import(`../app/javascript/components/${name}.svelte`).then(({ default: component }) => {
    App = renderSvelte(component);
})

export { App };