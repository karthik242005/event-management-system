import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Make sure this path is correct

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Step 1: Login
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/login`, formData, {
        withCredentials: true
      });

      // Step 2: Fetch session immediately after login
      const sessionRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/session`, {
        withCredentials: true
      });

      const { role, username } = sessionRes.data;

      // Step 3: Set global auth state
      login(role, username);

      // Step 4: Navigate based on role
      if (role === 'admin') {
        navigate('/admin-dashboard');
      } else if (role === 'student') {
        navigate('/student-dashboard');
      } else {
        alert('Unknown role!');
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <>
      <style>{`
        .login-form {
          max-width: 350px;
          margin: 80px auto;
          padding: 25px;
          border: 1px solid #ddd;
          border-radius: 12px;
          box-shadow: 0px 4px 12px rgba(0,0,0,0.1);
          background: #fff;
          text-align: center;
          font-family: Arial, sans-serif;
        }

        .login-form h2 {
          margin-bottom: 20px;
          font-size: 22px;
          color: #333;
        }

        .login-form input {
          width: 90%;
          padding: 10px;
          margin: 8px 0;
          border: 1px solid #ccc;
          border-radius: 8px;
          font-size: 14px;
        }

        .login-form input:focus {
          border-color: #4a90e2;
          outline: none;
        }

        .login-form button {
          width: 95%;
          padding: 10px;
          margin-top: 15px;
          background: #4a90e2;
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          cursor: pointer;
          transition: background 0.2s ease-in-out;
        }

        .login-form button:hover {
          background: #357abd;
        }
      `}</style>

      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        <input
          name="username"
          placeholder="Username"
          onChange={handleChange}
          required
        /><br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          required
        /><br />
        <button type="submit">Login</button>
      </form>
    </>
  );
}

export default Login;
