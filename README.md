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
- [📄 SuperForms](https://superforms.rocks/)
- [🐂 Turso](https://turso.tech/)
- [📁 Cloudflare R2](https://www.cloudflare.com/r2/)
- [🐶 Husky](https://typicode.github.io/husky/)

## Getting Started

### Installation

```bash
# Clone the repository
git clone https://github.com/n00ki/sveltekit-omakase.git my-app
cd my-app

# Install dependencies using your preferred package manager
pnpm install
# or: npm/bun/yarn install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Initialize the database locally
pnpm db:push

# Start the development server
pnpm dev
```

## Project Structure

```
src/
├── lib/
│   ├── assets/                # Static assets used in-app
│   ├── components/            # Components
│   │   └── ui/                # Primitive/UI building blocks (shadcn-svelte)
│   ├── db/                    # DB models, migrations and utils
│   │   ├── migrations/
│   │   ├── models/
│   │   └── clear.ts
│   ├── hooks/                 # Hooks
│   ├── server/                # Server-only code
│   │   ├── auth.ts            # Auth config
│   │   ├── database.ts        # DB config
│   │   └── storage.ts         # Storage config
│   ├── utils/                 # General utilities
│   │   ├── helpers/
│   │   └── mail/              # Email
│   │       ├── templates/
│   │       └── mailer.ts
│   └── validations/           # Zod schemas
├── routes/                    # Routes
│   ├── (auth)/                # Auth flows
│   ├── (app)/                 # Protected application routes
│   │   ├── dashboard/
│   │   └── settings/
│   ├── api/
│   │   └── upload/            # file upload endpoint
│   ├── +layout.svelte         # root layout
│   └── +page.svelte           # landing page
└── styles/                    # Global styles
```

## Documentation

Comprehensive documentation is in the works. In the meantime, we encourage you to dive into the codebase and explore. Should you encounter any difficulties or have questions, please don't hesitate to reach out. Your contributions towards improving documentation are also welcome!

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request 💪

## Acknowledgments

Special thanks to these incredible contributors to the open-source community:

- [Hunter Johnston (huntabyte)](https://github.com/huntabyte)
- [Andreas Söderlund (ciscoheat)](https://github.com/ciscoheat)
- [Bereket Engida (Bekacru)](https://github.com/Bekacru)
