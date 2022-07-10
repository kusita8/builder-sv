<script lang="ts">
  import Footer from "../Builder/modules/Footer/Footer.svelte";
  import Header from "./components/Header.svelte";
  import Hero from "./components/Hero.svelte";
  import TryIt from "./components/TryIt.svelte";
</script>

<div class="home">
  <Header />
  <Hero />
  <TryIt />
  <Footer />
</div>

<style lang="scss">
  @import "src/styles/variables.scss";

  :global(:root) {
    --left-padding: 13rem;

    @media (max-width: $bp-s) {
      --left-padding: 5%;
    }
  }

  .home {
    background: $white-b;
    max-width: 1440px;
    margin: 0 auto;
  }
</style>
