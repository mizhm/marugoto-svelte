<script lang="ts">
	import { Palette } from 'lucide-svelte';
	import { browser } from '$app/environment';

	// Available DaisyUI themes suitable for education
	const themes = [
		{ name: 'winter', label: 'Winter', icon: '❄️' },
		{ name: 'emerald', label: 'Emerald', icon: '🌿' },
		{ name: 'light', label: 'Light', icon: '☀️' },
		{ name: 'dark', label: 'Dark', icon: '🌙' },
		{ name: 'cupcake', label: 'Cupcake', icon: '🧁' },
		{ name: 'dracula', label: 'Dracula', icon: '🧛' }
	];

	// Current theme state
	let currentTheme = $state('winter');

	// Load theme from localStorage on mount
	$effect(() => {
		if (browser) {
			const saved = localStorage.getItem('theme');
			if (saved) {
				currentTheme = saved;
				document.documentElement.setAttribute('data-theme', saved);
			} else {
				// Default to winter
				document.documentElement.setAttribute('data-theme', 'winter');
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

<header
	class="fixed top-0 left-0 right-0 z-50 bg-base-100/80 backdrop-blur-md border-b border-base-content/5 transition-all duration-300"
>
	<div class="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
		<!-- Logo -->
		<a href="/" class="flex items-center gap-3 group">
			<div
				class="w-10 h-10 rounded-xl bg-primary text-primary-content flex items-center justify-center font-bold text-lg shadow-lg group-hover:scale-105 transition-transform"
			>
				本
			</div>
			<div class="flex flex-col">
				<span class="font-bold text-lg leading-tight tracking-tight">Marugoto</span>
				<span class="text-xs text-base-content/60 font-medium tracking-widest uppercase"
					>Vocabulary</span
				>
			</div>
		</a>

		<!-- Navigation & Actions -->
		<div class="flex items-center gap-2">
			<!-- Theme Selector -->
			<div class="dropdown dropdown-end">
				<div tabindex="0" role="button" class="btn btn-ghost btn-sm btn-circle">
					<Palette class="w-5 h-5 opacity-70" />
				</div>
				<ul
					tabindex="0"
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
									<span class="ml-auto text-primary text-xs font-bold">ACTIVE</span>
								{/if}
							</button>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</header>
