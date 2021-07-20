<script lang="ts">
  import { DragHandler } from "../../../lib/drag";
  import Icon from "../../../components/Icon.svelte";
  import { ItemsStore, selectedItem } from "../../../store";
  import type { Item } from "../../../global";
  export let data: Item;

  const style = `padding-left: ${data.depth * 10}px`;
  let selected = false;

  selectedItem.subscribe((item: Item) => {
    if (item.id === data.id) {
      selected = true;
    } else {
      selected = false;
    }
  });

  const selectComponent = () => {
    selectedItem.set(data);
  };

  const addChildren = (e) => {
    e.stopPropagation();
    ItemsStore.add(data);
  };

  const toggleChildren = (e) => {
    e.stopPropagation();

    if (data.showingChildren) {
      ItemsStore.hideChildren(data);
    } else {
      ItemsStore.showChildren(data);
    }
  };
</script>

<div
  class:selected
  data-id={data.id}
  {style}
  class="component"
  on:click={selectComponent}
  on:mousedown={(e) => DragHandler(e, data)}
>
  <div class="component__inner">
    {#if data.hasChildren}
      <div
        class:open={data.showingChildren}
        class="component__show-icon"
        on:click={toggleChildren}
      >
        <Icon name="show" />
      </div>
    {/if}
    <span>{data.label} - {data.id}</span>
    <div class="component__add" on:click={addChildren}>
      <Icon name="add" />
    </div>
  </div>
</div>

<style type="text/scss">
  :global(.component.transition) {
    transition: transform 120ms linear;
  }

  :global(.component.grab) {
    cursor: grabbing;
    z-index: 15;
  }

  .component {
    width: 100%;
    padding: 11px 0;
    position: relative;

    &.selected,
    &:hover {
      background: #e6ecf9;
    }

    &.hidden {
      display: none;
    }

    &__inner {
      display: flex;
      align-items: center;
      position: relative;
      padding-right: 22px;
    }

    span {
      display: inline-block;
      font-size: 9px;
      padding-left: 14px;
    }

    &__add :global(svg) {
      width: 13px;
      height: 13px;
    }
  }

  .component__show-icon + span {
    padding-left: 0;
  }

  .component__show-icon {
    width: 14px;
    height: 14px;
    display: flex;
    cursor: pointer;
    padding: 4px;
    transform: rotate(-90deg);

    &:hover {
      background: rgb(224, 224, 224);
    }

    &.open {
      transform: rotate(0deg);
    }

    :global(svg) {
      width: 100%;
      height: 100%;
    }
  }

  .component__add {
    margin-left: auto;
  }
</style>
