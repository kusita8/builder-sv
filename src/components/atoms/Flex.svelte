<script lang="ts">
  import { getClass } from "../../pages/Builder/util/getClass";

  export let justifyContent: "space-between" | "center" | "flex-end" =
    undefined;
  export let alignItems: "center" | "flex-end" = undefined;
  export let gap = "";
  let className: string = undefined;
  export { className as class };

  const classNames = getClass(
    "flex",
    className,
    justifyContent && `justifyContent--${justifyContent}`,
    alignItems && `alignItems--${alignItems}`,
    gap && `gap--${gap}`
  );
</script>

<div class={classNames} on:click>
  <slot />
</div>

<style lang="scss">
  @import "src/styles/variables.scss";

  .flex {
    display: flex;

    &.justifyContent {
      &--space-between {
        justify-content: space-between;
      }
      &--center {
        justify-content: center;
      }
      &--flex-end {
        justify-content: flex-end;
      }
    }
    &.alignItems {
      &--flex-end {
        align-items: flex-end;
      }
      &--center {
        align-items: center;
      }
    }
    &.gap {
      &--05 {
        gap: 0.5rem;
      }
      &--1 {
        gap: 1rem;
      }
    }
  }
</style>
