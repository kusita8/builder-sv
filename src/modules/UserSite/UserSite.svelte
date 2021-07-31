<script lang="ts">
  import { DimensionsStore } from "../../stores/DimensionsStore";
  import { SelectedItemStore } from "../../stores/SelectedItemStore";
  import { DragHandler } from "./Resize";

  let iframe = {} as HTMLIFrameElement;

  const click = (x, y) => {
    var ev = document.createEvent("MouseEvent");
    var el = iframe.contentWindow.document.elementFromPoint(x, y);

    if (!el) return;

    ev.initMouseEvent(
      "click",
      true /* bubble */,
      true /* cancelable */,
      window,
      null,
      x,
      y,
      0,
      0 /* coordinates */,
      false,
      false,
      false,
      false /* modifier keys */,
      0 /*left*/,
      null
    );
    el.dispatchEvent(ev);
  };

  const handleClick = (e) => {
    e.stopPropagation();

    const { offsetX, offsetY } = e;

    click(offsetX, offsetY);
  };

  const width = $DimensionsStore.width;
  const height = $DimensionsStore.height;
  const iframeContainerStyle = `width: ${width}px;height: ${height}px;`;

  let userSiteContainer;
</script>

<div class="user">
  <div class="user-site" on:click={() => SelectedItemStore.set({})}>
    <div class="user-site-scrollspace" />
    <div
      class="user-site__inner"
      style="transform: translate3d(220px, 220px, 0px) scale(0.22);"
    >
      <div
        class="user-site__container"
        {height}
        {width}
        style={iframeContainerStyle}
        bind:this={userSiteContainer}
      >
        <div class="resize">
          <div
            class="resize__width"
            on:mousedown={(e) => DragHandler(e, "width", userSiteContainer)}
          />
          <div
            class="resize__height"
            on:mousedown={(e) => DragHandler(e, "height", userSiteContainer)}
          />
        </div>
        <div class="user-site__cover" on:click={handleClick} />
        <iframe
          bind:this={iframe}
          src="./iframe.html"
          title="user site"
          id="user-site"
          on:click={(e) => e.stopPropagation()}
        />
      </div>
    </div>
  </div>
</div>

<style type="text/scss">
  :global(.b-empty) {
    padding-bottom: 75px;
    padding-right: 75px;
    outline-offset: -1px;
    box-shadow: inset 0 0 0 4px rgb(0 0 0 / 10%),
      inset 0 0 0 4px rgb(255 255 255 / 20%),
      inset 0 0 0 1px rgb(255 255 255 / 30%);
  }

  .user-site {
    background: #f1f1f1;
    position: absolute;
    left: 20%;
    width: 60%;
    height: calc(100vh - var(--header-height));
    top: var(--header-height);
    overflow: scroll;
    border: 1px solid black;

    &__inner {
      position: relative;
      transform-origin: 0 0 0;
      will-change: transform;
      margin-left: 1000px;

      .user-site__container {
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateX(-8.3%);
        padding: 20% 0;
        position: relative;

        &:hover {
          .resize__width,
          .resize__height {
            opacity: 1;
          }
        }
      }
    }
  }

  .user-site__cover {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
  }

  #user-site {
    background: white;
    height: inherit;
    min-width: 100%;
    overflow-x: scroll;
    border: 0;
    display: inline;
    overflow: hidden;
    pointer-events: none;
    user-select: none;
  }

  .user-site-scrollspace {
    width: 200vw;
    height: 1px;
  }

  .resize {
    $distance: -26px;
    $size: 20px;

    &:hover,
    &:active {
      .resize__width,
      .resize__height {
        opacity: 1;
      }
    }

    &__height,
    &__width {
      position: absolute;
      background: grey;
      opacity: 0;
      transition: opacity 100ms ease-in-out;
    }

    &__width {
      right: $distance;
      top: 0;
      height: 100%;
      width: $size;
      cursor: ew-resize;
    }

    &__height {
      bottom: $distance;
      width: 100%;
      height: $size;
      cursor: ns-resize;
    }
  }
</style>
