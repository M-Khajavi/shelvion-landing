# Move the landing page to its own repository

## 1. Create the new repository

Create a new empty GitHub repository named:

`M-Khajavi/shelvion-landing`

Do not add a README, license, or `.gitignore` during creation. Upload the contents of this folder to the new repository so `.github/`, `src/`, and `public/` are at repository root.

## 2. First test

Push to `main`. GitHub Actions will build and deploy the site to:

`https://M-Khajavi.github.io/shelvion-landing/`

Because the project is using hash routing, the admin entry is:

`https://M-Khajavi.github.io/shelvion-landing/#admin`

## 3. Supabase variables

In GitHub repository Settings → Secrets and variables → Actions → Variables, add:

`VITE_SUPABASE_URL`

`VITE_SUPABASE_ANON_KEY`

`VITE_ADMIN_EMAILS`

Leave `VITE_BASE_PATH` unset while using the repository URL. The build automatically uses `/shelvion-landing/`.

## 4. Test the protected Admin

In Supabase Authentication → Users, create the administrator user. The exact email must appear in `VITE_ADMIN_EMAILS`.

Then open `#admin` and sign in.

Inside Admin → Navigation → Admin access:

- Enable Admin interface = ON
- Show Admin button in CTA = OFF
- Show Admin button in footer = OFF
- Require Supabase administrator login = ON

The public page will have no Admin button, while the administrator can still use the direct `#admin` route.

## 5. Custom test hostname

When you are ready to test a real hostname, create a DNS record for:

`landing-test.shelvion.com`

Then:

1. Copy `public/CNAME.example` to `public/CNAME` and set it to `landing-test.shelvion.com`.
2. In GitHub repository Variables, set `VITE_BASE_PATH` to `/`.
3. In GitHub Pages settings, select the custom domain `landing-test.shelvion.com`.
4. Wait for HTTPS to become active.

The site will then be:

`https://landing-test.shelvion.com/`

Admin remains:

`https://landing-test.shelvion.com/#admin`

## 6. Promote to shelvion.com

After approval:

1. Change `public/CNAME` to `shelvion.com`.
2. Set the GitHub Pages custom domain to `shelvion.com`.
3. Point the DNS records for `shelvion.com` to the GitHub Pages target shown by GitHub.
4. Keep `VITE_BASE_PATH=/`.

No application-code route change is required. The same build becomes the production landing page.

## 7. Security note

Supabase login protects access to the Admin interface, and the deployment email allowlist limits which authenticated accounts are accepted. The current website content itself is still stored in browser `localStorage`; it is not yet a shared database-backed CMS.

For a true multi-user CMS later, move `SiteConfig` into Supabase tables and protect write operations with Row Level Security. Do not rely on a client-only `isAdmin` check to protect database writes.
