<script lang="ts">
	import { BOOKS } from '$lib/constants';
	// @ts-ignore
	import Hero from '$lib/components/Hero.svelte';
	// @ts-ignore
	import BookCard from '$lib/components/BookCard.svelte';
	import type { BookLevel } from '$lib/types';

	// Group books by level for organized display
	const booksByLevel = BOOKS.reduce(
		(acc, book) => {
			if (!acc[book.level]) {
				acc[book.level] = [];
			}
			acc[book.level].push(book);
			return acc;
		},
		{} as Record<BookLevel, typeof BOOKS>
	);

	// Level order for display
	const levelOrder: BookLevel[] = ['A1', 'A2-1', 'A2-2', 'A2/B1', 'B1-1', 'B1-2'];
</script>

<svelte:head>
	<title>Marugoto Vocabulary | Learn Japanese Effectively</title>
	<meta
		name="description"
		content="Master Japanese vocabulary with the official Marugoto curriculum. Interactive flashcards and quizzes."
	/>
</svelte:head>

<!-- Hero Section -->
<Hero />

<!-- Main Content -->
<div class="max-w-6xl mx-auto px-4 pb-20">
	{#each levelOrder as level}
		{#if booksByLevel[level]}
			<section id={level} class="mb-20 scroll-mt-24">
				<!-- Level Header -->
				<div class="flex items-end gap-4 mb-8 pb-4 border-b border-base-content/10">
					<h2 class="text-3xl font-bold text-base-content relative">
						<span class="text-primary mr-2">#</span>{level}
					</h2>
					<span class="text-base-content/40 text-sm font-medium mb-1.5 uppercase tracking-wide">
						Level
					</span>
				</div>

				<!-- Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each booksByLevel[level] as book, i}
						<BookCard {book} {level} index={i} />
					{/each}
				</div>
			</section>
		{/if}
	{/each}
</div>
