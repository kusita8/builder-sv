<script lang="ts">
  import { getClass } from "../../../util/getClass";

  export let label: string;
  export let variant = "";
</script>

<div
  class={getClass("input-container", variant && `input-container--${variant}`)}
>
  <p>{label}</p>
  <slot />
</div>

<style type="text/scss">
  @import "src/styles/variables.scss";

  .input-container {
    max-width: 80%;
    margin: 0 auto 0;
    padding: 1.1rem 1.5rem 1.4rem;
    border-radius: 0.4rem;

    &:first-of-type {
      margin: 1rem auto 0;
    }

    p {
      font-size: 12px;
      margin-bottom: 10px;
    }

    &--dark {
      background: $dark-c;
      color: $white-a;
    }
  }
</style>
