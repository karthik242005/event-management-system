import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [message, setMessage] = useState('');
  const { role, username } = useAuth();

  useEffect(() => {
    axios.get(`{process.env.REACT_APP_API_URL}/api/events/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error('Error fetching event:', err));
  }, [id]);

  const handleRegister = async () => {
    try {
      const res = await axios.post('{process.env.REACT_APP_API_URL}/api/registration', {
        studentUsername: username,
        eventId: id
      });

      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
    }
  };

  if (!event) return <p>Loading...</p>;

  return (
    <div style={{ padding: '40px' }}>
      <h2>{event.title}</h2>
      <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
      <p><strong>Location:</strong> {event.location}</p>
      <p><strong>Description:</strong> {event.description}</p>
      <p><strong>Created by:</strong> {event.createdBy}</p>

      {/* Show register button only for students */}
      {role === 'student' && (
        <button onClick={handleRegister}>Register for this Event</button>
      )}

      {message && <p>{message}</p>}
    </div>
  );
}

export default EventDetail;
