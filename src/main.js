import "./styles/global.scss";
import App from "./App.svelte";

// ONLY ON DEVELOPMENT:
// import "./pages/Builder/stores/AddStore";
// import "./pages/Builder/stores/DimensionsStore";
// import "./pages/Builder/stores/HighlightStore";
// import "./pages/Builder/stores/ItemsStore";
// import "./pages/Builder/stores/StyleStore";
// import "./pages/Builder/stores/UserSiteEventsStore";

const app = new App({
  target: document.body,
  hydrate: true,
});

export default app;
