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
  const { books, loading, reviews } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth);

  // Check if user has already reviewed this book
  const hasUserReviewed = useMemo(() => {
    if (!user || !reviews) return false;
    // Handle both array and object with data property
    const reviewsArray = Array.isArray(reviews) ? reviews : (reviews?.data || []);
    return reviewsArray.some(review => review.user === user.id || review.user === user._id);
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

  if (loading) {
    return (
      <Oval
        height={120}
        width={120}
        color="rgb(247, 96, 14)"
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
          <img src={books?.image?.url} alt={books?.image?.publicId || books?.title} />
        </div>
        <div className="book-details-top-info">
          <h1>{books?.title}</h1>
          <Rating rating={books?.rate} />
          <h3>{books?.category}</h3>
          <h3>{books?.author}</h3>
          <h3>{books?.language}</h3>
          <p>
            <span>{`Published at: `}</span>{" "}
            {moment(books?.PublicationDate).format("DD MMM YYYY")}
          </p>
          <p className="description">
            <span>{`Description: `}</span>
            {books?.description}
          </p>
        </div>
      </div>

      <div className="btns">
        <div className="favorite-btn">
          <button type="button" onClick={() => addToFavorites(books?.id)}>Add To Favorites</button>
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
        <LoanButton bookId={books?.id} isAuthenticated={!!user} />
      </div>

      <div className="book-details-reviews">
        <Reviews book={bookId}/>
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
