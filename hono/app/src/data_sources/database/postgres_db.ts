import { Book } from "../../domain/books";
import { Database, DbBook } from "./db";
import pg from 'pg'; 

const { Pool } = pg; 

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT) || 5432,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
});

export const PostgresDatabase: Database = {
  async listAll(): Promise<DbBook[]> {
    const res = await pool.query("SELECT id, title FROM books");
    return res.rows.map((row) => ({ id: row.id, title: row.title }));
  },

  async insert(item: Book): Promise<void> {
    await pool.query("INSERT INTO books (title) VALUES ($1)", [item.title]);
  },

  async getOne(id: number): Promise<DbBook | null> {
    const res = await pool.query("SELECT id, title FROM books WHERE id = $1", [
      id,
    ]);
    if (res.rows.length > 0) {
      const row = res.rows[0];
      return { id: row.id, title: row.title };
    } else {
      return null;
    }
  },
};
