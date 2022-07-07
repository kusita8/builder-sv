<script lang="ts">
  import Button from "../../components/atoms/Button.svelte";

  import Flex from "../../components/atoms/Flex.svelte";
  import Icon from "../../components/atoms/Icon.svelte";
  import { AddStore } from "../../stores/AddStore";

  import { ItemsStore } from "../../stores/ItemsStore";
  import Component from "./components/Component.svelte";
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
    height: 100%;
    z-index: 2;
  }

  .left-sidebar-items {
    overflow-y: auto;
    height: 100%;
    padding-bottom: 7rem;
  }

  .left-sidebar :global(.button-container) {
    margin: 1.3rem 0;
  }
</style>
