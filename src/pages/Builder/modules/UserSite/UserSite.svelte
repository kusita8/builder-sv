<script lang="ts">
  import { DimensionsStore } from "../../stores/DimensionsStore";
  import { SelectedItemStore } from "../../stores/SelectedItemStore";
  import { mouseEventFromPoint } from "../../util/mouseEventFromPoint";
  import { DragHandler } from "./Resize";

  let iframe = {} as HTMLIFrameElement;

  const handleEvent = (e, event) => {
    e.stopPropagation();

    const { offsetX, offsetY } = e;

    mouseEventFromPoint(offsetX, offsetY, event, iframe.contentWindow.document);
  };

  const { width, height } = $DimensionsStore;
  const iframeContainerStyle = `width: ${width}px;height: ${height}px;`;
  const userSiteInnerStyle = `transform: translate3d(0px, 0px, 0px) scale(1);`;

  let userSiteContainer;
</script>

<div class="user">
  <div class="user-site" on:mousedown={() => SelectedItemStore.set({})}>
    <div class="user-site__inner" style={userSiteInnerStyle}>
      <div
        class="user-site__container"
        style={iframeContainerStyle}
        bind:this={userSiteContainer}
        on:click={(e) => handleEvent(e, "click")}
        on:dblclick={(e) => handleEvent(e, "dblclick")}
        on:mousedown|stopPropagation
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
        <!-- <div class="user-site__cover" /> -->
        <iframe
          bind:this={iframe}
          src="./iframe.html"
          title="user site"
          id="user-site"
        />
      </div>
    </div>
    <!-- <div class="vertical-scrollspace" /> -->
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

  .user {
    flex-basis: 60%;
    min-width: 60%;
    position: relative;
  }

  .user-site {
    background: #f1f1f1;
    max-height: 100%;
    overflow: scroll;
    border: 1px solid black;

    &__inner {
      transform-origin: 0 0 0;
      will-change: transform;
      min-width: 150vw;
      min-height: 150vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .user-site__container {
      display: flex;
      justify-content: center;
      align-items: center;
      // transform: translateX(-8.3%);
      position: relative;
      transform: scale(0.3);

      &:hover {
        .resize__width,
        .resize__height {
          opacity: 1;
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
    pointer-events: none;
    visibility: hidden;
    &.inactive {
      pointer-events: none;
      visibility: hidden;
    }
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

  .lateral-scrollspace {
    width: 200vw;
    height: 1px;
  }
  .vertical-scrollspace {
    height: 100vh;
    width: 1px;
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
