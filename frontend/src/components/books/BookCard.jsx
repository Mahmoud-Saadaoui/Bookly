import React from 'react';
import { useState } from 'react';
import './book-card.css';

function BookCard({ book, onClick, onFavorite }) {
  const [imageError, setImageError] = useState(false);

  const bookRating = book.rate ? book.rate.toFixed(1) : 'No rating';
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <article
      className="book-card"
      onClick={onClick}
      onKeyDown={handleKeyDown}
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
            <button
              type="button"
              className="quick-action-btn primary"
              onClick={(event) => {
                event.stopPropagation();
                onClick();
              }}
            >
              Quick View
            </button>
            <button
              type="button"
              className="quick-action-btn"
              aria-label="Add to favorites"
              onClick={(event) => {
                event.stopPropagation();
                onFavorite?.(book.id);
              }}
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
            <span className="status-text">Check availability</span>
          </div>
          <button
            type="button"
            className="borrow-btn"
            onClick={(event) => {
              event.stopPropagation();
              onClick();
            }}
          >
            Borrow
          </button>
        </div>
      </div>
    </article>
  );
}

export default BookCard;
