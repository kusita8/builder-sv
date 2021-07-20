<script>
  import { selectedItem } from "../store";
  let currentItem = {};
  let hidden = true;
  let label = "";
  let style = "background: red;";

  const highlightItem = (item) => {
    const { top, left, height, width } = item.node.getBoundingClientRect();

    style = `
      width: ${width}px;
      height: ${height}px;
      transform: translate(${left}px, ${top}px);
    `;

    currentItem = item;
    label = item.label;
    hidden = false;
  };

  const clearHighlight = () => {
    label = "";
    style = "";
    hidden = true;
    currentItem = {};
  };

  const updateCurrentItem = () => {
    if (currentItem.node) {
      highlightItem(currentItem);
    }
  };

  window.addEventListener("resize", () => updateCurrentItem());

  selectedItem.subscribe((data) => {
    if (data.node) {
      highlightItem(data);
    } else {
      clearHighlight();
    }
  });
</script>

<div class:hidden class="highlight">
  <div class="highlight__inner" {style}>
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
        top: 0;
        left: 0;
        transform-origin: 0 0 0;
        transform: translate3d(0px, -105px, 0px) scale(4.545454545454546);
      }
    }
  }
</style>
