<script lang="ts">
  import { Link } from "svelte-routing";
  import Icon from "../../components/atoms/Icon.svelte";

  import Dimensions from "./components/Dimensions.svelte";
  import Export from "./components/Export.svelte";
  import Reset from "./components/Reset.svelte";
</script>

<header>
  <Link to="/">
    <div class="back-arrow">
      <Icon name="arrow_back" />
    </div>
  </Link>
  <Reset />
  <Dimensions />
  <Export />
</header>

<style type="text/scss">
  @import "src/styles/variables.scss";

  header {
    height: var(--header-height);
    background: $dark-a;
    position: relative;
    z-index: 10;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 1.4rem;

    .back-arrow {
      :global(svg) {
        fill: $white-a;
      }
    }
  }
</style>
