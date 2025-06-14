# rentaprint

3D printer sharing platform

## Setup

1. Install dependencies with `npm install` (Node.js 18 or higher is recommended).
2. Copy `.env.example` to `.env.local` and provide your Supabase and Clerk keys:
   ```bash
 cp .env.example .env.local
  ```
  Edit `.env.local` and replace the placeholder values with the credentials from
  your Supabase project and Clerk account.
3. Create the database tables. Run the SQL in `types/schema.sql` against your
   Supabase project using the SQL editor or `psql`:
   ```bash
   psql "$SUPABASE_URL" < types/schema.sql
   ```
   This defines the `bookings` and `patch_notes` tables used by the app.
4. Insert some example patch notes so the page isn't empty:
   ```sql
   insert into patch_notes (title, description)
   values
     ('Initial release', 'First public version of RentAPrint'),
     ('Bug fixes', 'Resolved booking issues and improved printer search.');
   ```
   Run this SQL in Supabase or `psql` to seed the table. You can also run
   `npx ts-node scripts/seed-patch-notes.ts` to insert the same records from the
   command line.
5. Start the development server:
   ```bash
    npm run dev
    ```

## Running tests

Run the Jest test suite with:

```bash
npm test
```

The app will be available at `http://localhost:3000`.

## License

This project is licensed under the [MIT License](LICENSE).
