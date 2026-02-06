<script lang="ts">
	import { ArrowRight } from 'lucide-svelte';
</script>

<div class="relative py-20 px-4 overflow-hidden">
	<!-- Background Pattern -->
	<div class="absolute inset-0 -z-10 opacity-30">
		<div
			class="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-primary/5 to-transparent rounded-full blur-3xl"
		></div>
	</div>

	<div class="max-w-4xl mx-auto text-center relative z-10">
		<div
			class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6 animate-fade-in-up"
		>
			<span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
			<span>Interactive Japanese Learning</span>
		</div>

		<h1 class="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight text-base-content">
			Master <span class="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
				>Marugoto</span
			> <br />
			Vocabulary
		</h1>

		<p
			class="text-lg md:text-xl text-base-content/60 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
		>
			A curated, spaced-repetition learning experience for the Marugoto Japanese curriculum. From A1
			to B1.
		</p>

		<div class="flex flex-col sm:flex-row items-center justify-center gap-4">
			<a
				href="#A1"
				class="btn btn-primary btn-lg rounded-2xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all gap-3 group"
			>
				Start Learning
				<ArrowRight class="w-5 h-5 group-hover:translate-x-1 transition-transform" />
			</a>
			<a href="#about" class="btn btn-ghost btn-lg rounded-2xl"> How it works </a>
		</div>

		<!-- Quick Stats -->
		<div
			class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 mt-16 max-w-3xl mx-auto pt-10 border-t border-base-content/5"
		>
			<div class="text-center">
				<div class="text-3xl font-bold text-base-content mb-1">9</div>
				<div class="text-xs text-base-content/50 uppercase tracking-widest">Textbooks</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-base-content mb-1">6</div>
				<div class="text-xs text-base-content/50 uppercase tracking-widest">Levels</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-base-content mb-1">5k+</div>
				<div class="text-xs text-base-content/50 uppercase tracking-widest">Words</div>
			</div>
			<div class="text-center">
				<div class="text-3xl font-bold text-base-content mb-1">Free</div>
				<div class="text-xs text-base-content/50 uppercase tracking-widest">Forever</div>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes fade-in-up {
		from {
			opacity: 0;
			transform: translateY(20px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	.animate-fade-in-up {
		animation: fade-in-up 0.8s ease-out forwards;
	}
</style>
