<script lang="ts">
	import { BOOKS } from '$lib/constants';
	import { LEVEL_GRADIENTS, TYPE_CONFIG } from '$lib/theme';
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

	import { fly, fade } from 'svelte/transition';
	import { quadOut, backOut } from 'svelte/easing';
</script>

<svelte:head>
	<title>Marugoto Vocabulary | Học từ vựng tiếng Nhật</title>
	<meta
		name="description"
		content="Ứng dụng học từ vựng tiếng Nhật theo giáo trình Marugoto - từ A1 đến B1"
	/>
</svelte:head>

<!-- Main Container -->
<div>
	<!-- Hero Section -->
	<header class="pt-16 pb-12 px-4">
		<div class="max-w-4xl mx-auto text-center" in:fly={{ y: 50, duration: 800, easing: backOut }}>
			<!-- Logo -->
			<div class="mb-8 relative inline-block">
				<div
					class="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary via-secondary to-accent p-1 rotate-3 hover:rotate-0 transition-transform duration-500"
				>
					<div
						class="w-full h-full rounded-3xl bg-base-300 flex items-center justify-center text-5xl"
					>
						本
					</div>
				</div>
			</div>

			<!-- Title -->
			<h1 class="text-5xl md:text-7xl font-black mb-4 tracking-tight">
				<span class="text-base-content">Marugoto</span>
				<br />
				<span
					class="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
				>
					Vocabulary
				</span>
			</h1>

			<!-- Subtitle -->
			<p class="text-lg md:text-xl text-base-content/60 max-w-xl mx-auto mb-8">
				Học từ vựng tiếng Nhật theo giáo trình Marugoto một cách hiệu quả
			</p>

			<!-- Stats -->
			<div class="flex justify-center gap-8 mb-10">
				<div class="text-center">
					<div class="text-3xl font-bold text-primary">9</div>
					<div class="text-sm text-base-content/50">Sách</div>
				</div>
				<div class="w-px bg-base-content/20"></div>
				<div class="text-center">
					<div class="text-3xl font-bold text-secondary">6</div>
					<div class="text-sm text-base-content/50">Cấp độ</div>
				</div>
				<div class="w-px bg-base-content/20"></div>
				<div class="text-center">
					<div class="text-3xl font-bold text-accent">5000+</div>
					<div class="text-sm text-base-content/50">Từ vựng</div>
				</div>
			</div>

			<!-- Level Quick Nav -->
			<div class="flex flex-wrap justify-center gap-2">
				{#each levelOrder as level}
					<a
						href="#{level}"
						class="px-4 py-2 rounded-full bg-base-100/50 backdrop-blur-sm border border-base-content/10 text-sm font-medium hover:bg-primary hover:text-primary-content hover:border-primary transition-all duration-300"
					>
						{level}
					</a>
				{/each}
			</div>
		</div>
	</header>

	<!-- Books Section -->
	<main class="max-w-6xl mx-auto px-4 pb-20">
		{#each levelOrder as level}
			{#if booksByLevel[level]}
				<section id={level} class="mb-16 scroll-mt-24">
					<!-- Level Header -->
					<div class="flex items-center gap-4 mb-8">
						<div
							class="px-5 py-2 rounded-xl bg-gradient-to-r {LEVEL_GRADIENTS[
								level
							]} text-white font-bold text-lg shadow-lg"
						>
							{level}
						</div>
						<div class="flex-1 h-px bg-gradient-to-r from-base-content/20 to-transparent"></div>
					</div>

					<!-- Book Cards -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						{#each booksByLevel[level] as book, i}
							<a
								href="/book/{book.id}"
								in:fly={{ y: 30, duration: 600, delay: 200 + i * 150, easing: quadOut }}
								class="group relative bg-base-100 rounded-2xl overflow-hidden border border-base-content/5 hover:border-primary/50 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10"
							>
								<!-- Gradient overlay on hover -->
								<div
									class="absolute inset-0 bg-gradient-to-br {LEVEL_GRADIENTS[
										level
									]} opacity-0 group-hover:opacity-5 transition-opacity duration-500"
								></div>

								<div class="relative p-6">
									<!-- Top Row: Type & Icon -->
									<div class="flex items-center justify-between mb-4">
										<span
											class="px-3 py-1 rounded-full bg-base-200 text-xs font-medium {TYPE_CONFIG[
												book.type
											].color}"
										>
											{TYPE_CONFIG[book.type].icon}
											{TYPE_CONFIG[book.type].label}
										</span>
										<div
											class="w-10 h-10 rounded-xl bg-gradient-to-br {LEVEL_GRADIENTS[
												level
											]} flex items-center justify-center text-white text-lg shadow-md group-hover:scale-110 transition-transform duration-300"
										>
											{level.charAt(0)}
										</div>
									</div>

									<!-- Title -->
									<h2 class="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
										{book.title}
									</h2>

									<!-- Description -->
									<p class="text-sm text-base-content/60 mb-6 line-clamp-2">
										{book.description}
									</p>

									<!-- Bottom: Action -->
									<div class="flex items-center justify-between">
										<div class="flex gap-1">
											{#each Array(3) as _, i}
												<div
													class="w-2 h-2 rounded-full bg-gradient-to-r {LEVEL_GRADIENTS[level]}"
													style="opacity: {1 - i * 0.3}"
												></div>
											{/each}
										</div>
										<span
											class="flex items-center gap-2 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-300"
										>
											Bắt đầu học
											<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
												<path
													stroke-linecap="round"
													stroke-linejoin="round"
													stroke-width="2"
													d="M17 8l4 4m0 0l-4 4m4-4H3"
												/>
											</svg>
										</span>
									</div>
								</div>

								<!-- Bottom accent line -->
								<div
									class="h-1 bg-gradient-to-r {LEVEL_GRADIENTS[
										level
									]} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
								></div>
							</a>
						{/each}
					</div>
				</section>
			{/if}
		{/each}
	</main>

	<!-- Footer -->
	<footer class="border-t border-base-content/5 py-12 px-4">
		<div class="max-w-4xl mx-auto text-center">
			<div class="text-2xl mb-4">📚</div>
			<p class="font-bold text-lg mb-2">Marugoto Vocabulary</p>
			<p class="text-sm text-base-content/50 mb-4">
				Dữ liệu từ vựng được đóng góp bởi cộng đồng học tiếng Nhật
			</p>
			<p class="text-xs text-base-content/30">Made with ❤️ for Japanese learners</p>
		</div>
	</footer>
</div>
