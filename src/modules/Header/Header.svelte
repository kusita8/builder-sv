<script lang="ts">
  import Dimensions from "./components/Dimensions.svelte";
  import Export from "./components/Export.svelte";
</script>

<header>
  <Dimensions />
  <Export />
</header>

<style type="text/scss">
  @import "src/styles/variables.scss";

  header {
    height: var(--header-height);
    background: $dark-a;
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1.4rem;
  }
</style>
