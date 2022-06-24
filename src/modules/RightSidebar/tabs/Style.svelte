<script lang="ts">
  import { StyleStore } from "../../../stores/StyleStore";
  import { SelectedItemStore } from "../../../stores/SelectedItemStore";
  import InputSection from "../components/InputSection.svelte";
  import TargetSection from "../components/TargetSection.svelte";
  import { debounce } from "../../../util/debounce";
  import { onDestroy, onMount } from "svelte";

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
  let style = "";

  const updateSelectedStyle = () => {
    style = StyleStore.get($SelectedItemStore.className, currentMedia);
  };

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
      else if (
        (mediaCopy.includes("ALL") && newCurrentMedia.includes("ALL")) ||
        (!mediaCopy.includes("ALL") && !newCurrentMedia.includes("ALL"))
      )
        newCurrentMedia = `${newCurrentMedia} and ${mediaCopy}`;
    }

    currentMedia = newCurrentMedia;
  };

  const handleOnInputStyle = debounce((e) => {
    StyleStore.add($SelectedItemStore, e.target.value, currentMedia);
  }, 100);

  const unsubscribe = SelectedItemStore.subscribe(updateSelectedStyle);

  $: {
    currentMedia;
    updateSelectedStyle();
  }

  onDestroy(unsubscribe);
</script>

<div>
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
</div>
