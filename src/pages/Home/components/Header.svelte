<script>
</script>

<header>
  <div class="header__inner">
    <div class="logo">vB</div>
    <span>visualBuilder</span>
  </div>
</header>

<style lang="scss">
  @import "src/styles/variables.scss";

  header {
    padding: 4rem 0 0 var(--left-padding);
    font-family: "Open Sans", "Roboto", sans-serif;

    .header__inner {
      display: flex;
      gap: 1.7rem;
      align-items: center;
      font-size: 1.8rem;
      font-weight: bold;

      .logo {
        font-weight: bold;
        width: 6.8rem;
        height: 6.8rem;
        min-width: 6.8rem;
        min-height: 6.8rem;
        font-size: 2.5rem;
        border-radius: 50%;
        background: $dark-a;
        color: $white-a;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      span {
        font-size: 2.6rem;
        font-weight: 600;
      }
    }
  }
</style>
