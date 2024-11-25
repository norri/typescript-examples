import { serve } from "@hono/node-server";
import { Hono } from "hono";

import books from "./routes/books";

const app = new Hono();

app.get("/api/status", (c) => {
  return c.text("ok");
});

app.route("/api/v1/books", books);

const port = Number(process.env.PORT) || 3000;
console.log(`Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port,
});
