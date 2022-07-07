<script lang="ts">
  import Select from "../../../components/atoms/Select.svelte";
  import { ENUMS } from "../../../enums";
  import SectionContainer from "./SectionContainer.svelte";

  interface Data {
    label?: string;
    selected?: string;
  }

  export let data: Data;

  const tags = Object.keys(ENUMS.ELEMENTS)
    .reduce((acc, key) => [...acc, ...ENUMS.ELEMENTS[key]], [])
    .map((el) => el.tag);
</script>

<SectionContainer label={data.label}>
  <Select
    on:select
    variant="a"
    data={{
      options: tags,
      selected: data.selected,
    }}
  />
</SectionContainer>

<style type="text/scss">
</style>
