<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Builder from "./pages/Builder/Builder.svelte";
  import Home from "./pages/Home/Home.svelte";

  export let url = "";
</script>

<!-- prettier-ignore -->
<Router url="{url}">
  <!-- prettier-ignore -->
  <Route path="/">
  <Home />
  </Route>
  <!-- prettier-ignore -->
  <Route path="builder">
    <Builder />
  </Route>
</Router>
