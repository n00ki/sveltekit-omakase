# SvelteKit Omakase - AI Agent Guidelines

Guidelines for AI agents working with sveltekit-omakase.

**Quick links:** [`docs/architecture.md`](/docs/architecture.md)

---

**MCP Tools:**

> use Svelte MCP for SvelteKit/Svelte 5 docs.
> use Context7 MCP for all other tools and frameworks.

---

## Use these docs

- Architecture and commands: `docs/architecture.md`

---

## Critical rules

- Use Svelte 5 runes syntax (`$props`, `$state`, `$derived`, `$effect`).
- Always use explicit TypeScript types. Avoid JSDoc unless essential shared utility.
- Use Remote Functions (`form`, `query`, `command`) instead of actions. Use `await` patterns for queries.
- **Never use `redirect()` inside `command` functions** - use `form` instead for actions that need to redirect (SvelteKit limitation: commands cannot handle redirects properly).
- Protected routes and remote functions must call `requireAuth()`. Auth pages use `requireGuest()`.
- Forms can call `await checkRateLimit(issue.field)` and use `.preflight(schema)` and `useFormValidation` hook for client-side validation
- Use Drizzle ORM only. Models live in `$models`, queries live in `$queries`. db connection is the default export in `$lib/server/database.ts`.
- Use class-based state machines in `$lib/state/*.svelte.ts` only for cross-route or app-wide state. Keep state local to the component otherwise.

---

## Implementation

- Prefer existing structure, conventions, helper APIs, and implemented decisions before introducing new patterns.
- Use modern, commonly recommended approaches when they fit this codebase. Do not replace working local patterns just for novelty. If a new pattern seems essential, suggest it first and explain the tradeoff.
- Keep code, comments, and docs concise. Avoid non-essential abstractions, boilerplate, explanatory notes, and fluff.
- Review suggestions and changes through the project's philosophy. Explain what they affect, why they are better or worse, and whether they still fit existing decisions.
- Update existing docs only when behavior, architecture, commands, or project conventions change. Do not add docs for routine implementation details.

---

## Naming conventions

### Files

- Use `kebab-case` for all files (enforced by ESLint).
- Svelte reactive files: `*.svelte.ts` (e.g., `is-mobile.svelte.ts`).
- Remote functions: `*.remote.ts` (e.g., `auth.remote.ts`).

### Remote Functions (CRUD)

**Resources (standalone entities):**

| Operation       | Pattern            | Example                |
| --------------- | ------------------ | ---------------------- |
| Create          | `create<Resource>` | `createUser`           |
| Read (single)   | `get<Resource>`    | `getUser`              |
| Read (multiple) | `get<Resource>s`   | `getUsers`             |
| Update          | `update<Resource>` | `updateUser`           |
| Delete          | `delete<Resource>` | `deleteUser`           |
| Boolean check   | `has<Condition>`   | `hasCredentialAccount` |

**Relationships (associations):**

- `add<Resource>` - Add resource to parent
- `remove<Resource>` - Remove resource from parent
- `set<Resource>s` - Replace all associations

**Boolean Checks:**

- `has<Condition>` - Check if condition is true for current users

### Domain Actions

For user-facing interactions that don't fit CRUD patterns (likes, follows, subscriptions), use domain-specific verbs:

- `<action>` - Perform the action
- `un<action>` - Reverse the action

---

## Form validation

Use `useFormValidation` hook for client-side validation:

```svelte
<form {...login.preflight(loginSchema)} {...useFormValidation(login)}>
```

This validates on focusout, then re-validates on input while errors exist.

---

## Testing guidance

- Name tests by user value, not implementation.
- Run `pnpm fix` and relevant tests when asked.

---

**Do NOT create documentation files unless explicitly requested.**
