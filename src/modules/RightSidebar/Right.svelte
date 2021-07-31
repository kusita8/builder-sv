<script lang="ts">
  import { AddStore } from "../../stores/AddStore";

  import { SelectedItemStore } from "../../stores/SelectedItemStore";
  import { StyleStore } from "../../stores/StyleStore";
  import AttributesSection from "./components/AttributesSection.svelte";
  import CheckboxSection from "./components/CheckboxSection.svelte";
  import InputSection from "./components/InputSection.svelte";
  import TagSection from "./components/TagSection.svelte";
  import TargetSection from "./components/TargetSection.svelte";

  let target = {
    copy: "ALL",
    media: "ALL",
  };

  const handleOnInputLabel = (e) => {
    SelectedItemStore.setValue("label", e.target.value);
  };

  const handleOnInputStyle = (e) => {
    StyleStore.add($SelectedItemStore, e.target.value, target.media);
  };

  const handleOnAttributeSubmit = (e) => {
    e.preventDefault();

    SelectedItemStore.setAttribute(e.detail.name, e.detail.value);
  };

  const handleOnTagSelect = (e) => {
    SelectedItemStore.setTag(e.detail);
  };

  const handleOnTargetSelect = (e) => {
    target = e.detail;
  };

  const handleOnComponentCheckbox = () => {
    AddStore.addComponent($SelectedItemStore);
  };

  $: style = StyleStore.get($SelectedItemStore.id, target);
</script>

<aside class="right-sidebar">
  <div class="right-sidebar__inner">
    {#if Object.keys($SelectedItemStore).length}
      <div class="inputs-container">
        <CheckboxSection
          on:change={handleOnComponentCheckbox}
          label="Use as component"
        />
        <TargetSection
          on:select={handleOnTargetSelect}
          data={{
            label: "Target",
            selected: target,
          }}
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
        <InputSection
          on:input={handleOnInputStyle}
          bind:value={style}
          data={{
            label: "Styles",
            big: true,
          }}
        />
        <AttributesSection
          on:submit={handleOnAttributeSubmit}
          data={{
            label: "Attributes",
            attributes: $SelectedItemStore.attributes,
          }}
        />
      </div>
    {/if}
  </div>
</aside>

<style type="text/scss">
  .right-sidebar {
    flex-basis: 20%;
    background: white;
    z-index: 2;

    .right-sidebar__inner {
      padding-top: 20px;
      position: relative;

      .inputs-container {
        max-width: 100%;
        font-size: 9px;
      }
    }
  }
</style>
