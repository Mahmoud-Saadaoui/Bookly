import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector } from "react-redux";

// Pages
import HomePage from "./pages/home/HomePage";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import NotFoundPage from "./pages/not-found/NotFound";
import FavoritesPage from "./pages/favorites/Favorites";
import AdminDashboardPage from "./pages/dashboard/AdminDashboard";
import BookDetailsPage from "./pages/book/BookDetails";
import BooksPage from "./pages/books/BooksPage";

// Layout
import Header from "./components/header/Header";
import Footer from "./components/footer/Footer";

// Styles
import "./styles/global.css";

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <div className="app">
        <Header />
        <main className="main">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/books" element={<BooksPage />} />

            {/* Auth Routes - Redirect if logged in */}
            <Route
              path="/login"
              element={!user ? <LoginPage /> : <Navigate to="/" replace />}
            />
            <Route
              path="/register"
              element={!user ? <RegisterPage /> : <Navigate to="/" replace />}
            />

            {/* Protected Routes - Redirect if not logged in */}
            <Route
              path="/books/:bookId"
              element={user ? <BookDetailsPage /> : <Navigate to="/login" replace />}
            />
            <Route
              path="/favorites"
              element={user ? <FavoritesPage /> : <Navigate to="/login" replace />}
            />

            {/* Admin Route - Redirect if not admin */}
            <Route
              path="/admin"
              element={user?.isAdmin ? <AdminDashboardPage /> : <Navigate to="/" replace />}
            />

            {/* 404 Catch-all */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>

      {/* Toast Notifications */}
      <ToastContainer
        theme="light"
        position="top-right"
        autoClose={3500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
}

export default App;
