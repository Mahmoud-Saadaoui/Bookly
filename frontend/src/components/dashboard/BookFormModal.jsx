import React, { useEffect, useState } from "react";
import { InputField, categories, formatDate } from "../utils";
import { FaWindowClose } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updateBookForm } from "../../redux/apiCalls/bookApiCall";

function BookFormModal({ book, setSelectedBook, setBookModal }) {
  const dispatch = useDispatch()

  const [title, setTitle] = useState(book?.title);
  const [description, setDescription] = useState(book?.description);
  const [category, setCategory] = useState(book?.category);
  const [author, setAuthor] = useState(book?.author);
  const [PublicationDate, setPublicationDate] = useState(
    formatDate(book?.PublicationDate)
  );
  const [language, setLanguage] = useState(book?.language);

  const bookFormSubmitHandler = (e) => {
    e.preventDefault()
    dispatch(updateBookForm({ title, description, category, author, PublicationDate }, book.id))
    setBookModal(false)
  }

  useEffect(() => {
    if (book) {
      setTitle(book.title);
      setDescription(book.description);
      setCategory(book.category);
      setAuthor(book.author);
      setPublicationDate(formatDate(book.PublicationDate));
      setLanguage(book.language);
    }
  }, [book]);

  return (
    <div className="book-form-modal">
      <form className="book-form-modal-content" onSubmit={bookFormSubmitHandler}>
        <button
          type="button"
          className="book-image-modal-close-btn"
          onClick={() => {
            setSelectedBook(null);
            setBookModal(false);
          }}
        >
          <FaWindowClose />
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
        <select
          className="create-book-input"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option disabled value="">
            Select A Category
          </option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
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
