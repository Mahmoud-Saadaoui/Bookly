import { describe, expect, it } from "vitest";
import { bookActions, bookReducer } from "./bookSlice";

const initialState = bookReducer(undefined, { type: "@@init" });

describe("book reducer", () => {
  it("adds books to the normalized data collection", () => {
    const state = bookReducer(
      { ...initialState, books: { ...initialState.books, data: [] } },
      bookActions.addBook({ id: "book-1", title: "Book" })
    );

    expect(state.books.data).toEqual([{ id: "book-1", title: "Book" }]);
  });

  it("updates the selected book and list entry together", () => {
    const current = {
      ...initialState,
      books: {
        ...initialState.books,
        data: [{ id: "book-1", title: "Old title" }],
      },
      selectedBook: { id: "book-1", title: "Old title" },
    };

    const state = bookReducer(
      current,
      bookActions.updateBook({ id: "book-1", title: "New title" })
    );

    expect(state.books.data[0].title).toBe("New title");
    expect(state.selectedBook.title).toBe("New title");
  });
});
