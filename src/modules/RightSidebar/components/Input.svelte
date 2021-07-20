<script lang="ts">
  interface Data {
    value?: string;
    label?: string;
    big?: boolean;
  }

  export let data: Data;
  // your script goes here

  const inputGlobalAttrs = {
    name: data.label,
    id: data.label,
  };
</script>

<div class="input-container">
  <label for={data.label}>{data.label}</label>
  {#if !data.big}
    <input
      {...inputGlobalAttrs}
      on:input
      type="text"
      value={data.value || ""}
    />
  {:else}
    <textarea on:input {...inputGlobalAttrs} cols="30" rows="10" />
  {/if}
</div>

<style type="text/scss">
  .input-container {
    max-width: 80%;
    margin: 20px auto 0;

    label {
      font-size: 12px;
    }

    input,
    textarea {
      margin-top: 10px;
      width: 100%;
      resize: none;
    }
  }
</style>
