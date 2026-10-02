import React, { useEffect, useState } from "react";
import { InputField, formatDate } from "../utils";
import { FaWindowClose } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updateBookForm } from "../../redux/apiCalls/bookApiCall";

function BookFormModal({ book, setSelectedBook, setBookModal }) {
  const dispatch = useDispatch();

  const [title, setTitle] = useState(book?.title || "");
  const [description, setDescription] = useState(book?.description || "");
  const [category, setCategory] = useState(book?.category || "");
  const [author, setAuthor] = useState(book?.author || "");
  const [PublicationDate, setPublicationDate] = useState(
    formatDate(book?.PublicationDate)
  );
  const [language, setLanguage] = useState(book?.language || "");

  const bookFormSubmitHandler = async (e) => {
    e.preventDefault();

    try {
      await dispatch(updateBookForm({
        title,
        description,
        category,
        author,
        language,
        ...(PublicationDate ? { PublicationDate } : {}),
      }, book.id));
      setSelectedBook(null);
      setBookModal(false);
    } catch {
      // The API thunk already displays the actionable error.
    }
  };

  const closeFormModal = () => {
    setSelectedBook(null);
    setBookModal(false);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeFormModal();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  });

  useEffect(() => {
    if (book) {
       setTitle(book.title || "");
       setDescription(book.description || "");
       setCategory(book.category || "");
       setAuthor(book.author || "");
       setPublicationDate(formatDate(book.PublicationDate));
       setLanguage(book.language || "");
    }
  }, [book]);

  return (
    <div className="book-form-modal show" role="dialog" aria-modal="true" aria-label="Edit book">
      <form className="book-form-modal-content" onSubmit={bookFormSubmitHandler}>
        <button
          type="button"
          className="book-image-modal-close-btn"
          aria-label="Close edit dialog"
          onClick={closeFormModal}
        >
          <FaWindowClose aria-hidden="true" />
        </button>
        <InputField
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <InputField
          type="text"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <InputField
          type="text"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <InputField
          type="date"
          value={PublicationDate}
          onChange={(e) => setPublicationDate(e.target.value)}
        />
         <InputField
           type="text"
           placeholder="Category"
           value={category}
           onChange={(e) => setCategory(e.target.value)}
         />
        <textarea
          className="create-book-textarea"
          rows="5"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button type="submit" className="create-book-btn">
          Save
        </button>
      </form>
    </div>
  );
}

export default BookFormModal;
