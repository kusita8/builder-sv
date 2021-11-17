<script lang="ts">
  import { AddStore } from "../../../stores/AddStore";
  import { SelectedItemStore } from "../../../stores/SelectedItemStore";
  import AttributesSection from "../components/AttributesSection.svelte";
  import CheckboxSection from "../components/CheckboxSection.svelte";
  import InputSection from "../components/InputSection.svelte";
  import TagSection from "../components/TagSection.svelte";

  const handleOnInputLabel = (e) => {
    SelectedItemStore.setValue("label", e.target.value);
  };

  const handleOnAttributeSubmit = (e) => {
    e.preventDefault();

    SelectedItemStore.setAttribute(e.detail.name, e.detail.value);
  };

  const handleOnTagSelect = (e) => {
    SelectedItemStore.setTag(e.detail);
  };

  const handleOnComponentCheckbox = () => {
    SelectedItemStore.setAsComponent();
    AddStore.addComponent($SelectedItemStore);
  };
</script>

<CheckboxSection
  on:change={handleOnComponentCheckbox}
  label="Use as component"
  checked={$SelectedItemStore.isComponent}
/>
<TagSection
  on:select={handleOnTagSelect}
  data={{
    label: "Tag",
    selected: $SelectedItemStore.tag,
  }}
/>
<InputSection
  on:input={handleOnInputLabel}
  bind:value={$SelectedItemStore.label}
  data={{
    label: "Label",
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
