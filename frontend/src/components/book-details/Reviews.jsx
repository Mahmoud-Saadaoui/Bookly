import moment from "moment";
import React from "react";
import Rating from "../rating/Rating";
import { Oval } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { getBookReviews } from "../../redux/apiCalls/bookApiCall";

function Reviews({ bookId, reviews, loading }) {
  const dispatch = useDispatch();
  const reviewsArray = reviews?.data || [];
  const pagination = reviews?.pagination;
  const hasMoreReviews = pagination?.page < pagination?.pages;

  return (
    <div className="get-reviews">
      <h2 className="get-reviews-title">
        Reviews ({pagination?.total || reviewsArray.length})
      </h2>
      <div className="reviews">
        {loading ? (
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
        ) : reviewsArray.length === 0 ? (
          <div className="no-reviews">
            <p>No reviews yet. Be the first to review this book!</p>
          </div>
        ) : (
          <>
             {reviewsArray.map((el, key) => (
               <div className="user-review" key={el.id || el._id || `${el.user}-${key}`}>
                <p>
                  <span>{el?.username ? el?.username : "Unknown User"}</span>{" "}
                  {`-  `}
                  {el?.createdAt && moment(el.createdAt).isValid()
                    ? moment(el.createdAt).format("DD MMM YYYY")
                    : "Recently"}
                </p>
                <Rating rating={el?.rate} />
                 <p>{el?.comment || "No comment provided"}</p>
              </div>
            ))}

            {hasMoreReviews && (
              <button
                className="show-more-reviews-btn"
                onClick={() => dispatch(getBookReviews(bookId, pagination.page + 1, true))}
                disabled={loading}
              >
                {loading ? "Loading..." : "Load more reviews"}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default Reviews;
