<script lang="ts">
  import Button from "../../../components/atoms/Button.svelte";
  import { exportWebsite } from "../../../lib/exportWebsite";
</script>

<div class="export">
  <Button on:click={() => exportWebsite()}>Export</Button>
</div>

<style type="text/scss">
  .export {
    position: absolute;
    top: 50%;
    right: 1.4rem;
    transform: translateY(-50%);
  }
</style>
