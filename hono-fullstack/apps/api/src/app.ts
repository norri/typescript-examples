import { OpenAPIHono } from '@hono/zod-openapi'
import { swaggerUI } from '@hono/swagger-ui'
import { createBooksRouter } from './routes/books.ts'
import { createRepository } from './db/database.ts'
import { env } from './env.ts'
import type { BookRepository } from './db/database.ts'

export function buildApp(repo: BookRepository) {
  const base = new OpenAPIHono()

  // doc31 is OpenAPIHono-specific; call on base before chaining
  base.doc31('/openapi.json', {
    openapi: '3.1.0',
    info: { title: 'Books API', version: '1.0.0' },
  })

  // Capture chained return values so route types are reflected in AppType
  return base
    .route('/api', createBooksRouter(repo))
    .get('/docs', swaggerUI({ url: '/openapi.json' }))
}

// Singleton for the server entry point and type derivation
const _app = buildApp(createRepository(env))
export const app = _app
export type AppType = typeof _app
