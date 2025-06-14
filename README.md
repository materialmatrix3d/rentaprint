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
4. Start the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`.

## License

This project is licensed under the [MIT License](LICENSE).
