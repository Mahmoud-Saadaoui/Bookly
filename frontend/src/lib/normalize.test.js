import { describe, expect, it } from "vitest";
import {
  normalizeBook,
  normalizeBooksResponse,
  normalizeReviewsResponse,
} from "./normalize";

describe("API normalization", () => {
  it("exposes a stable id for Mongo documents", () => {
    expect(normalizeBook({ _id: "book-1", title: "Book" })).toEqual({
      _id: "book-1",
      id: "book-1",
      title: "Book",
    });
  });

  it("normalizes an empty books response", () => {
    expect(normalizeBooksResponse({})).toEqual({
      data: [],
      pagination: { page: 1, limit: 10, total: 0, pages: 0 },
    });
  });

  it("preserves review pagination metadata", () => {
    const response = normalizeReviewsResponse({
      data: [{ comment: "Useful" }],
      pagination: { page: 2, limit: 20, total: 21, pages: 2 },
    });

    expect(response.pagination.total).toBe(21);
    expect(response.data).toHaveLength(1);
  });
});
