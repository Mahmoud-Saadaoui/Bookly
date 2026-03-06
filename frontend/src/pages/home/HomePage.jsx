import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../../redux/services/bookApiCalls';
import { Oval } from 'react-loader-spinner';
import '../../styles/home.css';

// Components
import BookCard from '../../components/books/BookCard';

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { books, loading } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth);

  // Fetch all books for featured section
  const [allBooks, setAllBooks] = useState([]);
  const [featuredLoading, setFeaturedLoading] = useState(true);

  // Fetch initial data
  React.useEffect(() => {
    const fetchAllBooks = async () => {
      setFeaturedLoading(true);
      try {
        // Fetch first few pages to get enough books for featured selection
        const promises = [];
        for (let i = 0; i < 3; i++) {
          promises.push(dispatch(fetchBooks(i)));
        }
        await Promise.all(promises);
        // After fetching, we'll have books in the state
      } catch (error) {
        console.error('Error fetching books:', error);
      } finally {
        setFeaturedLoading(false);
      }
    };
    fetchAllBooks();
  }, [dispatch]);

  // Get top 3 rated books from different categories
  const featuredBooks = useMemo(() => {
    if (!books) return [];

    const booksArray = Array.isArray(books) ? books : (books.data || []);
    if (booksArray.length === 0) return [];

    // Sort by rating and get unique categories
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
  }, [books]);

  const handleBookClick = useCallback((bookId) => {
    if (user) {
      navigate(`/books/${bookId}`);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleBrowseBooks = useCallback(() => {
    navigate('/books');
  }, [navigate]);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section" aria-labelledby="hero-title">
        <div className="hero-content">
          {/* Badge */}
          <div className="hero-badge">
            <span className="hero-badge-icon">📚</span>
            <span>Over 10,000+ Books Available</span>
          </div>

          {/* Title */}
          <h1 id="hero-title" className="hero-title">
            Discover Your Next <span className="gradient-text">Great Read</span>
          </h1>

          {/* Description */}
          <p className="hero-description">
            Browse, borrow, and manage your reading list with our modern library platform.
            Explore thousands of titles across all genres.
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
              <span className="stat-number">10K+</span>
              <span className="stat-label">Books</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">5K+</span>
              <span className="stat-label">Users</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">50+</span>
              <span className="stat-label">Categories</span>
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
            <div className="floating-card-cover" style={{background: 'linear-gradient(135deg, #F97316, #EC4899)'}}></div>
            <div className="floating-card-title">Mystery Tales</div>
            <div className="floating-card-author">Jane Doe</div>
          </div>
        </div>
      </section>

      {/* Featured Books Section */}
      <section className="featured-section" aria-label="Featured books">
        <div className="featured-header">
          <h2 className="featured-title">Featured Books</h2>
          <p className="featured-subtitle">Top-rated books from different categories</p>
          <button className="browse-all-button" onClick={handleBrowseBooks}>
            Browse All Books →
          </button>
        </div>

        {featuredLoading ? (
          <div className="featured-loading" role="status" aria-live="polite">
            <Oval
              height={60}
              width={60}
              color="#F97316"
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

      {/* Categories Preview */}
      <section className="categories-preview-section" aria-label="Browse by category">
        <div className="categories-preview-header">
          <h2 className="categories-preview-title">Browse by Category</h2>
          <button className="browse-all-button" onClick={handleBrowseBooks}>
            View All Categories →
          </button>
        </div>

        <div className="categories-preview-grid">
          {[
            { name: 'Fiction', icon: '✨', color: 'from-purple-500 to-indigo-500' },
            { name: 'Mystery', icon: '🔍', color: 'from-amber-500 to-orange-500' },
            { name: 'Romance', icon: '💕', color: 'from-pink-500 to-rose-500' },
            { name: 'Science Fiction', icon: '🚀', color: 'from-blue-500 to-cyan-500' },
            { name: 'Fantasy', icon: '🐉', color: 'from-emerald-500 to-teal-500' },
            { name: 'Historical Fiction', icon: '📜', color: 'from-yellow-500 to-amber-500' },
          ].map((category) => (
            <button
              key={category.name}
              className="category-preview-card"
              onClick={handleBrowseBooks}
            >
              <div className={`category-preview-icon ${category.color}`}>
                {category.icon}
              </div>
              <span className="category-preview-name">{category.name}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}

export default HomePage;
