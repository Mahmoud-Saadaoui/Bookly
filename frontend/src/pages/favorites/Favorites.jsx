import React, { useEffect } from "react";
import "./favorites.css";
import Rating from "../../components/rating/Rating";
import { MdFavorite } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  getFavorites,
  removeFromFavorites,
} from "../../redux/apiCalls/favoritesApiCall";
import { Oval } from "react-loader-spinner";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

function Favorites() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { favoriteList, loading } = useSelector((state) => state.favorites);

  const handleRemove = (id) => {
    swal({
      title: "Are you sure?",
      text: "By clicking the OK button, you will remove this book from your list of favorites!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        dispatch(removeFromFavorites(id)).then(() => {
          // Don't navigate away - just refresh favorites
          dispatch(getFavorites());
        });
      }
    });
  };

  useEffect(() => {
    dispatch(getFavorites());
  }, [dispatch]);

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

  // Handle both array and object structures
  const favoritesArray = Array.isArray(favoriteList) ? favoriteList : [];

  return (
    <div className="favorites">
      {favoritesArray.length === 0 ? (
        <h1 className="empty">Your list of favorites is empty!!</h1>
      ) : (
        favoritesArray.map((el, key) => (
          <div className="book-item" key={key}>
            <img
              src={el?.book?.image?.url}
              alt={el?.book?.image?.publicId}
              className="book-item-img"
            />
            <h3 className="book-item-title">{el?.book?.title}</h3>
            <p className="book-item-category">{el?.book?.category}</p>
            <Rating rating={el?.book?.rate} />
            <div className="book-icons-wrapper">
              <MdFavorite onClick={() => handleRemove(el?.book?.id)} />
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default Favorites;
