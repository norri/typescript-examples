# hono-react-fullstack

Full-stack TypeScript example: Hono API + React frontend with end-to-end type safety.

## Stack

| Layer           | Technology                                                                                                            |
| --------------- | --------------------------------------------------------------------------------------------------------------------- |
| API             | [Hono](https://hono.dev) + [`@hono/zod-openapi`](https://github.com/honojs/middleware/tree/main/packages/zod-openapi) |
| Runtime         | Node.js 24 (`--experimental-strip-types`)                                                                             |
| Validation      | Zod 4                                                                                                                 |
| API docs        | OpenAPI 3.1 + Swagger UI                                                                                              |
| Frontend        | React 19 + Vite 8 + Tailwind CSS v4                                                                                   |
| Data fetching   | TanStack Query v5                                                                                                     |
| RPC client      | Hono RPC (`hc<AppType>`) — end-to-end type safety                                                                     |
| Testing         | Vitest 4, Testing Library, MSW, Playwright                                                                            |
| Database        | In-memory (default) or PostgreSQL                                                                                     |
| Package manager | pnpm workspaces                                                                                                       |

## Project structure

```
hono-fullstack/
├── packages/
│   └── api-types/        # Shared Zod schemas + TypeScript types
├── apps/
│   ├── api/              # Hono Node.js server
│   └── web/              # React + Vite frontend
└── e2e/                  # Playwright end-to-end tests
```

## Getting started

### Prerequisites

- Node.js 24+
- pnpm 9+

### Install

```sh
pnpm install
```

### Run (memory backend)

```sh
pnpm dev
```

- API: http://localhost:3000
- Web: http://localhost:5173
- Swagger UI: http://localhost:3000/docs
- OpenAPI spec: http://localhost:3000/openapi.json

### Run with PostgreSQL

```sh
pnpm dev:postgres
```

This starts Postgres via Docker Compose and runs both API and web with the PostgreSQL backend. The default connection string matches the credentials in `docker-compose.yml`.

## Scripts

```sh
pnpm dev           # Start API (:3000) and web (:5173) in parallel (memory backend)
pnpm dev:postgres  # Start Postgres + API + web (PostgreSQL backend)
pnpm test          # Run all unit + integration tests
pnpm test:e2e      # Run Playwright end-to-end tests
pnpm typecheck     # Type-check all packages
pnpm docker:up     # Start Postgres only
pnpm docker:down   # Stop Postgres
```

## Testing

```sh
# Unit + integration (Vitest)
pnpm test

# End-to-end (Playwright) — dev servers start automatically
pnpm test:e2e
```

| Layer      | Tool               | What's tested                                       |
| ---------- | ------------------ | --------------------------------------------------- |
| Repository | Vitest             | `MemoryBookRepository` CRUD operations              |
| API routes | Vitest             | `buildApp(new MemoryBookRepository()).request(...)` |
| Components | Vitest + RTL + MSW | `BookList` and `BookForm` with mocked API           |
| E2E        | Playwright         | Full CRUD flow in a real browser                    |

## End-to-end type safety

Renaming a field in `BookSchema` propagates type errors to:

1. API route handlers (via `c.req.valid('json')`)
2. Web hooks (via `InferRequestType` / `InferResponseType`)
3. Component props (via `Book` type from `@app/api-types`)

```ts
// packages/api-types/src/schemas.ts
export const BookSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(200),
  // ...
})

// apps/web/src/client.ts
export const client = hc<AppType>('/') // fully typed RPC client

// apps/web/src/hooks/useBooks.ts
type CreateInput = InferRequestType<typeof client.api.books.$post>['json']
```

## API endpoints

| Method   | Path             | Description    |
| -------- | ---------------- | -------------- |
| `GET`    | `/api/books`     | List all books |
| `GET`    | `/api/books/:id` | Get book by ID |
| `POST`   | `/api/books`     | Create a book  |
| `PATCH`  | `/api/books/:id` | Update a book  |
| `DELETE` | `/api/books/:id` | Delete a book  |
