<script lang="ts">
	import Left from "./modules/LeftSidebar/Left.svelte";
	import Right from "./modules/RightSidebar/Right.svelte";
	import UserSite from "./modules/UserSite/UserSite.svelte";
	import Highlight from "./components/Highlight.svelte";
</script>

<main class="app">
	<div class="app__inner">
		<Left />
		<Right />
		<Highlight />
	</div>
</main>
<UserSite />

<style type="text/scss">
	.app {
		&__inner {
			display: flex;
			justify-content: space-between;
			height: 100vh;
		}
	}
</style>
