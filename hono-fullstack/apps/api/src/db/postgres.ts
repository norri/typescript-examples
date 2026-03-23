import { randomUUID } from 'node:crypto'
import pg from 'pg'
import type { BookRepository, DbBook, DbCreateBook, DbUpdateBook } from './database.ts'

const { Pool } = pg

function rowToDbBook(row: Record<string, unknown>): DbBook {
  return {
    id: row.id as string,
    title: row.title as string,
    author: row.author as string,
    description: row.description as string | undefined,
    createdAt: row.created_at as Date,
    updatedAt: row.updated_at as Date,
  }
}

export class PostgresBookRepository implements BookRepository {
  private pool: pg.Pool

  constructor(connectionString: string) {
    this.pool = new Pool({ connectionString })
  }

  async findAll(): Promise<DbBook[]> {
    const result = await this.pool.query('SELECT * FROM books ORDER BY created_at DESC')
    return result.rows.map(rowToDbBook)
  }

  async findById(id: string): Promise<DbBook | null> {
    const result = await this.pool.query('SELECT * FROM books WHERE id = $1', [id])
    if (result.rows.length === 0) return null
    return rowToDbBook(result.rows[0])
  }

  async create(data: DbCreateBook): Promise<DbBook> {
    const id = randomUUID()
    const result = await this.pool.query(
      `INSERT INTO books (id, title, author, description)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [id, data.title, data.author, data.description ?? null],
    )
    return rowToDbBook(result.rows[0])
  }

  async update(id: string, data: DbUpdateBook): Promise<DbBook | null> {
    // Single round trip: COALESCE keeps existing values for omitted fields.
    const result = await this.pool.query(
      `UPDATE books
       SET title = COALESCE($2, title),
           author = COALESCE($3, author),
           description = COALESCE($4, description),
           updated_at = NOW()
       WHERE id = $1
       RETURNING *`,
      [id, data.title ?? null, data.author ?? null, data.description ?? null],
    )
    if (result.rows.length === 0) return null
    return rowToDbBook(result.rows[0])
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.pool.query('DELETE FROM books WHERE id = $1', [id])
    return (result.rowCount ?? 0) > 0
  }
}
