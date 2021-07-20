<script lang="ts">
  import { selectedItem } from "../../store";
  import Highlight from "../../components/Highlight.svelte";

  let iframe = {} as HTMLIFrameElement;

  function click(x, y) {
    var ev = document.createEvent("MouseEvent");
    var el = iframe.contentWindow.document.elementFromPoint(x, y);
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
  }

  const handleClick = (e) => {
    e.stopPropagation();

    const { offsetX, offsetY } = e;

    click(offsetX, offsetY);
  };
</script>

<div class="user">
  <div class="user-site" on:click={() => selectedItem.set({})}>
    <div class="user-site-scrollspace" />
    <div class="user-site__inner">
      <div class="user-site__container">
        <Highlight />
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
    height: 100vh;
    top: 0;
    overflow: scroll;
    border: 1px solid black;

    &__inner {
      position: relative;
      transform: translate3d(220px, 220px, 0px) scale(0.22);
      transform-origin: 0 0 0;
      will-change: transform;
      margin-left: 90vw;

      .user-site__container {
        display: flex;
        justify-content: center;
        align-items: center;
        transform: translateX(-8.3%);
        min-width: 1440px;
        padding: 20% 0;
        position: relative;
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
    min-height: 700px;
    min-width: 100%;
    overflow-x: scroll;
    border: 0;
    display: inline;
    overflow: hidden;
  }

  .user-site-scrollspace {
    width: 200vw;
    height: 1px;
  }
</style>
