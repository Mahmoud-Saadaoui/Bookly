import React, { useState, useEffect } from "react";
import "./header.css";
import { Link, NavLink } from "react-router-dom";
import { CiMenuBurger } from "react-icons/ci";
import { RiCloseFill } from "react-icons/ri";
import logo from "../../images/logo.png";
import { useSelector } from "react-redux";
import { BsThreeDotsVertical } from "react-icons/bs";
import Dropdown from "./Dropdown";

function Header() {
  const [click, setClick] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const { user } = useSelector((state) => state.auth);

  const handleClick = () => {
    setClick(!click);
  };

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (click) {
      document.body.classList.add('nav-open');
    } else {
      document.body.classList.remove('nav-open');
    }
    return () => {
      document.body.classList.remove('nav-open');
    };
  }, [click]);

  return (
    <>
      {/* Overlay for mobile menu */}
      {click && <div className="nav-overlay active" onClick={handleClick}></div>}

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="nav-container">
          <Link to="/" className="nav-logo">
            <div className="nav-logo-icon">📚</div>
            <span className="nav-logo-text">Bookly</span>
          </Link>

          <ul className={click ? "nav-menu active" : "nav-menu"}>
            {user ? (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    onClick={() => {
                      handleClick();
                    }}
                    end
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/books"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    onClick={() => {
                      handleClick();
                    }}
                  >
                    Books
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/favorites"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    onClick={() => {
                      handleClick();
                    }}
                  >
                    Favorites
                  </NavLink>
                </li>
                {user.isAdmin && (
                  <li className="nav-item">
                    <NavLink
                      to="/admin"
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                    }
                      onClick={() => {
                        handleClick();
                      }}
                    >
                      Dashboard
                    </NavLink>
                  </li>
                )}
                <li className="nav-item">
                  <div className="nav-dropdown">
                    <span>{user.name}</span>
                    <BsThreeDotsVertical />
                    <Dropdown />
                  </div>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    onClick={() => {
                      handleClick();
                    }}
                    end
                  >
                    Home
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/books"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    onClick={() => {
                      handleClick();
                    }}
                  >
                    Books
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/login"
                    className={({ isActive }) =>
                      isActive ? "nav-link active" : "nav-link"
                    }
                    onClick={() => {
                      handleClick();
                    }}
                  >
                    Login
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink
                    to="/register"
                    className="nav-link nav-link-primary"
                    onClick={() => {
                      handleClick();
                    }}
                  >
                    Sign Up
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <button
            className="nav-icon"
            onClick={handleClick}
            aria-label="Toggle navigation menu"
            aria-expanded={click}
          >
            {click ? (
              <span className="icon">
                <RiCloseFill />
              </span>
            ) : (
              <span className="icon">
                <CiMenuBurger />
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
}

export default Header;
