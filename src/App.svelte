<script lang="ts">
  import { Router, Route } from "svelte-routing";
  import Redirect from "./components/atoms/Redirect.svelte";
  import Builder from "./pages/Builder/Builder.svelte";
  import Footer from "./pages/Builder/modules/Footer/Footer.svelte";
  import Home from "./pages/Home/Home.svelte";

  export let url = "";
</script>

<Router {url}>
  <Route path="/">
    <Home />
  </Route>
  <Route path="/builder">
    <Builder />
    <Footer />
  </Route>
  <Route path="*"><Redirect to="/" /></Route>
</Router>
