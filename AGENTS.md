# Marugoto Vocabulary Flashcard Learning Website - System Prompt

## Project Overview
You are building a Japanese vocabulary learning website called "Marugoto Vocabulary" using Svelte, Tailwind CSS, and DaisyUI. The application should focus on providing an engaging and effective flashcard-based learning experience for students studying Japanese vocabulary.

## Technology Stack
- **Framework**: Svelte 5+ (using the latest best practices)
- **Styling**: Tailwind CSS with DaisyUI components
- **Architecture**: Component-based design with proper state management
- **Build Tool**: Vite
- **Language**: TypeScript for type safety

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
- Use Svelte 5's reactive declarations and runes appropriately
- Implement proper state management using Svelte stores
- Create reusable components with slots and exports
- Use TypeScript interfaces for all data structures
- Implement proper error handling and loading states
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

## File Structure Convention
```
src/
├── components/     # Reusable UI components
├── lib/           # Utilities, stores, constants
├── routes/        # Page components
├── types/         # TypeScript type definitions
├── assets/        # Images, fonts, icons
└── app.html       # Entry point
```

## Implementation Notes
- Prioritize mobile experience in all design decisions
- Implement progressive enhancement for features
- Consider internationalization if expanding beyond Japanese
- Plan for extensibility to add new features in the future
- Maintain clean, well-documented code
