# Marugoto Vocabulary Flashcard Learning Website - System Prompt

## Project Overview

You are building a Japanese vocabulary learning website called "Marugoto Vocabulary" using Svelte, Tailwind CSS, and DaisyUI. The application should focus on providing an engaging and effective flashcard-based learning experience for students studying Japanese vocabulary.

## Technology Stack

- **Framework**: Svelte 5.48+ with SvelteKit 2.50+ (using runes and latest best practices)
- **Styling**: Tailwind CSS 4 with `@tailwindcss/vite` plugin + DaisyUI 5 + `@tailwindcss/typography`
- **Architecture**: Component-based design with Svelte 5 runes (`$state`, `$derived`, `$effect`)
- **Build Tool**: Vite 7 with `@sveltejs/vite-plugin-svelte`
- **Runtime/Deploy**: Bun adapter (`svelte-adapter-bun`) for production builds
- **Language**: TypeScript 5.9+ for type safety
- **Linting**: ESLint 9 with `typescript-eslint` and `eslint-plugin-svelte`
- **Formatting**: Prettier with `prettier-plugin-svelte`

## Development Commands

```bash
npm run dev        # Start dev server with Vite
npm run build      # Build for production
npm run preview    # Preview production build
npm run check      # Type-check with svelte-check
npm run lint       # Run Prettier + ESLint checks
npm run format     # Format code with Prettier
```

## Design Principles

- **Mobile-first approach**: Design for mobile devices first, then enhance for larger screens
- **Fully responsive**: Ensure seamless experience across all device sizes
- **Accessibility**: Follow WCAG guidelines for inclusive design
- **Performance**: Optimize for fast loading and smooth interactions
- **Best practices**: Follow Svelte and TypeScript best practices

## Core Features

1. **Flashcard System**:
   - Interactive flashcards with front/back flip animation
   - Spaced repetition algorithm for optimal learning
   - Progress tracking for each vocabulary item
   - Audio pronunciation (where possible)

2. **Vocabulary Categories**:
   - Organized by difficulty level (N5-N1)
   - Thematic categories (food, travel, business, etc.)
   - Custom user-created decks

3. **Learning Modes**:
   - Study mode: Browse cards at your own pace
   - Review mode: Practice with spaced repetition
   - Quiz mode: Multiple choice or typing exercises
   - Game modes: Gamified learning experiences

4. **Progress Tracking**:
   - Individual card mastery levels
   - Session statistics
   - Learning streaks
   - Achievement badges

5. **User Experience**:
   - Clean, intuitive interface
   - Smooth animations and transitions
   - Dark/light mode options
   - Offline support where possible

## Technical Requirements

- Use Svelte 5 runes for reactivity:
  - `$state()` for reactive state
  - `$derived()` for computed values
  - `$effect()` for side effects
  - `$props()` for component props
  - `$bindable()` for two-way binding props
- Use SvelteKit features:
  - `+page.svelte` / `+layout.svelte` for routing
  - `+page.ts` / `+page.server.ts` for data loading
  - `$app/stores` for page/navigating stores
- Create reusable components with `{@render}` and snippets
- Use TypeScript interfaces for all data structures
- Implement proper error handling with `+error.svelte` pages
- Follow accessibility best practices (ARIA attributes, keyboard navigation)
- Optimize images and assets for web delivery

## Responsive Design Specifications

- Mobile: 320px - 768px (primary focus)
- Tablet: 768px - 1024px
- Desktop: 1024px+ (enhanced experience)

## UI/UX Guidelines

- Use DaisyUI themes for consistent styling
- Implement consistent spacing using Tailwind utilities
- Use appropriate animations for card flipping and transitions
- Ensure touch targets are appropriately sized for mobile
- Maintain readable typography across all screen sizes
- Use appropriate contrast ratios for text and backgrounds

## Data Structure

- Vocabulary items should include: kanji, hiragana, meaning, example sentence, category, difficulty
- Implement proper data validation and sanitization
- Consider offline storage solutions (IndexedDB, localStorage)

## Performance Considerations

- Lazy load images and audio files
- Implement virtual scrolling for large datasets
- Use efficient reactivity patterns in Svelte
- Minimize bundle size through proper code splitting

## Testing Approach

- Unit test components where appropriate
- Test responsive behavior across screen sizes
- Validate accessibility compliance

## File Structure Convention (SvelteKit)

```
src/
├── lib/
│   ├── components/    # Reusable UI components
│   ├── stores/        # Svelte stores (if needed alongside runes)
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript type definitions
│   └── index.ts       # $lib exports
├── routes/
│   ├── +layout.svelte # Root layout
│   ├── +page.svelte   # Home page
│   └── [feature]/     # Feature routes with +page.svelte
├── app.html           # HTML template
├── app.css            # Global Tailwind CSS (with @import)
└── app.d.ts           # App-level type definitions
static/
└── [assets]           # Static assets (images, fonts, icons)
```

## Implementation Notes

- Prioritize mobile experience in all design decisions
- Implement progressive enhancement for features
- Consider internationalization if expanding beyond Japanese
- Plan for extensibility to add new features in the future
- Maintain clean, well-documented code

## Svelte 5 Code Patterns

### Component with Props and State

```svelte
<script lang="ts">
	import type { VocabCard } from '$lib/types';

	interface Props {
		card: VocabCard;
		onFlip?: () => void;
	}

	let { card, onFlip }: Props = $props();

	let isFlipped = $state(false);
	let flipCount = $derived(isFlipped ? 1 : 0);

	function handleFlip() {
		isFlipped = !isFlipped;
		onFlip?.();
	}
</script>
```

### Snippet Pattern (replaces slots)

```svelte
<!-- Child (Card.svelte) -->
<script lang="ts">
	import type { Snippet } from 'svelte';
	let { cardContent }: { cardContent: Snippet<[string]> } = $props();
</script>

<!-- Parent -->
{#snippet cardContent(text: string)}
	<p class="text-lg">{text}</p>
{/snippet}

<Card {cardContent} />

{@render cardContent('Hello')}
```

### Effect Pattern

```svelte
<script lang="ts">
	let count = $state(0);

	$effect(() => {
		// Runs on mount and whenever count changes
		console.log(`Count is now: ${count}`);

		return () => {
			// Cleanup (optional)
		};
	});
</script>
```

## DaisyUI 5 + Tailwind 4 Patterns

### Theme Colors

```html
<!-- Use semantic colors -->
<button class="btn btn-primary">Primary</button>
<div class="bg-base-200 text-base-content">Card</div>
<span class="text-success">Success message</span>
```

### Common Components

```html
<!-- Card -->
<div class="card bg-base-100 shadow-xl">
	<div class="card-body">
		<h2 class="card-title">Title</h2>
		<p>Content</p>
		<div class="card-actions justify-end">
			<button class="btn btn-primary">Action</button>
		</div>
	</div>
</div>

<!-- Modal -->
<dialog id="my_modal" class="modal">
	<div class="modal-box">
		<h3 class="text-lg font-bold">Title</h3>
		<p class="py-4">Content</p>
	</div>
	<form method="dialog" class="modal-backdrop">
		<button>close</button>
	</form>
</dialog>
```

### Responsive with Tailwind 4

```html
<!-- Mobile-first approach -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
	<!-- Cards -->
</div>
```
