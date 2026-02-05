<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/favicon.svg';
	import { Sun, Moon, Palette } from 'lucide-svelte';
	import { browser } from '$app/environment';

	let { children } = $props();

	// Available DaisyUI themes
	const themes = [
		{ name: 'dark', label: 'Tối', icon: '🌙' },
		{ name: 'light', label: 'Sáng', icon: '☀️' },
		{ name: 'cupcake', label: 'Cupcake', icon: '🧁' },
		{ name: 'dracula', label: 'Dracula', icon: '🧛' },
		{ name: 'night', label: 'Night', icon: '🌃' },
		{ name: 'forest', label: 'Forest', icon: '🌲' },
		{ name: 'aqua', label: 'Aqua', icon: '💧' },
		{ name: 'synthwave', label: 'Synthwave', icon: '🎵' }
	];

	// Current theme state
	let currentTheme = $state('light');

	// Load theme from localStorage on mount
	$effect(() => {
		if (browser) {
			const saved = localStorage.getItem('theme');
			if (saved) {
				currentTheme = saved;
				document.documentElement.setAttribute('data-theme', saved);
			}
		}
	});

	function setTheme(theme: string) {
		currentTheme = theme;
		if (browser) {
			document.documentElement.setAttribute('data-theme', theme);
			localStorage.setItem('theme', theme);
		}
	}
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

	<!-- Global Header -->
	<header
		class="fixed top-0 left-0 right-0 z-50 bg-base-100/80 backdrop-blur-lg border-b border-base-content/5"
	>
		<div class="max-w-6xl mx-auto px-4 py-3">
			<div class="flex items-center justify-between">
				<!-- Logo -->
				<a href="/" class="flex items-center gap-2 hover:opacity-80 transition-opacity">
					<div
						class="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold"
					>
						本
					</div>
					<span class="font-bold hidden sm:inline">Marugoto</span>
				</a>

				<!-- Theme Selector -->
				<div class="dropdown dropdown-end">
					<button class="btn btn-ghost btn-sm gap-2">
						<Palette class="w-4 h-4" />
						<span class="hidden sm:inline">Theme</span>
					</button>
					<ul
						class="dropdown-content menu bg-base-100 rounded-box z-[100] w-52 p-2 shadow-xl border border-base-content/10 mt-2"
					>
						{#each themes as theme}
							<li>
								<button
									class="flex items-center gap-2 {currentTheme === theme.name ? 'active' : ''}"
									onclick={() => setTheme(theme.name)}
								>
									<span>{theme.icon}</span>
									<span>{theme.label}</span>
									{#if currentTheme === theme.name}
										<span class="ml-auto text-primary">✓</span>
									{/if}
								</button>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	</header>

	<!-- Page content with top padding for fixed header -->
	<div class="relative z-10 pt-14">
		{@render children()}
	</div>
</div>
