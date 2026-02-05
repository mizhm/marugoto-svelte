import { error } from '@sveltejs/kit';
import { BOOKS } from '$lib/constants';
import type { PageLoad } from './$types';
import type { VocabularyEntry } from '$lib/types';

export const load: PageLoad = async ({ params, fetch }) => {
	const book = BOOKS.find((b) => b.id === params.id);

	if (!book) {
		throw error(404, {
			message: 'Không tìm thấy sách'
		});
	}

	// Load vocabulary data
	const response = await fetch(`/data/${book.sourceFile}`);
	if (!response.ok) {
		throw error(500, {
			message: 'Không thể tải dữ liệu từ vựng'
		});
	}

	const vocabulary: VocabularyEntry[] = await response.json();

	// Group by lesson
	const lessons = vocabulary.reduce(
		(acc, entry) => {
			if (!acc[entry.lesson]) {
				acc[entry.lesson] = [];
			}
			acc[entry.lesson].push(entry);
			return acc;
		},
		{} as Record<number, VocabularyEntry[]>
	);

	const lessonNumbers = Object.keys(lessons)
		.map(Number)
		.sort((a, b) => a - b);

	return {
		book,
		vocabulary,
		lessons,
		lessonNumbers,
		totalWords: vocabulary.length
	};
};
