# Jaroche — Agent Onboarding

Full-stack ecommerce app. Read this file in full before any code change.

## Tech stack

| Layer | Choice | Version |
|-------|--------|---------|
| Frontend | Next.js (App Router) | 15.x |
| | React | 19.x |
| | Tailwind CSS | 4.x (`@tailwindcss/postcss`) |
| | UI primitives | shadcn/ui |
| | Forms | react-hook-form + @hookform/resolvers + zod |
| | State | zustand (with `persist`) |
| | HTTP | axios |
| | Toasts | sonner |
| Backend | Node | 20.x |
| | Express | 4.x |
| | TypeScript | 5.x |
| | ORM | Prisma |
| | DB | PostgreSQL |
| | Auth | jsonwebtoken + bcryptjs |
| | Validation | zod |
| | Payments | Stripe Checkout Sessions (test mode) |
| Shared | Zod schemas + TS types |  |
| Repo | npm workspaces |  |

## Monorepo layout

```
/jaroche
├── package.json          npm workspaces (client, server, shared) + dev/build/db scripts
├── .env.example          all env vars
├── CLAUDE.md             this file
├── shared/               @jaroche/shared — types + Zod schemas
├── server/               Express API (port 4000)
│   ├── prisma/           schema.prisma, seed.ts, migrations/
│   └── src/
│       ├── app.ts            express() builder — webhook raw body BEFORE express.json()
│       ├── index.ts          listener
│       ├── config/           env (zod-validated), prisma singleton
│       ├── middleware/       auth, error, validate, notFound
│       ├── routes/           auth, products, orders, cart, users, stripe
│       ├── controllers/      one per route file
│       ├── services/         auth, cart, order (transactional), stripe
│       └── utils/            jwt, asyncHandler
└── client/               Next.js (port 3000)
    ├── next.config.ts        rewrites /api/* → http://localhost:4000
    └── src/
        ├── app/                  layout, pages, route groups
        │   ├── (auth)/login,register
        │   ├── products/[id]
        │   ├── cart, checkout (+success/cancel), orders
        │   └── admin/(dashboard, products)
        ├── components/           ui (shadcn), nav, product, cart, forms
        ├── lib/                  api (axios), auth, utils
        ├── hooks/
        ├── stores/               auth, cart, user (Zustand)
        └── types/                re-exports from @jaroche/shared
```

## Routes (REST)

All under Express on `:4000/api/*`. The Next dev server proxies `/api/*` → Express via `next.config.ts` rewrites — **never** create routes under `client/src/app/api/`.

| Method | Path | Auth | Notes |
|--------|------|------|-------|
| POST | `/api/auth/register` | public | strips any `role` field |
| POST | `/api/auth/login` | public | returns access JWT, sets refresh cookie |
| POST | `/api/auth/refresh` | refresh cookie | new access JWT |
| POST | `/api/auth/logout` | refresh cookie | clears cookie |
| GET | `/api/products` | public | `?category=` filter |
| GET | `/api/products/:id` | public | |
| POST | `/api/products` | admin | |
| PUT | `/api/products/:id` | admin | |
| DELETE | `/api/products/:id` | admin | |
| GET | `/api/cart` | auth | own cart |
| POST | `/api/cart/items` | auth | upsert + increment |
| PATCH | `/api/cart/items/:id` | auth | set quantity |
| DELETE | `/api/cart/items/:id` | auth | |
| POST | `/api/orders` | auth | creates PENDING order in tx |
| GET | `/api/orders` | auth | own; admin sees all via `?all=1` |
| GET | `/api/orders/:id` | auth | own or admin |
| GET | `/api/users/profile` | auth | |
| PUT | `/api/users/profile` | auth | name only |
| POST | `/api/stripe/checkout` | auth | creates Session |
| POST | `/api/stripe/webhook` | Stripe sig | flips PAID + decrement stock (idempotent) |

## Database schema (Prisma)

`User` (id, name, email unique, password, role, createdAt) — `Role { ADMIN, CUSTOMER }`
`Product` (id, name, description, price (Decimal), stock, imageUrl, category, createdAt)
`Order` (id, userId, status, total (Decimal), stripeSessionId?, createdAt) — `OrderStatus { PENDING, PAID, SHIPPED, DELIVERED, CANCELLED }`
`OrderItem` (id, orderId, productId, quantity, price)
`Cart` (id, userId unique)
`CartItem` (id, cartId, productId, quantity) with `@@unique([cartId, productId])`

Relations cascade on user delete.

## Conventions

- **Imports**: `@/` alias on the client, relative on the server.
- **Naming**: PascalCase components, camelCase functions/vars, SCREAMING_SNAKE_CASE constants. Files: `LoginForm.tsx`, `auth.routes.ts`, `auth.service.ts`.
- **Validation**: Zod schemas live in `shared/src/schemas/` and are imported by both the client (RHF resolver) and the server (validate middleware). Single source of truth.
- **Errors**: Throw `AppError` (in `server/src/utils/asyncHandler.ts` or similar) with status + message; central error middleware turns into JSON.
- **No comments that explain WHAT** — only WHY (subtle invariants, design constraints, ordering requirements).
- **No client/src/app/api/** — all `/api/*` is Express. Document this loudly.
- **Strip `role`** from register payloads server-side. Clients can never set their role.
- **Cart writes** use `prisma.cartItem.upsert` with `quantity: { increment }` — never read-then-write.
- **Stock decrement** happens on Stripe webhook PAID, not on order creation, so abandoned checkouts don't oversell.
- **Stripe webhook body** is `express.raw({ type: 'application/json' })` mounted BEFORE `express.json()`. Mount order matters.

## Run / build / test

```bash
# from repo root
npm install
cp .env.example .env       # fill DATABASE_URL, JWT_*_SECRET, STRIPE_*
npm run db:migrate         # prisma migrate dev
npm run db:seed
npm run dev                # concurrently: server:4000, client:3000

# Stripe webhook forwarding (separate terminal)
stripe listen --forward-to localhost:4000/api/stripe/webhook
# paste signing secret into .env as STRIPE_WEBHOOK_SECRET, restart server

npm run typecheck          # all workspaces
npm run build              # all workspaces
```

### Dev server: webpack, not Turbopack

`client/package.json` uses `next dev --webpack` deliberately. Next 16's default Turbopack
dev mode hangs after the first auth-cookie round-trip in this codebase (specifically when
the server-component home page re-fetches `/api/products` via the rewrite proxy after a
state-changing client navigation). Webpack mode is stable. Production builds (`next build`)
do not use Turbopack and are unaffected.

## Environment variables

See `.env.example`. Required:

- `DATABASE_URL` — Postgres connection string
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET` — long random hex strings (`openssl rand -hex 64`)
- `JWT_ACCESS_TTL`, `JWT_REFRESH_TTL` — defaults 15m / 7d
- `BCRYPT_ROUNDS` — default 12
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`
- `PORT` (server, default 4000), `CLIENT_URL` (default http://localhost:3000)
- `NEXT_PUBLIC_API_BASE` — default `/api` (uses Next rewrite proxy)

## Seeded credentials

- Admin: `admin@jaroche.dev` / `Password123!`
- Customer: `user@jaroche.dev` / `Password123!`
- Stripe test card: `4242 4242 4242 4242`, any future date, any CVC.

## Agent rules

- **Always read this file first.**
- **Plan before scaffolding.** Use ultrathink for any architectural / schema / auth decision.
- **Never trust client input** for `role` or any privileged field.
- **Run typecheck after each phase** before declaring it done.
- **Subagents** receive a slice of the build plan + this file; orchestrator verifies and integrates.

## Login design

The original Login.html design at `https://api.anthropic.com/v1/design/h/P9UKCaitUMtZ4ZM_9yZtbg`
is gated (returns 405/403 to unauthenticated requests) and could not be fetched during
implementation. The current Login screen is a clean dark-themed editorial design that matches
the rest of the system tokens (Playfair Display + Inter, near-black palette, zinc borders).
Once the design source is accessible, replace `client/src/app/(auth)/login/page.tsx` and
`client/src/components/forms/LoginForm.tsx` markup to match exactly — the form wiring,
validation, and JWT flow are correct and need no changes.

## Out of scope (v1)

- Image uploads (use `imageUrl` strings, seeded with Unsplash URLs)
- Refund / return flow
- Multi-currency
- Email notifications
- Rate limiting (add via `express-rate-limit` later if needed)

## Admin shell — what's wired vs stubbed (v1)

- **Wired to real API**: Dashboard (KPIs from `/orders/all` + `/products`), Orders list/detail
  (`/orders/all`, `/orders/:id`, `PUT /orders/:id/status`), Products CRUD (`/products`),
  Customers list/detail (new admin endpoints `GET /api/users`, `GET /api/users/:id`),
  Settings → Account (`/users/profile`).
- **Design stubs (v1)**: Journal, Discounts, Reviews — sample data from the design.
  Buttons trigger admin Modal toasts/confirms; no persistence yet.
- **Settings → Studio profile / Notifications / Integrations**: design-only.
- **Analytics**: derived live from `/orders/all` (revenue + order counts grouped by day).
- **Tweaks panel** from the design source: intentionally NOT shipped (it was a design-tool only).
- **Sidebar collapse** persists in `localStorage` under `jaroche.admin.sidebar`.
- All admin CSS lives at the bottom of `client/src/app/globals.css`, scoped under `.admin-app`
  to avoid collisions with storefront classes (`.field` was renamed to `.ad-field` inside
  the admin tree, `.kicker` → `.ad-kicker`, `.serif` → `.ad-serif` for the same reason).
