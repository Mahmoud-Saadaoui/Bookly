import React, { useState } from "react";
import "./book-details.css";
import { useDispatch } from "react-redux";
import { fetchSingleBook, postReview } from "../../redux/apiCalls/bookApiCall";
import { toast } from "react-toastify";

const Modal = ({ showModal, handleClose, book }) => {
  const [rate, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const dispatch = useDispatch();

  const submitReview = async (e) => {
    e.preventDefault();
    if (comment === "") {
      return toast.error("Comment is required");
    }
    if (rate === 0) {
      return toast.error("Please select a rating");
    }

    setSubmitting(true);
    try {
      await dispatch(postReview(book, { rate, comment }));
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
    <div className={`modal ${showModal ? "show" : ""}`}>
      <div className="modal-content">
        <span className="close" onClick={handleClose}>
          &times;
        </span>
        <h2>Submit Your Review</h2>
        <form onSubmit={submitReview}>
          <div className="rating-input">
            <label>Rating:</label>
            <select
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
            <label>Comment:</label>
            <textarea
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
