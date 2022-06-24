<script lang="ts">
  import Button from "../../../components/atoms/Button.svelte";
  import Flex from "../../../components/atoms/Flex.svelte";
  import Input from "../../../components/atoms/Input.svelte";

  export let name = "";
  export let value = "";
  export let onClose = () => {};
</script>

<div class="add-attribute" on:click={onClose}>
  <div class="add-attribute__inner" on:click|stopPropagation>
    <div class="add-attribute__title">Add attribute</div>
    <form on:submit autocomplete="off">
      <Input required label="Name" bind:value={name} />
      <Input required label="Content" bind:value />
      <Flex justifyContent="flex-end">
        <Button>Add</Button>
      </Flex>
    </form>
  </div>
</div>

<style type="text/scss">
  @import "src/styles/variables.scss";

  .add-attribute {
    position: absolute;
    background: $dark-d;
    width: 100%;
    height: calc(100vh - var(--header-height));
    left: 0;
    top: 0%;
    display: flex;
    align-items: center;
    justify-content: center;

    &__inner {
      background: $dark-a;
      padding: 1.6rem 2rem;
      width: 85%;
      border-radius: 0.6rem;
    }

    &__title {
      color: $white-a;
      font-size: 1.6rem;
      font-weight: 500;
      margin-bottom: 1.2rem;
    }

    :global(.input) {
      margin-bottom: 1rem;
    }

    :global(button) {
      margin-top: 1rem;
    }
  }
</style>
