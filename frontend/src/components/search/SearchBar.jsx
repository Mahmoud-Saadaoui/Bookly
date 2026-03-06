import React, { useState } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import '../../styles/search-bar.css';

function SearchBar({ onSearch, placeholder = "Search..." }) {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, 300);

  React.useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <div className="search-input-wrapper">
        <label htmlFor="search-input" className="visually-hidden">
          Search books
        </label>
        <input
          id="search-input"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="search-input"
          aria-label="Search books"
        />
        {value && (
          <button
            type="button"
            className="search-clear-button"
            onClick={handleClear}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
        <button
          type="submit"
          className="search-submit-button"
          aria-label="Submit search"
        >
          <span aria-hidden="true">🔍</span>
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
