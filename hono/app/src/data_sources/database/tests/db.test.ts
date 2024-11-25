import { InMemoryDatabase } from "../memory_db";
import { PostgresDatabase } from "../postgres_db";
import { initializeDatabase } from "../db";

jest.mock("../memory_db");
jest.mock("../postgres_db");

describe("Database selection", () => {
  afterEach(() => {
    jest.resetModules();
    delete process.env.DATABASE_TYPE;
  });

  test("should use InMemoryDatabase when DATABASE_TYPE is not set", () => {
    const db = initializeDatabase();
    expect(db).toEqual(InMemoryDatabase);
  });

  test("should use PostgresDatabase when DATABASE_TYPE is set to postgres", () => {
    process.env.DATABASE_TYPE = "postgres";
    const db = initializeDatabase();
    expect(db).toEqual(PostgresDatabase);
  });

  test("should use InMemoryDatabase when DATABASE_TYPE is set to any other value", () => {
    process.env.DATABASE_TYPE = "other";
    const db = initializeDatabase();
    expect(db).toEqual(InMemoryDatabase);
  });
});
