// src/pages/RegisterStudent.js
import { useState} from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function RegisterStudent() {
  const { eventId } = useParams(); // 👈 get eventId from URL
  const [form, setForm] = useState({
    username: '', password: '', name: '', year: '', branch: '',
    section: '', regNo: '', phone: '', email: ''
  });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      // 1. Register the student
      await axios.post('{process.env.REACT_APP_API_URL}/api/auth/register', {
        ...form,
        role: 'student'
      });

      // 2. Register for the selected event using the student username and eventId from URL
      await axios.post('{process.env.REACT_APP_API_URL}/api/registration', {
        studentUsername: form.username,
        eventId: eventId
      });

      alert('Student registered and enrolled in event');
    } catch (err) {
      console.error("Registration error:", err.response?.data || err.message);
      alert("Registration failed");
    }
  };

  return (
    <div>
      <h2>Student Registration</h2>
      <input name="username" placeholder="Username" onChange={handleChange} />
      <input type="password" name="password" placeholder="Password" onChange={handleChange} />
      <input name="name" placeholder="Full Name" onChange={handleChange} />
      <input name="year" placeholder="Year" onChange={handleChange} />
      <input name="branch" placeholder="Branch" onChange={handleChange} />
      <input name="section" placeholder="Section" onChange={handleChange} />
      <input name="regNo" placeholder="Registration No." onChange={handleChange} />
      <input name="phone" placeholder="Phone" onChange={handleChange} />
      <input name="email" placeholder="Email" onChange={handleChange} />
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}

export default RegisterStudent;
