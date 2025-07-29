// src/context/AuthContext.js
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check session on mount
  useEffect(() => {
    axios.get('{process.env.REACT_APP_API_URL}/api/auth/session', { withCredentials: true })
      .then(res => {
        setRole(res.data.role);
        setUsername(res.data.username);
      })
      .catch(() => {
        setRole(null);
        setUsername(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (role, username) => {
    setRole(role);
    setUsername(username);
  };

  const logout = async () => {
    await axios.post('{process.env.REACT_APP_API_URL}/api/auth/logout', {}, { withCredentials: true });
    setRole(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ role, username, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
