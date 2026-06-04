This is a mobile-first workout tracker built with Next.js, Prisma, and a migrated NestJS backend API with backend-owned cookie auth.

## Getting Started

Install dependencies and start the backend API and frontend app:

```bash
pnpm install
cd backend && pnpm install --ignore-workspace --lockfile-dir . && pnpm start:dev
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Environment

Copy `.env.example` to `.env.local` for local frontend development and set:

```bash
DATABASE_URL=
DIRECT_URL=
AUTH_SECRET=
AUTH_COOKIE_DOMAIN=
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4000
```

`NEXT_PUBLIC_BACKEND_API_URL` is required because browser-side React Query hooks and mutation functions call the NestJS backend directly. The backend must allow the frontend origin through CORS and include credentials so the backend-owned `workout_auth` cookie can authenticate resource API requests.

The backend process must also run with a valid `DATABASE_URL`/`DIRECT_URL`. If `POST /api/auth/signup` returns `500` and the backend log says `tenant/user ... not found`, the Supabase pooler username or tenant in the backend environment is invalid. For local development, point both the frontend and backend to the same local database, for example:

```bash
DATABASE_URL=postgresql://postgres:12345678@localhost:5432/workout
DIRECT_URL=postgresql://postgres:12345678@localhost:5432/workout
AUTH_SECRET=replace-me
CORS_ORIGIN=http://localhost:3000
```

Leave `AUTH_COOKIE_DOMAIN` empty for localhost. Set it only when the frontend and backend need to share cookies across sibling production subdomains, for example `.example.com`.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
