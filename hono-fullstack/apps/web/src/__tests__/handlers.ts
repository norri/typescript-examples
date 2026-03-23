import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import type { Book } from '@app/api-types'

export const mockBooks: Book[] = [
  {
    id: '550e8400-e29b-41d4-a716-446655440000',
    title: 'The Pragmatic Programmer',
    author: 'David Thomas',
    description: 'A classic book about software engineering',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
  },
  {
    id: '550e8400-e29b-41d4-a716-446655440001',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
  },
]

export const handlers = [
  http.get('/api/books', () => {
    return HttpResponse.json(mockBooks)
  }),
  http.post('/api/books', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const newBook: Book = {
      id: '550e8400-e29b-41d4-a716-446655440099',
      title: body.title as string,
      author: body.author as string,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    return HttpResponse.json(newBook, { status: 201 })
  }),
  http.patch('/api/books/:id', async ({ params, request }) => {
    const body = (await request.json()) as Record<string, unknown>
    const book = mockBooks.find((b) => b.id === params.id)
    if (!book) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json({ ...book, ...body, updatedAt: new Date().toISOString() })
  }),
  http.delete('/api/books/:id', () => {
    return new HttpResponse(null, { status: 204 })
  }),
]

export const server = setupServer(...handlers)
