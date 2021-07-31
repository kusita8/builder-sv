<script lang="ts">
  import Icon from "../../../components/Icon.svelte";
  import { createEventDispatcher } from "svelte";

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
    <div class="add-section__icon" class:open={showingItems}>
      <Icon name="show" />
    </div>
    <p>{label}</p>
  </div>
  {#if showingItems}
    <div class="add-section__items">
      {#each items as item}
        <div
          on:click={() => dispatch("onitemclick", item)}
          class="add-section__item"
        >
          {item.label}
        </div>
      {/each}
    </div>
  {/if}
</div>

<style type="text/scss">
  .add-section {
    &__label {
      display: flex;
      background: grey;
      color: white;
      border: 1px solid black;
      padding: 10px 20px;
      cursor: pointer;

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
      padding: 20px;
    }

    &__item {
      padding: 5px 10px;
      background: thistle;
      cursor: pointer;

      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
</style>
