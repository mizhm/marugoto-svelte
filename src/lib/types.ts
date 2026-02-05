/** JLPT-aligned levels for Marugoto books */
export type BookLevel = 'A1' | 'A2-1' | 'A2-2' | 'A2/B1' | 'B1-1' | 'B1-2';

/** Marugoto book types */
export type BookType = 'katsudou' | 'rikai' | 'combined';

export interface BookDefinition {
	/** Unique identifier for routing and keys (e.g., "a1-katsudou") */
	id: string;
	title: string;
	description: string;
	/** JSON filename in /src/lib/data/ */
	sourceFile: string;
	/** JLPT-aligned level */
	level: BookLevel;
	/** Book type: katsudou (activity), rikai (comprehension), or combined */
	type: BookType;
}

export interface VocabularyEntry {
	hiragana: string;
	kanji: string | null;
	meaning: string;
	lesson: number;
}

/** Lesson info derived from vocabulary data */
export interface LessonInfo {
	number: number;
	entryCount: number;
}
