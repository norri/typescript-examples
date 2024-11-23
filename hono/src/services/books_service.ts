import database from "../data_sources/database/db";
import { Book } from "../domain/books";

const listAll = async (): Promise<Book[]> => {
  const dbBooks = await database.listAll();
  return dbBooks.map((dbItem) => ({
    title: dbItem.title,
  }));
};

const save = async (newBook: Book): Promise<void> => {
  if (!newBook.title) {
    throw new Error("Invalid item data");
  }
  await database.insert({ title: newBook.title });
};

const getById = async (id: number): Promise<Book | null> => {
  const item = await database.getOne(id);
  if (!item) {
    return null;
  }
  return { title: item.title };
};

export default {
  listAll,
  save,
  getById,
};
