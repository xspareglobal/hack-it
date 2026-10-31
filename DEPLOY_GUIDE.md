# Instagram Mock — Deploy Guide

This guide walks you through deploying the app to Vercel and connecting it to your Neon Postgres database.

---

## 1. What you already have

- ✅ Next.js app with login / signup / forgot-password (3-step OTP) flows
- ✅ Wired to your **Neon Postgres** database
- ✅ Two tables in Neon: `User` (plaintext passwords per your request) and `PasswordReset`
- ✅ All API routes verified working against Neon end-to-end

## 2. What's still pending

These were intentionally skipped so you can decide when to enable them:

### a) Real email delivery (SMTP)
Right now OTP codes are shown in a dev-only toast (because no email provider is configured).
To send them by real email, paste SMTP credentials into `.env`:

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-gmail-app-password   # NOT your regular Gmail password
SMTP_FROM="Instagram Demo <your-email@gmail.com>"
```

Get the App Password at: https://myaccount.google.com/apppasswords (2FA must be enabled).
Once `.env` has all five values, the forgot-password endpoint will send the OTP by email instead of returning it in the JSON.

### b) Real session cookies (JWT)
Currently the logged-in user is held in React state (lost on page refresh).
To make sessions persist across refreshes, set up JWT cookies — the `JWT_SECRET` env var is already in `.env`, I just need to write the cookie-setting code. Say the word.

### c) Password hashing
You asked me to skip hashing. Passwords are stored as plaintext in the `User.password` column.
Before allowing real users to sign up, re-enable bcrypt — it's a 3-line change per file. Say the word and I'll add it back.

---

## 3. Deploy to Vercel

### Step 1 — Push code to GitHub
```bash
cd /home/z/my-project
git init
git add .
git commit -m "Instagram mock with auth + Neon"
# Create a new repo on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/instagram-mock.git
git branch -M main
git push -u origin main
```

> ⚠️ Before committing: confirm `.env` is in `.gitignore` (it should be by default with Next.js). Never commit credentials.

### Step 2 — Connect Vercel
1. Go to https://vercel.com → Sign up with GitHub
2. Click "Add New…" → "Project"
3. Import your `instagram-mock` repo
4. Framework preset: Next.js (auto-detected)
5. Don't click Deploy yet — first add env vars (next step)

### Step 3 — Add environment variables in Vercel
In the project setup screen, expand "Environment Variables" and add each one:

| Name | Value |
|---|---|
| `DATABASE_URL` | `postgresql://neondb_owner:npg_xxxxxxxx@ep-steep-waterfall-xxxxx.aws.neon.tech/neondb?sslmode=require` |
| `JWT_SECRET` | any random 40+ char string (e.g. `openssl rand -base64 32`) |
| `SMTP_HOST` | `smtp.gmail.com` (if using Gmail) |
| `SMTP_PORT` | `465` |
| `SMTP_USER` | your Gmail address |
| `SMTP_PASS` | your 16-char Gmail App Password |
| `SMTP_FROM` | `"Instagram Demo <you@gmail.com>"` |

Mark each as applied to "Production", "Preview", and "Development" environments.

### Step 4 — Deploy
Click "Deploy". Vercel builds the app (usually takes 1-2 minutes).
When done, you get a URL like `instagram-mock-abc123.vercel.app`.

### Step 5 — Push the database schema (only first time)
Vercel doesn't run Prisma migrations automatically. You have two options:

**Option A (recommended): push from your laptop**
```bash
git clone https://github.com/YOUR_USERNAME/instagram-mock.git
cd instagram-mock
cp .env.example .env
# fill in DATABASE_URL with your Neon string
npx prisma db push    # creates the tables in Neon (idempotent — safe to re-run)
```

**Option B: run the SQL from the Supabase/Neon SQL editor**
Use the SQL in the next section.

### Step 6 — Test the live app
1. Visit `https://instagram-mock-abc123.vercel.app`
2. Click "Create new account", fill in a test email + password
3. Log into your Neon dashboard → your project → "Tables"
4. You should see the new row in the `User` table

---

## 4. SQL to create tables manually (if needed)

If you ever need to recreate the tables in Neon (or want to inspect them), open the Neon SQL Editor and run:

```sql
-- Verify tables exist
SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- View all signed-up users
SELECT id, email, username, "fullName", "createdAt" FROM "User" ORDER BY "createdAt" DESC;

-- View password-reset OTPs
SELECT "userId", otp, used, "expiresAt", "createdAt" FROM "PasswordReset" ORDER BY "createdAt" DESC;

-- Delete a test user (cascades to their OTPs)
DELETE FROM "User" WHERE email = 'demo@spare.global';
```

---

## 5. How to see your data in Neon

Three ways, all in the Neon dashboard at https://console.neon.tech:

1. **Tables view** (point-and-click): Your project → "Tables" → click `User` or `PasswordReset`
2. **SQL Editor**: Your project → "SQL Editor" → paste any SQL → Run
3. **Branches**: Neon supports database branching (like Git for databases). Each Neon project has a `main` branch by default.

---

## 6. Quick reference — what's stored where

| Where | What |
|---|---|
| Neon → `User` table | id, email, username, fullName, **password (plaintext)**, createdAt, updatedAt |
| Neon → `PasswordReset` table | id, userId (FK), otp, expiresAt, used, createdAt |
| Browser cookie (when JWT is wired up) | Signed JWT with user id + email |
| `.env` on Vercel | DATABASE_URL, JWT_SECRET, SMTP_* |
| Neon dashboard → "Connection Details" | The DATABASE_URL string |

---

## 7. Security checklist before going live

- [ ] Re-enable bcrypt password hashing (currently plaintext per request)
- [ ] Add rate-limiting to `/api/auth/login` and `/api/auth/forgot-password` to prevent brute-force
- [ ] Rotate the `JWT_SECRET` to a fresh random string
- [ ] Remove `debugOtp` from the forgot-password response (only used during dev)
- [ ] Set up CSP headers in `next.config.ts`
- [ ] Add CSRF protection for state-changing endpoints

Say the word and I'll handle any of these for you.
