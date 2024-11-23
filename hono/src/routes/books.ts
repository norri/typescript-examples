import { Hono } from "hono";

import { Book } from "../domain/books";
import booksService from "../services/books_service";

const app = new Hono();

app.get("/", async (c) => {
  const books = await booksService.listAll();
  return c.json({ books: books });
});

app.post("/", async (c) => {
  const book = await c.req.json<Book>();
  await booksService.save(book);
  return c.json({ message: "ok" }, 201);
});

app.get("/:id", async (c) => {
  const id = parseInt(c.req.param("id"), 10);
  const book = await booksService.getById(id);
  if (book) {
    return c.json(book);
  } else {
    return c.notFound();
  }
});

export default app;
