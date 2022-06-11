<script lang="ts">
  import { DragHandler } from "../../../lib/drag";
  import Icon from "../../../components/atoms/Icon.svelte";
  import { ItemsStore } from "../../../stores/ItemsStore";
  import { SelectedItemStore } from "../../../stores/SelectedItemStore";
  import type { Item } from "../../../global";
  import { AddStore } from "../../../stores/AddStore";
  export let data: Item;

  const style = `padding-left: ${data.depth * 10}px`;
  let selected = false;

  SelectedItemStore.subscribe((item: Item) => {
    if (item.id === data.id) selected = true;
    else selected = false;
  });

  const selectComponent = () => {
    SelectedItemStore.set(data);
  };

  const handleLabelChange = (e) => {
    e.stopPropagation();
    if (!selected) selectComponent();
    const value = e.target.value;
    data["label"] = value;
    SelectedItemStore.setValue("label", value);
  };

  const addChildren = (e) => {
    e.stopPropagation();
    AddStore.set(data);
    // ItemsStore.add(data);
  };

  const toggleChildren = (e) => {
    e.stopPropagation();

    if (data.showingChildren) {
      ItemsStore.hideChildren(data);
    } else {
      ItemsStore.showChildren(data);
    }
  };

  const handleBlur = (e) => {
    e.target.scrollLeft = 0;
  };
</script>

<div
  class:selected
  data-id={data.id}
  {style}
  class="component"
  on:click={() => selectComponent()}
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
    <div class="label">
      <textarea
        on:mousedown={(e) => e.stopPropagation()}
        on:click={(e) => e.stopPropagation()}
        on:input={handleLabelChange}
        on:blur={handleBlur}
        rows="1"
        wrap="off"
        value={data.label}
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      />
    </div>
    <div class="component__add" on:click={addChildren}>
      <Icon name="add_b" />
    </div>
  </div>
</div>

<style type="text/scss">
  @import "src/styles/variables.scss";

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
    &:focus-within,
    &:hover {
      background: $blue-a;
    }

    &.selected,
    &:hover,
    &:focus-within {
      .label {
        border-bottom: 1px solid $dark-a;
      }
    }

    &__inner {
      display: flex;
      align-items: center;
      position: relative;
      padding-right: 22px;
    }

    .label {
      height: 20px;
      margin-left: 10px;

      textarea {
        font-size: 9px;
        line-height: 19px;
        resize: none;
        border: 0;
        border-radius: 0;
        height: 100%;
        padding-left: 2px;
        border-radius: 1px;
        outline: none;
        background: transparent;

        &::-webkit-scrollbar {
          display: none;
        }
      }
    }

    &__add :global(svg) {
      width: 1.6rem;
      height: 1.6rem;
    }
  }

  .component__show-icon {
    width: 14px;
    height: 14px;
    display: flex;
    cursor: pointer;
    padding: 4px;
    transform: rotate(-90deg);
    position: absolute;
    left: -6px;
    top: 2px;

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
