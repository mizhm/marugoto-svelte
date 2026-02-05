import type { BookLevel, BookType } from './types';

// Level gradient backgrounds
export const LEVEL_GRADIENTS: Record<BookLevel, string> = {
	A1: 'from-emerald-500 to-teal-600',
	'A2-1': 'from-blue-500 to-cyan-600',
	'A2-2': 'from-indigo-500 to-blue-600',
	'A2/B1': 'from-violet-500 to-purple-600',
	'B1-1': 'from-rose-500 to-pink-600',
	'B1-2': 'from-orange-500 to-red-600'
};

// Level text colors
export const LEVEL_COLORS: Record<BookLevel, string> = {
	A1: 'text-emerald-500',
	'A2-1': 'text-blue-500',
	'A2-2': 'text-indigo-500',
	'A2/B1': 'text-violet-500',
	'B1-1': 'text-rose-500',
	'B1-2': 'text-orange-500'
};

// Level border accents
export const LEVEL_ACCENTS: Record<BookLevel, string> = {
	A1: 'border-l-emerald-500',
	'A2-1': 'border-l-blue-500',
	'A2-2': 'border-l-indigo-500',
	'A2/B1': 'border-l-violet-500',
	'B1-1': 'border-l-rose-500',
	'B1-2': 'border-l-orange-500'
};

// Book Type configuration
export const TYPE_CONFIG: Record<BookType, { icon: string; label: string; color: string }> = {
	katsudou: { icon: '🗣️', label: 'Hoạt động', color: 'text-emerald-400' },
	rikai: { icon: '📖', label: 'Hiểu biết', color: 'text-sky-400' },
	combined: { icon: '📚', label: 'Tổng hợp', color: 'text-violet-400' }
};
