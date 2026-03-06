import React from 'react';
import { InputField, categories } from '../../components/utils/index';

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
    <div className="create-book-container">
      <h1 className="create-book-title">Add New Book</h1>
      <form className="create-book-form" onSubmit={formSubmitHandler} encType="multipart/form-data">
        <label htmlFor="file" className="image-label">
          {fileName ? (
            <span className="file-name">{fileName.name}</span>
          ) : (
            "Select new image"
          )}
        </label>
        <input
          type="file"
          name="file"
          id="file"
          style={{ display: "none" }}
          onChange={(e) => setFileName(e.target.files[0])}
        />
        <InputField
          type="text"
          placeholder="Book Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
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
        <InputField
          type="text"
          placeholder="Author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
        />
        <InputField
          type="text"
          placeholder="Language"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        />
        <InputField
          type="date"
          placeholder="Published at"
          value={PublicationDate}
          onChange={(e) => setPublicationDate(e.target.value)}
        />
        <textarea
          className="create-book-textarea"
          rows="5"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>
        <button type="submit" className="create-book-btn">
          Create
        </button>
      </form>
    </div>
  );
}

export default CreateNewBook