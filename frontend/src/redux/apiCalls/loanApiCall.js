import api from "../../services/axiosInstance";
import { getAuthToken } from "../../services/axiosInstance";
import { getApiErrorMessage } from "../../lib/normalize";

const getMessage = (error, fallback) => getApiErrorMessage(error, fallback);

const throwApiError = (error, fallback) => {
  const normalizedError = new Error(getMessage(error, fallback));
  normalizedError.response = error.response;
  throw normalizedError;
};

export const getBookLoanDates = async (bookId) => {
  try {
    const { data } = await api.get(`/loans/book/${bookId}`);
    return data.success ? data.data : [];
  } catch (error) {
    throwApiError(error, "Failed to load availability");
  }
};

export const getApplicationConfig = async () => {
  try {
    const { data } = await api.get('/config');
    return data.success ? data.data : {};
  } catch (error) {
    throwApiError(error, "Failed to load application configuration");
  }
};

export const checkBookAvailability = async (bookId, startDate, endDate) => {
  try {
    const { data } = await api.get(`/loans/availability/${bookId}`, {
      params: { startDate, endDate },
    });
    return data.success ? data.data.isAvailable : false;
  } catch (error) {
    throwApiError(error, "Failed to check availability");
  }
};

export const createLoan = async (
  bookId,
  loanDate,
  returnDate,
  notes = "",
  idempotencyKey
) => {
  if (!getAuthToken()) {
    throw new Error("No authentication token found");
  }

  try {
    const { data } = await api.post(
      "/loans",
      { bookId, loanDate, returnDate, notes },
      idempotencyKey
        ? { headers: { "Idempotency-Key": idempotencyKey } }
        : undefined
    );

    if (!data.success) throw new Error(data.message || "Loan creation failed");
    return data.data;
  } catch (error) {
    throwApiError(error, "Failed to create loan");
  }
};

export const getUserLoans = async (page = 1, limit = 20) => {
  if (!getAuthToken()) throw new Error("No authentication token found");

  try {
    const { data } = await api.get("/loans/user/all", {
      params: { page, limit },
    });
    return data.success ? data : { data: [], pagination: null };
  } catch (error) {
    throwApiError(error, "Failed to load loans");
  }
};

export const returnBook = async (loanId) => {
  if (!getAuthToken()) throw new Error("No authentication token found");

  try {
    const { data } = await api.put(`/loans/return/${loanId}`);
    if (!data.success) throw new Error(data.message || "Return failed");
    return data.data;
  } catch (error) {
    throwApiError(error, "Failed to return book");
  }
};

export const getLoanDetail = async (loanId) => {
  if (!getAuthToken()) throw new Error("No authentication token found");

  try {
    const { data } = await api.get(`/loans/${loanId}`);
    return data.success ? data.data : null;
  } catch (error) {
    throwApiError(error, "Failed to load loan details");
  }
};
