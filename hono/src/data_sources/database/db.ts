import { Book } from "../../domain/books";
import { InMemoryDatabase } from "./memory_db";
import { PostgresDatabase } from "./postgres_db";

export type DbBook = {
    id: number;
    title: string;
};

export interface Database {
    listAll(): Promise<DbBook[]>;
    insert(newBook: Book): Promise<void>;
    getOne(id: number): Promise<DbBook | null>;
}

export const initializeDatabase = (): Database => {
    if (process.env.DB_TYPE === 'postgres') {
        return new PostgresDatabase();
    } else {
        return new InMemoryDatabase();
    }
};

const database = initializeDatabase();
export default database;