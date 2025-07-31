import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function StudentDashboard() {
  const [events, setEvents] = useState([]);
  const [registeredIds, setRegisteredIds] = useState([]);
  const [username, setUsername] = useState('');
  const [selectedTab, setSelectedTab] = useState('available');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const sessionRes = await axios.get(`${process.env.REACT_APP_API_URL}/api/auth/session`, {
          withCredentials: true,
        });

        console.log("Session response:", sessionRes.data); // Debug log

        const studentId = sessionRes.data?._id;
        const studentUsername = sessionRes.data?.username;

        if (!studentId) {
          console.error("❌ studentId is missing in session response");
          return alert("Session expired or invalid. Please log in again.");
        }

        setUsername(studentUsername);

        const [registrationsRes, eventsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/api/registration/${studentId}`, {
            withCredentials: true,
          }),
          axios.get(`${process.env.REACT_APP_API_URL}/api/events`),
        ]);

        const registeredEventIds = registrationsRes.data.map((r) => r.eventId.toString());
        setRegisteredIds(registeredEventIds);
        setEvents(eventsRes.data);
      } catch (err) {
        console.error("Error loading student dashboard data:", err);
        alert("Failed to load dashboard data");
      }
    };

    fetchData();
  }, []);

  const registeredEvents = events.filter(e => registeredIds.includes(e._id.toString()));
  const availableEvents = events.filter(e => !registeredIds.includes(e._id.toString()));

  const shownEvents = selectedTab === 'registered' ? registeredEvents : availableEvents;
const handleRegister = async (eventId) => {
  try {
    const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/registration`, {
      studentUsername: username,
      eventId
    });
    setRegisteredIds(prev => [...prev, eventId]);
    alert(res.data.message || 'Registered successfully');
  } catch (err) {
    alert(err.response?.data?.message || 'Registration failed');
  }
};

const handleUnregister = async (eventId) => {
  try {
    const res = await axios.delete(`${process.env.REACT_APP_API_URL}/api/registration`, {
      data: {
        studentUsername: username,
        eventId
      }
    });
    setRegisteredIds(prev => prev.filter(id => id !== eventId));
    alert(res.data.message || 'Unregistered successfully');
  } catch (err) {
    alert(err.response?.data?.message || 'Unregistration failed');
  }
};

  return (
    <div style={styles.wrapper}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <h2 style={styles.logo}>🎓 {username || "Student"}</h2>
        <div
          style={{
            ...styles.tab,
            backgroundColor: selectedTab === "registered" ? "#2563eb" : "",
            color: selectedTab === "registered" ? "#fff" : "#1e293b",
          }}
          onClick={() => setSelectedTab("registered")}
        >
          Registered Events
        </div>
        <div
          style={{
            ...styles.tab,
            backgroundColor: selectedTab === "available" ? "#2563eb" : "",
            color: selectedTab === "available" ? "#fff" : "#1e293b",
          }}
          onClick={() => setSelectedTab("available")}
        >
          Available Events
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <h1 style={styles.heading}>
          {selectedTab === "registered" ? "✅ Registered Events" : "🎯 Available Events"}
        </h1>

        {shownEvents.length === 0 && (
          <p style={styles.empty}>
            {selectedTab === "registered"
              ? "You haven’t registered for any events yet."
              : "No new events available."}
          </p>
        )}

        <div style={styles.grid}>
          {shownEvents.map((event) => (
            <div key={event._id} style={styles.card}>
{event.imageUrl && (
  <img
    src={event.imageUrl}
    alt={event.title}
    style={styles.image}
  />
)}
<h3 style={styles.title}>{event.title}</h3>
              <p style={styles.desc}>{event.description}</p>
              <p style={styles.detail}>📅 {new Date(event.date).toLocaleDateString()}</p>
              <p style={styles.detail}>⏰ {event.time || "TBD"}</p>
              <p style={styles.detail}>📍 {event.location}</p>

              {selectedTab === "registered" ? (
                  <button style={{ ...styles.button, backgroundColor: '#dc2626' }} onClick={() => handleUnregister(event._id)}>
                    Unregister
                  </button>
              ) : (
                <button style={styles.button} onClick={() => handleRegister(event._id)}>
                    Register
                </button>

              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    fontFamily: "Poppins, sans-serif",
    height: "100vh",
    backgroundColor: "#f1f5f9",
  },
  sidebar: {
    width: "250px",
    backgroundColor: "#ffffff",
    padding: "30px 20px",
    boxShadow: "4px 0 12px rgba(0, 0, 0, 0.05)",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  logo: {
    fontSize: "22px",
    fontWeight: "bold",
    color: "#2563eb",
    marginBottom: "20px",
  },
  tab: {
    fontSize: "16px",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.3s",
  },
  main: {
    flex: 1,
    padding: "40px",
    overflowY: "auto",
  },
  heading: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "30px",
    color: "#1e293b",
  },
  empty: {
    fontStyle: "italic",
    color: "#6b7280",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "25px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  title: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#0f172a",
  },
  desc: {
    fontSize: "14px",
    color: "#475569",
    fontStyle: "italic",
  },
  detail: {
    fontSize: "13px",
    color: "#64748b",
  },
  badge: {
    marginTop: "10px",
    fontSize: "13px",
    color: "#059669",
    backgroundColor: "#dcfce7",
    padding: "6px 12px",
    borderRadius: "8px",
    width: "fit-content",
  },
  button: {
    marginTop: "10px",
    padding: "10px 16px",
    backgroundColor: "#2563eb",
    color: "#fff",
    fontSize: "14px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },
  image: {
  width: '100%',
  height: '180px',
  objectFit: 'cover',
  borderRadius: '10px',
},

};

export default StudentDashboard;
