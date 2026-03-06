import React, { useState, useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchBooks } from '../../redux/services/bookApiCalls';
import { Oval } from 'react-loader-spinner';
import '../../styles/books-page.css';

// Components
import BookCard from '../../components/books/BookCard';
import Pagination from '../../components/pagination/Pagination';

function BooksPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { books, loading } = useSelector((state) => state.book);
  const { user } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch books when page changes
  const loadBooks = useCallback((page) => {
    dispatch(fetchBooks(page));
  }, [dispatch]);

  // Handle page change with scroll to top
  const handlePageClick = useCallback(({ selected }) => {
    setCurrentPage(selected);
    loadBooks(selected);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [loadBooks]);

  // Fetch initial data
  React.useEffect(() => {
    loadBooks(currentPage);
  }, [loadBooks, currentPage]);

  // Get all unique categories from current page books
  const categories = useMemo(() => {
    if (!books) return ['All'];
    const cats = ['All'];
    const booksArray = Array.isArray(books) ? books : (books.data || []);
    booksArray.forEach(book => {
      if (book.category && !cats.includes(book.category)) {
        cats.push(book.category);
      }
    });
    return cats;
  }, [books]);

  // Filter books based on search and category
  const filteredBooks = useMemo(() => {
    if (!books) return [];

    let result = Array.isArray(books) ? books : (books.data || []);

    // Filter by search query
    if (debouncedSearch) {
      const query = debouncedSearch.toLowerCase();
      result = result.filter(book =>
        book.title?.toLowerCase().includes(query) ||
        book.author?.toLowerCase().includes(query) ||
        book.category?.toLowerCase().includes(query)
      );
    }

    // Filter by category
    if (selectedCategory !== 'All') {
      result = result.filter(book => book.category === selectedCategory);
    }

    return result;
  }, [books, debouncedSearch, selectedCategory]);

  const handleBookClick = useCallback((bookId) => {
    if (user) {
      navigate(`/books/${bookId}`);
    } else {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    setCurrentPage(0);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setCurrentPage(0);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setDebouncedSearch('');
    setSelectedCategory('All');
    setCurrentPage(0);
  }, []);

  // Get total pages from pagination metadata
  const totalPages = books?.pagination?.pages || 0;

  // Get total count from pagination metadata
  const totalCount = books?.pagination?.count || 0;

  if (loading && !books) {
    return (
      <div className="books-page-container">
        <div className="loading-container" role="status" aria-live="polite">
          <Oval
            height={80}
            width={80}
            color="#F97316"
            wrapperStyle={{
              height: "50vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            wrapperClass=""
            visible={true}
            ariaLabel="Loading books"
          />
          <p className="loading-text">Loading books...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="books-page-container">
      {/* Page Header */}
      <section className="books-page-header" aria-labelledby="books-page-title">
        <div className="books-page-header-content">
          <h1 id="books-page-title" className="books-page-title">
            <span className="books-page-icon">📚</span>
            Browse Books
          </h1>
          <p className="books-page-subtitle">
            Explore our collection of {totalCount > 0 ? `${totalCount.toLocaleString()}` : ''} books across various genres
          </p>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="books-page-filters" aria-label="Search and filter books">
        <div className="search-container">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="search-input"
            placeholder="Search by title, author, or category..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            aria-label="Search books"
          />
          {searchQuery && (
            <button
              className="search-clear-button"
              onClick={() => handleSearch('')}
              aria-label="Clear search"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="category-pills" role="tablist" aria-label="Filter by category">
          <button
            className={`category-pill ${selectedCategory === 'All' ? 'active' : ''}`}
            onClick={() => handleCategoryChange('All')}
            role="tab"
            aria-selected={selectedCategory === 'All'}
          >
            <span className="category-pill-icon">🏠</span>
            All Books
          </button>
          {categories.filter(cat => cat !== 'All').map((category) => (
            <button
              key={category}
              className={`category-pill ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => handleCategoryChange(category)}
              role="tab"
              aria-selected={selectedCategory === category}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Active Filters Display */}
        {(searchQuery || selectedCategory !== 'All') && (
          <div className="active-filters">
            <span className="active-filters-label">Active filters:</span>
            {searchQuery && (
              <span className="active-filter-tag">
                Search: "{searchQuery}"
                <button
                  className="filter-remove-button"
                  onClick={() => handleSearch('')}
                  aria-label="Remove search filter"
                >
                  ✕
                </button>
              </span>
            )}
            {selectedCategory !== 'All' && (
              <span className="active-filter-tag">
                Category: {selectedCategory}
                <button
                  className="filter-remove-button"
                  onClick={() => handleCategoryChange('All')}
                  aria-label="Remove category filter"
                >
                  ✕
                </button>
              </span>
            )}
            <button
              className="clear-all-filters-button"
              onClick={handleClearFilters}
            >
              Clear All
            </button>
          </div>
        )}
      </section>

      {/* Results Info */}
      <section className="results-info" aria-label="Results information">
        <div className="results-count">
          Showing <strong>{filteredBooks.length}</strong> book{filteredBooks.length !== 1 ? 's' : ''}
          {selectedCategory !== 'All' && <span> in <strong>{selectedCategory}</strong></span>}
          {searchQuery && <span> matching "<strong>{searchQuery}</strong>"</span>}
        </div>
      </section>

      {/* Books Grid */}
      <section className="books-section" aria-label="Books list">
        {filteredBooks.length === 0 && !loading ? (
          <div className="empty-state" role="status">
            <div className="empty-icon">📚</div>
            <h2>No books found</h2>
            <p>Try adjusting your search or filter to find what you're looking for.</p>
            {(searchQuery || selectedCategory !== 'All') && (
              <button
                className="clear-filters-button"
                onClick={handleClearFilters}
              >
                Clear All Filters
              </button>
            )}
          </div>
        ) : (
          <div className="books-grid" id="books-grid" role="tabpanel">
            {filteredBooks.map((book, index) => (
              <div
                key={book.id}
                className="animate-fade-in-up"
                style={{ animationDelay: `${Math.min(index * 50, 300)}ms` }}
              >
                <BookCard
                  book={book}
                  onClick={() => handleBookClick(book.id)}
                />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Pagination */}
      {totalPages > 1 && !loading && (
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageClick}
        />
      )}

      {/* Loading Overlay for page changes */}
      {loading && books && (
        <div className="loading-overlay" role="status" aria-live="polite">
          <Oval
            height={50}
            width={50}
            color="#F97316"
            visible={true}
            ariaLabel="Loading more books"
          />
        </div>
      )}
    </div>
  );
}

export default BooksPage;
