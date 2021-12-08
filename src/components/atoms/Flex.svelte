<script lang="ts">
  import { getClass } from "../../util/getClass";

  export let justifyContent: "space-between" | "center" = undefined;
  export let alignItems: "center" | "flex-end" = undefined;
  let className: string = undefined;
  export { className as class };

  const classNames = getClass(
    "flex",
    className,
    justifyContent && `justifyContent--${justifyContent}`,
    alignItems && `alignItems--${alignItems}`
  );
</script>

<div class={classNames}>
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
    }
    &.alignItems {
      &--flex-end {
        align-items: flex-end;
      }
      &--center {
        align-items: center;
      }
    }
  }
</style>
