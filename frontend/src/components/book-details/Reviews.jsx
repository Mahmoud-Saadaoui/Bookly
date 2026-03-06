import moment from "moment";
import React, { useState, useMemo } from "react";
import Rating from "../rating/Rating";
import { Oval } from "react-loader-spinner";
import { useSelector } from "react-redux";

function Reviews() {
  const { loading, reviews } = useSelector((state) => state.book);
  const [showAll, setShowAll] = useState(false);

  // Handle reviews data structure (could be array or object with data property)
  const reviewsArray = useMemo(() => {
    if (!reviews) return [];
    return Array.isArray(reviews) ? reviews : (reviews.data || []);
  }, [reviews]);

  // Number of reviews to show initially
  const INITIAL_REVIEWS = 5;

  // Reviews to display
  const displayedReviews = showAll ? reviewsArray : reviewsArray.slice(0, INITIAL_REVIEWS);

  // Check if there are more reviews to show
  const hasMoreReviews = reviewsArray.length > INITIAL_REVIEWS;

  // Toggle show more/less
  const toggleShowAll = () => {
    setShowAll(!showAll);
  };

  return (
    <div className="get-reviews">
      <h2 className="get-reviews-title">
        Reviews ({reviewsArray.length})
      </h2>
      <div className="reviews">
        {loading ? (
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
        ) : displayedReviews.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this book!</p>
          </div>
        ) : (
          <>
            {displayedReviews.map((el, key) => (
              <div className="user-review" key={key}>
                <p>
                  <span>{el?.username ? el?.username : "Unknown User"}</span>{" "}
                  {`-  `}
                  {moment(el?.createdAt).format("DD MMM YYYY")}
                </p>
                <Rating rating={el?.rate} />
                <p>{el?.comment}</p>
              </div>
            ))}

            {hasMoreReviews && (
              <button
                className="show-more-reviews-btn"
                onClick={toggleShowAll}
              >
                {showAll
                  ? `Show less (-${reviewsArray.length - INITIAL_REVIEWS})`
                  : `Show ${reviewsArray.length - INITIAL_REVIEWS} more reviews`
                }
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Reviews;
