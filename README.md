# 🦙 Pacific Alpacas — Luxury NZ Alpaca Fiber E-Commerce Platform

> A full-stack, bilingual (Chinese/English) e-commerce platform for a New Zealand luxury alpaca fiber brand, featuring fiber traceability, a grower portal, an AI chat assistant, and a comprehensive admin panel.

---

## 📖 Table of Contents

- [About the Project](#about-the-project)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Technical Challenges & Lessons Learned](#technical-challenges--lessons-learned)
- [License](#license)

---

## About the Project

Pacific Alpacas is a luxury e-commerce web application built for a New Zealand alpaca fiber brand targeting Chinese high-net-worth consumers. The platform goes beyond a standard online store by offering:

- **Farm-to-product fiber traceability** — customers can scan a batch code and trace their purchase back to the specific NZ farm and grower.
- **Bilingual UX (Chinese & English)** — full `zh`/`en` internationalisation via `react-i18next`, catering to the brand's primary customer base.
- **A grower portal** — authenticated NZ alpaca farmers can log in and view their fiber batch and payout data.
- **An admin panel** — internal staff manage products, orders, growers, fiber batches, and promotional codes through a dedicated back-office interface.

The project was built as a complete, production-ready SPA using React, TypeScript, and Supabase as the backend-as-a-service.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | React 18 + TypeScript |
| **Build Tool** | Vite |
| **Styling** | Tailwind CSS, shadcn/ui (Radix UI primitives) |
| **Animations** | Framer Motion |
| **Routing** | React Router v6 |
| **State Management** | Zustand (cart store) |
| **Server State / Caching** | TanStack React Query v5 |
| **Backend / Auth / DB** | Supabase (PostgreSQL, Row-Level Security, Auth) |
| **Forms & Validation** | React Hook Form + Zod |
| **Internationalisation** | react-i18next (Chinese `zh` + English `en`) |
| **Unit / Component Tests** | Vitest + Testing Library |
| **E2E Tests** | Playwright |
| **Linting** | ESLint + TypeScript-ESLint |

---

## Features

### 🛍️ Customer-Facing

- **Homepage** — Hero section, fiber explainer, grower network showcase, sleep science section, brand heritage, media coverage, and trust certifications.
- **Shop** — Product catalogue with filtering; individual product detail pages.
- **Cart** — Persistent slide-out cart drawer powered by Zustand.
- **Checkout** — Full checkout flow with order confirmation page.
- **Fiber Traceability** — `/trace/:batchCode` — scan a QR code or enter a batch code to view the full provenance story of a product's fiber.
- **Sleep Quiz** — Interactive dialog recommending products based on the customer's sleep preferences.
- **AI Chat Widget** — In-page assistant to answer product and brand questions.
- **Bilingual UI** — Toggle between Simplified Chinese and English on every page.

### 🌾 Grower Portal (`/grower`)

- Authenticated view for NZ alpaca farmers.
- Dashboard displaying fiber batch history and payout summaries.

### 🔐 Admin Panel (`/admin`)

| Route | Feature |
|---|---|
| `/admin` | Overview dashboard with key metrics |
| `/admin/products` | Create, edit, and delete product listings |
| `/admin/orders` | View and manage customer orders |
| `/admin/growers` | Manage grower accounts and fiber data |
| `/admin/fiber-batches` | Track fiber batches from farm to product |
| `/admin/promos` | Create and manage promotional discount codes |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18 (LTS recommended)
- **npm** or **bun**
- A [Supabase](https://supabase.com) project (free tier is sufficient for local development)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/RobotDevenport152/web-scribe-joy.git
cd web-scribe-joy

# 2. Install dependencies
npm install
# or, if you prefer bun:
bun install
```

### Environment Variables

Create a `.env` file in the project root (see `.env.example` if provided):

```env
VITE_SUPABASE_URL=https://<your-project-ref>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-supabase-anon-key>
```

> ⚠️ Never commit your `.env` file. It is already listed in `.gitignore`.

You can find your Supabase URL and anon key in your Supabase project dashboard under **Settings → API**.

#### Database Migrations

Apply the included SQL migrations to your Supabase project via the Supabase dashboard SQL editor, or using the Supabase CLI:

```bash
supabase db push
```

The migration files are located in `supabase/migrations/`.

### Running Locally

```bash
# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

| Command | Description |
|---|---|
| `npm run dev` | Start local dev server with HMR |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest unit tests |

---

## Project Structure

```
web-scribe-joy/
├── src/
│   ├── assets/               # Static images (alpaca fiber, hero, NZ scenes)
│   ├── components/
│   │   ├── cart/             # CartDrawer (Zustand-connected)
│   │   ├── chat/             # AI ChatWidget
│   │   ├── home/             # Landing page sections (Hero, Fiber, Growers…)
│   │   ├── layout/           # Navbar, Footer, PublicLayout
│   │   ├── shop/             # Product cards and filters
│   │   ├── traceability/     # Fiber batch traceability components
│   │   └── ui/               # shadcn/ui primitives
│   ├── hooks/                # Custom React hooks
│   ├── i18n/                 # Translation files (zh, en)
│   ├── integrations/         # Supabase client setup
│   ├── lib/                  # Shared utilities
│   ├── pages/
│   │   ├── admin/            # Admin panel pages
│   │   ├── Index.tsx         # Homepage
│   │   ├── ShopPage.tsx
│   │   ├── ProductDetailPage.tsx
│   │   ├── TraceabilityPage.tsx
│   │   ├── CheckoutPage.tsx
│   │   ├── AuthPage.tsx
│   │   └── GrowerDashboard.tsx
│   ├── stores/               # Zustand stores (cart, etc.)
│   └── test/                 # Vitest test files
├── supabase/
│   ├── migrations/           # SQL migration files
│   └── functions/            # Supabase Edge Functions (if any)
├── public/                   # Static public assets
├── playwright.config.ts      # E2E test configuration
├── vite.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## Testing

### Unit & Component Tests (Vitest)

```bash
npm run test          # Run once
npm run test:watch    # Watch mode
```

Tests live in `src/test/` and use `@testing-library/react` for component-level assertions.

### End-to-End Tests (Playwright)

```bash
npx playwright test
```

Playwright is configured in `playwright.config.ts`. E2E tests cover critical user journeys including the shop, cart, and checkout flows.

---

## Technical Challenges & Lessons Learned

### 1. Bilingual E-Commerce at the Component Level

Supporting both Chinese (`zh`) and English (`en`) throughout a complex SPA required careful upfront architecture. Using `react-i18next` with namespace-separated translation files kept things manageable, but the main challenge was ensuring that dynamic content from Supabase (product names, descriptions) was also stored and returned in both languages. Lesson: define the data schema's i18n strategy before writing any components.

### 2. Multi-Role Authentication with Supabase RLS

The platform has three distinct user roles — public customers, authenticated growers, and admin staff — each with different data access rights. Implementing this via Supabase's Row-Level Security (RLS) policies required careful planning of the `profiles` table and policy conditions. Getting RLS right before seeding real data was critical; retrofitting policies onto an existing dataset is significantly harder.

### 3. Real-Time Cart State Without a Backend

The cart is managed entirely client-side with Zustand to avoid round-trips to Supabase for every item addition/removal. The challenge was keeping cart state consistent with stock levels held in the database during the checkout step. Lesson: optimistic UI updates work well for cart interactions, but a server-side stock check must happen before payment is confirmed.

### 4. Fiber Traceability as a Trust Signal

Building the `/trace/:batchCode` page required linking products → fiber batches → growers → farms across multiple Supabase tables with relational joins. The technical challenge was relatively straightforward with TanStack Query; the more interesting design challenge was presenting this data in a narrative way that resonated with luxury consumers rather than reading like a database dump.

---

## License

This project is for portfolio and educational demonstration purposes. All brand assets, copy, and imagery are the property of Pacific Alpacas Ltd and are not licensed for reuse.

---

_Built with React, TypeScript, and Supabase. Designed for the New Zealand luxury market._
