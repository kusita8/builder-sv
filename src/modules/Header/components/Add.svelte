<script lang="ts">
  import { AddStore } from "../../../stores/AddStore";
  import { ItemsStore } from "../../../stores/ItemsStore";
  import { closeOnOutsideClick } from "../../../utils";
  import AddSection from "./AddSection.svelte";

  let showAdd = false;

  const elementsItems = [
    { label: "Div", tag: "div" },
    { label: "Section", tag: "section" },
  ];

  const HandleItemClick = (e) => {
    showAdd = false;
    ItemsStore.add($AddStore.parent, e.detail);
    AddStore.clear();
  };

  AddStore.subscribe(({ parent }) => {
    if (parent && !showAdd) {
      showAdd = true;

      closeOnOutsideClick(".add", () => {
        showAdd = false;
      });
    }
  });
</script>

{#if showAdd}
  <div class="add">
    <div class="add__to">Add to: {$AddStore.parent.label || ""}</div>
    <AddSection
      on:onitemclick={HandleItemClick}
      label="Elements"
      items={elementsItems}
      showingItems={true}
    />
    {#if $AddStore.hasComponets}
      <AddSection
        on:onitemclick={HandleItemClick}
        label="Components"
        items={$AddStore.components}
      />
    {/if}
  </div>
{/if}

<style type="text/scss">
  .add {
    position: absolute;
    top: 100%;
    z-index: 10;
    background: white;
    width: 500px;
    left: 4px;
    border: 1px solid black;

    &__to {
      padding: 20px 10px;
    }
  }
</style>
