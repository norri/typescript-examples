import { Pool } from "pg";
import { PostgresDatabase } from "../postgres_db";
import type { Book } from "../../../domain/books";
import type { DbBook } from "../db";

jest.mock("pg", () => {
  const mPool = {
    query: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

describe("PostgresDatabase", () => {
  let pool: jest.Mocked<Pool>;
  let database: typeof PostgresDatabase;

  beforeEach(() => {
    pool = new Pool() as jest.Mocked<Pool>;
    database = PostgresDatabase;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("listAll should return an empty array when no books are present", async () => {
    pool.query.mockResolvedValue({ rows: [] } as never);

    const books = await database.listAll();
    expect(books).toEqual([]);
    expect(pool.query).toHaveBeenCalledWith("SELECT id, title FROM books");
  });

  test("listAll should return books", async () => {
    const dbBooks: DbBook[] = [{ id: 1, title: "Test Book" }];
    pool.query.mockResolvedValue({ rows: dbBooks } as never);

    const books = await database.listAll();
    expect(books).toEqual(dbBooks);
    expect(pool.query).toHaveBeenCalledWith("SELECT id, title FROM books");
  });

  test("insert should add a book to the database", async () => {
    const newBook: Book = { title: "Test Book" };
    pool.query.mockResolvedValue({} as never);

    await database.insert(newBook);
    expect(pool.query).toHaveBeenCalledWith(
      "INSERT INTO books (title) VALUES ($1)",
      [newBook.title],
    );
  });

  test("getOne should return the correct book by id", async () => {
    const dbBook: DbBook = { id: 1, title: "Test Book" };
    pool.query.mockResolvedValue({ rows: [dbBook] } as never);

    const book = await database.getOne(1);
    expect(book).toEqual(dbBook);
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id, title FROM books WHERE id = $1",
      [1],
    );
  });

  test("getOne should return null if the book does not exist", async () => {
    pool.query.mockResolvedValue({ rows: [] } as never);

    const book = await database.getOne(999);
    expect(book).toBeNull();
    expect(pool.query).toHaveBeenCalledWith(
      "SELECT id, title FROM books WHERE id = $1",
      [999],
    );
  });
});
