import { randomUUID } from 'node:crypto'
import type { BookRepository, DbBook, DbCreateBook, DbUpdateBook } from './database.ts'

export class MemoryBookRepository implements BookRepository {
  private books: Map<string, DbBook> = new Map()

  async findAll(): Promise<DbBook[]> {
    return Array.from(this.books.values()).map((b) => ({ ...b }))
  }

  async findById(id: string): Promise<DbBook | null> {
    const book = this.books.get(id)
    return book ? { ...book } : null
  }

  async create(data: DbCreateBook): Promise<DbBook> {
    const now = new Date()
    const db: DbBook = { id: randomUUID(), ...data, createdAt: now, updatedAt: now }
    this.books.set(db.id, db)
    return { ...db }
  }

  async update(id: string, data: DbUpdateBook): Promise<DbBook | null> {
    const existing = this.books.get(id)
    if (!existing) return null
    const updated: DbBook = { ...existing, ...data, updatedAt: new Date() }
    this.books.set(id, updated)
    return { ...updated }
  }

  async delete(id: string): Promise<boolean> {
    return this.books.delete(id)
  }
}
