# Hono API with Postgres

This project is a Hono-based API that uses Node as runtime and PostgreSQL as its database. The API provides endpoints for managing books.

## Start

1. Build and start the containers:
    ```sh
    docker compose up --build
    ```

1. The application should now be running and accessible at `http://localhost:3000`.

## Endpoints

### List All Books
- `/api/v1/books`
  ```sh
  curl -X GET http://localhost:3000/api/v1/books
  ```

### Add a New Book
- `/api/v1/books`
  ```sh
  curl -X POST http://localhost:3000/api/v1/books \
       -H "Content-Type: application/json" \
       -d '{"title":"Title"}'
  ```

### Get a Book by ID
- `/api/v1/books/:id`
  ```sh
  curl -X GET http://localhost:3000/api/v1/books/1
  ```
