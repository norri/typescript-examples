import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi'
import { BookSchema, CreateBookSchema, UpdateBookSchema, BookIdParamSchema, type Book } from '@app/api-types'
import type { BookRepository, DbBook } from '../db/database.ts'

function toBook(db: DbBook): Book {
  return { ...db, createdAt: db.createdAt.toISOString(), updatedAt: db.updatedAt.toISOString() }
}

const NotFoundSchema = z.object({ message: z.string() })
const ErrorSchema = z.object({ ok: z.literal(false), errors: z.unknown() })

const listRoute = createRoute({
  method: 'get',
  path: '/books',
  tags: ['Books'],
  summary: 'List all books',
  responses: {
    200: {
      content: { 'application/json': { schema: z.array(BookSchema) } },
      description: 'List of books',
    },
  },
})

const getRoute = createRoute({
  method: 'get',
  path: '/books/{id}',
  tags: ['Books'],
  summary: 'Get a book by ID',
  request: { params: BookIdParamSchema },
  responses: {
    200: {
      content: { 'application/json': { schema: BookSchema } },
      description: 'Book found',
    },
    404: {
      content: { 'application/json': { schema: NotFoundSchema } },
      description: 'Book not found',
    },
  },
})

const createBookRoute = createRoute({
  method: 'post',
  path: '/books',
  tags: ['Books'],
  summary: 'Create a new book',
  request: {
    body: {
      content: { 'application/json': { schema: CreateBookSchema } },
      required: true,
    },
  },
  responses: {
    201: {
      content: { 'application/json': { schema: BookSchema } },
      description: 'Book created',
    },
    422: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
  },
})

const updateRoute = createRoute({
  method: 'patch',
  path: '/books/{id}',
  tags: ['Books'],
  summary: 'Update a book',
  request: {
    params: BookIdParamSchema,
    body: {
      content: { 'application/json': { schema: UpdateBookSchema } },
      required: true,
    },
  },
  responses: {
    200: {
      content: { 'application/json': { schema: BookSchema } },
      description: 'Book updated',
    },
    404: {
      content: { 'application/json': { schema: NotFoundSchema } },
      description: 'Book not found',
    },
    422: {
      content: { 'application/json': { schema: ErrorSchema } },
      description: 'Validation error',
    },
  },
})

const deleteRoute = createRoute({
  method: 'delete',
  path: '/books/{id}',
  tags: ['Books'],
  summary: 'Delete a book',
  request: { params: BookIdParamSchema },
  responses: {
    204: { description: 'Book deleted' },
    404: {
      content: { 'application/json': { schema: NotFoundSchema } },
      description: 'Book not found',
    },
  },
})

export function createBooksRouter(repo: BookRepository) {
  const router = new OpenAPIHono({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json({ ok: false as const, errors: result.error.issues }, 422)
      }
    },
  })

  return router
    .openapi(listRoute, async (c) => {
      const books = await repo.findAll()
      return c.json(books.map(toBook), 200)
    })
    .openapi(getRoute, async (c) => {
      const { id } = c.req.valid('param')
      const book = await repo.findById(id)
      if (!book) return c.json({ message: 'Book not found' }, 404)
      return c.json(toBook(book), 200)
    })
    .openapi(createBookRoute, async (c) => {
      const data = c.req.valid('json')
      const book = await repo.create(data)
      return c.json(toBook(book), 201)
    })
    .openapi(updateRoute, async (c) => {
      const { id } = c.req.valid('param')
      const data = c.req.valid('json')
      const book = await repo.update(id, data)
      if (!book) return c.json({ message: 'Book not found' }, 404)
      return c.json(toBook(book), 200)
    })
    .openapi(deleteRoute, async (c) => {
      const { id } = c.req.valid('param')
      const deleted = await repo.delete(id)
      if (!deleted) return c.json({ message: 'Book not found' }, 404)
      return c.body(null, 204)
    })
}
