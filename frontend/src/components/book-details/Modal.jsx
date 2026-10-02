import React, { useEffect, useRef, useState } from "react";
import "./book-details.css";
import { useDispatch } from "react-redux";
import { fetchSingleBook, postReview } from "../../redux/apiCalls/bookApiCall";
import { toast } from "react-toastify";

const Modal = ({ showModal, handleClose, book }) => {
  const [rate, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const closeButtonRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (!showModal) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") handleClose();
    };

    document.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showModal]);

  const submitReview = async (e) => {
    e.preventDefault();
    const trimmedComment = comment.trim();
    if (!trimmedComment) {
      return toast.error("Comment is required");
    }
    if (trimmedComment.length > 1000) {
      return toast.error("Comment cannot exceed 1000 characters");
    }
    if (rate === 0) {
      return toast.error("Please select a rating");
    }

    setSubmitting(true);
    try {
      await dispatch(postReview(book, { rate, comment: trimmedComment }));
      await dispatch(fetchSingleBook(book));
      handleClose();
      toast.success("Review added successfully!");
    } catch (error) {
      // Error is already handled by the API call with toast
      console.error("Failed to submit review:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className={`modal ${showModal ? "show" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="review-dialog-title"
      aria-hidden={!showModal}
    >
      <button
        type="button"
        className="modal-backdrop"
        aria-label="Close review dialog"
        tabIndex={showModal ? 0 : -1}
        onClick={handleClose}
      />
      <div className="modal-content">
        <button ref={closeButtonRef} type="button" className="close" onClick={handleClose} aria-label="Close review dialog" tabIndex={showModal ? 0 : -1}>
          &times;
        </button>
        <h2 id="review-dialog-title">Submit Your Review</h2>
        <form onSubmit={submitReview}>
          <div className="rating-input">
            <label htmlFor="review-rating">Rating:</label>
            <select
              id="review-rating"
              value={rate}
              onChange={(e) => setRating(Number(e.target.value))}
              required
              disabled={submitting}
            >
              <option value="0">Select rating...</option>
              <option value="1">1 - Poor</option>
              <option value="2">2 - Fair</option>
              <option value="3">3 - Good</option>
              <option value="4">4 - Very Good</option>
              <option value="5">5 - Excellent</option>
            </select>
          </div>
          <div className="comment">
            <label htmlFor="review-comment">Comment:</label>
            <textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={submitting}
              placeholder="Share your thoughts about this book..."
            />
          </div>
          <button className="modal-btn" type="submit" disabled={submitting}>
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Modal;
