<script lang="ts">
  import Button from "../../../components/atoms/Button.svelte";
  import userSite from "../../../lib/userSite";
  import { HighlightStore } from "../../../stores/HighlightStore";
  import { ItemsStore } from "../../../stores/ItemsStore";
  import { SelectedItemStore } from "../../../stores/SelectedItemStore";
  import { StyleStore } from "../../../stores/StyleStore";

  const handleReset = () => {
    localStorage.clear();
    userSite.clear();
    ItemsStore.clear();
    StyleStore.clear();
    HighlightStore.clear();
    SelectedItemStore.clear();

    ItemsStore.hydrate();
  };
</script>

<div class="export">
  <Button on:click={handleReset}>Reset</Button>
</div>

<style type="text/scss">
  .export {
    position: absolute;
    top: 50%;
    left: 1.4rem;
    transform: translateY(-50%);
  }
</style>
