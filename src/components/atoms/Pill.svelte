<script lang="ts">
  import { getClass } from "../../util/getClass";

  export let variant = "";
  export let tag = "div";
  export let className = "";
  export let size = "";
</script>

<svelte:element
  this={tag}
  class={getClass(
    "pill",
    className,
    variant && `pill--${variant}`,
    size && `pill--${size}`
  )}
  on:click
>
  <slot />
</svelte:element>

<style lang="scss">
  @import "src/styles/variables.scss";

  .pill {
    padding: 0.7rem 1rem;
    background: $dark-b;
    font-weight: bold;
    border-radius: $br;
    color: $white-a;
    border: none;
    font-size: 1.2rem;
    transition: background $tt;
    text-align: center;
    width: fit-content;
    user-select: none;

    &--a {
      background: $grey-b;
    }

    &--b {
      background: $blue-a;
      color: $dark-b;
    }

    &--small {
      font-size: 1rem;
      padding: 0.6rem 0.8rem;
    }
  }
</style>
