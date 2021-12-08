<script lang="ts">
  import Left from "./modules/LeftSidebar/Left.svelte";
  import Right from "./modules/RightSidebar/Right.svelte";
  import UserSite from "./modules/UserSite/UserSite.svelte";
  import Highlight from "./components/organisms/Highlight.svelte";
  import Header from "./modules/Header/Header.svelte";
</script>

<Header />
<main class="app">
  <div class="app__inner">
    <Left />
    <UserSite />
    <Right />
    <Highlight />
  </div>
  <input
    class="selected-item-input"
    type="text"
    style="position: fixed;top: 0;left: 0;height: 0;width: 0;z-index: -1;"
    autocomplete="off"
    autocorrect="off"
    autocapitalize="off"
    spellcheck="false"
  />
</main>

<style type="text/scss">
  :global(:root) {
    --header-height: 50px;
  }

  .app {
    &__inner {
      display: flex;
      // justify-content: space-between;
      height: calc(100vh - var(--header-height));
    }
  }
</style>
