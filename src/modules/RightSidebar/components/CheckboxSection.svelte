<script lang="ts">
  import SectionContainer from "./SectionContainer.svelte";

  export let label = "";
</script>

<SectionContainer {label}>
  <input on:change type="checkbox" />
</SectionContainer>

<style type="text/scss">
  /* your styles go here */
</style>
