import React, { useState } from 'react';
import { Link } from "react-router-dom";
import './form.css';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { registerUser } from '../../redux/apiCalls/authApiCalls';
import { useDispatch } from 'react-redux';

function Register() {
  const dispatch = useDispatch()
  window.scroll(0,0)

  const [email,setEmail] = useState("")
  const [name,setUsername] = useState("")
  const [password,setPassword] = useState("")

  // form submit handler
  const formSubmitHandler = (e) => {
      e.preventDefault()
      if (email.trim() === "") {
          return toast.error("Email is required")
      }
      if (password.length < 6) {
          return toast.error("Please enter a password with 6 or more characters")
      }
      if (name.trim() === "") {
          return toast.error("name is required")
      }
      dispatch(registerUser({ name, email, password }))
    }
  return (
    <div className="form-wrapper">
    <ToastContainer theme="light"/>
    <h1 className="form-title">Create new account</h1>
    <form onSubmit={formSubmitHandler}  className="form">
      <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          placeholder="Email"
      />
      <input
          value={name}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="name"
      />
      <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          placeholder="Password"
      />
      <button className="form-btn" type="submit">
        Register
      </button>
    </form>
    <div className="form-footer">
      Already have an account ?{" "}
      <Link to="/login" className="forms-link">
        Login
      </Link>
    </div>
  </div>
  )
}

export default Register