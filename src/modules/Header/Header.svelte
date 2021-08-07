<script lang="ts">
  import Add from "./components/Add.svelte";
  import Dimensions from "./components/Dimensions.svelte";
</script>

<header>
  <Dimensions />
  <Add />
</header>

<style type="text/scss">
  header {
    height: var(--header-height);
    background: rgb(100, 100, 100);
    position: relative;
    z-index: 10;
  }
  /* your styles go here */
</style>
