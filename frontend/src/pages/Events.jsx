import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchEvents();
  }, [filter]);

  const fetchEvents = async () => {
    try {
      const url = filter === 'all' ? '/events' : `/events?status=${filter}`;
      const response = await api.get(url);
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = (eventId) => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }

    if (user.role !== 'volunteer') {
      alert('Only volunteers can register for events');
      return;
    }

    navigate('/volunteer/events');
  };

  return (
    <div className="events-page py-5">
      <div className="container">
        <h1 className="text-center mb-4">Our Events</h1>
        
        {/* Filter Buttons */}
        <div className="text-center mb-4">
          <div className="btn-group" role="group">
            <button className={`btn ${filter === 'all' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setFilter('all')}>All Events</button>
            <button className={`btn ${filter === 'upcoming' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setFilter('upcoming')}>Upcoming</button>
            <button className={`btn ${filter === 'completed' ? 'btn-success' : 'btn-outline-success'}`} onClick={() => setFilter('completed')}>Completed</button>
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <p className="text-center">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="text-center">No events found</p>
        ) : (
          <div className="row g-4">
            {events.map((event) => (
              <div className="col-md-6 col-lg-4" key={event.id}>
                <div className="card h-100 shadow-sm">
                  <img src={event.image_url || 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400'} className="card-img-top" alt={event.title} style={{ height: '200px', objectFit: 'cover' }} />
                  <div className="card-body">
                    <span className={`badge ${event.status === 'upcoming' ? 'bg-success' : 'bg-secondary'} mb-2`}>
                      {event.status.toUpperCase()}
                    </span>
                    <h5 className="card-title">{event.title}</h5>
                    <p className="card-text">{event.description}</p>
                    <p className="text-muted mb-2">
                      <small>📅 {new Date(event.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</small>
                    </p>
                    <p className="text-muted">
                      <small>📍 {event.location}</small>
                    </p>
                    {event.status === 'upcoming' && (
                      <button className="btn btn-success w-100" onClick={() => handleRegister(event.id)}>
                        Register as Volunteer
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Events;