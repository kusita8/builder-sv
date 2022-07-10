<script lang="ts">
  import { navigate } from "svelte-routing";
  import { coffeeTemplate } from "../utils/coffeeTemplate";
  import { waitForValue } from "../../../utils/waitForValue";

  const handleBlankTemplateClick = () => {
    localStorage.clear();
    navigate("/builder");
  };

  const handleCoffeeTemplateClick = async () => {
    localStorage.clear();

    for (const key in coffeeTemplate) {
      const value = coffeeTemplate[key];
      localStorage.setItem(key, value);

      await waitForValue(() => localStorage.getItem(key));
    }

    navigate("/builder");
  };
</script>

<div class="try-it" id="try-it">
  <h5>Start with</h5>

  <div class="try-it__templates">
    <div class="template" on:click={handleBlankTemplateClick}>
      <div class="template__image" />
      <span>Blank</span>
    </div>
    <div class="template" on:click={handleCoffeeTemplateClick}>
      <div class="template__image">
        <img src="./template-example.jpg" alt="Template" />
      </div>
      <span>Template</span>
    </div>
  </div>
</div>

<style lang="scss">
  @import "src/styles/variables.scss";

  .try-it {
    text-align: center;
    padding: 8.7rem 0 10rem 0;
    background: $dark-a;
    color: $white-a;

    @media (max-width: $bp-s) {
      padding: 6rem 0 8rem 0;
    }

    h5 {
      font-size: 4rem;
      font-weight: 700;
      margin-bottom: 7.5rem;

      @media (max-width: $bp-s) {
        margin-bottom: 6rem;
      }
    }

    &__templates {
      display: flex;
      justify-content: center;
      gap: 10.9rem;

      @media (max-width: $bp-m) {
        flex-direction: column;
        align-items: center;
        gap: 8rem;
      }
    }

    .template {
      cursor: pointer;
      @media (max-width: $bp-m) {
        width: 100%;
      }
      &__image {
        width: 51.4rem;
        height: 30.5rem;
        background-color: $white-a;

        @media (max-width: $bp-m) {
          margin: 0 auto;
        }

        @media (max-width: $bp-s) {
          width: 80%;
        }

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }

      span {
        display: block;
        font-weight: 700;
        font-size: 2.5rem;
        margin-top: 1.9rem;
      }
    }
  }
</style>
