<script lang="ts">
	import type { PageData } from './$types';
	import type { VocabularyEntry } from '$lib/types';
	import {
		ArrowLeft,
		RotateCcw,
		Trophy,
		X,
		Check,
		Zap,
		HelpCircle,
		ChevronRight,
		Play,
		Square,
		CheckSquare,
		ChevronDown
	} from 'lucide-svelte';
	import { fly, scale, fade } from 'svelte/transition';
	import { quadOut, elasticOut } from 'svelte/easing';
	import { LEVEL_GRADIENTS } from '$lib/theme';

	let { data }: { data: PageData } = $props();

	// Quiz settings
	const QUESTION_OPTIONS = [5, 10, 15, 20, 30];
	const OPTIONS_COUNT = 4;

	// State
	let selectedLessons = $state<Set<number>>(new Set());
	let isLessonDropdownOpen = $state(false);
	let questionCount = $state(10);

	let questions = $state<
		Array<{
			word: VocabularyEntry;
			options: string[];
			correctIndex: number;
		}>
	>([]);

	let currentIndex = $state(0);
	let selectedAnswer = $state<number | null>(null);
	let isAnswered = $state(false);

	// Stats
	let correctCount = $state(0);
	let wrongCount = $state(0);

	// Game Flow State
	let gameState = $state<'start' | 'playing' | 'finished'>('start');

	// Calculate available vocabulary based on lesson selection
	let availableVocab = $derived(
		selectedLessons.size === 0
			? data.vocabulary
			: data.vocabulary.filter((v) => selectedLessons.has(v.lesson))
	);

	// Max questions based on available vocabulary (need at least 4 for options)
	let maxQuestions = $derived(Math.max(0, availableVocab.length));

	// Available question count options (filtered based on vocabulary size)
	let availableQuestionOptions = $derived(QUESTION_OPTIONS.filter((n) => n <= maxQuestions));

	function toggleLesson(lesson: number) {
		const newSet = new Set(selectedLessons);
		if (newSet.has(lesson)) {
			newSet.delete(lesson);
		} else {
			newSet.add(lesson);
		}
		selectedLessons = newSet;
	}

	// Generate quiz questions
	function startQuiz() {
		const pool = availableVocab;
		const count = Math.min(questionCount, pool.length);

		// Shuffle and take questions
		const shuffled = [...pool].sort(() => Math.random() - 0.5);
		const questionWords = shuffled.slice(0, count);

		// Get all unique meanings for wrong answers
		const allMeanings = [...new Set(pool.map((v) => v.meaning))];

		questions = questionWords.map((word) => {
			// Get wrong options (meanings that are NOT the correct answer)
			const wrongMeanings = allMeanings
				.filter((m) => m !== word.meaning)
				.sort(() => Math.random() - 0.5)
				.slice(0, OPTIONS_COUNT - 1);

			// Combine and shuffle options
			const options = [word.meaning, ...wrongMeanings].sort(() => Math.random() - 0.5);
			const correctIndex = options.indexOf(word.meaning);

			return { word, options, correctIndex };
		});

		// Reset state
		currentIndex = 0;
		selectedAnswer = null;
		isAnswered = false;
		correctCount = 0;
		wrongCount = 0;
		gameState = 'playing';
	}

	function selectAnswer(index: number) {
		if (isAnswered) return;

		selectedAnswer = index;
		isAnswered = true;

		if (index === currentQuestion.correctIndex) {
			correctCount++;
		} else {
			wrongCount++;
		}
	}

	function nextQuestion() {
		if (currentIndex < questions.length - 1) {
			currentIndex++;
			selectedAnswer = null;
			isAnswered = false;
		} else {
			gameState = 'finished';
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (gameState !== 'playing') return;

		if (e.key >= '1' && e.key <= '4') {
			const index = parseInt(e.key) - 1;
			if (index < currentQuestion.options.length) {
				if (!isAnswered) {
					selectAnswer(index);
				}
			}
		} else if (e.code === 'Space' || e.code === 'Enter') {
			if (isAnswered) {
				e.preventDefault();
				nextQuestion();
			}
		}
	}

	let currentQuestion = $derived(questions[currentIndex]);
	let progress = $derived(questions.length > 0 ? (currentIndex / questions.length) * 100 : 0);

	let scorePercent = $derived(
		correctCount + wrongCount > 0
			? Math.round((correctCount / (correctCount + wrongCount)) * 100)
			: 0
	);
</script>

<svelte:head>
	<style>
		@keyframes shake {
			0%,
			100% {
				transform: translateX(0);
			}
			25% {
				transform: translateX(-4px);
			}
			75% {
				transform: translateX(4px);
			}
		}
		.animate-shake {
			animation: shake 0.3s ease-in-out;
		}
	</style>
	<title>Quiz: {data.book.title} | Marugoto</title>
</svelte:head>

<svelte:window onkeydown={handleKeydown} />

<div class="min-h-screen bg-base-100 flex flex-col">
	<!-- Header -->
	<header class="bg-base-100/80 backdrop-blur-md border-b border-base-content/5 sticky top-0 z-50">
		<div class="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
			<div class="flex items-center gap-2">
				<a href="/book/{data.book.id}" class="btn btn-ghost btn-circle btn-sm">
					<ArrowLeft class="w-5 h-5" />
				</a>
				<div class="flex flex-col">
					<span class="text-xs font-bold text-primary tracking-wider uppercase">Quiz Mode</span>
					<h1 class="font-bold text-sm sm:text-base line-clamp-1">{data.book.title}</h1>
				</div>
			</div>

			{#if gameState === 'start'}
				<!-- Custom Multi-select Dropdown -->
				<div class="dropdown dropdown-end">
					<div
						tabindex="0"
						role="button"
						class="btn btn-sm btn-ghost bg-base-200/50 font-normal border-base-300 min-w-[140px] justify-between"
						onclick={() => (isLessonDropdownOpen = !isLessonDropdownOpen)}
					>
						<span class="truncate max-w-[100px]">
							{selectedLessons.size === 0 ? 'All Lessons' : `Selected (${selectedLessons.size})`}
						</span>
						<ChevronDown class="w-4 h-4 opacity-50" />
					</div>
					<ul
						tabindex="0"
						class="dropdown-content z-[20] menu p-2 shadow-xl bg-base-100 rounded-box w-64 max-h-80 overflow-y-auto flex-nowrap border border-base-content/5 mt-1"
					>
						<li>
							<button class="flex items-center gap-2" onclick={() => (selectedLessons = new Set())}>
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
			{:else if gameState === 'playing'}
				<div class="flex items-center gap-4 text-xs font-bold">
					<div class="flex items-center gap-1.5 text-success bg-success/10 px-2 py-1 rounded-lg">
						<Check class="w-3.5 h-3.5" />
						{correctCount}
					</div>
					<div class="flex items-center gap-1.5 text-error bg-error/10 px-2 py-1 rounded-lg">
						<X class="w-3.5 h-3.5" />
						{wrongCount}
					</div>
				</div>
			{/if}
		</div>

		<!-- Progress Bar -->
		{#if gameState === 'playing'}
			<div class="w-full h-1 bg-base-200">
				<div
					class="h-full bg-primary transition-all duration-300 ease-out"
					style="width: {((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100}%"
				></div>
			</div>
		{/if}
	</header>

	<main class="flex-1 flex flex-col items-center justify-center p-4 w-full max-w-2xl mx-auto">
		<!-- START SCREEN -->
		{#if gameState === 'start'}
			<div class="text-center space-y-8 w-full max-w-md" in:fly={{ y: 20, duration: 400 }}>
				<div class="relative inline-block mb-4">
					<div class="absolute inset-0 bg-primary/20 blur-3xl rounded-full"></div>
					<div
						class="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-5xl shadow-xl relative z-10 rotate-3"
					>
						🎯
					</div>
				</div>

				<div class="space-y-2">
					<h2 class="text-3xl font-bold">Ready to practice?</h2>
					<p class="text-base-content/60">Choose how many words you want to review</p>
				</div>

				<div class="bg-base-200/50 rounded-2xl p-6 border border-base-content/5">
					<div class="flex flex-wrap justify-center gap-2">
						{#each availableQuestionOptions as count}
							<button
								class="btn btn-lg {questionCount === count
									? 'btn-primary shadow-lg scale-105'
									: 'btn-outline border-base-300 hover:border-primary hover:bg-primary/5'} transition-all"
								onclick={() => (questionCount = count)}
							>
								{count}
							</button>
						{/each}
					</div>
					<div class="mt-4 text-xs text-base-content/40 font-medium">Questions</div>
				</div>

				<button
					class="btn btn-primary btn-lg w-full gap-2 shadow-xl shadow-primary/20 hover:scale-[1.02] transition-transform"
					onclick={startQuiz}
					disabled={maxQuestions < 4}
				>
					<Play class="w-5 h-5 fill-current" />
					Start Quiz
				</button>

				{#if maxQuestions < 4}
					<div role="alert" class="alert alert-warning text-sm py-2">
						<HelpCircle class="w-4 h-4" />
						<span>Not enough words properly loaded to start quiz.</span>
					</div>
				{/if}
			</div>

			<!-- PLAYING SCREEN -->
		{:else if gameState === 'playing' && currentQuestion}
			<div class="w-full space-y-8">
				<!-- Question Card -->
				<div
					class="relative w-full aspect-[2/1] bg-base-100 rounded-3xl border border-base-content/10 shadow-lg flex flex-col items-center justify-center p-8 text-center overlow-hidden"
				>
					<div
						class="absolute inset-0 bg-gradient-to-br {LEVEL_GRADIENTS[data.book.level]} opacity-5"
					></div>
					<span class="text-xs font-bold text-base-content/30 uppercase tracking-widest mb-4"
						>Question {currentIndex + 1} of {questions.length}</span
					>

					{#key currentQuestion}
						<div class="space-y-2" in:scale={{ start: 0.9, duration: 300, easing: elasticOut }}>
							{#if currentQuestion.word.kanji}
								<h2 class="text-5xl md:text-6xl font-black text-base-content">
									{currentQuestion.word.kanji}
								</h2>
								<p class="text-2xl text-base-content/50 font-medium">
									{currentQuestion.word.hiragana}
								</p>
							{:else}
								<h2 class="text-5xl md:text-6xl font-black text-base-content">
									{currentQuestion.word.hiragana}
								</h2>
							{/if}
						</div>
					{/key}
				</div>

				<!-- Options Grid -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{#each currentQuestion.options as option, i}
						{@const isCorrect = i === currentQuestion.correctIndex}
						{@const isSelected = i === selectedAnswer}
						{@const isWrongSelected = isAnswered && isSelected && !isCorrect}

						<button
							class="btn btn-lg h-auto py-5 px-6 text-left justify-between border-2 relative overflow-hidden group
								{isAnswered
								? isCorrect
									? 'bg-success/10 border-success text-success'
									: isWrongSelected
										? 'bg-error/10 border-error text-error animate-shake'
										: 'opacity-40 border-transparent bg-base-200'
								: 'bg-base-100 border-base-200 hover:border-primary hover:bg-base-100'}"
							onclick={() => selectAnswer(i)}
							disabled={isAnswered}
						>
							<span class="font-medium text-lg relative z-10">{option}</span>

							{#if isAnswered}
								{#if isCorrect}
									<Check class="w-6 h-6 shrink-0" />
								{:else if isWrongSelected}
									<X class="w-6 h-6 shrink-0" />
								{/if}
							{:else}
								<span
									class="w-6 h-6 rounded-full bg-base-200 text-base-content/40 text-xs flex items-center justify-center group-hover:bg-primary group-hover:text-primary-content transition-colors"
								>
									{i + 1}
								</span>
							{/if}
						</button>
					{/each}
				</div>

				<!-- Next Button / Hint -->
				<div class="h-16 flex items-center justify-center">
					{#if isAnswered}
						<button
							class="btn btn-link no-underline gap-2 text-base-content/60 hover:text-primary animate-bounce decoration-transparent"
							onclick={nextQuestion}
						>
							Press <kbd class="kbd kbd-sm font-sans">Space</kbd> to continue
							<ChevronRight class="w-4 h-4" />
						</button>
					{/if}
				</div>
			</div>

			<!-- FINISHED SCREEN -->
		{:else if gameState === 'finished'}
			<div class="text-center space-y-8 w-full max-w-md" in:scale={{ start: 0.9, duration: 400 }}>
				<div class="relative inline-block">
					<div class="absolute inset-0 bg-yellow-400/20 blur-3xl rounded-full"></div>
					<Trophy class="w-32 h-32 text-yellow-500 drop-shadow-xl relative z-10" />
				</div>

				<div>
					<h2 class="text-4xl font-black mb-2">{scorePercent}% Score</h2>
					<p class="text-base-content/60 text-lg">
						{#if scorePercent >= 90}
							Incredible! Perfect mastery!
						{:else if scorePercent >= 80}
							Great job! Almost perfect.
						{:else if scorePercent >= 50}
							Good effort! Keep practicing.
						{:else}
							Keep going! Practice makes perfect.
						{/if}
					</p>
				</div>

				<div class="stats shadow-lg w-full border border-base-content/5 bg-base-100">
					<div class="stat place-items-center">
						<div class="stat-title text-success font-bold">Correct</div>
						<div class="stat-value text-success">{correctCount}</div>
					</div>
					<div class="stat place-items-center">
						<div class="stat-title text-error font-bold">Wrong</div>
						<div class="stat-value text-error">{wrongCount}</div>
					</div>
				</div>

				<div class="flex flex-col gap-3 pt-4">
					<button class="btn btn-primary btn-lg w-full gap-2 shadow-lg" onclick={startQuiz}>
						<RotateCcw class="w-5 h-5" />
						Play Again
					</button>
					<a href="/book/{data.book.id}" class="btn btn-ghost w-full"> Back to Book </a>
				</div>
			</div>
		{/if}
	</main>
</div>
