<script lang="ts">
  import { DimensionsStore } from "../../../stores/DimensionsStore";
</script>

<div class="dimensions">
  <div class="dimensions__inner">
    <div class="dimensions__item">
      <div>Width:</div>
      {$DimensionsStore.width}px
    </div>

    <div class="dimensions__item">
      <div>Height:</div>
      {$DimensionsStore.height}px
    </div>
  </div>
</div>

<style type="text/scss">
  .dimensions {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    color: white;

    &__inner,
    &__item {
      display: flex;
    }

    &__item {
      &:not(:last-child) {
        margin-right: 10px;
      }
    }
  }
</style>
