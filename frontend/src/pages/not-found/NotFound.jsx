import React from 'react'
import "./not-found.css";
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <section className="not-found">
    <div className="not-found-title">404</div>
    <h1 className="not-found-text">Page Not Found</h1>
    <p className="not-found-subtitle">The page you are looking for doesn't exist or has been moved.</p>
    <Link className="not-found-link" to="/">
      Go to home page
    </Link>
  </section>
  )
}

export default NotFound