# Jaroche

Full-stack ecommerce monorepo: Next.js client + Express API + Postgres (Prisma) + Stripe.

```
jaroche/
├── client/   Next.js 15 App Router + TS + Tailwind v4 + shadcn/ui
├── server/   Express + TS + Prisma + JWT + Stripe
└── shared/   TypeScript types + Zod schemas shared by both
```

## Quick start

```bash
cp .env.example .env             # fill DATABASE_URL + Stripe keys
npm install
npm run db:migrate
npm run db:seed                  # admin@jaroche.dev / Password123!
npm run dev                      # client:3000 + server:4000

# In another terminal, forward Stripe webhooks:
stripe listen --forward-to localhost:4000/api/stripe/webhook
```

See `CLAUDE.md` for full onboarding (architecture, conventions, agent rules).
