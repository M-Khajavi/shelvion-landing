# Shelvion Landing

Standalone Shelvion landing-page project extracted from the reusable-site-cms project. It is designed to be tested independently and later attached to `shelvion.com`.

## Routes

The public site is `/`.

Admin is opened with `#admin`, for example `https://landing-test.shelvion.com/#admin`. Hash routing is used so the admin entry works on GitHub Pages without server-side rewrites.

## Local development

```bash
npm install
npm run dev
```

Copy `.env.example` to `.env.local` and provide the Supabase settings before using the login-protected Admin route.

## Supabase administrator login

1. Create a Supabase project.
2. In Supabase Authentication, create the administrator user with the desired email/password.
3. Put the authorized email in `VITE_ADMIN_EMAILS`.
4. Put the Supabase URL and browser-safe anon/publishable key in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. In Admin → Navigation → Admin access, turn on `Require Supabase administrator login`.

The email allowlist is a deployment variable, not a value editable from the browser. That prevents an administrator from granting a new email address merely by editing local site configuration.

Important: the current CMS configuration is still stored in `localStorage`. Supabase authentication protects entry to the Admin interface, but it does not yet make website content a shared database-backed CMS. A later version should move the saved configuration into a Supabase table with Row Level Security.

## GitHub Pages / custom domain

For the temporary GitHub Pages repository URL, the Vite config automatically uses `/<repo-name>/`.

For `landing-test.shelvion.com` or `shelvion.com`, create a GitHub repository variable named `VITE_BASE_PATH` with the value `/`.

For a custom domain, copy `public/CNAME.example` to `public/CNAME` and replace its contents with the hostname you are using, then configure the same hostname in GitHub Pages and your DNS provider.
