# Storing your OpenAI API key (safe practices)

This project expects an OpenAI API key in the environment variable `OPENAI_API_KEY` for the server-side API route at `app/api/zero-g/route.ts`.

DO NOT paste your API key into source files or commit it to the repository. Instead, use one of the methods below.

1) Local development (recommended)

- Copy the example file to create a local env file:

  - On Windows (PowerShell):

    cp .env.local.example .env.local

  - Open `.env.local` and set:

    OPENAI_API_KEY=sk-your-secret-key-here

  Next.js automatically loads `.env.local` in development. `.env*` is already in `.gitignore`.

2) PowerShell session (temporary)

- To set the variable for the current PowerShell session only:

  $env:OPENAI_API_KEY = 'sk-your-secret-key-here'

  This lasts until you close the shell. Useful for quick testing without writing a file.

3) CI / hosting (Vercel)

- In Vercel dashboard, go to your Project → Settings → Environment Variables. Add `OPENAI_API_KEY` with the value and set it for the appropriate environments (Production, Preview, Development).

4) Verification

- From the server-side (Node) you can log or check that `process.env.OPENAI_API_KEY` is set. The project already falls back to a canned reply if the variable is missing.

5) Rotation & security

- Rotate keys regularly via the OpenAI dashboard. Revoke any leaked keys immediately.
- Do not share keys in chat or public issue trackers.
