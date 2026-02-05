<script lang="ts">
	import type { PageData } from './$types';
	import type { BookLevel, VocabularyEntry } from '$lib/types';
	import { ArrowLeft, RotateCcw, Trophy, X, Check, Zap } from 'lucide-svelte';

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

	// Quiz settings
	const QUESTION_OPTIONS = [5, 10, 15, 20, 30];
	const OPTIONS_COUNT = 4;

	// State
	let selectedLesson = $state<number | null>(null);
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
	let correctCount = $state(0);
	let wrongCount = $state(0);
	let quizStarted = $state(false);
	let quizFinished = $state(false);

	// Calculate available vocabulary based on lesson selection
	let availableVocab = $derived(
		selectedLesson === null
			? data.vocabulary
			: data.vocabulary.filter((v) => v.lesson === selectedLesson)
	);

	// Max questions based on available vocabulary (need at least 4 for options)
	let maxQuestions = $derived(Math.max(0, availableVocab.length));

	// Available question count options (filtered based on vocabulary size)
	let availableQuestionOptions = $derived(QUESTION_OPTIONS.filter((n) => n <= maxQuestions));

	// Generate quiz questions
	function generateQuiz() {
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
		quizStarted = true;
		quizFinished = false;
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
			quizFinished = true;
		}
	}

	function handleKeydown(e: KeyboardEvent) {
		if (!quizStarted || quizFinished) return;

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
	let progress = $derived(questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0);
	let scorePercent = $derived(
		correctCount + wrongCount > 0
			? Math.round((correctCount / (correctCount + wrongCount)) * 100)
			: 0
	);
</script>

<svelte:head>
	<title>Quiz - {data.book.title}</title>
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
						<span class="text-sm text-base-content/60">Quiz</span>
					</div>
					<h1 class="font-bold truncate">{data.book.title}</h1>
				</div>

				{#if !quizStarted}
					<select class="select select-bordered select-sm bg-base-200" bind:value={selectedLesson}>
						<option value={null}>Tất cả ({data.vocabulary.length})</option>
						{#each data.lessonNumbers as lesson}
							<option value={lesson}>
								Bài {lesson} ({data.vocabulary.filter((v) => v.lesson === lesson).length})
							</option>
						{/each}
					</select>
				{/if}
			</div>
		</div>
	</header>

	<!-- Progress bar -->
	{#if quizStarted && !quizFinished}
		<div class="h-1 bg-base-300">
			<div
				class="h-full bg-gradient-to-r {levelGradients[
					data.book.level
				]} transition-all duration-300"
				style="width: {progress}%"
			></div>
		</div>
	{/if}

	<!-- Main content -->
	<main class="flex-1 flex flex-col items-center justify-center p-4">
		{#if !quizStarted}
			<!-- Start screen -->
			<div class="text-center max-w-md">
				<div class="text-6xl mb-6">🎯</div>
				<h2 class="text-3xl font-bold mb-4">Kiểm tra từ vựng</h2>
				<p class="text-base-content/60 mb-6">Chọn số lượng câu hỏi và bắt đầu kiểm tra</p>

				<!-- Question count selector -->
				<div class="mb-8">
					<p class="text-sm text-base-content/60 mb-2">Số câu hỏi</p>
					<div class="flex flex-wrap justify-center gap-2">
						{#each availableQuestionOptions as count}
							<button
								class="btn {questionCount === count ? 'btn-primary' : 'btn-outline'}"
								onclick={() => (questionCount = count)}
							>
								{count}
							</button>
						{/each}
					</div>
					{#if maxQuestions < 5}
						<p class="text-sm text-warning mt-3">
							⚠️ Cần ít nhất 5 từ vựng để tạo quiz. Hiện có: {maxQuestions}
						</p>
					{:else if maxQuestions < questionCount}
						<p class="text-sm text-base-content/50 mt-3">
							Có {maxQuestions} từ vựng trong bộ lọc
						</p>
					{/if}
				</div>

				<button
					class="btn btn-primary btn-lg gap-2"
					onclick={generateQuiz}
					disabled={maxQuestions < 4}
				>
					<Zap class="w-5 h-5" />
					Bắt đầu Quiz
				</button>
			</div>
		{:else if quizFinished}
			<!-- Results screen -->
			<div class="text-center max-w-md">
				<div class="text-6xl mb-6">
					{#if scorePercent >= 80}
						🎉
					{:else if scorePercent >= 50}
						👍
					{:else}
						💪
					{/if}
				</div>
				<h2 class="text-3xl font-bold mb-4">Kết quả</h2>

				<div class="stats shadow mb-8">
					<div class="stat">
						<div class="stat-figure text-success">
							<Check class="w-8 h-8" />
						</div>
						<div class="stat-title">Đúng</div>
						<div class="stat-value text-success">{correctCount}</div>
					</div>
					<div class="stat">
						<div class="stat-figure text-error">
							<X class="w-8 h-8" />
						</div>
						<div class="stat-title">Sai</div>
						<div class="stat-value text-error">{wrongCount}</div>
					</div>
					<div class="stat">
						<div class="stat-figure text-primary">
							<Trophy class="w-8 h-8" />
						</div>
						<div class="stat-title">Điểm</div>
						<div class="stat-value text-primary">{scorePercent}%</div>
					</div>
				</div>

				<div class="flex gap-3 justify-center">
					<button class="btn btn-primary gap-2" onclick={generateQuiz}>
						<RotateCcw class="w-4 h-4" />
						Làm lại
					</button>
					<a href="/book/{data.book.id}" class="btn btn-ghost"> Quay lại </a>
				</div>
			</div>
		{:else if currentQuestion}
			<!-- Question -->
			<div class="w-full max-w-2xl">
				<!-- Stats -->
				<div class="flex items-center justify-between mb-6 text-sm">
					<span class="text-base-content/60">
						Câu {currentIndex + 1} / {questions.length}
					</span>
					<div class="flex gap-4">
						<span class="text-success flex items-center gap-1">
							<Check class="w-4 h-4" />
							{correctCount}
						</span>
						<span class="text-error flex items-center gap-1">
							<X class="w-4 h-4" />
							{wrongCount}
						</span>
					</div>
				</div>

				<!-- Question card -->
				<div class="card bg-base-100 shadow-xl mb-8">
					<div class="card-body items-center text-center py-12">
						<p class="text-sm text-base-content/50 mb-2">Từ này có nghĩa là gì?</p>
						{#if currentQuestion.word.kanji}
							<h2 class="text-6xl md:text-7xl font-bold mb-3">
								{currentQuestion.word.kanji}
							</h2>
							<p class="text-2xl text-base-content/50">{currentQuestion.word.hiragana}</p>
						{:else}
							<h2 class="text-6xl md:text-7xl font-bold">
								{currentQuestion.word.hiragana}
							</h2>
						{/if}
					</div>
				</div>

				<!-- Options -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{#each currentQuestion.options as option, i}
						{@const isCorrect = i === currentQuestion.correctIndex}
						{@const isSelected = i === selectedAnswer}
						{@const isWrongSelected = isAnswered && isSelected && !isCorrect}
						<button
							class="btn btn-lg h-auto py-4 text-left justify-start gap-3 border-2
								{isAnswered
								? isCorrect
									? 'bg-success border-success text-white hover:bg-success'
									: isWrongSelected
										? 'bg-error border-error text-white hover:bg-error'
										: 'btn-ghost opacity-30 border-transparent'
								: 'btn-outline hover:btn-primary border-base-300'}"
							onclick={() => selectAnswer(i)}
							disabled={isAnswered}
						>
							<span
								class="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0
									{isAnswered && isCorrect
									? 'bg-white/20 text-white'
									: isWrongSelected
										? 'bg-white/20 text-white'
										: 'bg-base-200 text-base-content'}"
							>
								{#if isAnswered && isCorrect}
									<Check class="w-4 h-4" />
								{:else if isWrongSelected}
									<X class="w-4 h-4" />
								{:else}
									{i + 1}
								{/if}
							</span>
							<span
								class="flex-1 text-base {isAnswered && (isCorrect || isWrongSelected)
									? 'font-semibold'
									: ''}">{option}</span
							>
						</button>
					{/each}
				</div>

				<!-- Next button -->
				{#if isAnswered}
					<div class="text-center mt-8">
						<button class="btn btn-primary btn-lg" onclick={nextQuestion}>
							{currentIndex < questions.length - 1 ? 'Câu tiếp theo' : 'Xem kết quả'}
						</button>
						<p class="text-xs text-base-content/40 mt-2">
							Nhấn <span class="kbd kbd-sm">Space</span> để tiếp tục
						</p>
					</div>
				{:else}
					<p class="text-center text-xs text-base-content/40 mt-8">
						Nhấn <span class="kbd kbd-sm">1</span>-<span class="kbd kbd-sm">4</span> để chọn đáp án
					</p>
				{/if}
			</div>
		{/if}
	</main>
</div>
