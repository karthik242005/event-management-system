import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'; // ✅ import Link

function EventList() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('{process.env.REACT_APP_API_URL}/api/events', { withCredentials: true })
      .then(res => setEvents(res.data))
      .catch(() => alert('Failed to load events'));
  }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ marginBottom: '20px' }}>All Upcoming Events</h2>
      {events.length === 0 && <p>No events available yet.</p>}
     {events.map((event) => (
  <Link to={`/events/${event._id}`} key={event._id} style={{ textDecoration: 'none', color: 'inherit' }}>
    <div style={{
      backgroundColor: '#f9f9f9',
      border: '1px solid #ddd',
      borderRadius: '6px',
      padding: '20px',
      marginBottom: '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '20px'
    }}>
      {event.imageUrl && (
        <img
          src={event.imageUrl}
          alt={event.title}
          style={{
            width: '150px',
            height: '100px',
            objectFit: 'cover',
            borderRadius: '6px'
          }}
        />
      )}
      <div>
        <h3>{event.title}</h3>
        <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
        <p><strong>Location:</strong> {event.location}</p>
        <p>{event.description.slice(0, 100)}...</p>
      </div>
    </div>
  </Link>
))}

    </div>
  );
}

export default EventList;
