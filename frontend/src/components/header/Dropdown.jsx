import React, { useState, useRef, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../../redux/apiCalls/authApiCalls'
import { Link } from 'react-router-dom'
import { FaUser, FaHeart, FaSignOutAlt, FaCog, FaChevronDown } from 'react-icons/fa'

function Dropdown() {
    const dispatch = useDispatch()
    const { user } = useSelector((state) => state.auth)
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    const logout = () => {
        dispatch(logoutUser())
        setIsOpen(false)
    }

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen])

    return (
        <div className='dropdown-wrapper' ref={dropdownRef}>
            <button
                className='dropdown-toggle'
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
            >
                <span className="dropdown-user-name">{user?.name || 'User'}</span>
                <FaChevronDown className={`dropdown-chevron ${isOpen ? 'open' : ''}`} />
            </button>
            {isOpen && (
                <ul className={`dropdown-menu ${isOpen ? 'show' : ''}`}>
                    <li className="dropdown-item">
                        <Link className='dropdown-item-link' to='/profile' onClick={() => setIsOpen(false)}>
                            <FaUser className="dropdown-icon" />
                            My Profile
                        </Link>
                    </li>
                    <li className="dropdown-item">
                        <Link className='dropdown-item-link' to='/favorites' onClick={() => setIsOpen(false)}>
                            <FaHeart className="dropdown-icon" />
                            My Favorites
                        </Link>
                    </li>
                    {user?.isAdmin && (
                        <li className="dropdown-item">
                            <Link className='dropdown-item-link' to='/admin' onClick={() => setIsOpen(false)}>
                                <FaCog className="dropdown-icon" />
                                Dashboard
                            </Link>
                        </li>
                    )}
                    <li className="dropdown-divider"></li>
                    <li className="dropdown-item dropdown-item-danger" onClick={logout}>
                        <FaSignOutAlt className="dropdown-icon" />
                        Logout
                    </li>
                </ul>
            )}
        </div>
    )
}

export default Dropdown