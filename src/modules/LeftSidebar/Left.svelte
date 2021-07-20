<script lang="ts">
  import { ItemsStore } from "../../store";
  import { onLoad } from "../../utils";
  import Component from "./components/Component.svelte";

  let items = [];

  ItemsStore.subscribe((state) => {
    items = state;
  });

  onLoad(() => {
    ItemsStore.add(null, { label: "Body" });
  });
</script>

<aside class="left-sidebar">
  <div class="left-sidebar-items">
    {#each items as item (item)}
      <Component data={item} />
    {/each}
  </div>
</aside>

<style>
  .left-sidebar {
    flex-basis: 20%;
    background: white;
    overflow-y: scroll;
    height: 100%;
    z-index: 2;
    padding-bottom: 40px;
  }
</style>
