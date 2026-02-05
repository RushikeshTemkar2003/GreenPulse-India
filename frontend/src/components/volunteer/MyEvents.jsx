import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [availableEvents, setAvailableEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('registered');

  useEffect(() => {
    fetchMyEvents();
    fetchAvailableEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const response = await api.get('/volunteers/my-events');
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableEvents = async () => {
    try {
      const response = await api.get('/events?status=upcoming');
      setAvailableEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching available events:', error);
    }
  };

  const handleRegister = async (eventId) => {
    try {
      await api.post(`/volunteers/events/${eventId}/register`);
      alert('Successfully registered for event!');
      fetchMyEvents();
      fetchAvailableEvents();
    } catch (error) {
      alert(error.response?.data?.message || 'Registration failed');
    }
  };

  const isRegistered = (eventId) => {
    return events.some(e => e.id === eventId);
  };

  return (
    <div className="container py-5">
      <h1 className="mb-4">My Events</h1>

      {/* Tabs */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'registered' ? 'active' : ''}`}
            onClick={() => setActiveTab('registered')}
          >
            Registered Events
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'available' ? 'active' : ''}`}
            onClick={() => setActiveTab('available')}
          >
            Available Events
          </button>
        </li>
      </ul>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <>
          {activeTab === 'registered' && (
            <div className="row g-4">
              {events.length === 0 ? (
                <div className="col-12">
                  <div className="alert alert-info">
                    You haven't registered for any events yet.
                  </div>
                </div>
              ) : (
                events.map(event => (
                  <div key={event.id} className="col-md-6 col-lg-4">
                    <div className="card h-100">
                      <img 
                        src={event.image_url || 'https://via.placeholder.com/400x200'} 
                        className="card-img-top" 
                        alt={event.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <span className={`badge mb-2 ${
                          event.registration_status === 'completed' ? 'bg-success' : 
                          event.registration_status === 'attended' ? 'bg-primary' : 
                          'bg-warning'
                        }`}>
                          {event.registration_status.toUpperCase()}
                        </span>
                        <h5 className="card-title">{event.title}</h5>
                        <p className="card-text">{event.description}</p>
                        <p className="text-muted mb-2">
                          <small>📅 {new Date(event.date).toLocaleDateString()}</small>
                        </p>
                        <p className="text-muted">
                          <small>📍 {event.location}</small>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'available' && (
            <div className="row g-4">
              {availableEvents.length === 0 ? (
                <div className="col-12">
                  <div className="alert alert-info">
                    No upcoming events available at the moment.
                  </div>
                </div>
              ) : (
                availableEvents.map(event => (
                  <div key={event.id} className="col-md-6 col-lg-4">
                    <div className="card h-100">
                      <img 
                        src={event.image_url || 'https://via.placeholder.com/400x200'} 
                        className="card-img-top" 
                        alt={event.title}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                      <div className="card-body">
                        <h5 className="card-title">{event.title}</h5>
                        <p className="card-text">{event.description}</p>
                        <p className="text-muted mb-2">
                          <small>📅 {new Date(event.date).toLocaleDateString()}</small>
                        </p>
                        <p className="text-muted mb-3">
                          <small>📍 {event.location}</small>
                        </p>
                        <button 
                          className="btn btn-success w-100"
                          onClick={() => handleRegister(event.id)}
                          disabled={isRegistered(event.id)}
                        >
                          {isRegistered(event.id) ? 'Already Registered' : 'Register Now'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyEvents;