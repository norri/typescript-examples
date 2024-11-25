import { Book } from "../../domain/books";
import { Database, DbBook } from "./db";

const items = new Map<number, DbBook>();
let idCounter = 0;

export const InMemoryDatabase: Database & { reset: () => void } = {
  async listAll(): Promise<DbBook[]> {
    return Array.from(items.values());
  },

  async insert(item: Book): Promise<void> {
    const newID = idCounter++;
    items.set(newID, { id: newID, title: item.title });
  },

  async getOne(id: number): Promise<DbBook | null> {
    return items.get(id) || null;
  },

  reset() {
    items.clear();
    idCounter = 0;
  },
};
