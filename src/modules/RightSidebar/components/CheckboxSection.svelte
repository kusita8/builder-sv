<script lang="ts">
  import SectionContainer from "./SectionContainer.svelte";

  export let label = "";
  export let checked = false;
</script>

<SectionContainer {label}>
  <input on:change type="checkbox" {checked} />
</SectionContainer>

<style type="text/scss">
  /* your styles go here */
</style>
