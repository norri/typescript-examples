import bookService from "../books_service";
import database from "../../data_sources/database/db";
import { Book } from "../../domain/books";

jest.mock("../../data_sources/database/db");

describe("BookService", () => {
  let mockDatabase: jest.Mocked<typeof database>;

  beforeEach(() => {
    mockDatabase = database as jest.Mocked<typeof database>;
    jest.clearAllMocks();
  });

  test("listAllItems should return an empty array when no books are present", async () => {
    mockDatabase.listAll.mockResolvedValue([]);

    const books = await bookService.listAll();
    expect(books).toEqual([]);
    expect(mockDatabase.listAll).toHaveBeenCalledTimes(1);
  });

  test("listAllItems should return books", async () => {
    mockDatabase.listAll.mockResolvedValue([{ id: 1, title: "Test Book" }]);

    const books = await bookService.listAll();
    expect(books).toEqual([{ title: "Test Book" }]);
    expect(mockDatabase.listAll).toHaveBeenCalledTimes(1);
  });

  test("insertItem should add a book to the database", async () => {
    const newBook: Book = { title: "Test Book" };
    mockDatabase.insert.mockResolvedValue();

    await bookService.save(newBook);

    expect(mockDatabase.insert).toHaveBeenCalledWith(newBook);
  });

  test("getItemById should return the correct book", async () => {
    const dbBook = { id: 1, title: "Test Book" };
    mockDatabase.getOne.mockResolvedValue(dbBook);

    const book = await bookService.getById(1);
    expect(book).toEqual({ title: "Test Book" });
    expect(mockDatabase.getOne).toHaveBeenCalledWith(1);
  });

  test("getItemById should return null if the book does not exist", async () => {
    mockDatabase.getOne.mockResolvedValue(null);

    const book = await bookService.getById(999);
    expect(book).toBeNull();
    expect(mockDatabase.getOne).toHaveBeenCalledWith(999);
  });

  test("insertItem should throw an error if the book data is invalid", async () => {
    const invalidBook: Book = { title: "" };

    await expect(bookService.save(invalidBook)).rejects.toThrow(
      "Invalid item data",
    );
    expect(mockDatabase.insert).not.toHaveBeenCalled();
  });
});
