<script lang="typescript">
  import type { Attribute } from "../../../global";
  import SectionContainer from "./SectionContainer.svelte";
  import { createEventDispatcher } from "svelte";

  interface Data {
    label?: string;
    attributes?: Attribute;
  }

  export let data: Data;

  let name = "";
  let value = "";

  const dispatch = createEventDispatcher();

  function forward(e) {
    e.preventDefault();

    if (name.trim() && value.trim()) {
      dispatch("submit", { name, value });

      name = "";
      value = "";
    }
  }

  const formatText = (string) => {
    const maxLength = 30;

    if (string.length > maxLength) {
      return `${string.slice(0, maxLength)}...`;
    }

    return string;
  };
</script>

<SectionContainer label={data.label}>
  <div class="attrs-current">
    {#each Object.keys(data.attributes) as attrKey (attrKey)}
      <div class="attr-item">
        <div class="attr-item-name">{attrKey}:</div>
        <div class="attr-item-value" title={data.attributes[attrKey]}>
          {formatText(data.attributes[attrKey])}
        </div>
      </div>
    {/each}
  </div>
  <div class="attrs-add">
    <form on:submit={forward} autocomplete="off">
      <input
        autocomplete="off"
        type="text"
        name="name"
        id="attr-name"
        bind:value={name}
      />
      <input
        autocomplete="off"
        type="text"
        name="value"
        id="attr-value"
        bind:value
      />
      <button>add</button>
    </form>
  </div>
</SectionContainer>

<style type="text/scss">
  .attr-item {
    display: flex;
    border: 1px solid black;
    margin-bottom: 5px;

    .attr-item-value {
      margin-left: 10px;
      white-space: nowrap;
    }
  }
</style>
