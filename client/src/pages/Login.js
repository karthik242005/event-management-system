import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // Make sure this path is correct

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth(); // Pull login function from context

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
    <form onSubmit={handleSubmit}>
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
  );
}

export default Login;
