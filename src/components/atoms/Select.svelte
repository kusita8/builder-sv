<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { closeOnOutsideClick } from "../../util/closeOnOutsideClick";
  import { getClass } from "../../util/getClass";
  import { getId } from "../../util/getId";

  interface Data {
    options: string[];
    selected?: string;
  }

  export let data: Data;
  export let label = "";
  export let variant = "";
  const selectUniqueClass = getId();
  let showOptions = false;

  const dispatch = createEventDispatcher();

  const forward = (option) => {
    showOptions = false;

    if (option !== data.selected) {
      data.selected = option;

      dispatch("select", option);
    }
  };

  const handleCurrentClick = () => {
    showOptions = !showOptions;
  };

  closeOnOutsideClick(`.${selectUniqueClass}`, () => {
    showOptions = false;
  });
</script>

<div
  class={getClass("select", variant && `select--${variant}`, selectUniqueClass)}
>
  {#if label}
    <span class="select__label">{label}</span>
  {/if}
  <div class="select__current" on:click={handleCurrentClick}>
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
  @import "src/styles/variables.scss";

  .select {
    position: relative;
    color: $dark-a;
    user-select: none;
    width: 100%;

    &__label {
      color: $white-a;
      display: inline-block;
      margin-bottom: 0.4rem;
    }

    &__current {
      padding: 8px 5px;
      border-radius: 0.4rem;
      background: $white-a;
    }

    &__options {
      position: absolute;
      top: 100%;
      width: 100%;
      z-index: 1;
      border: 0.05rem solid $dark-a;
      border-radius: 0 0 0.4rem 0.4rem;
    }

    &__option {
      padding: 0.7rem 0.5rem;
      border-bottom: 0.05rem solid $dark-a;
      background: $white-a;
      cursor: pointer;

      &:hover {
        background: rgb(212, 212, 212);
      }
    }

    &--a {
      .select__current {
        border: 1px solid $dark-a;
      }
    }
  }
</style>
