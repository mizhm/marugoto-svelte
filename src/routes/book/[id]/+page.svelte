<script lang="ts">
	import type { PageData } from './$types';
	import type { BookLevel, BookType } from '$lib/types';
	import { ArrowLeft, Search, Eye, EyeOff, ChevronUp, Layers, Target } from 'lucide-svelte';

	let { data }: { data: PageData } = $props();

	// UI State
	let selectedLesson = $state<number | null>(null);
	let searchQuery = $state('');
	let showHiragana = $state(true);

	// Level colors
	const levelGradients: Record<BookLevel, string> = {
		A1: 'from-emerald-500 to-teal-600',
		'A2-1': 'from-blue-500 to-cyan-600',
		'A2-2': 'from-indigo-500 to-blue-600',
		'A2/B1': 'from-violet-500 to-purple-600',
		'B1-1': 'from-rose-500 to-pink-600',
		'B1-2': 'from-orange-500 to-red-600'
	};

	const levelAccent: Record<BookLevel, string> = {
		A1: 'border-l-emerald-500',
		'A2-1': 'border-l-blue-500',
		'A2-2': 'border-l-indigo-500',
		'A2/B1': 'border-l-violet-500',
		'B1-1': 'border-l-rose-500',
		'B1-2': 'border-l-orange-500'
	};

	// Type config
	const typeConfig: Record<BookType, { icon: string; label: string }> = {
		katsudou: { icon: '🗣️', label: 'Hoạt động' },
		rikai: { icon: '📖', label: 'Hiểu biết' },
		combined: { icon: '📚', label: 'Tổng hợp' }
	};

	// Filtered vocabulary
	let filteredVocabulary = $derived.by(() => {
		let result = data.vocabulary;

		if (selectedLesson !== null) {
			result = result.filter((v) => v.lesson === selectedLesson);
		}

		if (searchQuery.trim()) {
			const query = searchQuery.toLowerCase().trim();
			result = result.filter(
				(v) =>
					v.hiragana.toLowerCase().includes(query) ||
					(v.kanji && v.kanji.toLowerCase().includes(query)) ||
					v.meaning.toLowerCase().includes(query)
			);
		}

		return result;
	});
</script>

<svelte:head>
	<title>{data.book.title} | Marugoto Vocabulary</title>
</svelte:head>

<div class="min-h-screen">
	<!-- Header -->
	<header class="sticky top-0 z-50 bg-base-100 shadow-sm">
		<div class="max-w-6xl mx-auto px-4 py-4">
			<div class="flex items-center gap-4">
				<a href="/" class="btn btn-ghost btn-circle">
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
						<span class="text-sm text-base-content/60">
							{typeConfig[data.book.type].icon}
							{typeConfig[data.book.type].label}
						</span>
					</div>
					<h1 class="text-xl font-bold">{data.book.title}</h1>
				</div>

				<a href="/book/{data.book.id}/flashcard" class="btn btn-primary gap-2">
					<Layers class="w-5 h-5" />
					<span class="hidden sm:inline">Flashcard</span>
				</a>

				<a href="/book/{data.book.id}/quiz" class="btn btn-secondary gap-2">
					<Target class="w-5 h-5" />
					<span class="hidden sm:inline">Quiz</span>
				</a>

				<div class="text-center px-4 py-2 bg-primary/10 rounded-xl">
					<div class="text-2xl font-bold text-primary">{data.totalWords}</div>
					<div class="text-xs text-base-content/60">từ vựng</div>
				</div>
			</div>
		</div>
	</header>

	<!-- Filters -->
	<div class="sticky top-[88px] z-40 bg-base-100 border-b border-base-300">
		<div class="max-w-6xl mx-auto px-4 py-3">
			<div class="flex gap-3">
				<div class="relative flex-1">
					<Search class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-content/40" />
					<input
						type="text"
						placeholder="Tìm kiếm từ vựng..."
						class="input input-bordered w-full pl-11 bg-base-200"
						bind:value={searchQuery}
					/>
				</div>

				<select
					class="select select-bordered bg-base-200 min-w-[130px]"
					bind:value={selectedLesson}
				>
					<option value={null}>Tất cả bài</option>
					{#each data.lessonNumbers as lesson}
						<option value={lesson}>Bài {lesson}</option>
					{/each}
				</select>

				<button
					class="btn btn-square {showHiragana ? 'btn-primary' : 'btn-ghost border-base-300'}"
					onclick={() => (showHiragana = !showHiragana)}
					title={showHiragana ? 'Ẩn hiragana' : 'Hiện hiragana'}
				>
					{#if showHiragana}
						<Eye class="w-5 h-5" />
					{:else}
						<EyeOff class="w-5 h-5" />
					{/if}
				</button>
			</div>
		</div>
	</div>

	<!-- Content -->
	<main class="max-w-6xl mx-auto px-4 py-6">
		<p class="text-base-content/60 mb-6">
			Hiển thị <span class="font-semibold text-base-content">{filteredVocabulary.length}</span> từ
		</p>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			{#each filteredVocabulary as entry}
				<div
					class="card bg-base-100 shadow-md border-l-4 {levelAccent[
						data.book.level
					]} hover:shadow-lg"
				>
					<div class="card-body p-5">
						<!-- Lesson badge -->
						<div class="mb-3">
							<span class="badge badge-ghost text-xs">Bài {entry.lesson}</span>
						</div>

						<!-- Japanese section -->
						<div class="space-y-1 mb-4">
							{#if entry.kanji}
								<div class="text-3xl font-bold text-base-content leading-tight">
									{entry.kanji}
								</div>
								{#if showHiragana}
									<div class="text-lg text-base-content/50">
										{entry.hiragana}
									</div>
								{/if}
							{:else}
								<div class="text-3xl font-bold text-base-content leading-tight">
									{entry.hiragana}
								</div>
							{/if}
						</div>

						<!-- Vietnamese meaning - bigger -->
						<div class="pt-3 border-t border-base-200">
							<p class="text-base text-base-content/80 leading-relaxed">
								{entry.meaning}
							</p>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if filteredVocabulary.length === 0}
			<div class="text-center py-16">
				<div class="text-5xl mb-4">🔍</div>
				<p class="text-xl font-medium text-base-content/70">Không tìm thấy từ vựng</p>
				<p class="text-base-content/50 mt-2">Thử thay đổi bộ lọc hoặc từ khóa</p>
			</div>
		{/if}
	</main>

	<!-- Back to top -->
	<button
		onclick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
		class="fixed bottom-6 right-6 btn btn-circle btn-primary shadow-xl"
	>
		<ChevronUp class="w-5 h-5" />
	</button>
</div>
