import { InMemoryDatabase } from "./memory_db";
import { PostgresDatabase } from "./postgres_db";

export type DbBook = {
  id: number;
  title: string;
};

export type NewDbBook = {
  title: string;
};

export interface Database {
  listAll(): Promise<DbBook[]>;
  insert(newBook: NewDbBook): Promise<void>;
  getOne(id: number): Promise<DbBook | null>;
}

export const initializeDatabase = (): Database => {
  if (process.env.DATABASE_TYPE === "postgres") {
    return PostgresDatabase;
  } else {
    return InMemoryDatabase;
  }
};

const database = initializeDatabase();
export default database;
