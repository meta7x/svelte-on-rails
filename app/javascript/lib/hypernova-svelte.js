import hypernova from 'hypernova';
const { serialize, load } = hypernova;


export const renderSvelte = (name, Component) => hypernova({
    server() {
        return (props) => {
            const contents = Component.render(props);
            console.log(contents.html)
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