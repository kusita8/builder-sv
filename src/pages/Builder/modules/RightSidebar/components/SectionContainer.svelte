<script lang="ts">
  import Flex from "../../../components/atoms/Flex.svelte";
  import Icon from "../../../components/atoms/Icon.svelte";

  import { getClass } from "../../../util/getClass";

  export let label: string;
  export let variant = "";
  export let addIcon = false;
</script>

<div
  class={getClass(
    "input-container",
    variant && `input-container--${variant}`,
    addIcon && `input-container--add-icon`
  )}
>
  <Flex alignItems="center" class="input-container__label" gap="05" on:click>
    <p>{label}</p>
    {#if addIcon}
      <Icon name="add" />
    {/if}
  </Flex>
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

    :global(.input-container__label) {
      margin-bottom: 1rem;
    }
    p {
      font-size: 1.2rem;
    }

    &--dark {
      background: $dark-c;
      color: $white-a;
    }

    &--add-icon {
      :global(.input-container__label) {
        cursor: pointer;
      }
    }
  }
</style>
