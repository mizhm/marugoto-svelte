<script lang="ts">
	import { TYPE_CONFIG, LEVEL_GRADIENTS } from '$lib/theme';
	import type { Book, BookLevel } from '$lib/types';

	interface Props {
		book: Book;
		level: BookLevel;
		index?: number;
	}

	let { book, level, index = 0 }: Props = $props();
</script>

<a
	href="/book/{book.id}"
	class="group relative bg-base-100 rounded-2xl overflow-hidden border border-base-content/10 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 block h-full flex flex-col"
	style="animation-delay: {index * 50}ms"
>
	<!-- Top Accent Line -->
	<div
		class="h-1.5 w-full bg-gradient-to-r {LEVEL_GRADIENTS[
			level
		]} opacity-80 group-hover:opacity-100 transition-opacity"
	></div>

	<div class="p-6 flex-1 flex flex-col relative">
		<!-- Background Gradient Blob (Subtle) -->
		<div
			class="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-gradient-to-br {LEVEL_GRADIENTS[
				level
			]} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity duration-500"
		></div>

		<!-- Header: Type Badge & Level Icon -->
		<div class="flex items-start justify-between mb-4">
			<span
				class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold tracking-wide bg-base-200/50 border border-base-content/5 {TYPE_CONFIG[
					book.type
				]?.color || 'text-base-content/70'}"
			>
				<span>{TYPE_CONFIG[book.type]?.icon || '📖'}</span>
				<span>{TYPE_CONFIG[book.type]?.label || 'Book'}</span>
			</span>

			<div
				class="w-8 h-8 rounded-lg bg-base-200 flex items-center justify-center text-xs font-bold text-base-content/60 group-hover:bg-primary group-hover:text-primary-content transition-colors duration-300 shadow-sm"
			>
				{level}
			</div>
		</div>

		<!-- Title & Description -->
		<div class="mb-6 flex-1">
			<h3
				class="text-xl font-bold mb-2 text-base-content group-hover:text-primary transition-colors leading-tight"
			>
				{book.title}
			</h3>
			<p class="text-sm text-base-content/60 leading-relaxed line-clamp-3">
				{book.description}
			</p>
		</div>

		<!-- Footer: Progress or Action -->
		<div class="pt-4 mt-auto border-t border-base-content/5 flex items-center justify-between">
			<!-- Visual flair (dots) -->
			<div class="flex gap-1 opacity-40 group-hover:opacity-100 transition-opacity">
				<div class="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
				<div class="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
				<div class="w-1.5 h-1.5 rounded-full bg-primary/40"></div>
			</div>

			<span
				class="text-xs font-bold text-primary flex items-center gap-1 opacity-60 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
			>
				Start Learning
				<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M14 5l7 7m0 0l-7 7m7-7H3"
					/>
				</svg>
			</span>
		</div>
	</div>
</a>
