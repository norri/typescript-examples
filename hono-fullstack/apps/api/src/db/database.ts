import { MemoryBookRepository } from './memory.ts'
import { PostgresBookRepository } from './postgres.ts'
import type { Env } from '../env.ts'

export interface DbBook {
  id: string
  title: string
  author: string
  description?: string
  createdAt: Date
  updatedAt: Date
}

export type DbCreateBook = Omit<DbBook, 'id' | 'createdAt' | 'updatedAt'>
export type DbUpdateBook = Partial<DbCreateBook>

export interface BookRepository {
  findAll(): Promise<DbBook[]>
  findById(id: string): Promise<DbBook | null>
  create(data: DbCreateBook): Promise<DbBook>
  update(id: string, data: DbUpdateBook): Promise<DbBook | null>
  delete(id: string): Promise<boolean>
}

export function createRepository(env: Env): BookRepository {
  if (env.DB_BACKEND === 'postgres') {
    if (!env.DATABASE_URL) throw new Error('DATABASE_URL is required when DB_BACKEND=postgres')
    return new PostgresBookRepository(env.DATABASE_URL)
  }
  return new MemoryBookRepository()
}
