<script lang="ts">
  import Select from "../../../components/Select.svelte";
  import SectionContainer from "./SectionContainer.svelte";
  import { createEventDispatcher } from "svelte";

  interface Data {
    label?: string;
    selected?: {
      copy: string;
      media: string;
    };
  }

  export let data: Data;
  let addCustomTarget = false;

  const dispatch = createEventDispatcher();

  const targets = [
    {
      media: "ALL",
      copy: "ALL",
    },
    {
      media: "(max-width: 400px)",
      copy: "Max width: 400px",
    },
    {
      media: "",
      copy: "Add custom...",
    },
  ];

  const handleOnSelect = (e) => {
    const selectedIndex = targets.findIndex((el) => el.copy === e.detail);

    if (selectedIndex === targets.length - 1) {
      addCustomTarget = true;
    } else {
      dispatch("select", targets[selectedIndex]);
    }
  };

  let minWidth = "";
  let maxWidth = "";
  const handleCustomTargetSubmit = (e) => {
    e.preventDefault();

    const medias = [
      { mediaCopy: "min-width", copy: "Min width", value: minWidth },
      { mediaCopy: "max-width", copy: "Max width", value: maxWidth },
    ];

    const values = medias
      .filter((el) => el.value)
      .reduce(
        (acc, cur) => {
          const media = `(${cur.mediaCopy}: ${cur.value})`;
          const copy = `${cur.copy}: ${cur.value}`;

          if (acc.media) {
            return {
              media: acc.media + ` and ${media}`,
              copy: acc.copy + ` and ${copy.toLocaleLowerCase()}`,
            };
          }
          return {
            media,
            copy,
          };
        },
        { media: "", copy: "" }
      );

    const newTarget = {
      copy: values.copy,
      media: values.media,
    };

    const previousIndex = targets.findIndex((el) => el.media === values.media);
    if (previousIndex === -1) {
      targets.splice(targets.length - 1, 0, newTarget);
    } else {
      targets.splice(previousIndex, 1, newTarget);
    }

    addCustomTarget = false;
    dispatch("select", newTarget);
    minWidth = "";
    maxWidth = "";
  };
</script>

<SectionContainer label={data.label}>
  <Select
    on:select={handleOnSelect}
    data={{
      options: targets.map((el) => el.copy),
      selected: data.selected.copy,
    }}
  />
  {#if addCustomTarget}
    <div class="target-add" on:submit={handleCustomTargetSubmit}>
      <form autocomplete="off">
        <label for="min-width">Min width</label>
        <input
          autocomplete="off"
          bind:value={minWidth}
          type="text"
          id="min-width"
        />
        <label for="max-width">Max width</label>
        <input
          autocomplete="off"
          bind:value={maxWidth}
          type="text"
          id="max-width"
        />
        <button>add</button>
      </form>
    </div>
  {/if}
</SectionContainer>

<style type="text/scss">
  .target-add {
    margin-top: 10px;

    input {
      &:not(:last-of-type) {
        margin-bottom: 10px;
      }
    }
  }
</style>
