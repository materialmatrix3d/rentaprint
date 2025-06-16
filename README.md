# RentAPrint

RentAPrint is an open-source platform for sharing and booking 3D printers.
It allows printer owners to list their devices and makers to book time on
printers near them. The official hosted service is available at
[https://rentaprint.net](https://rentaprint.net).

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```
3. Create the database tables by running the SQL in `types/schema.sql` against
   your Supabase project.
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

Self‑hosting is allowed for personal use. **Commercial use requires a separate
license** or is permitted once the project transitions to the MIT license two
years after each release.

## Contributing

We welcome pull requests and issue reports! See
[CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines.
Codex users can help by submitting patches, documentation improvements and
new feature ideas.

## License

This project is released under the Business Source License 1.1. See
[LICENSE](LICENSE) for details.
