<div class="hero">
  <div class="hero__copy">
    <h6>Build static sites with instant feedback.</h6>
    <a class="hero__cta" href="#try-it"
      >Try it out <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="20"
        viewBox="0 0 16 20"
        fill="none"
      >
        <path
          d="M7.29289 19.7071C7.68342 20.0976 8.31658 20.0976 8.70711 19.7071L15.0711 13.3431C15.4616 12.9526 15.4616 12.3195 15.0711 11.9289C14.6805 11.5384 14.0474 11.5384 13.6569 11.9289L8 17.5858L2.34315 11.9289C1.95262 11.5384 1.31946 11.5384 0.928933 11.9289C0.538408 12.3195 0.538408 12.9526 0.928933 13.3431L7.29289 19.7071ZM7 4.37114e-08L7 19L9 19L9 -4.37114e-08L7 4.37114e-08Z"
          fill="#6282F6"
        />
      </svg></a
    >
  </div>
  <div class="hero__image">
    <img src="./template.jpg" alt="Template" />
  </div>
</div>

<style lang="scss">
  @import "src/styles/variables.scss";

  .hero {
    padding: 8rem 0 10rem var(--left-padding);
    display: flex;
    align-items: center;
    gap: 7.9rem;
    overflow: hidden;

    @media (max-width: $bp-s) {
      flex-direction: column;
    }

    &__copy {
      max-width: 40rem;

      h6 {
        font-size: 5rem;
        font-weight: 900;
      }
    }

    &__cta {
      margin-top: 2.6rem;
      color: $blue-e;
      background: $blue-d;
      border: 1px solid $blue-e;
      font-size: 1.8rem;
      cursor: pointer;
      padding: 1.2rem 2.2rem;
      border-radius: 0.6rem;
      display: flex;
      align-items: center;
      gap: 0.8rem;
      width: fit-content;
    }

    &__image {
      width: 69.6rem;
      height: 40.9rem;
      border: 1px solid $dark-a;
      position: relative;

      &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        background: $dark-c;
        left: 1.4rem;
        top: 1.4rem;
        z-index: 1;
      }

      img {
        position: relative;
        z-index: 2;
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }
  }
</style>
