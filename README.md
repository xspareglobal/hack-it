# Instagram Login Mock

A pixel-faithful mock of Instagram's dark-mode login page with a full custom
authentication system — sign up, log in, forgot-password (3-step OTP flow),
and reset password — backed by a live Postgres database.

Built with Next.js 16, TypeScript, Tailwind CSS, Prisma, and Neon Postgres.

## Features

- **Pixel-faithful Instagram login UI** — two-column dark-mode layout, gradient
  logo, 3D photo collage with stickers, gradient "close friends." headline,
  floating-label inputs, and the full login form (Log in / Forgot password /
  Log in with Facebook / Create new account).
- **Sign-up modal** — email, username, optional full name, password with
  show/hide toggle. On success, redirects to https://www.instagram.com/.
- **Login** — accepts email OR username. On success, redirects to
  https://www.instagram.com/.
- **Forgot password (3-step flow)**:
  1. Enter email/username → server generates a 6-digit OTP, valid for 10 min
  2. Enter the OTP → server verifies it
  3. Choose a new password → server updates the user's row
- **Database** — Neon Postgres with two tables: `User` (id, email, username,
  fullName, password, timestamps) and `PasswordReset` (id, userId FK, otp,
  expiresAt, used, createdAt).
- **SMTP-ready** — when `SMTP_*` env vars are set, OTP codes are delivered by
  email (Gmail / SES / any SMTP). When not set, falls back to a dev-only toast
  so the flow remains testable.
- **Redirect on success** — after login or signup, the browser is redirected to
  `https://www.instagram.com/` so the demo ends on the real Instagram site.

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16 (App Router) + Turbopack |
| Language | TypeScript 5 |
| Styling | Tailwind CSS 4 + shadcn/ui (New York) |
| Database | Neon Postgres (serverless) |
| ORM | Prisma 6 |
| Email | Nodemailer (SMTP) |
| Runtime | Bun (dev) / Node.js (production) |

## Project structure

```
src/
├── app/
│   ├── api/auth/
│   │   ├── signup/route.ts        # POST /api/auth/signup
│   │   ├── login/route.ts         # POST /api/auth/login
│   │   ├── forgot-password/route.ts
│   │   ├── verify-otp/route.ts
│   │   └── reset-password/route.ts
│   ├── layout.tsx
│   ├── page.tsx                   # Instagram login page + modals
│   └── globals.css
├── components/ui/                  # shadcn/ui component set
├── hooks/
└── lib/
    ├── db.ts                       # Prisma client singleton
    └── mailer.ts                   # SMTP transport + sendOtpEmail()
prisma/
└── schema.prisma                   # User + PasswordReset models
public/images/                      # Stock photos for the collage
```

## Getting started locally

```bash
# 1. Install deps
bun install

# 2. Set up your database (Neon, Supabase, or local Postgres)
cp .env.example .env
# Fill in DATABASE_URL with your Postgres connection string

# 3. Push the schema (creates the User + PasswordReset tables)
bunx prisma db push

# 4. Run the dev server
bun run dev
```

Open http://localhost:3000.

## Deploy to Vercel

See `download/DEPLOY_GUIDE.md` for the full walkthrough. Short version:

1. Push this repo to GitHub
2. Import it on Vercel
3. Add env vars: `DATABASE_URL`, `JWT_SECRET`, optionally `SMTP_*`
4. Deploy

## Security notes

> ⚠️ This is a demo. Before letting real users sign up, you should:
>
> - Re-enable bcrypt password hashing (currently plaintext per the original
>   demo request — code paths are clearly marked with `// NOTE:` comments)
> - Add rate-limiting to `/api/auth/login` and `/api/auth/forgot-password`
> - Rotate the `JWT_SECRET` to a fresh random string
> - Remove `debugOtp` from the forgot-password response
> - Add CSRF protection and CSP headers

## License

MIT — use it however you like.
