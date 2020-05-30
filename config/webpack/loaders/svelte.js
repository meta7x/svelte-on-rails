module.exports = {
  test: /\.svelte$/,
  use: [{
    loader: 'svelte-loader',
    options: {
      hotReload: true,
      emitCss: true,
      hydratable: true,
    }
  }],
}
