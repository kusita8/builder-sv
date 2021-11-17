<script lang="ts">
  export let copy: string;
  export let isActive: boolean = false;
</script>

<button class="tab-button" class:active={isActive} on:click>
  {copy}
</button>

<style lang="scss">
  @import "src/styles/variables.scss";

  .tab-button {
    background: none;
    border: none;
    color: $grey-a;
    font-size: 1.4rem;
    font-weight: bold;
    cursor: pointer;
    transition: color 200ms ease;

    &.active,
    &:hover {
      color: $dark-a;
    }
  }
</style>
