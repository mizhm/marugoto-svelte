<script lang="ts">
	import { Volume2, RotateCcw } from 'lucide-svelte';
	import type { VocabularyEntry } from '$lib/types';
	import { speak } from '$lib/audio';

	interface Props {
		vocab: VocabularyEntry;
		showBack?: boolean;
		onFlip?: () => void;
	}

	let { vocab, showBack = false, onFlip }: Props = $props();

	// Internal state for flip animation
	let isFlipped = $state(showBack);

	// Sync internal state with prop
	$effect(() => {
		isFlipped = showBack;
	});

	function handleCardClick() {
		isFlipped = !isFlipped;
		onFlip?.();
	}

	function handleAudio(e: Event) {
		e.stopPropagation();
		speak(vocab.kanji || vocab.hiragana);
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			handleCardClick();
		}
	}
</script>

<!-- Card Container with Perspective -->
<div
	class="perspective-1000 w-full max-w-xl mx-auto aspect-[3/2] cursor-pointer group focus:outline-none"
	onclick={handleCardClick}
	onkeydown={handleKeydown}
	role="button"
	tabindex="0"
	aria-label={isFlipped ? 'Show Japanese' : 'Show Meaning'}
>
	<!-- Inner Card with Preserve-3D -->
	<div
		class="relative w-full h-full transition-transform duration-500 transform-style-3d shadow-xl rounded-3xl"
		class:rotate-y-180={isFlipped}
	>
		<!-- FRONT -->
		<div
			class="absolute inset-0 backface-hidden bg-base-100 border border-base-content/5 rounded-3xl flex flex-col items-center justify-center p-8 overflow-hidden"
		>
			<!-- Decorative Background -->
			<div
				class="absolute inset-0 bg-gradient-to-br from-base-100 to-base-200 opacity-50 z-0"
			></div>

			<div class="relative z-10 text-center space-y-4 mb-4">
				<span class="text-sm font-bold text-primary/60 uppercase tracking-widest">Japanese</span>

				{#if vocab.kanji}
					<div class="text-6xl md:text-7xl font-bold text-base-content mb-2">{vocab.kanji}</div>
					<div class="text-2xl md:text-3xl text-base-content/60 font-medium">{vocab.hiragana}</div>
				{:else}
					<div class="text-5xl md:text-6xl font-bold text-base-content">{vocab.hiragana}</div>
				{/if}
			</div>

			<!-- Audio Button (Under text) -->
			<div class="relative z-20 mt-2">
				<button
					class="btn btn-circle btn-ghost btn-lg text-primary/80 hover:text-primary hover:bg-primary/10 transition-all scale-100 hover:scale-110"
					onclick={handleAudio}
					title="Play Audio"
				>
					<Volume2 size={32} />
				</button>
			</div>

			<div class="absolute bottom-6 right-6">
				<button
					class="btn btn-circle btn-ghost btn-sm text-base-content/30 group-hover:text-primary transition-colors"
				>
					<RotateCcw size={20} />
				</button>
			</div>
		</div>

		<!-- BACK -->
		<div
			class="absolute inset-0 backface-hidden rotate-y-180 bg-base-100 border border-base-content/5 rounded-3xl flex flex-col items-center justify-center p-8 overflow-hidden"
		>
			<!-- Decorative Background -->
			<div
				class="absolute top-0 right-0 w-32 h-32 bg-secondary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
			></div>

			<div class="relative z-10 text-center w-full">
				<span class="text-sm font-bold text-secondary/60 uppercase tracking-widest block mb-6"
					>Meaning</span
				>

				<div class="text-3xl md:text-4xl font-bold text-base-content mb-8 leading-tight">
					{vocab.meaning}
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	.perspective-1000 {
		perspective: 1000px;
	}
	.transform-style-3d {
		transform-style: preserve-3d;
	}
	.backface-hidden {
		backface-visibility: hidden;
	}
	.rotate-y-180 {
		transform: rotateY(180deg);
	}
</style>
