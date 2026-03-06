import React from 'react';
import '../../styles/category-filter.css';

function CategoryFilter({ categories, selectedCategory, onCategoryChange }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="category-filter">
      <label htmlFor="category-select" className="filter-label">
        Category:
      </label>
      <div className="custom-select-wrapper">
        <button
          type="button"
          className="custom-select-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <span>{selectedCategory}</span>
          <span className={`select-arrow ${isOpen ? 'open' : ''}`} aria-hidden="true">
            ▼
          </span>
        </button>

        {isOpen && (
          <ul
            className="custom-select-options"
            role="listbox"
            aria-label="Select category"
          >
            {categories.map((category) => (
              <li
                key={category}
                className={`custom-select-option ${category === selectedCategory ? 'selected' : ''}`}
                onClick={() => {
                  onCategoryChange(category);
                  setIsOpen(false);
                }}
                role="option"
                aria-selected={category === selectedCategory}
              >
                {category}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default CategoryFilter;
