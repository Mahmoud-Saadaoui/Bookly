import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getUserLoans, returnBook } from "../../redux/apiCalls/loanApiCall";
import Pagination from "../../components/pagination/Pagination";
import "./loans.css";

const formatDate = (value) => (
  value ? new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(new Date(value)) : "-"
);

function LoansPage() {
  const navigate = useNavigate();
  const [loans, setLoans] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState(null);

  const loadLoans = useCallback(async (pageNumber = page) => {
    setLoading(true);
    try {
      const response = await getUserLoans(pageNumber, 20);
      setLoans(response.data || []);
      setPagination(response.pagination || null);
    } catch (error) {
      toast.error(error.message || "Failed to load loans");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadLoans();
  }, [loadLoans]);

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleReturn = async (loanId) => {
    if (!window.confirm("Return this book now?")) return;

    setReturningId(loanId);
    try {
      await returnBook(loanId);
      toast.success("Book returned successfully");
      await loadLoans(page);
    } catch (error) {
      toast.error(error.message || "Failed to return book");
    } finally {
      setReturningId(null);
    }
  };

  if (loading) {
    return <main className="loans-page loans-state" role="status">Loading your loans...</main>;
  }

  return (
    <main className="loans-page">
      <header className="loans-header">
        <p className="eyebrow">Your reading history</p>
        <h1>My loans</h1>
        <p>Keep track of the books you are currently reading and the ones you have returned.</p>
      </header>

      {loans.length === 0 ? (
        <section className="loans-empty">
          <h2>No loans yet</h2>
          <p>Choose a book and select dates to start your reading journey.</p>
          <button type="button" onClick={() => navigate("/books")}>Browse books</button>
        </section>
      ) : (
        <section className="loans-list" aria-label="Your loans">
          {loans.map((loan) => (
            <article className="loan-card" key={loan._id || loan.id}>
              <div>
                <p className="loan-status">{loan.status}</p>
                <h2>{loan.book?.title || "Book unavailable"}</h2>
                <p>{loan.book?.author || "Unknown author"}</p>
              </div>
              <dl className="loan-dates">
                <div>
                  <dt>Start</dt>
                  <dd>{formatDate(loan.loanDate)}</dd>
                </div>
                <div>
                  <dt>Return by</dt>
                  <dd>{formatDate(loan.returnDate)}</dd>
                </div>
              </dl>
              {loan.status === "active" && !loan.actualReturnDate && (
                <button
                  type="button"
                  className="loan-return-button"
                  onClick={() => handleReturn(loan._id || loan.id)}
                  disabled={returningId === (loan._id || loan.id)}
                >
                  {returningId === (loan._id || loan.id) ? "Returning..." : "Return book"}
                </button>
              )}
            </article>
          ))}
        </section>
      )}

      {pagination?.pages > 1 && (
        <Pagination
          totalPages={pagination.pages}
          currentPage={page - 1}
          onPageChange={handlePageChange}
        />
      )}
    </main>
  );
}

export default LoansPage;
