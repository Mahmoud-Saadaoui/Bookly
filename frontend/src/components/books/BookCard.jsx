import React from 'react';
import { useState } from 'react';
import './book-card.css';

function BookCard({ book, onClick }) {
  const [imageError, setImageError] = useState(false);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const bookRating = book.rate ? book.rate.toFixed(1) : 'No rating';
  const isAvailable = true; // You can determine this from book data

  return (
    <article
      className="book-card"
      onClick={onClick}
      onKeyPress={handleKeyPress}
      tabIndex={0}
      role="button"
      aria-label={`View details for ${book.title} by ${book.author}`}
    >
      <div className="book-card-image">
        {imageError ? (
          <div className="book-image-placeholder">
            <span>📖</span>
          </div>
        ) : (
          <img
            src={book.image?.url || '/placeholder-book.png'}
            alt={`Cover of ${book.title}`}
            className="book-image"
            loading="lazy"
            onError={() => setImageError(true)}
          />
        )}

        {/* Badge */}
        <span className="book-badge">{book.category}</span>

        {/* Rating Badge */}
        {book.rate && (
          <div className="book-rating-badge" aria-label={`Rating: ${bookRating}`}>
            <span className="rating-star">⭐</span>
            <span>{bookRating}</span>
          </div>
        )}

        {/* Hover Overlay */}
        <div className="book-card-overlay">
          <div className="quick-actions">
            <button className="quick-action-btn primary">
              Quick View
            </button>
            <button
              className="quick-action-btn"
              aria-label="Add to favorites"
            >
              ❤️
            </button>
          </div>
        </div>
      </div>

      <div className="book-card-content">
        {/* Rating */}
        {book.rate && (
          <div className="book-card-rating">
            <span className="rating-stars">
              {'★'.repeat(Math.round(book.rate))}
              {'☆'.repeat(5 - Math.round(book.rate))}
            </span>
            <span className="rating-count">({bookRating})</span>
          </div>
        )}

        {/* Title */}
        <h3 className="book-title">{book.title}</h3>

        {/* Author */}
        <p className="book-author">by {book.author}</p>

        {/* Meta */}
        <div className="book-meta">
          {book.language && (
            <span className="meta-item" aria-label={`Language: ${book.language}`}>
              🌐 {book.language}
            </span>
          )}
        </div>

        {/* Footer */}
        <div className="book-card-footer">
          <div className="availability-status">
            <span className={`status-dot ${isAvailable ? 'available' : 'unavailable'}`}></span>
            <span className={`status-text ${isAvailable ? 'available' : ''}`}>
              {isAvailable ? 'Available' : 'Borrowed'}
            </span>
          </div>
          <button className="borrow-btn">Borrow</button>
        </div>
      </div>
    </article>
  );
}

export default BookCard;
