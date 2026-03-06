# SvelteKit Omakase

<div align="center">
  <img src="https://res.cloudinary.com/nshemesh/image/upload/v1745329712/Sveltekit%20Omakase/meta_new.png" alt="SvelteKit Omakase" width="600">

<a href="https://demo.somakase.dev">View Demo</a> ·
<a href="#getting-started">Quick Start</a> ·
<a href="#features">Features</a>

</div>

## Overview

#### Welcome to SvelteKit Omakase, the ultimate mise en place for your next SvelteKit project 🚀.

Inspired by the [Rails doctrine](https://rubyonrails.org/doctrine#omakase), this project embraces an **_omakase_** approach—offering an opinionated selection of tools and a structured foundation while giving you the freedom to customize and extend as needed.
Whether you're a seasoned developer or just starting out, this starter kit is carefully curated to get you up and running with SvelteKit by providing everything you need to build modern, scalable web applications with ease.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

- 🎨 **Modern, Responsive & Accessible UI**
- 🔒 **Robust Authentication**
- 🎛️ **Customizable Dashboard**
- 📁 **File Storage**
- 📧 **Transactional Email**
- 🛠️ **Developer Utilities & DX Enhancements**

## Tech Stack

- [🟠 Svelte 5](https://svelte.dev/)
- [👍 SvelteKit](https://kit.svelte.dev/)
- [💨 TailwindCSS](https://tailwindcss.com/)
- [💾 Drizzle ORM](https://orm.drizzle.team/)
- [💂 Better-Auth](https://www.better-auth.com/)
- [🎨 shadcn-svelte](https://www.shadcn-svelte.com/)
- [⛵ SailKit](https://sailkit.xyz/)
- [📬 Resend](https://resend.com/)
- [⛔ Zod](https://zod.dev/)
- [🚀 Remote Functions](https://svelte.dev/docs/kit/remote-functions)
- [🐂 Turso](https://turso.tech/)
- [📁 Cloudflare R2](https://www.cloudflare.com/r2/)
- [🪝 Git Hooks](https://github.com/toplenboren/simple-git-hooks)

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/n00ki/sveltekit-omakase.git my-app
cd my-app

# Install dependencies using your preferred package manager
bun install
# or: npm/pnpm/yarn install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize the database locally
bun db:push

# Start the development server
bun dev
```

## Project Structure

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

## Documentation

Start with `docs/architecture.md` for project structure, rules of the road, remote function patterns, and common commands.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request 💪

## License

This project is licensed under the [MIT License](LICENSE). Dependencies are subject to their own licenses.

## Acknowledgments

This starter kit relies on many open source projects. See [Tech Stack](#tech-stack) for the main technologies used.

Special thanks to these incredible contributors to the open-source community:

- [Hunter Johnston (huntabyte)](https://github.com/huntabyte)
- [Andreas Söderlund (ciscoheat)](https://github.com/ciscoheat)
- [Bereket Engida (Bekacru)](https://github.com/Bekacru)
