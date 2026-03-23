import { describe, it, expect, beforeEach } from 'vitest'
import { buildApp } from '../app.ts'
import { MemoryBookRepository } from '../db/memory.ts'
import type { Book } from '@app/api-types'

function makeApp() {
  return buildApp(new MemoryBookRepository())
}

describe('Books API', () => {
  let app: ReturnType<typeof makeApp>

  beforeEach(() => {
    app = makeApp()
  })

  it('GET /api/books returns empty array', async () => {
    const res = await app.request('/api/books')
    expect(res.status).toBe(200)
    expect(await res.json()).toEqual([])
  })

  it('POST /api/books creates a book', async () => {
    const res = await app.request('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Clean Code', author: 'Robert C. Martin' }),
    })
    expect(res.status).toBe(201)
    const book = (await res.json()) as Book
    expect(book.title).toBe('Clean Code')
    expect(book.id).toBeDefined()
  })

  it('POST /api/books returns 422 for invalid input', async () => {
    const res = await app.request('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: '' }),
    })
    expect(res.status).toBe(422)
  })

  it('GET /api/books/:id returns a book', async () => {
    const createRes = await app.request('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Book', author: 'Author' }),
    })
    const { id } = (await createRes.json()) as Book

    const res = await app.request(`/api/books/${id}`)
    expect(res.status).toBe(200)
    const book = (await res.json()) as Book
    expect(book.id).toBe(id)
  })

  it('GET /api/books/:id returns 404 for unknown id', async () => {
    const res = await app.request('/api/books/00000000-0000-0000-0000-000000000000')
    expect(res.status).toBe(404)
  })

  it('PATCH /api/books/:id updates a book', async () => {
    const createRes = await app.request('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Original', author: 'Author' }),
    })
    const { id } = (await createRes.json()) as Book

    const res = await app.request(`/api/books/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Updated' }),
    })
    expect(res.status).toBe(200)
    const book = (await res.json()) as Book
    expect(book.title).toBe('Updated')
  })

  it('DELETE /api/books/:id deletes a book', async () => {
    const createRes = await app.request('/api/books', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'To Delete', author: 'Author' }),
    })
    const { id } = (await createRes.json()) as Book

    const deleteRes = await app.request(`/api/books/${id}`, { method: 'DELETE' })
    expect(deleteRes.status).toBe(204)

    const getRes = await app.request(`/api/books/${id}`)
    expect(getRes.status).toBe(404)
  })
})
