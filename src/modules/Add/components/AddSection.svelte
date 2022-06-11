<script lang="ts">
  import Icon from "../../../components/atoms/Icon.svelte";
  import { createEventDispatcher } from "svelte";
  import Button from "../../../components/atoms/Button.svelte";

  const dispatch = createEventDispatcher();

  export let label: string;
  export let items: any[];

  export let showingItems = false;

  const toggleShowingItems = () => {
    showingItems = !showingItems;
  };
</script>

<div class="add-section">
  <div class="add-section__label" on:click={toggleShowingItems}>
    <p>{label}</p>
    <div class="add-section__icon" class:open={showingItems}>
      <Icon name="show" />
    </div>
  </div>
  {#if showingItems}
    <div class="add-section__items">
      {#each items as item}
        <Button
          on:click={() => dispatch("onitemclick", item)}
          className="add-section__item"
        >
          {item.label}
        </Button>
      {/each}
    </div>
  {/if}
</div>

<style type="text/scss">
  @import "src/styles/variables.scss";

  .add-section {
    &__label {
      color: white;
      font-size: 1.4rem;
      font-weight: bold;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
      cursor: pointer;
      width: fit-content;

      p {
        margin-left: 5px;
      }

      .add-section__icon {
        :global(svg) {
          width: 10px;
          fill: white;
          transform: rotate(-90deg);
        }

        &.open {
          :global(svg) {
            transform: rotate(0deg);
          }
        }
      }
    }

    &__items {
      display: flex;
      flex-wrap: wrap;
      gap: 1.1rem;
    }

    &__item {
      font-size: 1.2rem;
    }
  }
</style>
