<script lang="ts">
  import SectionContainer from "./SectionContainer.svelte";

  interface Data {
    label?: string;
    big?: boolean;
  }

  export let value = "";
  export let data: Data;

  const inputGlobalAttrs = {
    name: data.label,
    id: data.label,
  };
</script>

<SectionContainer label={data.label}>
  {#if !data.big}
    <input
      {...inputGlobalAttrs}
      on:input
      bind:value
      type="text"
      autocomplete="off"
      spellcheck="false"
    />
  {:else}
    <textarea
      {...inputGlobalAttrs}
      on:input
      bind:value
      cols="30"
      rows="10"
      autocomplete="off"
      spellcheck="false"
    />
  {/if}
</SectionContainer>

<style type="text/scss">
  input,
  textarea {
    width: 100%;
    resize: none;
    outline: none;
  }

  textarea {
    border-radius: 0.4rem;
    padding: 0.8rem 1.3rem;
  }
</style>
