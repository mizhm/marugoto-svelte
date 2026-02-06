<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	// @ts-ignore
	import Header from '$lib/components/Header.svelte';
	// @ts-ignore
	import Footer from '$lib/components/Footer.svelte';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div
	class="min-h-screen bg-base-100 text-base-content flex flex-col font-sans antialiased selection:bg-primary/20 selection:text-primary"
>
	<!-- Global Header -->
	<Header />

	<!-- Page content with top padding for fixed header -->
	<main class="flex-1 relative z-10 pt-20 pb-10">
		{@render children()}
	</main>

	<!-- Global Footer -->
	<Footer />
</div>
