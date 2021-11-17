import './styles/global.scss'
import App from './App.svelte';
import './lib/zoom'
import './lib/userSite'
import './lib/selectedItemInput'
import './lib/keyboard'

// ONLY ON DEVELOPMENT:
import './stores/AddStore'
import './stores/DimensionsStore'
import './stores/HighlightStore'
import './stores/ItemsStore'
import './stores/StyleStore'
import './stores/UserSiteEventsStore'

const app = new App({
	target: document.body,
});

export default app;