<script lang="ts">
  import { HighlightStore } from "../../stores/HighlightStore";
  import { onLoad } from "../../util/onLoad";
  import { s } from "../../util/s";

  let userSite = {} as HTMLElement;
  let currentItem = {};
  let hidden = true;
  let label = "";
  let style = "background: red;";

  onLoad(() => {
    userSite = s(".user-site__inner");
  });

  const highlightItem = (item) => {
    const { top, left, height, width } = item.node.getBoundingClientRect();
    const uSiteBounding = (
      userSite.firstChild as HTMLElement
    ).getBoundingClientRect();

    const scale =
      (userSite.style.transform.split(" scale(")[1].replace(/\)/, "") as any) *
      1 *
      0.3;

    style = `
      width: ${width * scale}px;
      height: ${height * scale}px;
      transform: translate(${left * scale + uSiteBounding.left}px, ${
      top * scale + uSiteBounding.top
    }px);
    `;
    currentItem = item;
    label = item.label;
    hidden = false;
  };

  const clearHighlight = () => {
    label = "";
    style = "";
    hidden = true;
    currentItem = false;
  };

  const updateCurrentItem = () => {
    if (currentItem) {
      highlightItem(currentItem);
    }
  };

  window.addEventListener("resize", () => updateCurrentItem());

  HighlightStore.subscribe((data) => {
    if (Object.keys(data).length > 0) {
      highlightItem(data);
    } else {
      clearHighlight();
    }
  });
</script>

<div class:hidden class="highlight" {style}>
  <div class="highlight__inner">
    <span class="highlight__label">{label}</span>
  </div>
</div>

<style type="text/scss">
  .highlight {
    left: 0;
    top: 0;
    position: absolute;
    outline: 2px dashed black;
    pointer-events: none;
    z-index: 1;

    &.hidden {
      display: none;
    }

    &__inner {
      position: relative;

      .highlight__label {
        position: absolute;
        font-size: 9px;
        height: 19px;
        background: black;
        color: white;
        padding: 0 16px;
        display: flex;
        justify-items: center;
        align-items: center;
        white-space: nowrap;
        top: -25px;
        left: 0;
        transform-origin: 0 0 0;
      }
    }
  }
</style>
