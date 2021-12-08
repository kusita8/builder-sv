<script lang="ts">
  import { createEventDispatcher } from "svelte";

  interface Data {
    options: string[];
    selected?: string;
  }

  export let data: Data;
  let showOptions = false;

  const dispatch = createEventDispatcher();

  function forward(option) {
    showOptions = false;

    if (option !== data.selected) {
      data.selected = option;

      dispatch("select", option);
    }
  }
</script>

<div class="select">
  <div class="select__current" on:click={() => (showOptions = !showOptions)}>
    {data.selected || data.options[0]}
  </div>
  {#if showOptions}
    <div class="select__options">
      {#each data.options as option}
        <div class="select__option" on:click={() => forward(option)}>
          <span>{option}</span>
        </div>
      {/each}
    </div>
  {/if}
</div>

<style type="text/scss">
  .select {
    position: relative;

    &__current {
      padding: 8px 5px;
      border: 1px solid black;
    }

    &__options {
      position: absolute;
      top: 100%;
      width: 100%;
      z-index: 1;
    }

    &__option {
      padding: 5px;
      border: 1px solid black;
      background: white;
      cursor: pointer;

      &:hover {
        background: rgb(212, 212, 212);
      }
    }
  }
</style>
