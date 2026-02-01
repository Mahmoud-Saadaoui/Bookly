import React, { useEffect, useState } from "react";
import "./book.css";
import Rating from "../../componenents/rating/Rating";
import { useParams } from "react-router-dom";
import {
  fetchSingleBook,
  getBookReviews,
} from "../../redux/apiCalls/bookApiCall";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import moment from "moment";
import Modal from "../../componenents/book-details/Modal";
import Reviews from "../../componenents/book-details/Reviews";
import { postToFavorites } from "../../redux/apiCalls/favoritesApiCall";
import LoanButton from "../../componenents/loan/LoanButton";

function BookDetails() {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const { book } = useParams();
  const { books, loading } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const addToFavorites = (id) => {
    dispatch(postToFavorites(id))
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(fetchSingleBook(book));
  }, [dispatch, book]);

  
  useEffect(() => {
    if (book) {
      dispatch(getBookReviews(book));
    }
  }, [dispatch, book]);

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
          <img src={books?.image?.url} alt={books?.image?.publicId} />
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
          <button type="button" onClick={handleOpenModal}>
            Add Review
          </button>
        </div>
      </div>

      <div className="loan-section">
        <LoanButton bookId={books?._id} isAuthenticated={!!user} />
      </div>

      <div className="book-details-reviews">
        <Reviews book={book}/>
      </div>
      <Modal
        showModal={showModal}
        handleClose={handleCloseModal}
        book={book}
      />
    </div>
  );
}

export default BookDetails;
