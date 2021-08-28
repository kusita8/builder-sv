<script lang="ts">
  import Add from "./components/Add.svelte";
  import Dimensions from "./components/Dimensions.svelte";
  import Export from "./components/Export.svelte";
</script>

<header>
  <Add />
  <Dimensions />
  <Export />
</header>

<style type="text/scss">
  header {
    height: var(--header-height);
    background: rgb(100, 100, 100);
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    padding: 0 20px;
  }
  /* your styles go here */
</style>
