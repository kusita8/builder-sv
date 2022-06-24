<script lang="ts">
  import Button from "../../components/atoms/Button.svelte";

  import Flex from "../../components/atoms/Flex.svelte";
  import Icon from "../../components/atoms/Icon.svelte";
  import selectedItemInput from "../../lib/selectedItemInput";
  import { AddStore } from "../../stores/AddStore";

  import { ItemsStore } from "../../stores/ItemsStore";
  import { StyleStore } from "../../stores/StyleStore";
  import { onLoad } from "../../util/onLoad";
  import Component from "./components/Component.svelte";

  onLoad(() => {
    const hydrateStores = [ItemsStore, StyleStore, selectedItemInput];

    hydrateStores.forEach((store, index) => {
      setTimeout(() => store.hydrate(), index * 150);
    });
  });
</script>

<aside class="left-sidebar">
  <Flex justifyContent="center" class="button-container">
    <Button
      variant="b"
      on:click={$ItemsStore ? () => AddStore.set($ItemsStore[0]) : undefined}
      >Add element <Icon name="add" /></Button
    >
  </Flex>
  <div class="left-sidebar-items">
    {#each $ItemsStore as item (item)}
      <Component data={item} />
    {/each}
  </div>
</aside>

<style>
  .left-sidebar {
    flex-basis: var(--left-sidebar-width);
    min-width: var(--left-sidebar-width);
    background: white;
    overflow-y: auto;
    height: 100%;
    z-index: 2;
    padding-bottom: 40px;
  }

  .left-sidebar :global(.button-container) {
    margin: 1.3rem 0;
  }
</style>
