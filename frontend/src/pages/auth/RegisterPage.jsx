import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { registerUser } from '../../redux/services/authApiCalls';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../../styles/auth.css';

function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain uppercase, lowercase, and number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const formSubmitHandler = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await dispatch(registerUser({
        name: formData.name,
        email: formData.email,
        password: formData.password
      }));
      navigate('/');
    } catch (error) {
      // Error handled by API call
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPasswordStrength = () => {
    const password = formData.password;
    if (!password) return { strength: 0, color: 'transparent', text: '' };

    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 10) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;

    const levels = [
      { max: 2, color: '#e74c3c', text: 'Weak' },
      { max: 4, color: '#f39c12', text: 'Fair' },
      { max: 6, color: '#2ecc71', text: 'Strong' }
    ];

    const level = levels.find(l => strength <= l.max) || levels[2];
    return level;
  };

  const passwordStrength = getPasswordStrength();

  return (
    <div className="auth-wrapper">
      <div className="auth-container">
        <div className="auth-card">
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join our library community</p>

          <form onSubmit={formSubmitHandler} className="auth-form" noValidate>
            {/* Name Field */}
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="John Doe"
                className="form-input"
                autoComplete="name"
                aria-invalid={errors.name ? "true" : "false"}
                aria-describedby="name-error"
                disabled={isSubmitting}
              />
              {errors.name && (
                <span id="name-error" className="error-message" role="alert">
                  {errors.name}
                </span>
              )}
            </div>

            {/* Email Field */}
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                className="form-input"
                autoComplete="email"
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby="email-error"
                disabled={isSubmitting}
              />
              {errors.email && (
                <span id="email-error" className="error-message" role="alert">
                  {errors.email}
                </span>
              )}
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
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
                  className="form-input"
                  autoComplete="new-password"
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby="password-error password-strength"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  tabIndex="-1"
                >
                  {showPassword ? "👁️" : "👁️"}
                </button>
              </div>
              {formData.password && (
                <div id="password-strength" className="password-strength" aria-live="polite">
                  <div
                    className="strength-bar"
                    style={{ backgroundColor: passwordStrength.color }}
                  />
                  <span className="strength-text">{passwordStrength.text}</span>
                </div>
              )}
              {errors.password && (
                <span id="password-error" className="error-message" role="alert">
                  {errors.password}
                </span>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="form-group">
              <label htmlFor="confirmPassword" className="form-label">
                Confirm Password
              </label>
              <div className="input-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="form-input"
                  autoComplete="new-password"
                  aria-invalid={errors.confirmPassword ? "true" : "false"}
                  aria-describedby="confirmPassword-error"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                  tabIndex="-1"
                >
                  {showConfirmPassword ? "👁️" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <span id="confirmPassword-error" className="error-message" role="alert">
                  {errors.confirmPassword}
                </span>
              )}
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
                "Create Account"
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="auth-footer">
            <span>Already have an account?</span>
            <button
              type="button"
              className="auth-link"
              onClick={() => navigate('/login')}
            >
              Sign In
            </button>
          </div>
        </div>

        {/* Illustration Side */}
        <div className="auth-illustration" aria-hidden="true">
          <div className="illustration-content">
            <h2>Join Bookly</h2>
            <p>Access thousands of books, manage your reading list, and connect with fellow readers</p>
            <ul className="features-list">
              <li>📚 Browse & Discover</li>
              <li>❤️ Save Favorites</li>
              <li>📅 Track Reading</li>
            </ul>
          </div>
        </div>
      </div>
      <ToastContainer theme="light" position="top-right" />
    </div>
  );
}

export default RegisterPage;
