<script>
  export let label;
  let count = 0;
  function handleClick() {
    count += 1;
  }
</script>

<style>
h1 {
  color: orangered;
}
</style>

<h1>{label}: {count}</h1>
<button on:click={handleClick}>
    Increase {label}
</button>