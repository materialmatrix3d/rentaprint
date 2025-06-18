# Contributing to RentAPrint

Thank you for your interest in contributing! We welcome issues and pull
requests. Feel free to fork the repository and open issues to discuss new
features or improvements.

## Development Setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and update the values for your Supabase project.
3. Run the SQL in `types/schema.sql` to create the required tables.
4. Start the development server with `npm run dev`.
5. Run the tests with `npm test` before submitting changes.

## Coding Standards

- Use TypeScript.
- Keep formatting consistent with the existing code base.
- Include tests for new features when possible.

## Pull Requests

1. Fork the repository and create your feature branch.
2. Commit your changes with clear messages.
3. Open a pull request against `main` describing your changes.
4. Ensure all tests pass.
5. Merging to `main` deploys immediately to production, so review your changes
   carefully. See the README's **Deployment Workflow** section for details.

### Sample Codex Prompt

```
Add a dark mode toggle
```

```
Implement printer search filters
```

```
Auto-update patch notes after each PR merge
```

We encourage opening issues first if you're planning large changes.
