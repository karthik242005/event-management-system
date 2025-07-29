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
      await axios.post('http://localhost:5000/api/auth/register', {
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
    <div style={styles.container}>
      <h2>Register</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm Password"
          value={form.confirmPassword}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {role === 'student' && (
          <>
            <input
              name="name"
              placeholder="Full Name"
              value={form.name}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="year"
              placeholder="Year"
              value={form.year}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="branch"
              placeholder="Branch"
              value={form.branch}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="section"
              placeholder="Section"
              value={form.section}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="regNo"
              placeholder="Registration Number"
              value={form.regNo}
              onChange={handleChange}
              required
              style={styles.input}
            />
            <input
              name="phone"
              placeholder="Phone Number"
              value={form.phone}
              onChange={handleChange}
              required
              style={styles.input}
            />
          </>
        )}

        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: '40px',
    maxWidth: '500px',
    margin: 'auto',
    fontFamily: "'Poppins', sans-serif",
    background: '#f7f9fc',
    borderRadius: '10px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)'
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    width: '100%'
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    borderRadius: '6px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer'
  }
};

export default Register;
