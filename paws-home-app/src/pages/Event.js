import React, { useState, useEffect } from 'react';
import '../App.css';

function Events({ currentUserId }) {
  const [events, setEvents] = useState([]);

  // Fetch events from backend on component mount
  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => {
        console.error('Error fetching events:', error);
        alert('Failed to load events');
      });
  }, []);

  // Function to handle event sign-up
  const handleSignUp = async (eventId) => {
    if (!currentUserId) {
      alert("Please log in first!");
      return;
    }

    try {
      const res = await fetch(`http://localhost:5000/api/events/${eventId}/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: currentUserId }),
      });

      if (!res.ok) throw new Error('Failed to sign up');

      alert('Signed up successfully!');
      // Update the event list to reflect the new signup
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.event_id === eventId ? { ...event, current_signups: event.current_signups + 1 } : event
        )
      );
    } catch (err) {
      console.error(err);
      alert('Failed to sign up for event');
    }
  };

  return (
    <div className="events-page">
      <div className="cards">
        {events.map(event => (
          <div key={event.event_id} className="card">
            <h2>{event.name}</h2>
            <div className="card-content">
              <p className="event-detail">{event.description}</p>
              <p className="event-info">Date: {event.date}</p>
              <p className="event-info">Location: {event.location}</p>
              <p className="event-info">
                Capacity: {event.capacity} | Remaining: {event.capacity - event.current_signups}
              </p>
              <button
                className="signup-btn"
                onClick={() => handleSignUp(event.event_id)}
                disabled={event.current_signups >= event.capacity}
              >
                {event.current_signups >= event.capacity ? 'Full' : 'Sign Up Now'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Events;