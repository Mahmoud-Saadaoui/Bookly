import React, { useEffect, useState } from "react";
import "./admin-dashboard.css";
import SideBar from "../../components/dashboard/SideBar";
import BooksDashboard from "../../components/dashboard/BooksDashboard";
import CreateNewBook from "../../components/dashboard/CreateNewBook";
import NotFound from "../not-found/NotFound";
import { useDispatch, useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";
import {
  addBook,
  fetchBooks,
  removeBook,
} from "../../redux/apiCalls/bookApiCall";
import { toast } from "react-toastify";
import swal from "sweetalert";

function AdminDashboardPage() {
  const [currentTab, setCurrentTab] = useState(1);

  const dispatch = useDispatch();
  const { books, loading } = useSelector((state) => state.book);

  /**
   * Pagination
  */
  const [currentPage, setCurrentPage] = useState(0);
  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  /**
   * Add New Book
   */
  const [fileName, setFileName] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [author, setAuthor] = useState("");
  const [PublicationDate, setPublicationDate] = useState("");
  const [language, setLanguage] = useState("");

  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (title.trim() === "") return toast.error("Book Title is required");
    if (category.trim() === "") return toast.error("Book Category is required");
    if (description.trim().length < 10)
      return toast.error("Book Description must contain at least 10 characters");
    if (description.length > 5000)
      return toast.error("Book Description cannot exceed 5000 characters");
    if (title.trim().length > 200)
      return toast.error("Book Title cannot exceed 200 characters");
    if (category.trim().length < 2 || category.trim().length > 50)
      return toast.error("Book Category must contain between 2 and 50 characters");
    if (author.trim().length < 2 || author.trim().length > 100)
      return toast.error("Book Author must contain between 2 and 100 characters");
    if (language.trim().length > 50)
      return toast.error("Book Language cannot exceed 50 characters");
    if (!fileName) return toast.error("Book Image is required");
    if (!['image/jpeg', 'image/png', 'image/gif', 'image/webp'].includes(fileName.type))
      return toast.error("Only JPEG, PNG, GIF and WebP images are allowed");
    if (fileName.size > 5 * 1024 * 1024)
      return toast.error("Image must not exceed 5 MB");

    const formData = new FormData();
    formData.append("image", fileName);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("author", author);
    formData.append("language", language);
    formData.append("PublicationDate", PublicationDate);

    dispatch(addBook(formData))
      .then(() => {
        dispatch(fetchBooks(currentPage + 1));
        // Only reset form on success
        setFileName(null);
        setTitle("");
        setDescription("");
        setCategory("");
        setAuthor("");
        setPublicationDate("");
        setLanguage("");
      })
      .catch(() => {
        // Don't reset form on error
      });
  };

  /**
   * Fetch All Books With Pagination
   */
  useEffect(() => {
    dispatch(fetchBooks(currentPage + 1));
  }, [dispatch, currentPage]);

  /**
   * Remove Book
   */
  const handleRemoveBook = (id) => {
    swal({
      title: "Are you sure?",
      text: "By clicking the OK button, you will remove this book!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((isOk) => {
      if (isOk) {
        dispatch(removeBook(id)).then(() => {
          dispatch(fetchBooks(currentPage + 1));
        });
      } else {
        swal("something went wrong");
      }
    });
  };

  /**
   * Reset form fields when tab changes
   */
  useEffect(() => {
    if (currentTab === 2) {
      setFileName(null);
      setTitle("");
      setDescription("");
      setCategory("");
      setAuthor("");
      setPublicationDate("");
      setLanguage("");
    }
  }, [currentTab]);

  if (loading) {
    return (
      <Oval
        height={120}
        width={120}
        color="var(--color-brand)"
        wrapperStyle={{
          height: "90vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        wrapperClass=""
        visible={true}
        ariaLabel="oval-loading"
        secondaryColor="#E2E2E2"
        strokeWidth={3}
        strokeWidthSecondary={3}
      />
    );
  }
  return (
    <div className="admin-dashboard">
      <SideBar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      {currentTab === 1 ? (
        <BooksDashboard
          books={books}
          handlePageClick={handlePageClick}
          currentPage={currentPage}
          handleRemoveBook={handleRemoveBook}
          fileName={fileName}
          setFileName={setFileName}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          category={category}
          setCategory={setCategory}
          author={author}
          setAuthor={setAuthor}
          PublicationDate={PublicationDate}
          setPublicationDate={setPublicationDate}
          language={language}
          setLanguage={setLanguage}
        />
      ) : currentTab === 2 ? (
        <CreateNewBook
          fileName={fileName}
          setFileName={setFileName}
          title={title}
          setTitle={setTitle}
          description={description}
          setDescription={setDescription}
          category={category}
          setCategory={setCategory}
          author={author}
          setAuthor={setAuthor}
          PublicationDate={PublicationDate}
          setPublicationDate={setPublicationDate}
          language={language}
          setLanguage={setLanguage}
          formSubmitHandler={formSubmitHandler}
        />
      ) : (
        <NotFound />
      )}
    </div>
  );
}

export default AdminDashboardPage;
