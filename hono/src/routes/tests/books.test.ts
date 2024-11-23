import { Hono } from "hono";
import books from "../../routes/books";
import bookService from "../../services/books_service";
import { Book } from "../../domain/books";

const app = new Hono();
app.route("/api/v1/books", books);

jest.mock("../../services/books_service");

describe("Books Routes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /api/v1/books should return an empty array when no books are present", async () => {
    (bookService.listAll as jest.Mock).mockResolvedValue([]);

    const res = await app.request("/api/v1/books");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      books: [],
    });
  });

  test("POST /api/v1/books should add a book to the database", async () => {
    const newBook: Book = { title: "Test Book" };
    bookService.save as jest.Mock;
    (bookService.listAll as jest.Mock).mockResolvedValue([newBook]);

    const res = await app.request("/api/v1/books", {
      method: "POST",
      body: JSON.stringify(newBook),
      headers: { "Content-Type": "application/json" },
    });
    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ message: "ok" });

    const res2 = await app.request("/api/v1/books");
    expect(res2.status).toBe(200);
    expect(await res2.json()).toEqual({
      books: [newBook],
    });
  });

  test("GET /api/v1/books/:id should return the correct book", async () => {
    const newBook: Book = { title: "Test Book" };
    (bookService.getById as jest.Mock).mockResolvedValue(newBook);

    const res = await app.request("/api/v1/books/1");
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(newBook);
  });

  test("GET /api/v1/books/:id should return 404 if the book does not exist", async () => {
    (bookService.getById as jest.Mock).mockResolvedValue(null);

    const res = await app.request("/api/v1/books/999");
    expect(res.status).toBe(404);
  });
});
