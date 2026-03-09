import React from 'react';
import { InputField, categories } from '../../components/utils/index';
import { FaBookMedical } from 'react-icons/fa';

function CreateNewBook({
  fileName,
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
  formSubmitHandler }) {

  return (
    <div className="create-book-page">
      <div className="create-book-header">
        <div className="create-book-header-content">
          <div className="create-book-icon-wrapper">
            <FaBookMedical className="create-book-icon" />
          </div>
          <div className="create-book-header-text">
            <h1 className="create-book-title">Add New Book</h1>
            <p className="create-book-subtitle">Fill in the details below to add a new book to the library</p>
          </div>
        </div>
      </div>

      <form className="create-book-form-full" onSubmit={formSubmitHandler} encType="multipart/form-data">
        <div className="form-grid">
          <div className="form-group">
            <label htmlFor="file" className="image-upload-area">
              <div className="image-upload-content">
                {fileName ? (
                  <>
                    <div className="image-preview-wrapper">
                      <img src={URL.createObjectURL(fileName)} alt="Preview" className="image-preview" />
                      <div className="image-overlay">
                        <span>Change Image</span>
                      </div>
                    </div>
                    <span className="file-name">{fileName.name}</span>
                  </>
                ) : (
                  <>
                    <div className="upload-placeholder">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="17 8 12 3 7 8" />
                        <line x1="12" y1="3" x2="12" y2="15" />
                      </svg>
                      <span>Upload Cover Image</span>
                      <span className="upload-hint">Click or drag and drop</span>
                    </div>
                  </>
                )}
              </div>
            </label>
            <input
              type="file"
              name="file"
              id="file"
              style={{ display: "none" }}
              accept="image/*"
              onChange={(e) => setFileName(e.target.files[0])}
            />
          </div>

          <div className="form-fields-main">
            <div className="form-row">
              <div className="form-group full-width">
                <InputField
                  type="text"
                  placeholder="Book Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <InputField
                  type="text"
                  placeholder="Author"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
              <div className="form-group half-width">
                <select
                  className="create-book-input"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option disabled value="">
                    Select Category
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group half-width">
                <InputField
                  type="text"
                  placeholder="Language"
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                />
              </div>
              <div className="form-group half-width">
                <InputField
                  type="date"
                  placeholder="Publication Date"
                  value={PublicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group full-width">
              <textarea
                className="create-book-textarea"
                rows="4"
                placeholder="Book Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="form-actions">
              <button type="submit" className="create-book-btn-full">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M12 5v14M5 12h14" />
                </svg>
                Create Book
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateNewBook