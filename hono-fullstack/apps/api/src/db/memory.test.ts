import { describe, it, expect, beforeEach } from 'vitest'
import { MemoryBookRepository } from './memory.ts'

describe('MemoryBookRepository', () => {
  let repo: MemoryBookRepository

  beforeEach(() => {
    repo = new MemoryBookRepository()
  })

  it('starts empty', async () => {
    expect(await repo.findAll()).toEqual([])
  })

  it('creates and retrieves a book', async () => {
    const created = await repo.create({ title: 'Test', author: 'Author' })
    expect(created.id).toBeDefined()
    expect(created.title).toBe('Test')
    expect(await repo.findById(created.id)).toEqual(created)
  })

  it('returns null for unknown id', async () => {
    expect(await repo.findById('00000000-0000-0000-0000-000000000000')).toBeNull()
  })

  it('updates a book', async () => {
    const book = await repo.create({ title: 'Original', author: 'Author' })
    const updated = await repo.update(book.id, { title: 'Updated' })
    expect(updated?.title).toBe('Updated')
    expect(updated?.author).toBe('Author')
  })

  it('returns null when updating unknown id', async () => {
    expect(await repo.update('00000000-0000-0000-0000-000000000000', { title: 'X' })).toBeNull()
  })

  it('deletes a book', async () => {
    const book = await repo.create({ title: 'To delete', author: 'Author' })
    expect(await repo.delete(book.id)).toBe(true)
    expect(await repo.findById(book.id)).toBeNull()
  })

  it('returns false when deleting unknown id', async () => {
    expect(await repo.delete('00000000-0000-0000-0000-000000000000')).toBe(false)
  })
})
