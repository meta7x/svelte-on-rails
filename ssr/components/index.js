'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

function _interopNamespace(e) {
    if (e && e.__esModule) { return e; } else {
        var n = {};
        if (e) {
            Object.keys(e).forEach(function (k) {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            });
        }
        n['default'] = e;
        return n;
    }
}

var hypernova = _interopDefault(require('hypernova'));

const { serialize, load } = hypernova;


var hypernovaSvelte = (name, Component) => hypernova({
    server() {
        return (props) => {
            const contents = Component.render(props);
            console.log(contents.html);
            return serialize(name, contents.html, props);
        };
    },

    client() {
        const payloads = load(name);

        if (payloads) {
            payloads.forEach((payload) => {
                const { node, data } = payload;
                new Component({
                    target: node,
                    hydrate: true,
                    props: data
                });
            });
        }

        return Component;
    }
});

const name = 'App';

Promise.resolve().then(function () { return _interopNamespace(require(`../app/javascript/components/${name}.svelte`)); }).then(({ default: component }) => {
    exports.App = hypernovaSvelte(component);
});
