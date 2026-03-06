import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/services/authApiCalls';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../styles/auth.css';

function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Scroll to top on mount
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Form submit handler
  const formSubmitHandler = async (e) => {
    e.preventDefault();

    // Validation
    if (!email.trim()) {
      return showError("Email is required");
    }
    if (!isValidEmail(email)) {
      return showError("Please enter a valid email");
    }
    if (!password) {
      return showError("Password is required");
    }
    if (password.length < 6) {
      return showError("Password must be at least 6 characters");
    }

    setIsSubmitting(true);
    try {
      await dispatch(loginUser({ email, password }));
      navigate('/');
    } catch (error) {
      // Error already handled by the API call
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const showError = (message) => {
    // This would be replaced by a toast in the API call
    console.error(message);
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>

          <form onSubmit={formSubmitHandler} className="auth-form" noValidate>
            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <div className="input-wrapper">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your.email@example.com"
                  className="form-input"
                  autoComplete="email"
                  aria-invalid={!email || isValidEmail(email) ? "false" : "true"}
                  aria-describedby="email-error"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-wrapper">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="form-input"
                  autoComplete="current-password"
                  aria-invalid={password ? "false" : "true"}
                  aria-describedby="password-error"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex="-1"
                >
                  {showPassword ? (
                    <span aria-hidden="true">👁️</span>
                  ) : (
                    <span aria-hidden="true">👁️</span>
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="auth-options">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  className="checkbox"
                />
                <span>Remember me</span>
              </label>
              <a href="/forgot-password" className="forgot-link">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="auth-button"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="spinner" aria-hidden="true"></span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="auth-footer">
            <span>Don't have an account?</span>
            <button
              type="button"
              className="auth-link"
              onClick={() => navigate('/register')}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Illustration Side */}
        <div className="auth-illustration" aria-hidden="true">
          <div className="illustration-content">
            <h2>Library Management</h2>
            <p>Discover, borrow, and manage your favorite books</p>
          </div>
        </div>
      </div>
      <ToastContainer theme="light" position="top-right" />
    </div>
  );
}

export default LoginPage;
