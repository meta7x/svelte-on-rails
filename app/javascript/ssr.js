import { renderSvelte } from "./lib/hypernova-svelte";

let App;
import('./components/App.svelte').then(({ default: app }) => {
    App = renderSvelte('App', app);
})

export { App }