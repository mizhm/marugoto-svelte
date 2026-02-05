<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<div class="min-h-screen bg-base-200 relative overflow-hidden">
	<!-- Animated background blobs -->
	<div class="fixed inset-0 overflow-hidden pointer-events-none z-0">
		<div
			class="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl animate-pulse"
		></div>
		<div
			class="absolute top-1/2 -left-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse"
			style="animation-delay: 1s;"
		></div>
		<div
			class="absolute -bottom-40 right-1/3 w-80 h-80 bg-accent/20 rounded-full blur-3xl animate-pulse"
			style="animation-delay: 2s;"
		></div>
	</div>

	<!-- Page content -->
	<div class="relative z-10">
		{@render children()}
	</div>
</div>
