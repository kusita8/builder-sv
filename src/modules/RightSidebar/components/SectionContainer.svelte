<script lang="ts">
  export let label: string;
</script>

<div class="input-container">
  <p>{label}</p>
  <slot />
</div>

<style type="text/scss">
  .input-container {
    max-width: 80%;
    margin: 20px auto 0;

    p {
      font-size: 12px;
      margin-bottom: 10px;
    }
  }
</style>
