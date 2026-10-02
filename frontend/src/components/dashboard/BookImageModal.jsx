import React, { useEffect, useState } from 'react';
import { FaWindowClose } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { updateBookImage } from '../../redux/apiCalls/bookApiCall';
import { toast } from 'react-toastify';

function BookImageModal({ book, setSelectedBook, setBookImageModal }) {
    const dispatch = useDispatch();
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(book?.image?.url || '');

    const closeImageModal = () => {
        setSelectedBook(null);
        setBookImageModal(false);
    };

    useEffect(() => {
        if (!file) {
            setPreviewUrl(book?.image?.url || '');
            return undefined;
        }

        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [book, file]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") closeImageModal();
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    });

    const updateImageHandler = async () => {
        if (!file) {
            toast.warning("There is no file");
            return;
        }

        if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(file.type)) {
            toast.error("Only JPEG, PNG, GIF and WebP images are allowed");
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image must not exceed 5 MB");
            return;
        }

        const formData = new FormData();
        formData.append("image", file);

        try {
            await dispatch(updateBookImage(formData, book.id));
            closeImageModal();
        } catch {
            // The API thunk already displays the actionable error.
        }
    };

    return (
        <div className="book-image-modal show" role="dialog" aria-modal="true" aria-label="Update book image">
            <div className="book-modal-image-container">
                <button
                    type="button"
                    className="book-image-modal-close-btn"
                    aria-label="Close image dialog"
                    onClick={closeImageModal}
                >
                    <FaWindowClose aria-hidden="true" />
                </button>
                <div className="book-image-modal-img-content">
                    <img
                        className='book-image-modal-image'
                        src={previewUrl}
                        alt={`Cover of ${book?.title || 'book'}`}
                    />
                    <label htmlFor="file-input" className="book-image-modal-img-content-label">
                        Upload
                    </label>
                    <input
                        type="file"
                        id="file-input"
                        accept="image/jpeg,image/png,image/gif,image/webp"
                        style={{ display: "none" }}
                        onChange={(event) => setFile(event.target.files?.[0] || null)}
                    />
                    <button
                        className="book-image-modal-save-btn"
                        type="button"
                        onClick={updateImageHandler}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
}

export default BookImageModal;
