<script lang="ts">
  import Select from "../../../components/atoms/Select.svelte";
  import SectionContainer from "./SectionContainer.svelte";

  interface Data {
    label?: string;
    selected?: string;
  }

  export let data: Data;

  const tags = ["div", "section", "a", "img"];
</script>

<SectionContainer label={data.label}>
  <Select
    on:select
    data={{
      options: tags,
      selected: data.selected,
    }}
  />
</SectionContainer>

<style type="text/scss">
</style>
