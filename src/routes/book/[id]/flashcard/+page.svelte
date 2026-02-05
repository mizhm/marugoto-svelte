<script lang="ts">
	import type { PageData } from './$types';
	import type { BookLevel, VocabularyEntry } from '$lib/types';
	import {
		ArrowLeft,
		RotateCcw,
		ChevronLeft,
		ChevronRight,
		Shuffle,
		Check,
		X
	} from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	// Level colors
	const levelGradients: Record<BookLevel, string> = {
		A1: 'from-emerald-500 to-teal-600',
		'A2-1': 'from-blue-500 to-cyan-600',
		'A2-2': 'from-indigo-500 to-blue-600',
		'A2/B1': 'from-violet-500 to-purple-600',
		'B1-1': 'from-rose-500 to-pink-600',
		'B1-2': 'from-orange-500 to-red-600'
	};

	// State
	let selectedLesson = $state<number | null>(null);
	let cards = $state<VocabularyEntry[]>([]);
	let currentIndex = $state(0);
	let isFlipped = $state(false);
	let showHiragana = $state(true);
	let knownCount = $state(0);
	let unknownCount = $state(0);

	// Initialize cards
	$effect(() => {
		let filtered = data.vocabulary;
		if (selectedLesson !== null) {
			filtered = filtered.filter((v) => v.lesson === selectedLesson);
		}
		cards = [...filtered];
		resetSession();
	});

	function resetSession() {
		currentIndex = 0;
		isFlipped = false;
		knownCount = 0;
		unknownCount = 0;
	}

	function shuffleCards() {
		cards = cards.sort(() => Math.random() - 0.5);
		resetSession();
	}

	function flipCard() {
		isFlipped = !isFlipped;
	}

	function nextCard() {
		if (currentIndex < cards.length - 1) {
			currentIndex++;
			isFlipped = false;
		}
	}

	function prevCard() {
		if (currentIndex > 0) {
			currentIndex--;
			isFlipped = false;
		}
	}

	function markKnown() {
		knownCount++;
		nextCard();
	}

	function markUnknown() {
		unknownCount++;
		nextCard();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.code === 'Space') {
			e.preventDefault();
			flipCard();
		} else if (e.code === 'ArrowRight') {
			nextCard();
		} else if (e.code === 'ArrowLeft') {
			prevCard();
		} else if (e.code === 'KeyK') {
			markKnown();
		} else if (e.code === 'KeyU') {
			markUnknown();
		}
	}

	let currentCard = $derived(cards[currentIndex]);
	let progress = $derived(cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0);
	let isComplete = $derived(currentIndex >= cards.length - 1 && isFlipped);
</script>

<svelte:head>
	<title>Flashcard - {data.book.title}</title>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div class="min-h-screen flex flex-col">
	<!-- Header -->
	<header class="bg-base-100 shadow-sm">
		<div class="max-w-4xl mx-auto px-4 py-4">
			<div class="flex items-center gap-4">
				<a href="/book/{data.book.id}" class="btn btn-ghost btn-circle">
					<ArrowLeft class="w-5 h-5" />
				</a>

				<div class="flex-1">
					<div class="flex items-center gap-2 mb-1">
						<span
							class="px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r {levelGradients[
								data.book.level
							]}"
						>
							{data.book.level}
						</span>
						<span class="text-sm text-base-content/60">Flashcard</span>
					</div>
					<h1 class="font-bold truncate">{data.book.title}</h1>
				</div>

				<!-- Lesson filter -->
				<select class="select select-bordered select-sm bg-base-200" bind:value={selectedLesson}>
					<option value={null}>Tất cả ({data.vocabulary.length})</option>
					{#each data.lessonNumbers as lesson}
						<option value={lesson}>
							Bài {lesson} ({data.vocabulary.filter((v) => v.lesson === lesson).length})
						</option>
					{/each}
				</select>
			</div>
		</div>
	</header>

	<!-- Progress bar -->
	<div class="h-1 bg-base-300">
		<div
			class="h-full bg-gradient-to-r {levelGradients[data.book.level]} transition-all duration-300"
			style="width: {progress}%"
		></div>
	</div>

	<!-- Main content -->
	<main class="flex-1 flex flex-col items-center justify-center p-4">
		{#if cards.length === 0}
			<div class="text-center">
				<p class="text-xl text-base-content/60">Không có từ vựng</p>
			</div>
		{:else if currentCard}
			<!-- Stats -->
			<div class="flex items-center gap-6 mb-6 text-sm">
				<span class="text-base-content/60">
					{currentIndex + 1} / {cards.length}
				</span>
				<span class="text-success flex items-center gap-1">
					<Check class="w-4 h-4" />
					{knownCount}
				</span>
				<span class="text-error flex items-center gap-1">
					<X class="w-4 h-4" />
					{unknownCount}
				</span>
			</div>

			<!-- Flashcard -->
			<div class="w-full max-w-2xl perspective-1000">
				<button class="w-full aspect-[3/2] cursor-pointer" onclick={flipCard} aria-label="Lật thẻ">
					<div
						class="relative w-full h-full transition-transform duration-500 transform-style-3d {isFlipped
							? 'rotate-y-180'
							: ''}"
					>
						<!-- Front (Japanese) -->
						<div class="absolute inset-0 backface-hidden">
							<div
								class="w-full h-full bg-base-100 rounded-2xl shadow-xl flex flex-col items-center justify-center p-8 border border-base-300"
							>
								{#if currentCard.kanji}
									<div class="text-7xl md:text-8xl font-bold mb-4 text-base-content">
										{currentCard.kanji}
									</div>
									{#if showHiragana}
										<div class="text-3xl text-base-content/50">
											{currentCard.hiragana}
										</div>
									{/if}
								{:else}
									<div class="text-7xl md:text-8xl font-bold text-base-content">
										{currentCard.hiragana}
									</div>
								{/if}
								<div class="absolute bottom-4 text-sm text-base-content/40">
									Bài {currentCard.lesson}
								</div>
							</div>
						</div>

						<!-- Back (Vietnamese) -->
						<div class="absolute inset-0 backface-hidden rotate-y-180">
							<div
								class="w-full h-full bg-gradient-to-br {levelGradients[
									data.book.level
								]} rounded-2xl shadow-xl flex flex-col items-center justify-center p-8"
							>
								<div
									class="text-3xl md:text-4xl font-medium text-white text-center leading-relaxed"
								>
									{currentCard.meaning}
								</div>
							</div>
						</div>
					</div>
				</button>
			</div>

			<!-- Controls -->
			<div class="flex items-center gap-3 mt-8">
				<button class="btn btn-ghost btn-circle" onclick={prevCard} disabled={currentIndex === 0}>
					<ChevronLeft class="w-6 h-6" />
				</button>

				<button class="btn btn-error btn-circle" onclick={markUnknown} title="Chưa biết (U)">
					<X class="w-5 h-5" />
				</button>

				<button class="btn btn-success btn-circle" onclick={markKnown} title="Đã biết (K)">
					<Check class="w-5 h-5" />
				</button>

				<button
					class="btn btn-ghost btn-circle"
					onclick={nextCard}
					disabled={currentIndex >= cards.length - 1}
				>
					<ChevronRight class="w-6 h-6" />
				</button>
			</div>

			<!-- Action buttons -->
			<div class="flex items-center gap-3 mt-6">
				<button class="btn btn-ghost btn-sm gap-2" onclick={shuffleCards}>
					<Shuffle class="w-4 h-4" />
					Xáo trộn
				</button>
				<button class="btn btn-ghost btn-sm gap-2" onclick={resetSession}>
					<RotateCcw class="w-4 h-4" />
					Làm lại
				</button>
				<label class="flex items-center gap-2 cursor-pointer">
					<input type="checkbox" class="toggle toggle-sm" bind:checked={showHiragana} />
					<span class="text-sm">Hiragana</span>
				</label>
			</div>

			<!-- Keyboard hints -->
			<div class="mt-8 text-xs text-base-content/40 text-center">
				<span class="kbd kbd-sm">Space</span> lật thẻ •
				<span class="kbd kbd-sm">←</span><span class="kbd kbd-sm">→</span> điều hướng •
				<span class="kbd kbd-sm">K</span> biết •
				<span class="kbd kbd-sm">U</span> chưa biết
			</div>
		{/if}
	</main>
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
