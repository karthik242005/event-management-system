// src/pages/AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [events, setEvents] = useState([]);
  const [students, setStudents] = useState([]);
  const [username, setUsername] = useState('');
  const [section, setSection] = useState('overview');
  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await axios.delete(`{process.env.REACT_APP_API_URL}/api/events/${eventId}`);
      // Remove deleted event from state
      setEvents(prevEvents => prevEvents.filter(event => event._id !== eventId));
    } catch (err) {
      console.error("Failed to delete event:", err);
      alert("Error deleting event");
    }
  };
  useEffect(() => {
    axios.get('{process.env.REACT_APP_API_URL}/api/auth/session', { withCredentials: true })
      .then(res => setUsername(res.data.username));
      


 axios.get('{process.env.REACT_APP_API_URL}/api/events')
    .then(async res => {
      const eventsData = res.data;

      // Fetch count for each event
      const enriched = await Promise.all(eventsData.map(async (event) => {
        try {
          const countRes = await axios.get(`{process.env.REACT_APP_API_URL}/api/events/${event._id}/count`);
          return { ...event, participantCount: countRes.data.count };
        } catch (err) {
          console.error('Error fetching participant count:', err);
          return { ...event, participantCount: 0 };
        }
      }));

      setEvents(enriched);
    });

    axios.get('{process.env.REACT_APP_API_URL}/api/students')
      .then(res => setStudents(res.data));
  }, []);

  const sections = {
    overview: (
      <div style={styles.grid}>
        <div style={styles.card}><h3>Total Events</h3><p>{events.length}</p></div>
        <div style={styles.card}><h3>Total Students</h3><p>{students.length}</p></div>
      </div>
    ),
    events: (
      <div>
        <h3>📅 Events</h3>
        <Link to="/create-event" style={{ color: '#007bff', fontWeight: 'bold' }}>➕ Add New Event</Link>
        <ul style={styles.list}>
         {events.map(event => (
  <li key={event._id} style={styles.eventItem}>
    {event.imageUrl && (
      <img src={event.imageUrl} alt={event.title} style={styles.image} />
    )}
    <Link to={`/events/${event._id}`} style={styles.eventLink}>
      <strong>{event.title}</strong>
    </Link>
    <div><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</div>
    <div><strong>Location:</strong> {event.location}</div>
    <div><strong>Description:</strong> {event.description}</div>
    <div><strong>Participants:</strong> {event.participantCount}</div>
    <div><strong>Created by:</strong> {event.createdBy}</div>

    {/* 🗑️ Delete button for admin */}
    <button
      onClick={() => handleDelete(event._id)}
      style={{
        marginTop: '10px',
        padding: '8px 12px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
      }}
    >
      Delete Event
    </button>
  </li>
))}

        </ul>
      </div>
    ),
  };

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h2 style={styles.logo}>🎓 Admin {username}</h2>
        {["overview", "events"].map((item) => (
          <button
            key={item}
            onClick={() => setSection(item)}
            style={{
              ...styles.sidebarBtn,
              backgroundColor: section === item ? "#007bff" : "#fff",
              color: section === item ? "#fff" : "#333",
            }}
          >
            {item[0].toUpperCase() + item.slice(1)}
          </button>
        ))}
      </div>

      <div style={styles.mainContent}>
        <h2 style={styles.sectionTitle}>
          {section[0].toUpperCase() + section.slice(1)} Section
        </h2>
        {sections[section]}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Poppins', sans-serif",
    background: "linear-gradient(to right, #eef2f7, #e3edf9)",
  },
  sidebar: {
    width: "250px",
    background: "#ffffff",
    boxShadow: "2px 0 10px rgba(0,0,0,0.06)",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    borderTopRightRadius: "25px",
    borderBottomRightRadius: "25px",
  },
  logo: {
    fontSize: "24px",
    marginBottom: "25px",
    textAlign: "center",
    fontWeight: "600",
    color: "#007bff",
  },
  sidebarBtn: {
    padding: "12px 18px",
    fontSize: "16px",
    borderRadius: "10px",
    border: "1px solid #ddd",
    cursor: "pointer",
    textAlign: "left",
    transition: "0.2s ease-in-out",
  },
  mainContent: {
    flex: 1,
    padding: "60px 80px",
  },
  sectionTitle: {
    fontSize: "30px",
    marginBottom: "30px",
    color: "#003f6b",
    fontWeight: "600",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "25px",
  },
  card: {
    background: "#ffffff",
    padding: "30px 20px",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
    textAlign: "center",
    transition: "transform 0.3s ease",
    fontSize: "18px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
    marginTop: "20px",
    background: "#ffffff",
    borderRadius: "12px",
    paddingInline: "20px",
    boxShadow: "0 5px 14px rgba(0,0,0,0.06)",
    fontSize: "16px",
    lineHeight: "2em",
  },
  eventItem: {
    marginBottom: '25px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '15px',
  },
  eventLink: {
    textDecoration: 'none',
    color: '#007bff',
    fontSize: '18px',
    display: 'block',
    marginBottom: '8px',
  },
  image: {
  width: '100%',
  height: '180px',
  objectFit: 'cover',
  borderRadius: '10px',
  marginBottom: '10px',
},

};

export default AdminDashboard;
