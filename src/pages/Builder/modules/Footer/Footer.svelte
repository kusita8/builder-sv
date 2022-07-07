<script lang="ts">
  import Flex from "../../components/atoms/Flex.svelte";
  import Icon from "../../components/atoms/Icon.svelte";
</script>

<footer>
  <Flex justifyContent="flex-end" alignItems="center" class="footer__inner">
    Made with <Icon name="code" /> by
    <a
      href="https://romankusinsky.netlify.app/"
      target="_blank"
      rel="noopener noreferrer">Roman Kusinsky</a
    >
  </Flex>
</footer>

<style type="text/scss">
  @import "src/styles/variables.scss";

  footer {
    position: relative;
    z-index: 3;
    height: var(--footer-height);
    background: #191b1a;
    color: #989a99;
    padding-right: 2.5rem;

    a {
      color: inherit;
      margin-left: 0.5rem;
      transition: color $tt;

      &:hover {
        color: #2cff5a;
      }
    }

    :global(svg) {
      fill: #2cff5a;
      margin: 0 0.5rem 0rem;
      width: 1.1rem;
      height: 1.1rem;
    }
  }

  :global(.footer__inner) {
    height: 100%;
  }
</style>
