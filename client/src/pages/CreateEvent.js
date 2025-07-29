// src/pages/CreateEvent.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function CreateEvent() {
  const navigate = useNavigate();
  const [authorized, setAuthorized] = useState(false);
  const [username, setUsername] = useState('');
  const [image, setImage] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    venue: '',
  });

  useEffect(() => {
    axios.get('{process.env.REACT_APP_API_URL}/api/auth/session', { withCredentials: true })
      .then(res => {
        if (res.data.role === 'admin') {
          setAuthorized(true);
          setUsername(res.data.username);
        } else {
          alert('Access Denied: Only admins can create events.');
          navigate('/');
        }
      })
      .catch(err => {
        console.error('Session check failed:', err);
        alert('You must be logged in.');
        navigate('/login');
      });
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formPayload = new FormData();
      formPayload.append('title', formData.title);
      formPayload.append('description', formData.description);
      formPayload.append('date', formData.date);
      formPayload.append('time', formData.time);
      formPayload.append('location', formData.venue);
      formPayload.append('createdBy', username);
      if (image) {
        formPayload.append('image', image);
      }

      await axios.post('{process.env.REACT_APP_API_URL}/api/events/create', formPayload, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      alert('✅ Event created successfully!');
      navigate('/admin-dashboard');
    } catch (err) {
      console.error('❌ Error creating event:', err);
      alert('❌ Failed to create event');
    }
  };

  if (!authorized) return null;

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.title}>🎯 Admin - Post an Event</h1>

        <form style={styles.form} onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Event Title"
            value={formData.title}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <input
            type="text"
            name="venue"
            placeholder="Venue"
            value={formData.venue}
            onChange={handleChange}
            required
            style={styles.input}
          />
          <textarea
            name="description"
            placeholder="Event Description"
            value={formData.description}
            onChange={handleChange}
            required
            style={styles.textarea}
          />

          {/* Image Upload Field */}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Post Event
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  body: {
    margin: 0,
    padding: 0,
    fontFamily: "Poppins, sans-serif",
    background: "linear-gradient(to bottom right, #eef6ff, #d0e4ff)",
    minHeight: "100vh",
  },
  container: {
    maxWidth: "500px",
    margin: "20px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "12px",
    boxShadow: "0 8px 25px rgba(0, 0, 0, 0.1)",
  },
  title: {
    textAlign: "center",
    fontSize: "22px",
    color: "#2c3e50",
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  input: {
    padding: "8px 10px",
    fontSize: "13px",
    border: "1px solid #ccc",
    borderRadius: "8px",
  },
  textarea: {
    padding: "8px 10px",
    fontSize: "13px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    resize: "vertical",
    height: "70px",
  },
  button: {
    padding: "10px",
    fontSize: "14px",
    fontWeight: "500",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "background 0.3s ease",
  }
};

export default CreateEvent;
