import React, { useState } from "react";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import Rating from "../rating/Rating";
import Pagination from "../pagination/Pagination";
import BookImageModal from "./BookImageModal";
import BookFormModal from "./BookFormModal";

function BooksDashboard({
  books,
  handlePageClick,
  currentPage,
  handleRemoveBook,
  setFileName,
  title,
  setTitle,
  description,
  setDescription,
  category,
  setCategory,
  author,
  setAuthor,
  PublicationDate,
  setPublicationDate,
  language,
  setLanguage,
}) {
  const [bookModal, setBookModal] = useState(false);
  const [bookImageModal, setBookImageModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  return (
    <div className="books-dashboard">
      <div className="books-dashboard-header">
        <h1 className="books-dashboard-title">Book Management</h1>
        <p className="books-dashboard-subtitle">Manage your library collection</p>
      </div>
      <div className="books-dashboard-container">
        {books?.data?.map((book, key) => (
          <div className="book-dashboard-item" key={key}>
            <div className="book-dashboard-item-img-wrapper">
              <img
                src={book?.image?.url}
                alt={book?.image?.publicId}
                className="book-dashboard-item-img"
              />
              <span
                className="book-dashboard-item-img-edit"
                onClick={() => {
                  setSelectedBook(book);
                  setBookImageModal(true);
                }}
              >
                Upload New Image
              </span>
              {selectedBook &&
                selectedBook.id === book?.id &&
                bookImageModal && (
                  <BookImageModal
                    book={book}
                    setFileName={setFileName}
                    setSelectedBook={setSelectedBook}
                    setBookImageModal={setBookImageModal}
                  />
                )}
            </div>
            <h3 className="book-dashboard-item-title">{book?.title}</h3>
            <p className="book-dashboard-item-category">{book?.category}</p>
            <Rating rating={book?.rate} />
            <div className="book-dashboard-icons-wrapper">
              <FaEdit
                className="icon edit-icon"
                onClick={() => {
                  setBookModal(true);
                  setSelectedBook(book);
                }}
              />

              {selectedBook && selectedBook.id === book?.id && bookModal && (
                <BookFormModal
                  setBookModal={setBookModal}
                  setSelectedBook={setSelectedBook}
                  book={book}
                  title={title}
                  setTitle={setTitle}
                  description={description}
                  setDescription={setDescription}
                  category={category}
                  setCategory={setCategory}
                  author={author}
                  setAuthor={setAuthor}
                  PublicationDate={PublicationDate}
                  setPublicationDate={setPublicationDate}
                  language={language}
                  setLanguage={setLanguage}
                />
              )}

              <MdDelete
                className="icon delete-icon"
                onClick={() => handleRemoveBook(book?.id)}
              />
            </div>
          </div>
        ))}
      </div>
      <Pagination
        totalPages={books?.pagination?.pages || 0}
        currentPage={currentPage}
        onPageChange={handlePageClick}
      />
    </div>
  );
}

export default BooksDashboard;
