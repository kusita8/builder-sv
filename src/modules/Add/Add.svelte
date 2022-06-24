<script lang="ts">
  import Pill from "../../components/atoms/Pill.svelte";
  import { ENUMS } from "../../enums";
  import { AddStore } from "../../stores/AddStore";
  import { ItemsStore } from "../../stores/ItemsStore";
  import { closeOnOutsideClick } from "../../util/closeOnOutsideClick";
  import AddSection from "./components/AddSection.svelte";

  let showAdd = false;

  const HandleItemClick = (e) => {
    showAdd = false;
    ItemsStore.add(e.detail, $AddStore.parent);
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
    <div class="add__to">
      Add to: <b>{$AddStore.parent?.label || ""}</b>
    </div>
    <AddSection
      on:onitemclick={HandleItemClick}
      label="Elements"
      items={ENUMS.ELEMENTS}
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
  @import "src/styles/variables.scss";

  .add {
    position: absolute;
    top: calc(var(--header-height) + 2rem);
    left: calc(var(--left-sidebar-width) + 2.9rem);
    z-index: 10;
    background: $dark-a;
    width: 22%;
    min-width: 20rem;
    max-width: 30rem;
    border-radius: 2.5%;
    padding: 1.5rem 1.8rem 2.6rem;

    &__to {
      margin-bottom: 1.6rem;
      font-size: 1.3rem;
      color: $white-a;
      font-weight: 500;
      position: relative;
      width: fit-content;

      &::after {
        content: "";
        height: 0.2rem;
        width: 100%;
        position: absolute;
        bottom: -0.5rem;
        left: 0;
        border-radius: 0.4rem;
        background: $blue-c;
      }
    }
  }
</style>
