export const normalizeId = (value) => value?.id ?? value?._id ?? null;

export const normalizeBook = (book) => {
  if (!book) return book;

  return {
    ...book,
    id: normalizeId(book),
  };
};

export const normalizeBooksResponse = (response) => ({
  data: Array.isArray(response?.data)
    ? response.data.map(normalizeBook)
    : [],
  pagination: response?.pagination || {
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  },
});

export const normalizeReviewsResponse = (response) => ({
  data: Array.isArray(response?.data) ? response.data : [],
  pagination: response?.pagination || {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  },
});

export const getApiErrorMessage = (error, fallback) => (
  error?.response?.data?.message || error?.message || fallback
);
