<script lang="ts">
  import { StyleStore } from "../../../stores/StyleStore";
  import { SelectedItemStore } from "../../../stores/SelectedItemStore";
  import InputSection from "../components/InputSection.svelte";
  import TargetSection from "../components/TargetSection.svelte";

  let currentTarget = {
    MAX: {
      copy: "None",
      media: "ALL",
    },
    MIN: {
      copy: "None",
      media: "ALL",
    },
  };

  let currentMedia = "ALL and ALL";

  const handleOnTargetSelect = (e) => {
    currentTarget = e.detail;

    let newCurrentMedia = "";
    for (const target in e.detail) {
      const mediaCopy = e.detail[target].media;

      if (
        !newCurrentMedia ||
        (newCurrentMedia.includes("ALL") && !mediaCopy.includes("ALL"))
      )
        newCurrentMedia = mediaCopy;
      else if (mediaCopy.includes("ALL") || !newCurrentMedia.includes("ALL"))
        newCurrentMedia = `${newCurrentMedia} and ${mediaCopy}`;
    }
    currentMedia = newCurrentMedia;
  };

  const handleOnInputStyle = (e) => {
    StyleStore.add($SelectedItemStore, e.target.value, currentMedia);
  };

  $: style = StyleStore.get($SelectedItemStore.className, currentMedia);

  console.log(style);
</script>

<TargetSection
  on:select={handleOnTargetSelect}
  data={{
    label: "Target",
    selected: currentTarget,
  }}
/>
<InputSection
  on:input={handleOnInputStyle}
  bind:value={style}
  data={{
    label: "Styles",
    big: true,
  }}
/>
