<script lang="ts">
  import Pill from "./Pill.svelte";
  export let className = "";
</script>

<div>
  <Pill {...$$props} {className} tag="button" on:click>
    <slot />
  </Pill>
</div>

<style lang="scss">
  @import "src/styles/variables.scss";

  div :global(.pill) {
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;

    &:hover {
      background: $grey-b;
    }
  }

  div :global(.pill.pill--b) {
    &:hover {
      background: $blue-b;
    }
  }
</style>
