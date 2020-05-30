backend: bin/rails s -p 3000
frontend: bin/webpack-dev-server
ssr: NODE_ENV=$RAILS_ENV yarn run rollup -c && NODE_ENV=$RAILS_ENV node lib/svelte-ssr/server.js