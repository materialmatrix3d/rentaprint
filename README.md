# rentaprint

3D printer sharing platform

## Setup

1. Install dependencies with `npm install` (Node.js 18 or higher is recommended).
2. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
3. Create the database tables. Run the SQL in `types/schema.sql` against your
   Supabase project using the SQL editor or `psql`:
   ```bash
   psql "$SUPABASE_URL" < types/schema.sql
   ```
   This defines the `bookings`, `patch_notes`, and `reviews` tables used by the app.
4. Insert some example patch notes so the page isn't empty. Run the sync script
   to upload the notes from `patch_notes.json`:
   ```bash
   npx ts-node scripts/sync-patch-notes.ts
   ```
   The script reads `patch_notes.json` and inserts any notes that don't already
   exist in your Supabase database. You can modify the JSON file to add new
   entries and re-run the script at any time.
5. Start the development server:
   ```bash
    npm run dev
    ```

## Running tests

Install dependencies first to ensure Jest and other dev tools are available:

```bash
npm install
```

Then run the test suite with:

```bash
npm test
```

The app will be available at `http://localhost:3000`.

## License

This project is licensed under the [MIT License](LICENSE).
