import { Book } from '../../domain/books';
import { Database, DbBook } from './db';

export class InMemoryDatabase implements Database {
    private items: Map<number, DbBook>;
    private idCounter: number;

    constructor() {
        this.items = new Map<number, DbBook>();
        this.idCounter = 0;
    }

    async listAll(): Promise<DbBook[]> {
        return Array.from(this.items.values());
    }

    async insert(item: Book): Promise<void> {
        const newID = this.idCounter++;
        this.items.set(newID, { id: newID, title: item.title });
    }

    async getOne(id: number): Promise<DbBook | null> {
        return this.items.get(id) || null;
    }
}