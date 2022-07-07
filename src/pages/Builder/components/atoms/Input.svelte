<script>
  import { getId } from "../../util/getId";

  export let value = "";
  export let name = "name";
  export let label = "";
  export let required = false;

  const id = getId();
</script>

<div class="input">
  <label for={id}>{label}</label>
  <input autocomplete="off" type="text" {required} {name} {id} bind:value />
</div>

<style type="text/scss">
  @import "src/styles/variables.scss";

  .input {
    label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 1.2rem;
      font-weight: 500;
      color: $white-a;
    }

    input {
      width: 100%;
      outline: none;
      border: none;
      padding: 0.5rem 0.5rem;
      border-radius: 0.4rem;
    }
  }
</style>
