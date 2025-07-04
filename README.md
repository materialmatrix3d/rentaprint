# RentAPrint

[![License: BSL 1.1](https://img.shields.io/badge/License-BSL--1.1-blue.svg)](LICENSE)
[![Build Status](https://github.com/rentaprint/rentaprint/actions/workflows/ci.yml/badge.svg)](https://github.com/rentaprint/rentaprint/actions/workflows/ci.yml)

RentAPrint is an open-source platform for listing and booking 3D printers. It
lets owners share their machines while makers reserve print time. The official
service is available at [rentaprint.net](https://rentaprint.net).

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file and add your own keys:
   ```bash
   cp .env.example .env.local
   ```
   Fill `.env.local` with your Supabase and Clerk credentials. Both services offer free tiers and no production keys are shared.
3. Create **or update** the database tables by running the SQL in `types/schema.sql`
   against your Supabase project. Whenever you pull new code, re-run this file to
   apply any schema changes (for example new columns like `estimated_runtime_hours`).
4. Insert example patch notes:
   ```bash
   npx ts-node scripts/sync-patch-notes.ts
   ```
5. Start the dev server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`.

## Monetization Policy

Personal self-hosting is allowed. **Commercial use**&mdash;including resale or
hosting RentAPrint for clients&mdash;is not permitted without a separate
license. Commercial usage becomes allowed when the project switches to the MIT
license two years after each release.

## Contributing

We welcome pull requests and issue reports! See
[CONTRIBUTING.md](.github/CONTRIBUTING.md) for the full guidelines.
Codex users are encouraged to submit prompt ideas alongside code patches and
documentation improvements.

## Deployment Workflow

Merging into the `main` branch automatically deploys the latest code to
[rentaprint.net](https://rentaprint.net) through GitHub Actions. Review and test
changes thoroughly before merging to avoid impacting the live site.

## License

This project is licensed under the Business Source License 1.1 (BSL). You may
use and host this code for non-commercial use only. After two years, each
release becomes available under the MIT license. See
[LICENSE](LICENSE) for full details.
