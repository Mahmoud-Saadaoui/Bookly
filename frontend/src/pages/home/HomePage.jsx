import React, { useEffect, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../../redux/services/bookApiCalls';
import { Oval } from 'react-loader-spinner';
import '../../styles/home.css';

// Components
import BookCard from '../../components/books/BookCard';
import { postToFavorites } from '../../redux/apiCalls/favoritesApiCall';

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { books, loading } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth);

  // Fetch all books for featured section
  useEffect(() => {
    dispatch(fetchBooks(1, { limit: 10 }));
  }, [dispatch]);

  // Select up to three highly rated books from the loaded collection.
  const featuredBooks = useMemo(() => {
    const booksArray = books.data;
    if (booksArray.length === 0) return [];

    // The books endpoint returns the current collection page; rank that page locally.
    const sortedBooks = [...booksArray].sort((a, b) => (b.rate || 0) - (a.rate || 0));
    const seenCategories = new Set();
    const featured = [];

    for (const book of sortedBooks) {
      if (book.category && !seenCategories.has(book.category)) {
        seenCategories.add(book.category);
        featured.push(book);
        if (featured.length >= 3) break;
      }
    }

    return featured;
  }, [books.data]);

  const handleBookClick = useCallback((bookId) => {
    if (user) {
      navigate(`/books/${bookId}`);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleBrowseBooks = useCallback((category) => {
    navigate(category ? `/books?category=${encodeURIComponent(category)}` : '/books');
  }, [navigate]);

  const handleFavorite = useCallback((bookId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    dispatch(postToFavorites(bookId));
  }, [dispatch, navigate, user]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span className="hero-badge-icon">📚</span>
            <span>Find your next book</span>
          </div>

          {/* Title */}
          <h1 id="hero-title" className="hero-title">
            Discover Your Next <span className="gradient-text">Great Read</span>
          </h1>

          {/* Description */}
          <p className="hero-description">
            Browse, borrow, and manage your reading list with our modern library platform.
            Explore the collection and check availability before borrowing.
          </p>

          {/* CTA Buttons */}
          <div className="hero-buttons">
            <button className="hero-button primary" onClick={handleBrowseBooks}>
              Browse All Books
            </button>
            <button className="hero-button secondary" onClick={handleBrowseBooks}>
              Explore Categories
            </button>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="stat-item">
              <span className="stat-number">{books.pagination?.total || 0}</span>
              <span className="stat-label">Books</span>
            </div>
          </div>
        </div>

        {/* Visual with Floating Books */}
        <div className="hero-visual" aria-hidden="true">
          <span className="floating-book book-1" role="img" aria-label="Book">📖</span>
          <span className="floating-book book-2" role="img" aria-label="Books stack">📚</span>
          <span className="floating-book book-3" role="img" aria-label="Book">📕</span>

          {/* Floating Book Cards */}
          <div className="floating-card card-1">
            <div className="floating-card-cover"></div>
            <div className="floating-card-title">The Great Adventure</div>
            <div className="floating-card-author">John Smith</div>
          </div>
          <div className="floating-card card-2">
            <div className="floating-card-cover floating-card-cover-accent"></div>
            <div className="floating-card-title">Mystery Tales</div>
            <div className="floating-card-author">Jane Doe</div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-section" aria-label="Featured books">
        <div className="featured-header">
          <h2 className="featured-title">Featured Books</h2>
           <p className="featured-subtitle">A selection from our collection</p>
          <button className="browse-all-button" onClick={handleBrowseBooks}>
            Browse All Books →
          </button>
        </div>

        {loading ? (
          <div className="featured-loading" role="status" aria-live="polite">
            <Oval
              height={60}
              width={60}
              color="var(--color-brand)"
              wrapperStyle={{
                height: "200px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              wrapperClass=""
              visible={true}
              ariaLabel="Loading featured books"
            />
          </div>
        ) : featuredBooks.length > 0 ? (
          <div className="featured-grid">
            {featuredBooks.map((book, index) => (
              <div
                key={book.id}
                className="featured-book-card animate-fade-in-up"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <BookCard
                  book={book}
                  onClick={() => handleBookClick(book.id)}
                  onFavorite={handleFavorite}
                  featured
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-featured" role="status">
            <div className="empty-icon">📚</div>
            <h2>No featured books available</h2>
            <p>Check back later for new additions to our collection.</p>
          </div>
        )}
      </section>

    </div>
  );
}

export default HomePage;
