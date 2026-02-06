<script lang="ts">
	import type { PageData } from './$types';
	import {
		ArrowLeft,
		Search,
		Eye,
		EyeOff,
		Volume2,
		BookOpen,
		Grid,
		Target,
		CheckSquare,
		Square,
		ChevronDown,
		Shuffle,
		ArrowUpDown
	} from 'lucide-svelte';
	import { speak } from '$lib/audio';
	import { fly } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { toHiragana } from 'wanakana';
	// @ts-ignore
	import Flashcard from '$lib/components/Flashcard.svelte';
	// @ts-ignore
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { LEVEL_GRADIENTS } from '$lib/theme';

	let { data }: { data: PageData } = $props();

	// UI State
	// Multi-select state: Set of selected lesson numbers. Empty = All lessons.
	let selectedLessons = $state<Set<number>>(new Set());
	let isLessonDropdownOpen = $state(false);

	let searchQuery = $state('');
	let debouncedQuery = $state('');
	let showHiragana = $state(true);
	let viewMode = $state<'list' | 'focus'>('focus');
	let currentCardIndex = $state(0);

	// Sort State
	let isSortedByLesson = $state(true);

	// Shuffle State
	// Initialize with data using a derived or effect if strictly needed to sync,
	// but for "initial seed" patterns, we can just silence the warning or accept it.
	// Here we keep it simple but acknowledge the pattern.
	let vocabularyList = $state([...data.vocabulary]);

	$effect(() => {
		// If data changes (e.g. navigation), reset list
		vocabularyList = [...data.vocabulary];
	});

	// Debounce search
	$effect(() => {
		const query = searchQuery;
		const timer = setTimeout(() => {
			debouncedQuery = query;
			currentCardIndex = 0; // Reset card index on filter change
		}, 300);
		return () => clearTimeout(timer);
	});

	// Filtered vocabulary
	let filteredVocabulary = $derived.by(() => {
		let result = vocabularyList;

		// Lesson Filter (Multi-select)
		if (selectedLessons.size > 0) {
			result = result.filter((v) => selectedLessons.has(v.lesson));
		}

		if (debouncedQuery.trim()) {
			const rawQuery = debouncedQuery.toLowerCase().trim();
			const hiraganaQuery = toHiragana(rawQuery, { IMEMode: true });

			result = result.filter(
				(v) =>
					v.hiragana.toLowerCase().includes(hiraganaQuery) ||
					v.hiragana.toLowerCase().includes(rawQuery) ||
					(v.kanji && v.kanji.toLowerCase().includes(rawQuery)) ||
					v.meaning.toLowerCase().includes(rawQuery)
			);
		}

		// Sort by Lesson
		if (isSortedByLesson) {
			result = [...result].sort((a, b) => (Number(a.lesson) || 0) - (Number(b.lesson) || 0));
		}

		return result;
	});

	let currentCard = $derived(filteredVocabulary[currentCardIndex]);

	function nextCard() {
		if (currentCardIndex < filteredVocabulary.length - 1) {
			currentCardIndex++;
		}
	}

	function prevCard() {
		if (currentCardIndex > 0) {
			currentCardIndex--;
		}
	}

	function shuffleCards() {
		// Disable sort when shuffling
		isSortedByLesson = false;
		// Shuffle the base list to preserve randomness even while filtering
		vocabularyList = [...vocabularyList].sort(() => Math.random() - 0.5);
		currentCardIndex = 0;
	}

	function toggleSort() {
		isSortedByLesson = !isSortedByLesson;
		if (!isSortedByLesson) {
			// If turning off sort, maybe revert to original order or just keep current?
			// For now, let's reset to original data order if not shuffled
			vocabularyList = [...data.vocabulary];
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (viewMode !== 'focus') return;
		// Prevent conflicts with input typing
		if (document.activeElement?.tagName === 'INPUT') return;

		if (e.key === 'ArrowRight') nextCard();
		if (e.key === 'ArrowLeft') prevCard();
	}

	function toggleLesson(lesson: number) {
		const newSet = new Set(selectedLessons);
		if (newSet.has(lesson)) {
			newSet.delete(lesson);
		} else {
			newSet.add(lesson);
		}
		selectedLessons = newSet;
		currentCardIndex = 0;
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<svelte:head>
	<title>{data.book.title} | Marugoto Vocabulary</title>
</svelte:head>

<div class="min-h-screen bg-base-100 flex flex-col">
	<!-- Header -->
	<header
		class="sticky top-0 z-40 bg-base-100/95 backdrop-blur-md border-b border-base-content/5 shadow-sm"
	>
		<div class="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
			<div class="flex items-center gap-3">
				<a href="/" class="btn btn-ghost btn-square btn-sm hover:bg-base-200">
					<ArrowLeft class="w-5 h-5" />
				</a>

				<div class="flex flex-col">
					<h1 class="font-bold text-lg leading-tight line-clamp-1">{data.book.title}</h1>
					<div class="flex items-center gap-2 text-xs text-base-content/60">
						<span class="font-medium text-primary">{data.book.level}</span>
						<span>•</span>
						<span>{data.totalWords} words</span>
					</div>
				</div>
			</div>

			<div class="flex items-center gap-2">
				<!-- Sort Button -->
				<button
					class="btn btn-sm btn-ghost gap-2 {isSortedByLesson ? 'text-primary' : ''}"
					onclick={toggleSort}
					title="Sort by Lesson"
					aria-label={isSortedByLesson ? 'Sort by original order' : 'Sort by Lesson'}
				>
					<ArrowUpDown class="w-4 h-4" />
					<span class="hidden sm:inline">Sort</span>
				</button>

				<!-- Shuffle Button (New) -->
				<button
					class="btn btn-sm btn-ghost gap-2"
					onclick={shuffleCards}
					title="Shuffle Cards"
					aria-label="Shuffle vocabulary"
				>
					<Shuffle class="w-4 h-4" />
					<span class="hidden sm:inline">Shuffle</span>
				</button>

				<!-- Quiz Button (Restored) -->
				<a href="/book/{data.book.id}/quiz" class="btn btn-sm btn-outline gap-2">
					<Target class="w-4 h-4" />
					<span class="hidden sm:inline">Quiz</span>
				</a>

				<!-- View Toggle -->
				<div class="join bg-base-200 p-1 rounded-lg">
					<button
						class="join-item btn btn-sm btn-ghost gap-2 {viewMode === 'focus'
							? 'bg-base-100 shadow-sm'
							: ''}"
						onclick={() => (viewMode = 'focus')}
					>
						<BookOpen class="w-4 h-4" />
						<span class="hidden sm:inline">Study</span>
					</button>
					<button
						class="join-item btn btn-sm btn-ghost gap-2 {viewMode === 'list'
							? 'bg-base-100 shadow-sm'
							: ''}"
						onclick={() => (viewMode = 'list')}
					>
						<Grid class="w-4 h-4" />
						<span class="hidden sm:inline">List</span>
					</button>
				</div>
			</div>
		</div>
	</header>

	<main
		class="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 gap-8 grid grid-cols-1 lg:grid-cols-[350px_1fr] items-start"
	>
		<!-- Sidebar / Controls (Sticky on desktop) -->
		<aside class="space-y-6 lg:sticky lg:top-24">
			<!-- Filters -->
			<div
				class="bg-base-100 rounded-2xl border border-base-content/10 p-4 space-y-4 shadow-sm relative z-30"
			>
				<div class="relative">
					<input
						type="text"
						placeholder="Search vocabulary..."
						class="input input-sm input-bordered w-full pl-9 bg-base-100 focus:bg-base-100 transition-colors"
						bind:value={searchQuery}
					/>
					<Search class="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/40" />
				</div>

				<div class="flex flex-col gap-2">
					<!-- Custom Multi-select Dropdown -->
					<div class="dropdown w-full">
						<div
							tabindex="0"
							role="button"
							class="btn btn-sm btn-bordered w-full justify-between bg-base-100 font-normal border-base-300"
							onclick={() => (isLessonDropdownOpen = !isLessonDropdownOpen)}
						>
							<span class="truncate">
								{selectedLessons.size === 0 ? 'All Lessons' : `Selected (${selectedLessons.size})`}
							</span>
							<ChevronDown class="w-4 h-4 opacity-50" />
						</div>
						<ul
							tabindex="0"
							class="dropdown-content z-[100] menu p-2 shadow-xl bg-base-100 rounded-box w-full max-h-60 overflow-y-auto flex-nowrap border border-base-content/5 mt-1"
						>
							<li>
								<button
									class="flex items-center gap-2"
									onclick={() => (selectedLessons = new Set())}
								>
									{#if selectedLessons.size === 0}
										<CheckSquare class="w-4 h-4 text-primary" />
									{:else}
										<Square class="w-4 h-4 text-base-content/30" />
									{/if}
									<span class="font-semibold">All Lessons</span>
								</button>
							</li>
							<div class="divider my-1 h-px"></div>
							{#each data.lessonNumbers as lesson}
								<li>
									<button
										class="flex items-center gap-2"
										onclick={(e) => {
											e.currentTarget.blur();
											toggleLesson(lesson);
										}}
									>
										{#if selectedLessons.has(lesson)}
											<CheckSquare class="w-4 h-4 text-primary" />
										{:else}
											<Square class="w-4 h-4 text-base-content/30" />
										{/if}
										<span>Lesson {lesson}</span>
									</button>
								</li>
							{/each}
						</ul>
					</div>

					<button
						class="btn btn-sm w-full gap-2 justify-between {showHiragana
							? 'btn-soft'
							: 'btn-outline'}"
						onclick={() => (showHiragana = !showHiragana)}
					>
						<span>Show Hiragana</span>
						{#if showHiragana}
							<Eye class="w-4 h-4" />
						{:else}
							<EyeOff class="w-4 h-4" />
						{/if}
					</button>
				</div>
			</div>

			<!-- Progress in Focus Mode -->
			{#if viewMode === 'focus' && filteredVocabulary.length > 0}
				<div
					class="bg-base-100 rounded-2xl border border-base-content/10 p-5 shadow-sm relative z-0"
				>
					<h3 class="font-bold text-sm mb-3 text-base-content/70 uppercase tracking-widest">
						Progress
					</h3>
					<ProgressBar current={currentCardIndex + 1} total={filteredVocabulary.length} />

					<div class="grid grid-cols-2 gap-2 mt-4">
						<button
							class="btn btn-outline btn-sm"
							onclick={prevCard}
							disabled={currentCardIndex === 0}>Previous</button
						>
						<button
							class="btn btn-primary btn-sm"
							onclick={nextCard}
							disabled={currentCardIndex === filteredVocabulary.length - 1}>Next</button
						>
					</div>
					<p class="text-xs text-center text-base-content/40 mt-3">
						Use <kbd class="kbd kbd-xs">←</kbd> <kbd class="kbd kbd-xs">→</kbd> keys
					</p>
				</div>
			{/if}
		</aside>

		<!-- Main Content Area -->
		<div class="w-full min-h-[500px]">
			{#if filteredVocabulary.length === 0}
				<!-- Empty State -->
				<div
					class="h-full flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-base-content/10 rounded-3xl"
				>
					<div class="text-4xl mb-4 opacity-50">🔍</div>
					<h3 class="font-bold text-lg">No words found</h3>
					<p class="text-base-content/60">Try adjusting your filters</p>
				</div>
			{:else if viewMode === 'focus'}
				<!-- FOCUS MODE: Flashcard -->
				<div class="h-full flex flex-col items-center justify-center py-8">
					{#key currentCard}
						<div class="w-full max-w-xl" in:fly={{ y: 20, duration: 300, easing: quadOut }}>
							<Flashcard vocab={currentCard} />

							<div class="mt-8 text-center text-sm text-base-content/40 font-medium">
								Lesson {currentCard.lesson}
							</div>
						</div>
					{/key}
				</div>
			{:else}
				<!-- LIST MODE: Grid (Redesigned) -->
				<div class="grid grid-cols-1 gap-3">
					{#each filteredVocabulary as entry (entry)}
						<div
							class="card bg-base-100 border border-base-content/5 hover:border-primary/20 hover:shadow-md transition-all p-4 flex flex-row items-center justify-between group cursor-pointer"
							onclick={() => speak(entry.kanji || entry.hiragana)}
							role="button"
							tabindex="0"
							onkeydown={(e) => {
								if (e.key === 'Enter' || e.key === ' ') {
									e.preventDefault();
									speak(entry.kanji || entry.hiragana);
								}
							}}
						>
							<div class="flex items-center gap-4">
								<!-- Lesson Badge -->
								<div
									class="flex flex-col items-center justify-center w-12 h-12 rounded-xl bg-base-200/50 text-xs font-bold text-base-content/40 shrink-0"
								>
									<span class="text-[10px] uppercase">Les</span>
									<span class="text-base text-primary/80">{entry.lesson}</span>
								</div>

								<!-- Japanese Text -->
								<div>
									{#if entry.kanji}
										<div class="text-xl font-bold flex items-baseline gap-2">
											{entry.kanji}
										</div>
										{#if showHiragana}
											<div class="text-sm text-base-content/60 font-medium">{entry.hiragana}</div>
										{/if}
									{:else}
										<div class="text-xl font-bold">{entry.hiragana}</div>
									{/if}
								</div>
							</div>

							<!-- Meaning & Actions -->
							<div class="text-right flex items-center gap-4">
								<span class="text-base font-medium text-base-content/80 text-right"
									>{entry.meaning}</span
								>

								<button
									class="btn btn-ghost btn-circle btn-sm text-base-content/30 hover:text-primary hover:bg-primary/10 transition-all opacity-0 group-hover:opacity-100"
									onclick={(e) => {
										e.stopPropagation();
										speak(entry.kanji || entry.hiragana);
									}}
									title="Play Audio"
								>
									<Volume2 class="w-4 h-4" />
								</button>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	</main>
</div>
