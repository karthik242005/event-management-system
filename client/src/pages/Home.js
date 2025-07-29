import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/api/events')
      .then(res => setEvents(res.data))
      .catch(err => {
        console.error('Failed to fetch events', err);
        alert('Could not load events');
      });
  }, []);

  const styles = {
    container: {
      textAlign: 'center',
      padding: '50px',
      backgroundColor: '#f0f2f5',
      minHeight: 'calc(100vh - 60px)',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      fontSize: '3rem',
      marginBottom: '20px',
      color: '#2c3e50'
    },
    subtitle: {
      fontSize: '1.2rem',
      marginBottom: '40px',
      color: '#555'
    },
    eventCard: {
      backgroundColor: '#fff',
      margin: '20px auto',
      padding: '20px',
      borderRadius: '10px',
      width: '80%',
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      textAlign: 'left'
    },
    eventTitle: {
      fontSize: '1.5rem',
      marginBottom: '10px',
      color: '#007bff'
    },
    eventDetails: {
      color: '#333',
      marginBottom: '5px'
    },
    image: {
  width: '100%',
  height: '180px',
  objectFit: 'cover',
  borderRadius: '10px',
  marginBottom: '10px',
}

  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>College Event Management System</h1>
      <p style={styles.subtitle}>Discover, manage, and register for college events with ease.</p>

      {events.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        events.map(event => (
          <div key={event._id} style={styles.eventCard}>
            {event.imageUrl && (
    <img src={event.imageUrl} alt={event.title} style={styles.image} />
  )}
<Link to={`/events/${event._id}`} style={{ textDecoration: 'none', color: '#007bff' }}>
  <div style={styles.title}>{event.title}</div>
</Link>
            <div style={styles.eventDetails}><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</div>
            <div style={styles.eventDetails}><strong>Location:</strong> {event.location}</div>
            <div style={styles.eventDetails}><strong>Description:</strong> {event.description}</div>
            <div style={styles.eventDetails}><strong>Created by:</strong> {event.createdBy}</div>
          </div>
        ))
      )}
    </div>
  );
}

export default Home;
