import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/events`)
      .then(res => res.json())
      .then(data => {
        console.log(data);
        setEvents(data);
      })
      .catch(err => {
        console.error("Failed to fetch events", err);
      });
  }, []);

  return (
    <div className="home-container">
      {/* Embedded CSS */}
      <style>{`
        .home-container {
          background-color: #f4f7fa;
          min-height: 100vh;
          padding: 2rem 1rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        .home-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .home-title {
          font-size: 2.8rem;
          color: #2c3e50;
          margin-bottom: 0.5rem;
        }

        .home-subtitle {
          font-size: 1.2rem;
          color: #666;
        }

        .events-section {
          max-width: 1000px;
          margin: 0 auto;
        }

        .event-card {
          background-color: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.06);
          transition: transform 0.2s ease;
        }

        .event-card:hover {
          transform: scale(1.02);
        }

        .event-image {
          width: 100%;
          height: 200px;
          object-fit: cover;
          border-radius: 10px;
          margin-bottom: 1rem;
        }

        .event-title {
          font-size: 1.6rem;
          color: #007bff;
          margin-bottom: 0.5rem;
        }

        .event-link {
          text-decoration: none;
        }

        .event-link:hover .event-title {
          text-decoration: underline;
        }

        .event-detail {
          font-size: 1rem;
          margin-bottom: 0.4rem;
          color: #333;
        }

        .no-events {
          text-align: center;
          font-size: 1.1rem;
          color: #999;
        }
      `}</style>

      {/* Header */}
      <header className="home-header">
        <h1 className="home-title">College Event Hub</h1>
        <p className="home-subtitle">Discover, manage, and register for college events with ease.</p>
      </header>

      {/* Events Section */}
      <section className="events-section">
        {events.length === 0 ? (
          <p className="no-events">No upcoming events.</p>
        ) : (
          events.map(event => (
            <div key={event._id} className="event-card">
              {event.imageUrl && (
                <img
                  src={event.imageUrl}
                  alt={event.title}
                  className="event-image"
                />
              )}

              <Link to={`/events/${event._id}`} className="event-link">
                <h2 className="event-title">{event.title || "Untitled Event"}</h2>
              </Link>

              <p className="event-detail"><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
              <p className="event-detail"><strong>Location:</strong> {event.location || "TBD"}</p>
              <p className="event-detail"><strong>Description:</strong> {event.description || "No description provided."}</p>
              <p className="event-detail"><strong>Created by:</strong> {event.createdBy || "Admin"}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

export default Home;
