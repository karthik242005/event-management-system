// src/pages/RegisterAdmin.js
import { useState } from 'react';
import axios from 'axios';

function RegisterAdmin() {
  const [form, setForm] = useState({ username: '', password: '' });

  const handleSubmit = async () => {
    await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/register`, { ...form, role: 'admin' });
    alert('Admin registered successfully');
  };

  return (
    <div>
      <h2>Admin Registration</h2>
      <input name="username" onChange={e => setForm({ ...form, username: e.target.value })} placeholder="Username" />
      <input type="password" name="password" onChange={e => setForm({ ...form, password: e.target.value })} placeholder="Password" />
      <button onClick={handleSubmit}>Register</button>
    </div>
  );
}

export default RegisterAdmin;
