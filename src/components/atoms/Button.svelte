<script lang="ts">
</script>

<button on:click>
  <slot />
</button>

<style lang="scss">
  @import "src/styles/variables.scss";

  button {
    width: 10rem;
    padding: 0.6rem 0;
    background: $dark-b;
    font-weight: bold;
    border-radius: $br;
    color: $white-a;
    border: none;
    font-size: 1.2rem;
    cursor: pointer;
    transition: background $tt;

    &:hover {
      background: $grey-b;
    }
  }
</style>
