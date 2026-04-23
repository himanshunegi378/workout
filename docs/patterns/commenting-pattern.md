## Things to keep in mind while writing/modifying code
2. write the js doc description/comments of components, function, hook. update if modifying code

## output guide

- Suggest 3 relevant next steps at end of turn

# Comment Writing Rule

Write code so the reader can understand the **what** from naming, structure, and function boundaries.  
Write comments only when they add **why**, **warning**, **wayfinding**, or **workaround**.

## Comment only when it does one of these jobs
1. **Why** — explains the reason behind the code or business intent
2. **Warning** — highlights a gotcha, edge case, side effect, or risk
3. **Wayfinding** — helps navigation with section signposts in longer files
4. **Workaround** — explains why an unusual or temporary approach is necessary

## Do not write comments that
- repeat what the code already makes obvious
- paraphrase syntax line by line
- restate a clear variable, function, or component name
- compensate for poor naming or bad structure
- narrate routine operations

## Heuristic
Before writing a comment, ask:
- Is this already obvious from the code?
- Will removing this comment cause loss of context, safety, or navigation?
- Should this be solved by better naming, extraction, or file structure instead?

If the code can be made clearer through refactoring, prefer refactoring over commenting.

## Preferred style
- Use comments to explain intent, constraints, and non-obvious decisions
- Use short section signposts only when they improve scanning
- Keep comments concise and high signal
- Avoid comment clutter

## Comment format
- Write comments in plain natural language.
- Do **not** prefix comments with labels or metadata tags like `@why`, `@warning`, `@wayfinding`, or `@workaround`.
- The purpose of the comment should be clear from the sentence itself.
- Prefer direct comments such as:
  - `Keep the timer in the top nav so users can monitor rest periods while moving between screens.`
  - `Guard against duplicate submissions because this endpoint is not idempotent.`
  - `Temporary workaround for Safari flexbox rendering bug. Remove after upgrading the design system.`

