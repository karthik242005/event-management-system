import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const navigate = useNavigate();
  const { role, logout, loading } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const styles = {
    nav: {
      backgroundColor: '#007bff',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    link: {
      color: '#fff',
      textDecoration: 'none',
      margin: '0 10px',
      fontWeight: 'bold',
      background: 'none',
      border: 'none',
      cursor: 'pointer',
    },
    brand: {
      fontSize: '1.5rem',
      color: '#fff',
    }
  };

  // Don't render Navbar while loading session check
  if (loading) return null;

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>College Event Hub</div>
      <div>
        {!role && (
          <>
            <Link to="/" style={styles.link}>Home</Link>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
        {role && (
          <button onClick={handleLogout} style={styles.link}>Logout</button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
