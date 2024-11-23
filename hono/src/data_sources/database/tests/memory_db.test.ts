import { InMemoryDatabase } from '../memory_db';
import { Book } from '../../../domain/books';

describe('InMemoryDatabase', () => {
  let database: InMemoryDatabase;

  beforeEach(() => {
    database = new InMemoryDatabase();
  });

  test('listAll should return an empty array when no books are present', async () => {
    const books = await database.listAll();
    expect(books).toEqual([]);
  });

  test('insert should add a book to the database', async () => {
    const newBook: Book = { title: 'Test Book' };
    await database.insert(newBook);

    const books = await database.listAll();
    expect(books).toHaveLength(1);
    expect(books[0].title).toBe('Test Book');
  });

  test('getOne should return the correct book by ID', async () => {
    const newBook: Book = { title: 'Test Book' };
    await database.insert(newBook);

    const books = await database.listAll();
    const bookId = books[0].id;

    const book = await database.getOne(bookId);
    expect(book).not.toBeNull();
    expect(book?.title).toBe('Test Book');
  });

  test('getOne should return null if the book does not exist', async () => {
    const book = await database.getOne(999);
    expect(book).toBeNull();
  });
});
