<script lang="ts">
  import { DimensionsStore } from "../../../stores/DimensionsStore";
</script>

<div class="dimensions">
  <div class="dimensions__inner">
    <div class="dimensions__item">
      <div>Width:</div>
      <span>{$DimensionsStore.width}px</span>
    </div>

    <div class="dimensions__item">
      <div>Height:</div>
      <span>{$DimensionsStore.height}px</span>
    </div>
  </div>
</div>

<style type="text/scss">
  @import "src/styles/variables.scss";

  .dimensions {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;
    font-size: 1.4rem;

    &__inner,
    &__item {
      display: flex;
    }

    &__item {
      font-size: 1.4rem;
      display: flex;
      align-items: center;
      background: $grey-b;
      border-radius: $br;
      padding: 0.6rem 0.8rem;

      span {
        margin-left: 0.5rem;
        font-weight: bold;
      }
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
</style>
