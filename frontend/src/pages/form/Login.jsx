import React, { useState } from 'react';
import './form.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/apiCalls/authApiCalls';
import { Link } from 'react-router-dom';

function Login() {
  const dispatch = useDispatch()
  window.scroll(0,0)

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  // form submit handler
  const formSubmitHandler = (e) => {
    e.preventDefault()
    if (email.trim() === "") {
        return toast.error("Email is required")
    }
    if (password === "") {
        return toast.error("Password is required")
    }
    dispatch(loginUser({ email, password }))
  }
  return (
    <div className="form-wrapper">
      <ToastContainer theme="light"/>
      <h1 className="form-title">Login to your account</h1>
      <form onSubmit={formSubmitHandler}  className="form">
        <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
        />
        <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
        />
        <button className="form-btn" type="submit">
          Login
        </button>
      </form>
      <div className="form-footer">
        Dont't have an account ?{" "}
        <Link to="/register" className="forms-link">
          Register
        </Link>
      </div>
    </div>
  )
}

export default Login