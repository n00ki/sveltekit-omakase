# Architecture

## Stack

| Layer        | Tools                                               |
| ------------ | --------------------------------------------------- |
| **Backend**  | SvelteKit, TypeScript, Better Auth, Drizzle ORM     |
| **Frontend** | Svelte 5, TypeScript, TailwindCSS v4, shadcn-svelte |
| **Database** | Turso/LibSQL                                        |
| **Forms**    | Remote Functions, Valibot                           |
| **Email**    | Resend, Better Svelte Email                         |
| **Storage**  | Cloudflare R2                                       |

---

## Directory Structure

```
src/
├── lib/
│   ├── assets/                # Static assets (logo, images)
│   ├── components/            # Svelte components
│   │   └── ui/                # shadcn-svelte primitives
│   ├── config/                # App config, messages, and adjustable defaults
│   ├── db/
│   │   ├── models/            # Drizzle schemas (User, Session, etc.)
│   │   ├── queries/           # Pure data queries
│   │   └── migrations/        # SQL migrations
│   ├── hooks/                 # Svelte hooks
│   ├── mail/                  # Email (Resend + Better Svelte Email templates)
│   ├── remote/                # Remote functions (*.remote.ts)
│   ├── server/                # Server-only code
│   │   ├── auth.ts            # Better Auth config + helpers
│   │   ├── database.ts        # Drizzle connection (default export)
│   │   ├── flash.ts           # Flash message helpers
│   │   ├── rate-limit.ts      # Rate limit helper
│   │   ├── security.ts        # Security and access guards
│   │   └── storage.ts         # R2/S3 upload signing
│   ├── state/                 # Global state (*.svelte.ts)
│   ├── upload/                # Upload policies and FileUploader
│   ├── utils/                 # Shared utilities
│   └── validations/           # Valibot schemas
├── routes/
│   ├── (auth)/                # Auth flows (login, register, password, challenge)
│   ├── (app)/                 # Protected routes (dashboard, settings)
│   └── api/                   # API endpoints
└── styles/
    └── app.css                # Global styles + Tailwind config
```

### Path Aliases

```typescript
$config        → src/lib/config/config.ts
$config/server → src/lib/config/config.server.ts
$messages      → src/lib/config/messages
$components    → src/lib/components
$models        → src/lib/db/models
$queries       → src/lib/db/queries
$remote        → src/lib/remote
```

### Config

- Config is grouped by context folders in `src/lib/config`: `app`, `auth`, `security`, `upload`, etc.
- `$config` exports `{ config }` with client-safe config values and shared config types.
- `$config/server` exports server-only `{ config }`, including the public config plus server-only values.
- `config.schema.ts` defines the public and full config shapes. Config files use plain typed objects.
- `$messages` holds user-facing messages.
- Server-only config is composed through `src/lib/config/config.server.ts`. SvelteKit blocks `.server` modules from client imports.
- Keep routes, local helper constants, styling internals, and one-off implementation details near their usage.

---

## Rules of the road

- Use Svelte 5 runes (`$props`, `$state`, `$derived`, `$effect`).
- Use Remote Functions (`form`, `query`, `command`) instead of actions.
- Protected route groups use `requireAuth()` in their server layout. protected remote functions and standalone protected routes must call `requireAuth()`. Auth pages use `requireGuest()`.
- Security and access guards live in `src/lib/server/security.ts`. Two-factor protected sessions use Better Auth verification plus `Session.twoFactorCompletedAt`.
- Sensitive routes and remote forms use `requireChallenge('/return-path')` before the operation. It prompts for a 2FA or recovery code when enabled, password for password-backed accounts, or a fresh sign-in for OAuth-only accounts, and `/auth/challenge` returns users there after confirmation.
- Forms can call `await checkRateLimit(issue.field)` and use `useRemoteForm`, `.preflight(schema)`, and `useFormValidation` for client-side usage.
- Models live in `$lib/db/models`; db connection is the default export in `$lib/server/database.ts`.
- Use explicit TypeScript types at meaningful boundaries, such as shared APIs, DB/query contracts, and non-obvious helpers. Rely on inference for local values, route `load` functions, and route `$props()` data/children props.
- Keep TypeScript readable: prefer plain object types and named unions over generics, mapped types, conditional types, and assertions unless they clearly improve the caller API.

---

## State management

| Scope   | Pattern               | Location                 |
| ------- | --------------------- | ------------------------ |
| Local   | `$state` in component | Component file           |
| Complex | Class with `$state`   | Same file or co-located  |
| Global  | Class in `.svelte.ts` | `$lib/state/*.svelte.ts` |

```typescript
// $lib/state/sidebar.svelte.ts
export class SidebarState {
  open = $state(false);

  toggle(): void {
    this.open = !this.open;
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

import * as m from '$messages';

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
export const hasActiveSubscription = query(async () => {
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
  import { useRemoteForm } from '$lib/hooks/use-remote-form';
  import { loginSchema } from '$lib/validations/auth';

  const formKey = $props.id();
  const loginForm = useRemoteForm(login, formKey).preflight(loginSchema);
</script>

<form {...loginForm} {...useFormValidation(loginForm)}>
  <input {...loginForm.fields.email.as('email')} />
  {#each loginForm.fields.email.issues() ?? [] as issue}
    <span class="error">{issue.message}</span>
  {/each}

  <button type="submit" disabled={!!loginForm.pending}>
    {#if loginForm.pending}Loading...{/if}
    Log in
  </button>
</form>
```

---

## Uploads

Uploads use named policies from `$lib/upload` and direct R2 uploads through the file-based upload endpoint.

```typescript
import { FileUploader, uploads } from '$lib/upload';

const imageUploader: FileUploader = new FileUploader(uploads.userImage);
const upload = await imageUploader.upload(file);
```

---

## Validation

### Shared schemas

Define reusable schemas in `$lib/validations/shared.ts`:

```typescript
import * as v from 'valibot';

export const trimmedString = v.pipe(v.string(), v.trim());

export const emailSchema = v.pipe(
  trimmedString,
  v.email('Invalid email address'),
  v.maxLength(64, 'Email must be less than 64 characters'),
  v.check((value) => !value.includes('test'), 'Test emails are not allowed'),
  v.check((value) => !value.includes('+'), 'Email address tagging is not allowed')
);

export const passwordSchema = v.pipe(
  trimmedString,
  v.minLength(8, 'Password must be at least 8 characters'),
  v.maxLength(32, 'Password must be less than 32 characters'),
  v.regex(/^(?=.*[A-Za-z])(?=.*\d).+$/, 'Must contain letter and number')
);
```

### Password field naming

Prefix password fields with `_` to prevent client serialization:

```typescript
export const loginSchema = v.object({
  email: emailSchema,
  _password: trimmedString // Won't be sent back to client
});
```

---

## Commands

```bash
pnpm dev          # Dev server
pnpm build        # Production build
pnpm fix          # Format & lint fix

pnpm db:push      # Push schema
pnpm db:studio    # Drizzle Studio

pnpm test:unit    # Unit tests
pnpm test:e2e     # E2E tests
```

---

## Environment

See `.env.example` for required variables.
