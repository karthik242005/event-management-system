import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: '',
    password: '',
    confirmPassword: '',
    email: '',
    name: '',
    year: '',
    branch: '',
    section: '',
    regNo: '',
    phone: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert('❌ Passwords do not match');
      return;
    }

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
        ...form,
        role
      });

      alert('✅ Registered successfully!');
      navigate('/login');
    } catch (err) {
      const error = err.response?.data?.error || 'Registration failed';

      if (error.includes('Username')) {
        alert('❌ Username already taken');
      } else if (error.includes('email')) {
        alert('❌ Email already registered');
      } else if (error.includes('Phone')) {
        alert('❌ Phone number already used');
      } else if (error.includes('Registration number')) {
        alert('❌ Registration number already used');
      } else {
        alert(`❌ ${error}`);
      }
    }
  };

  return (
    <>
      <style>{`
        .register-container {
          padding: 40px;
          max-width: 500px;
          margin: 60px auto;
          font-family: 'Poppins', sans-serif;
          background: #f7f9fc;
          border-radius: 10px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        .register-container h2 {
          text-align: center;
          margin-bottom: 20px;
          color: #333;
        }

        .register-form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .register-form input {
          padding: 12px;
          font-size: 16px;
          border-radius: 6px;
          border: 1px solid #ccc;
          width: 100%;
          transition: border 0.2s;
        }

        .register-form input:focus {
          border-color: #007bff;
          outline: none;
        }

        .register-form button {
          padding: 12px;
          font-size: 16px;
          border-radius: 6px;
          background-color: #007bff;
          color: #fff;
          border: none;
          cursor: pointer;
          transition: background 0.2s ease-in-out;
        }

        .register-form button:hover {
          background-color: #0056b3;
        }
      `}</style>

      <div className="register-container">
        <h2>Register</h2>

        <form onSubmit={handleSubmit} className="register-form">
          <input
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm Password"
            value={form.confirmPassword}
            onChange={handleChange}
            required
          />

          {role === 'student' && (
            <>
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                required
              />
              <input
                name="year"
                placeholder="Year"
                value={form.year}
                onChange={handleChange}
                required
              />
              <input
                name="branch"
                placeholder="Branch"
                value={form.branch}
                onChange={handleChange}
                required
              />
              <input
                name="section"
                placeholder="Section"
                value={form.section}
                onChange={handleChange}
                required
              />
              <input
                name="regNo"
                placeholder="Registration Number"
                value={form.regNo}
                onChange={handleChange}
                required
              />
              <input
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
              />
            </>
          )}

          <button type="submit">Register</button>
        </form>
      </div>
    </>
  );
}

export default Register;
