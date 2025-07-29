// src/pages/SelectRole.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

function SelectRole() {
  const navigate = useNavigate();

  const handleSelect = (role) => {
    localStorage.setItem('selectedRole', role);  // 🔒 Remember role in localStorage
    navigate('/register'); // ✅ Redirect to common registration form
  };

  return (
    <div style={styles.container}>
      <h2>Select Role to Register</h2>
      <button style={styles.button} onClick={() => handleSelect('student')}>Register as Student</button>
      <button style={styles.button} onClick={() => handleSelect('admin')}>Register as Admin</button>
    </div>
  );
}

const styles = {
  container: {
    textAlign: 'center',
    marginTop: '100px',
    fontFamily: 'Arial'
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '1rem',
    cursor: 'pointer',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff'
  }
};

export default SelectRole;
