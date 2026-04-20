# Code Review Pattern

This document defines the mandatory criteria for code reviews in the Workout Tracker project. Every review request must evaluate the changes against these four pillars:

## 1. Code Quality
- **JSDoc**: Every new function, component, or hook must have a short JSDoc description.
- **Naming**: Variables and functions should be descriptive enough that their purpose is clear without comments.
- **Typing**: Strict TypeScript usage (no `any`, proper interface definitions).
- **Standards**: Adherence to the project's styling and architectural boundaries (e.g., cross-feature imports via `index.ts`).

## 2. Duplication & AI Slop
- **Redundancy**: Identify code that repeats logic already available in the component or via shared utilities.
- **AI Slop**: Remove verbose explanations of obvious code, "safety" code that isn't actually needed, and generic boilerplate that doesn't fit the project's premium aesthetic.
- **Refactoring**: If a pattern is repeated 2 or more times, consider extracting a helper or shared variant.

## 3. Complexity
- **State Management**: Avoid unnecessary state or complex `useEffect` chains. Prefer derived state where possible.
- **Component Size**: Ensure components remain focused. Extract sub-components if a file exceeds 200-300 lines or addresses multiple concerns.
- **Logic Flow**: Keep logic simple and readable. Avoid deeply nested ternaries or complex conditional rendering where a simple early return would suffice.

## 4. Logical Issues
- **Edge Cases**: Check for potential null/undefined errors, empty state handling, and loading states.
- **Performance**: Monitor for unnecessary re-renders or heavy computations during the render cycle.
- **Bugs**: Verify that the implemented logic actually solves the problem without introducing side effects or breaking existing functionality.
