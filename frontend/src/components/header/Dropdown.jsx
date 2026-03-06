import React from 'react'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../../redux/apiCalls/authApiCalls'
import { Link } from 'react-router-dom'

function Dropdown() {
    const dispatch = useDispatch()

    const logout = () => {
        dispatch(logoutUser())
    }
  return (
    <div className='dropdown'>
        <ul className="dropdown-menu">
            <li className="dropdown-item" onClick={logout}>
                Logout
            </li>
            <li className="dropdown-item">
                <Link className='dropdown-item-link' to='/favorites'>
                    My Favorites
                </Link>  
            </li>
        </ul>
    </div>
  )
}

export default Dropdown