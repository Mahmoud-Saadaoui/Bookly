import React, { useEffect, useState } from 'react';
import { FaWindowClose } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updateBookImage } from '../../redux/apiCalls/bookApiCall';
import { toast } from 'react-toastify';

function BookImageModal({ book, setFileName, setSelectedBook, setBookImageModal }) {
    const dispatch = useDispatch()

    const [file, setFile] = useState(null)

    const updateImageHandler = (id) => {
        if (!file) return toast.warning("There is no file");

        const formData = new FormData();
        formData.append("image", file);

        dispatch(updateBookImage(formData, id))
        setSelectedBook(null)  
        setBookImageModal(false)
    }
    
    useEffect(() => {
        if (book) {
          setFileName(book?.image.url)
        }
      }, [book, setFileName]);
  return (
    <div className="book-image-modal">
    <div className="book-modal-image-container">
        <button
            type="button"
            className="book-image-modal-close-btn"
            onClick={() => setSelectedBook(null)}
        >
            <FaWindowClose />
        </button>
        <div className="book-image-modal-img-content">
            <img
                className='book-image-modal-image'
                src={file ? URL.createObjectURL(file) : book?.image.url}
                alt="Book"
            />
            <label htmlFor="file-input" className="book-image-modal-img-content-label">
                Upload
            </label>
            <input 
                type="file" 
                id="file-input" 
                style={{ display: "none" }}
                onChange={(e) => setFile(e.target.files[0])} 
            />
            <button
                className="book-image-modal-save-btn"
                type="button"
                onClick={()=>updateImageHandler(book.id)}
            >
                Save
            </button>
        </div>
    </div>
</div>
  )
}

export default BookImageModal