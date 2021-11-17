<script lang="ts">
  import { StyleStore } from "../../../stores/StyleStore";
  import { SelectedItemStore } from "../../../stores/SelectedItemStore";
  import InputSection from "../components/InputSection.svelte";
  import TargetSection from "../components/TargetSection.svelte";

  let target = {
    copy: "ALL",
    media: "ALL",
  };

  const handleOnTargetSelect = (e) => {
    target = e.detail;
  };

  const handleOnInputStyle = (e) => {
    StyleStore.add($SelectedItemStore, e.target.value, target.media);
  };

  $: style = StyleStore.get($SelectedItemStore.className, target);
</script>

<TargetSection
  on:select={handleOnTargetSelect}
  data={{
    label: "Target",
    selected: target,
  }}
/>
<InputSection
  on:input={handleOnInputStyle}
  bind:value={style}
  data={{
    label: "Styles",
    big: true,
  }}
/>

<style>
  /* your styles go here */
</style>
