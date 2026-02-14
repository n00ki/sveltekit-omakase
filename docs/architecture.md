# Architecture

## Stack

| Layer        | Tools                                               |
| ------------ | --------------------------------------------------- |
| **Backend**  | SvelteKit, TypeScript, Better-Auth, Drizzle ORM     |
| **Frontend** | Svelte 5, TypeScript, TailwindCSS v4, shadcn-svelte |
| **Database** | Turso/LibSQL                                        |
| **Forms**    | Remote Functions, Zod                               |
| **Email**    | Resend, SailKit                                     |
| **Storage**  | Cloudflare R2                                       |

---

## Directory Structure

```
src/
├── lib/
│   ├── assets/                # Static assets (logo, images)
│   ├── components/            # Svelte components
│   │   └── ui/                # shadcn-svelte primitives
│   ├── constants/             # Domain constants and enums
│   ├── db/
│   │   ├── models/            # Drizzle schemas (User, Session, etc.)
│   │   ├── queries/           # Pure data queries
│   │   └── migrations/        # SQL migrations
│   ├── hooks/                 # Svelte hooks
│   ├── mail/                  # Email (Resend + SailKit templates)
│   ├── messages/              # User-facing messages (i18n)
│   ├── remote/                # Remote functions (*.remote.ts)
│   ├── server/                # Server-only code
│   │   ├── auth.ts            # Better-Auth config + helpers
│   │   ├── database.ts        # Drizzle connection (default export)
│   │   ├── flash.ts           # Flash message helpers
│   │   ├── rate-limit.ts      # Rate limit helper
│   │   └── storage.ts         # R2/S3 client
│   ├── state/                 # Global state (*.svelte.ts)
│   ├── utils/                 # Shared utilities
│   └── validations/           # Zod schemas
├── routes/
│   ├── (auth)/                # Auth flows (login, register, password)
│   ├── (app)/                 # Protected routes (dashboard, settings)
│   └── api/                   # API endpoints
└── styles/
    └── app.css                # Global styles + Tailwind config
```

### Path Aliases

```typescript
$components   → src/lib/components
$models       → src/lib/db/models
$queries      → src/lib/db/queries
$remote       → src/lib/remote
```

---

## Rules of the road

- Use Svelte 5 runes (`$props`, `$state`, `$derived`, `$effect`).
- Use Remote Functions (`form`, `query`, `command`) instead of actions.
- Protected routes and remote functions must call `requireAuth()`; auth pages use `requireGuest()`.
- Forms can call `await checkRateLimit(issue.field)` and use `.preflight(schema)` and `useFormValidation` hook for client-side validation.
- Models live in `$lib/db/models`; db connection is the default export in `$lib/server/database.ts`.
- Always use explicit TypeScript types.

---

## State management

| Scope   | Pattern               | Location                 |
| ------- | --------------------- | ------------------------ |
| Local   | `$state` in component | Component file           |
| Complex | Class with `$state`   | Same file or co-located  |
| Global  | Class in `.svelte.ts` | `$lib/state/*.svelte.ts` |

```typescript
// $lib/state/upload-file.svelte.ts
export class FileUploader {
  status = $state<UploadStatus>('ready');
  progress = $state(0);

  get isUploading() {
    return this.status === 'uploading';
  }

  async upload(file: File) {
    /* ... */
  }
}
```

---

## Remote Functions

### form() - Form submissions with validation

```typescript
// $lib/remote/auth.remote.ts
import { form } from '$app/server';

import { error, invalid } from '@sveltejs/kit';

import { requireGuest } from '$lib/server/auth';
import { flashAndRedirect } from '$lib/server/flash';
import { checkRateLimit } from '$lib/server/rate-limit';
import { loginSchema } from '$lib/validations/auth';
import * as m from '$lib/messages';

export const login = form(loginSchema, async ({ email, _password }, issue) => {
  requireGuest();
  await checkRateLimit(issue.email);

  try {
    await auth.api.signInEmail({ body: { email, password: _password } });
  } catch (err) {
    if (err.body?.code === 'INVALID_EMAIL_OR_PASSWORD') {
      invalid(issue.email(m.auth.login.error));
    }
    error(500, m.general.error);
  }

  flashAndRedirect('/dashboard', 'success', m.auth.login.success);
});
```

### query() - Read operations

```typescript
export const hasCredentialAccount = query(async () => {
  const { user } = requireAuth();
  // ... return data
});
```

### command() - Mutations without redirects

Use `command` for actions that don't require a redirect (e.g., likes, follows, toggles).
**Do NOT use `redirect()` inside commands** - SvelteKit cannot propagate redirects through command calls.

```typescript
export const toggleLike = command(async ({ postId }: { postId: string }) => {
  requireAuth();
  // ... perform action
  return { liked: true };
});
```

**For destructive actions that need to redirect** (like deleting an account), use `form()` instead:

```typescript
export const deleteUser = form(deleteUserSchema, async () => {
  requireAuth();
  // ... delete user
  flashAndRedirect('/', 'success', m.settings.userProfile.delete.success);
});
```

### Client usage

```svelte
<script lang="ts">
  import { login } from '$remote/auth.remote';

  import { useFormValidation } from '$lib/hooks/use-form-validation.svelte';
  import { loginSchema } from '$lib/validations/auth';
</script>

<form {...login.preflight(loginSchema)} {...useFormValidation(login)}>
  <input {...login.fields.email.as('email')} />
  {#each login.fields.email.issues() ?? [] as issue}
    <span class="error">{issue.message}</span>
  {/each}

  <button type="submit" disabled={!!login.pending}>
    {#if login.pending}Loading...{/if}
    Log in
  </button>
</form>
```

---

## Validation

### Shared schemas

Define reusable schemas in `$lib/validations/shared.ts`:

```typescript
export const emailSchema = z
  .email({ error: 'Invalid email address' })
  .trim()
  .max(64)
  .refine((v) => !v.includes('test'), { error: 'Test emails not allowed' })
  .refine((v) => !v.includes('+'), { error: 'Email tagging not allowed' });

export const passwordSchema = z
  .string()
  .trim()
  .min(8)
  .max(32)
  .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, { error: 'Must contain letter and number' });
```

### Password field naming

Prefix password fields with `_` to prevent client serialization:

```typescript
export const loginSchema = z.object({
  email: emailSchema,
  _password: z.string().trim() // Won't be sent back to client
});
```

---

## Commands

```bash
bun run dev          # Dev server
bun run build        # Production build
bun run fix          # Format & lint fix

bun run db:push      # Push schema
bun run db:studio    # Drizzle Studio

bun run test:unit    # Unit tests
bun run test:e2e     # E2E tests
```

---

## Environment

See `.env.example` for required variables.
