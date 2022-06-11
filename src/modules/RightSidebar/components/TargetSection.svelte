<script lang="ts">
  import Select from "../../../components/atoms/Select.svelte";
  import SectionContainer from "./SectionContainer.svelte";
  import { createEventDispatcher } from "svelte";
  import { TargetsStore } from "../../../stores/TargetsStore";
  import Flex from "../../../components/atoms/Flex.svelte";
  import Button from "../../../components/atoms/Button.svelte";

  interface Data {
    label?: string;
    selected?: {
      [target: string]: {
        copy: string;
        media: string;
      };
    };
  }

  export let data: Data;
  let addCustomTarget = false;
  let currentTarget = "";

  const dispatch = createEventDispatcher();

  const handleOnSelect = (e, target) => {
    const currentTargetValues = $TargetsStore[target];
    const selectedIndex = currentTargetValues.findIndex(
      (el) => el.copy === e.detail
    );

    if (selectedIndex === currentTargetValues.length - 1) {
      addCustomTarget = true;
      currentTarget = target;
    } else {
      data.selected[target] = currentTargetValues[selectedIndex];
      dispatch("select", data.selected);
    }
  };

  let inputValue = "";
  const handleCustomTargetSubmit = (e) => {
    e.preventDefault();

    if (!inputValue) return;

    const targetValue = Number(inputValue) ? `${inputValue}px` : inputValue;
    const mediaTypesCopy = {
      MAX: "max-width",
      MIN: "min-width",
    };

    const newTarget = {
      copy: targetValue,
      media: `(${mediaTypesCopy[currentTarget]}: ${targetValue})`,
    };

    TargetsStore.add(newTarget, currentTarget);

    data.selected[currentTarget] = newTarget;

    addCustomTarget = false;
    dispatch("select", data.selected);
    inputValue = "";
    currentTarget = "";
  };
</script>

<SectionContainer label={data.label} variant="dark">
  <Flex alignItems="center" gap="1">
    <Select
      on:select={(e) => handleOnSelect(e, "MIN")}
      label="MIN"
      data={{
        options: $TargetsStore["MIN"].map((el) => el.copy),
        selected: data.selected["MIN"].copy,
      }}
    />
    <Select
      on:select={(e) => handleOnSelect(e, "MAX")}
      label="MAX"
      data={{
        options: $TargetsStore["MAX"].map((el) => el.copy),
        selected: data.selected["MAX"].copy,
      }}
    />
  </Flex>
  {#if addCustomTarget}
    <div class="target-add" on:submit={handleCustomTargetSubmit}>
      <form autocomplete="off">
        <Flex gap="1">
          <input
            autocomplete="off"
            bind:value={inputValue}
            type="text"
            id="min-width"
          />
          <Button variant="a" size="small">Add</Button>
        </Flex>
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
