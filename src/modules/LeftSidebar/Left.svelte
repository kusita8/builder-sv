<script lang="ts">
  import Button from "../../components/atoms/Button.svelte";

  import Flex from "../../components/atoms/Flex.svelte";

  import { ItemsStore } from "../../stores/ItemsStore";
  import { onLoad } from "../../util/onLoad";
  import Component from "./components/Component.svelte";

  let items = [];

  ItemsStore.subscribe((state) => {
    items = state;
  });

  onLoad(() => {
    ItemsStore.add(null, { defaultId: "body", label: "Body" });
  });
</script>

<aside class="left-sidebar">
  <Flex justifyContent="center" class="button-container">
    <Button>Add element</Button>
  </Flex>
  <div class="left-sidebar-items">
    {#each items as item (item)}
      <Component data={item} />
    {/each}
  </div>
</aside>

<style>
  .left-sidebar {
    flex-basis: 20%;
    min-width: 20%;
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
