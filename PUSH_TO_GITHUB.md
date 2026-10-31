# Push to GitHub — Step-by-Step

The repo is fully prepared locally and ready to push.

---

## What's been done already

✅ History scrubbed — `.env`, `db/custom.db`, `scripts/`, `upload/` removed from
ALL commits (using git-filter-repo). No Neon password, no Supabase password,
no test data anywhere in git history.

✅ `.gitignore` hardened — local DB files, uploads, dev scripts, and git
history backups are now excluded.

✅ Added `.env.example` — template for Vercel deploy (no real secrets).

✅ Added `README.md` — project overview, tech stack, getting started.

✅ Working tree is clean — `git status` shows nothing to commit.

---

## Step 1 — Rotate your Neon password (REQUIRED)

Since the old password was in git history (now scrubbed), you should still
rotate it as defense-in-depth.

1. Go to https://console.neon.tech → your project
2. Click your project name in the top bar → **Settings**
3. Or: Dashboard → Settings → **Reset project password**
4. Set a new password — save it somewhere safe (password manager)
5. Update `.env` locally with the new password:
   ```
   DATABASE_URL=postgresql://neondb_owner:NEW_PASSWORD@ep-steep-waterfall-b9ydmsyk-pooler.c-7.eu-central-1.aws.neon.tech/neondb?sslmode=require
   ```
6. Restart your dev server

> **Note:** the connection string uses the same hostname, just a new password.

---

## Step 2 — Create the GitHub repo

You'll use the GitHub CLI (`gh`) from your local machine. I can't authenticate
to GitHub from this sandbox.

### On your local machine (after cloning this repo or copying the files):

1. Install GitHub CLI if you don't have it:
   - macOS: `brew install gh`
   - Linux: `sudo apt install gh` (or see https://github.com/cli/cli#installation)
   - Windows: `winget install GitHub.cli`

2. Authenticate:
   ```bash
   gh auth login
   ```
   Choose: GitHub.com → HTTPS → Login with browser

3. Initialize git locally (if you're starting from a fresh copy of the files):
   ```bash
   cd instagram-mock
   git init
   git add .
   git commit -m "Initial commit"
   ```

   **Or** if you've copied over the existing `.git` directory from the sandbox,
   you can skip this — the history is already there.

4. Create the public repo and push:
   ```bash
   gh repo create instagram-mock --public --source=. --remote=origin --push
   ```

   This single command:
   - Creates a new public repo named `instagram-mock` under your GitHub account
   - Adds it as the `origin` remote
   - Pushes your current `main` branch
   - Opens the new repo in your browser when done

5. Verify: visit your repo at `https://github.com/YOUR_USERNAME/instagram-mock`
   - You should see the README render at the bottom of the page
   - You should NOT see `.env` in the file list (it's gitignored)
   - You should see `.env.example` (the template, no secrets)

---

## Step 3 — Verify the push was clean

After pushing, run this on your local machine to triple-check no secrets are
in the published history:

```bash
cd instagram-mock
# Search for any Neon-style password string (starts with "npg_")
git log --all -p | grep -E "npg_[A-Za-z0-9]{10}" | head
# Should output nothing — exit code 1
```

If anything shows up, tell me immediately and we'll re-scrub.

---

## Step 4 — Deploy to Vercel

Now that the repo is on GitHub:

1. Go to https://vercel.com → Sign in with GitHub
2. Click "Add New…" → "Project"
3. Import the `instagram-mock` repo
4. In the project setup, expand "Environment Variables" and add:
   - `DATABASE_URL` = your **new** Neon connection string (with rotated password)
   - `JWT_SECRET` = run `openssl rand -base64 32` locally to generate one
5. Click "Deploy"
6. Wait 1–2 minutes for the build to finish
7. Visit your new URL → sign up a test user → you'll be redirected to
   https://www.instagram.com/

---

## Troubleshooting

### "gh auth login" doesn't work
Use the web fallback: create the repo manually at
https://github.com/new, then:
```bash
git remote add origin https://github.com/YOUR_USERNAME/instagram-mock.git
git branch -M main
git push -u origin main
```

### Push rejected as "non-fast-forward"
The remote has commits your local doesn't. Force-push:
```bash
git push -u origin main --force
```
(Safe here because we just scrubbed history and the remote is brand new.)

### Vercel build fails
Check that you added `DATABASE_URL` AND `JWT_SECRET` to Vercel's environment
variables. Vercel → your project → Settings → Environment Variables.

### After deploy, signup returns 500
Run `bunx prisma db push` locally to make sure the `User` and `PasswordReset`
tables exist in your Neon database. The schema is in `prisma/schema.prisma`.
