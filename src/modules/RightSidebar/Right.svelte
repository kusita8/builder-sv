<script>
  // your script goes here
</script>

<aside class="right-sidebar">
  <div class="right-sidebar__inner">
    <div class="inputs-container" />
  </div>
</aside>

<style type="text/scss">
  .right-sidebar {
    flex-basis: 20%;
    background: white;
    z-index: 2;

    .right-sidebar__inner {
      padding-top: 20px;

      .inputs-container {
        max-width: 100%;
        font-size: 9px;
      }

      textarea,
      input {
        width: 100%;
        font-family: inherit;
        font-size: inherit;
      }

      label {
        margin-bottom: 11px;
        display: block;
      }

      textarea {
        height: 100px;
        resize: none;
      }
    }
  }
</style>
