import { Book } from "../../domain/books";
import { Database, DbBook } from "./db";
import { Pool } from "pg";

const pool = new Pool({
  user: process.env.PG_USER,
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  password: process.env.PG_PASSWORD,
  port: Number(process.env.PG_PORT) || 5432,
});

export const PostgresDatabase: Database = {
  async listAll(): Promise<DbBook[]> {
    const res = await pool.query("SELECT id, title FROM items");
    return res.rows.map((row) => ({ id: row.id, title: row.title }));
  },

  async insert(item: Book): Promise<void> {
    await pool.query("INSERT INTO items (title) VALUES ($1)", [item.title]);
  },

  async getOne(id: number): Promise<DbBook | null> {
    const res = await pool.query("SELECT id, title FROM items WHERE id = $1", [
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
