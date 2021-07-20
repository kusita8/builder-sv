<script lang="ts">
  import type { Item } from "../../global";

  import { selectedItem, styleStore } from "../../store";
  import Input from "./components/Input.svelte";

  let item = null as Item;

  selectedItem.subscribe((val: Item) => {
    item = val;
  });

  const handleOnInputLabel = (e) => {
    selectedItem.setValue("label", e.target.value);
  };

  const handleOnInputStyle = (e) => {
    styleStore.add(item, e.target.value);
  };
</script>

<aside class="right-sidebar">
  <div class="right-sidebar__inner">
    {#if item}
      <div class="inputs-container">
        <Input
          data={{
            value: item.label,
            label: "Label",
          }}
          on:input={handleOnInputLabel}
        />
        <Input
          data={{
            value: item.label,
            label: "Styles",
            big: true,
          }}
          on:input={handleOnInputStyle}
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

      .inputs-container {
        max-width: 100%;
        font-size: 9px;
      }

      textarea,
      input {
        width: 100%;
        font-family: inherit;
        font-size: inherit;
      }

      label {
        margin-bottom: 11px;
        display: block;
      }

      textarea {
        height: 100px;
        resize: none;
      }
    }
  }
</style>
