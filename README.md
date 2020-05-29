# Ruby on Rails with SSR Svelte

Template for Ruby on Rails app with Svelte installed and configured.
Svelte components are server-side-rendered using [Hypernova](https://github.com/airbnb/hypernova-ruby)
and [Rollup](https://github.com/rollup/rollup).

## Getting started

### Installation
The following tools are assumed to be installed:
- [Ruby on Rails](https://github.com/rails/rails)
- [Yarn](https://github.com/yarnpkg/yarn)

Clone this repository and install all dependencies by running:
```bash
# install ruby gems
bundle install
# install npm packages
yarn
```

### Adding components
Per default, all files inside the `app/javascript/components` that end with `.svelte` are compiled and available for SSR.
To add a new component, simply create a new file containing a Svelte-component:
```html
<!-- inside app/javascript/components/MyComponent.svelte -->
<script>
  export let label;
  let count = 0;
  function handleClick() {
    count += 1;
  }
</script>

<h1>{label}: {count}</h1>
<button on:click={handleClick}>
    Increment {label}
</button>
```

To use it inside your template, use the provided helper function:
```ruby
# inside erb-template
<%= render_component 'MyComponent', name: 'Spoons' %>
```