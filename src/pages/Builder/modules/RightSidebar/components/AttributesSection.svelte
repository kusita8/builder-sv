<script lang="ts">
  import type { Attribute } from "../../../global";
  import SectionContainer from "./SectionContainer.svelte";
  import { createEventDispatcher } from "svelte";
  import AddAttributeModal from "./AddAttributeModal.svelte";
  import Icon from "../../../components/atoms/Icon.svelte";
  import Flex from "../../../components/atoms/Flex.svelte";
  import { SelectedItemStore } from "../../../stores/SelectedItemStore";

  interface Data {
    label?: string;
    attributes?: Attribute;
  }

  export let data: Data;

  let addAttributeModal = false;
  let name = "";
  let value = "";

  const dispatch = createEventDispatcher();

  const closeModal = () => (addAttributeModal = false);

  function forward(e) {
    e.preventDefault();

    if (name.trim() && value.trim()) {
      closeModal();
      dispatch("submit", { name, value });

      name = "";
      value = "";
    }
  }

  const formatText = (string) => {
    const maxLength = 25;

    if (string.length > maxLength) {
      return `${string.slice(0, maxLength)}...`;
    }

    return string;
  };
</script>

<SectionContainer
  label={data.label}
  addIcon
  on:click={() => (addAttributeModal = true)}
>
  <div class="attrs-current">
    {#each Object.keys(data.attributes) as attrKey (attrKey)}
      <div class="attr-item">
        <Flex alignItems="center" class="attr-item-container">
          <div class="attr-item-name">{attrKey}:</div>
          <div class="attr-item-value" title={data.attributes[attrKey]}>
            {formatText(data.attributes[attrKey])}
          </div>
        </Flex>
        <button
          class="attr-item__button"
          on:click={() => SelectedItemStore.removeAttribute(attrKey)}
        >
          <Icon name="close" />
        </button>
      </div>
    {/each}
  </div>
  {#if addAttributeModal}
    <AddAttributeModal
      onClose={closeModal}
      on:submit={forward}
      bind:name
      bind:value
    />
  {/if}
</SectionContainer>

<style type="text/scss">
  @import "src/styles/variables.scss";

  .attr-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 1rem;
    background: $grey-c;

    .attr-item-value {
      margin-left: 0.5rem;
      white-space: nowrap;
    }

    :global(.attr-item-container) {
      overflow: hidden;
    }

    &__button {
      cursor: pointer;
      padding: 0.3rem;
      background: none;
      outline: none;
      border: none;
    }
  }
</style>
