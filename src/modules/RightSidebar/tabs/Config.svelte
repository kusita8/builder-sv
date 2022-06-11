<script lang="ts">
  import { SelectedItemStore } from "../../../stores/SelectedItemStore";
  import AttributesSection from "../components/AttributesSection.svelte";
  import TagSection from "../components/TagSection.svelte";

  const handleOnAttributeSubmit = (e) => {
    e.preventDefault();

    SelectedItemStore.setAttribute(e.detail.name, e.detail.value);
  };

  const handleOnTagSelect = (e) => {
    SelectedItemStore.setTag(e.detail);
  };
</script>

<TagSection
  on:select={handleOnTagSelect}
  data={{
    label: "Tag",
    selected: $SelectedItemStore.tag,
  }}
/>
<AttributesSection
  on:submit={handleOnAttributeSubmit}
  data={{
    label: "Attributes",
    attributes: $SelectedItemStore.attributes,
  }}
/>

<style>
  /* your styles go here */
</style>
