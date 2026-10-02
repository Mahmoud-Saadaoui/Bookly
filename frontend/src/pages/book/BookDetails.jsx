import React, { useEffect, useState, useMemo } from "react";
import "./book-details.css";
import Rating from "../../components/rating/Rating";
import { useParams } from "react-router-dom";
import {
  fetchSingleBook,
  getBookReviews,
} from "../../redux/apiCalls/bookApiCall";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import moment from "moment";
import Modal from "../../components/book-details/Modal";
import Reviews from "../../components/book-details/Reviews";
import { postToFavorites } from "../../redux/apiCalls/favoritesApiCall";
import LoanButton from "../../components/loan/LoanButton";

function BookDetails() {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { bookId } = useParams();
  const { selectedBook, loading, reviews, reviewsLoading } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth);

  // Check if user has already reviewed this book
  const hasUserReviewed = useMemo(() => {
    if (!user) return false;
    const userId = String(user.id || user._id || '');
    return reviews.data.some((review) => {
      const reviewUserId = review.user?.id || review.user?._id || review.user;
      return String(reviewUserId || '') === userId;
    });
  }, [user, reviews]);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const addToFavorites = (id) => {
    dispatch(postToFavorites(id));
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchSingleBook(bookId));
  }, [dispatch, bookId]);


  useEffect(() => {
    if (bookId) {
      dispatch(getBookReviews(bookId));
    }
  }, [dispatch, bookId]);

  if (loading && !selectedBook) {
    return (
      <Oval
        height={120}
        width={120}
        color="var(--color-brand)"
        wrapperStyle={{
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#E2E2E2"
        strokeWidth={3}
        strokeWidthSecondary={3}
      />
    );
  }

  return (
    <div className="book-details">
      <div className="book-details-top">
        <div className="book-details-top-img">
          <img src={selectedBook?.image?.url} alt={`Cover of ${selectedBook?.title || 'book'}`} />
        </div>
        <div className="book-details-top-info">
          <h1>{selectedBook?.title}</h1>
          <Rating rating={selectedBook?.rate} />
          <h3>{selectedBook?.category}</h3>
          <h3>{selectedBook?.author}</h3>
          <h3>{selectedBook?.language}</h3>
          <p>
            <span>{`Published at: `}</span>{" "}
            {selectedBook?.PublicationDate && moment(selectedBook.PublicationDate).isValid()
              ? moment(selectedBook.PublicationDate).format("DD MMM YYYY")
              : "Not specified"}
          </p>
          <p className="description">
            <span>{`Description: `}</span>
            {selectedBook?.description}
          </p>
        </div>
      </div>

      <div className="btns">
        <div className="favorite-btn">
          <button type="button" onClick={() => addToFavorites(selectedBook?.id)}>Add To Favorites</button>
        </div>
        <div className="review-btn">
          <button
            type="button"
            onClick={() => handleOpenModal()}
            disabled={hasUserReviewed}
            title={hasUserReviewed ? "You have already reviewed this book" : "Add a review"}
            style={{
              opacity: hasUserReviewed ? 0.5 : 1,
              cursor: hasUserReviewed ? "not-allowed" : "pointer"
            }}
          >
            {hasUserReviewed ? "Reviewed" : "Add Review"}
          </button>
        </div>
      </div>

      <div className="loan-section">
        <LoanButton bookId={selectedBook?.id} isAuthenticated={!!user} />
      </div>

      <div className="book-details-reviews">
        <Reviews bookId={bookId} reviews={reviews} loading={reviewsLoading} />
      </div>
      <Modal
        showModal={showModal}
        handleClose={handleCloseModal}
        book={bookId}
      />
    </div>
  );
}

export default BookDetails;
