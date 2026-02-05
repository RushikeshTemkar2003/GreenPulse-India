import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_volunteers: 0,
    total_delivery_boys: 0,
    total_events: 0,
    total_donations: 0,
    total_donation_amount: 0,
    total_recycling_requests: 0,
    total_tasks: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [events, setEvents] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [recyclingRequests, setRecyclingRequests] = useState([]);
  const [contactMessages, setContactMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  // CREATE EVENT FORM STATE
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  });

  // ASSIGN RECYCLING FORM STATE
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState('');

  // VIEW CONTACT MESSAGE MODAL
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadAllData = async () => {
    try {
      const [statsRes, activityRes, eventsRes, volunteersRes, recyclingRes, deliveryRes, contactRes] = await Promise.all([
        api.get('/admin/dashboard-stats'),
        api.get('/admin/dashboard-stats'),
        api.get('/events'),
        api.get('/admin/volunteers'),
        api.get('/recycling'),
        api.get('/admin/delivery-boys'),
        api.get('/contact')
      ]);

      setStats(statsRes.data.stats);
      setRecentActivity(activityRes.data.recentActivity || []);
      setEvents(eventsRes.data.events.slice(0, 5));
      setVolunteers(volunteersRes.data.volunteers.slice(0, 5));
      setRecyclingRequests(recyclingRes.data.requests.filter(r => r.status === 'pending').slice(0, 5));
      setDeliveryBoys(deliveryRes.data.deliveryBoys);
      setContactMessages(contactRes.data.contacts || []);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    try {
      await api.post('/events', eventForm);
      alert('✅ Event created successfully!');
      setShowEventModal(false);
      setEventForm({ title: '', description: '', date: '', location: '' });
      loadAllData();
    } catch (error) {
      alert('❌ Failed to create event: ' + (error.response?.data?.message || 'Unknown error'));
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await api.delete(`/events/${eventId}`);
      alert('✅ Event deleted successfully!');
      loadAllData();
    } catch (error) {
      alert('❌ Failed to delete event');
    }
  };

  const handleAssignRecycling = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/recycling/${selectedRequest.id}/assign`, {
        deliveryBoyId: selectedDeliveryBoy
      });
      alert('✅ Recycling request assigned successfully!');
      setShowAssignModal(false);
      setSelectedRequest(null);
      setSelectedDeliveryBoy('');
      loadAllData();
    } catch (error) {
      alert('❌ Failed to assign request');
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-success" role="status"></div>
        <p className="mt-3">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Admin Dashboard</h1>
        <div className="btn-group">
          <button className="btn btn-success" onClick={() => setShowEventModal(true)}>
            ➕ Create Event
          </button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="row g-3 mb-4">
        <div className="col-md-3">
          <div className="card stat-card">
            <div className="card-body text-center">
              <h2>{stats.total_volunteers}</h2>
              <p className="mb-0">Volunteers</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card warning">
            <div className="card-body text-center">
              <h2>{stats.total_delivery_boys}</h2>
              <p className="mb-0">Delivery Boys</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card success">
            <div className="card-body text-center">
              <h2>{stats.total_events}</h2>
              <p className="mb-0">Total Events</p>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card stat-card info">
            <div className="card-body text-center">
              <h2>₹{Number(stats.total_donation_amount || 0).toLocaleString()}</h2>
              <p className="mb-0">Donations</p>
            </div>
          </div>
        </div>
      </div>

      {/* TABS */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button className={`nav-link ${activeSection === 'overview' ? 'active' : ''}`} onClick={() => setActiveSection('overview')}>
            📊 Overview
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeSection === 'events' ? 'active' : ''}`} onClick={() => setActiveSection('events')}>
            🎉 Events ({events.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeSection === 'volunteers' ? 'active' : ''}`} onClick={() => setActiveSection('volunteers')}>
            👥 Volunteers ({volunteers.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeSection === 'recycling' ? 'active' : ''}`} onClick={() => setActiveSection('recycling')}>
            ♻️ Recycling ({recyclingRequests.length} pending)
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeSection === 'feedback' ? 'active' : ''}`} onClick={() => setActiveSection('feedback')}>
            💬 Feedback
          </button>
        </li>
      </ul>

      {/* OVERVIEW TAB */}
      {activeSection === 'overview' && (
        <div className="row g-4">
          <div className="col-md-4">
            <Link to="/admin/events" className="text-decoration-none">
              <div className="card h-100 hover-card">
                <div className="card-body text-center">
                  <i className="bi bi-calendar-event text-success" style={{ fontSize: '3rem' }}></i>
                  <h5 className="mt-3">Manage Events</h5>
                  <p className="text-muted">Create, edit, delete events</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/admin/users" className="text-decoration-none">
              <div className="card h-100 hover-card">
                <div className="card-body text-center">
                  <i className="bi bi-people text-success" style={{ fontSize: '3rem' }}></i>
                  <h5 className="mt-3">Manage Users</h5>
                  <p className="text-muted">View all volunteers & delivery boys</p>
                </div>
              </div>
            </Link>
          </div>
          <div className="col-md-4">
            <Link to="/admin/donations" className="text-decoration-none">
              <div className="card h-100 hover-card">
                <div className="card-body text-center">
                  <i className="bi bi-currency-rupee text-success" style={{ fontSize: '3rem' }}></i>
                  <h5 className="mt-3">View Donations</h5>
                  <p className="text-muted">Track all donations received</p>
                </div>
              </div>
            </Link>
          </div>

          <div className="col-12">
            <div className="card">
              <div className="card-header bg-success text-white">
                <h5 className="mb-0">📋 Recent Activity</h5>
              </div>
              <div className="card-body">
                {recentActivity.length === 0 ? (
                  <p className="text-muted">No recent activity</p>
                ) : (
                  <div className="list-group">
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="list-group-item">
                        <strong>{activity.user_name || 'System'}</strong> {activity.action}
                        {activity.details && <span className="text-muted"> - {activity.details}</span>}
                        <br />
                        <small className="text-muted">{new Date(activity.created_at).toLocaleString()}</small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* EVENTS TAB */}
      {activeSection === 'events' && (
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="mb-0">🎉 Recent Events</h5>
            <button className="btn btn-success btn-sm" onClick={() => setShowEventModal(true)}>
              ➕ Create Event
            </button>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{new Date(event.date).toLocaleDateString()}</td>
                      <td>{event.location}</td>
                      <td>
                        <span className={`badge ${event.status === 'upcoming' ? 'bg-primary' : 'bg-success'}`}>
                          {event.status}
                        </span>
                      </td>
                      <td>
                        <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEvent(event.id)}>
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link to="/admin/events" className="btn btn-outline-success">View All Events →</Link>
          </div>
        </div>
      )}

      {/* VOLUNTEERS TAB */}
      {activeSection === 'volunteers' && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">👥 Recent Volunteers</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Events</th>
                    <th>Donated</th>
                  </tr>
                </thead>
                <tbody>
                  {volunteers.map(volunteer => (
                    <tr key={volunteer.volunteer_id}>
                      <td>{volunteer.name}</td>
                      <td>{volunteer.email}</td>
                      <td>{volunteer.events_participated}</td>
                      <td>₹{volunteer.total_donated}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Link to="/admin/users" className="btn btn-outline-success">View All Users →</Link>
          </div>
        </div>
      )}

      {/* RECYCLING TAB */}
      {activeSection === 'recycling' && (
        <div className="card">
          <div className="card-header">
            <h5 className="mb-0">♻️ Pending Recycling Requests</h5>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table">
                <thead>
                  <tr>
                    <th>Request ID</th>
                    <th>Name</th>
                    <th>Item Type</th>
                    <th>Pickup Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recyclingRequests.map(request => (
                    <tr key={request.id}>
                      <td><small>{request.request_id}</small></td>
                      <td>{request.name}</td>
                      <td><span className="badge bg-info">{request.item_type}</span></td>
                      <td>{new Date(request.pickup_date).toLocaleDateString()}</td>
                      <td>
                        <button 
                          className="btn btn-sm btn-primary"
                          onClick={() => {
                            setSelectedRequest(request);
                            setShowAssignModal(true);
                          }}
                        >
                          📍 Assign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* FEEDBACK TAB */}
      {activeSection === 'feedback' && (
        <div className="card">
          <div className="card-header bg-success text-white">
            <h5 className="mb-0">💬 Contact Form Messages</h5>
          </div>
          <div className="card-body">
            {contactMessages.length === 0 ? (
              <p className="text-muted text-center py-4">No messages received yet</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Message Preview</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contactMessages.map(msg => (
                      <tr key={msg.id}>
                        <td>
                          <small>{new Date(msg.created_at).toLocaleDateString()}<br/>
                          {new Date(msg.created_at).toLocaleTimeString()}</small>
                        </td>
                        <td><strong>{msg.name}</strong></td>
                        <td><small>{msg.email}</small></td>
                        <td><small>{msg.phone}</small></td>
                        <td>
                          <div style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {msg.message}
                          </div>
                        </td>
                        <td>
                          <button 
                            className="btn btn-sm btn-primary"
                            onClick={() => {
                              setSelectedMessage(msg);
                              setShowMessageModal(true);
                            }}
                          >
                            📩 View Message
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CREATE EVENT MODAL */}
      {showEventModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">➕ Create New Event</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowEventModal(false)}></button>
              </div>
              <form onSubmit={handleCreateEvent}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Event Title *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={eventForm.title}
                      onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                      required
                      placeholder="e.g., Beach Cleanup Drive"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea 
                      className="form-control"
                      rows="3"
                      value={eventForm.description}
                      onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                      required
                      placeholder="Describe the event..."
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Date *</label>
                    <input 
                      type="date" 
                      className="form-control"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={eventForm.location}
                      onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                      required
                      placeholder="e.g., Juhu Beach, Mumbai"
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEventModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    ✅ Create Event
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ASSIGN RECYCLING MODAL */}
      {showAssignModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">📍 Assign Recycling Request</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowAssignModal(false)}></button>
              </div>
              <form onSubmit={handleAssignRecycling}>
                <div className="modal-body">
                  <div className="alert alert-info">
                    <strong>Request:</strong> {selectedRequest?.request_id}<br/>
                    <strong>Name:</strong> {selectedRequest?.name}<br/>
                    <strong>Item:</strong> {selectedRequest?.item_type}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Select Delivery Boy *</label>
                    <select 
                      className="form-select"
                      value={selectedDeliveryBoy}
                      onChange={(e) => setSelectedDeliveryBoy(e.target.value)}
                      required
                    >
                      <option value="">Choose...</option>
                      {deliveryBoys.map(boy => (
                        <option key={boy.delivery_boy_id} value={boy.delivery_boy_id}>
                          {boy.name} ({boy.vehicle_type || 'No vehicle'})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    ✅ Assign
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* VIEW MESSAGE MODAL */}
      {showMessageModal && selectedMessage && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header bg-success text-white">
                <h5 className="modal-title">💬 Contact Message Details</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowMessageModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <p><strong>Name:</strong><br/>{selectedMessage.name}</p>
                </div>
                <div className="mb-3">
                  <p><strong>Received:</strong><br/>
                    {new Date(selectedMessage.created_at).toLocaleString()}
                  </p>
                </div>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <p><strong>Email:</strong><br/>
                      <a href={`mailto:${selectedMessage.email}`}>{selectedMessage.email}</a>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <p><strong>Phone:</strong><br/>
                      <a href={`tel:${selectedMessage.phone}`}>{selectedMessage.phone}</a>
                    </p>
                  </div>
                </div>
                <div className="mb-3">
                  <p><strong>Message:</strong></p>
                  <div className="card bg-light">
                    <div className="card-body">
                      <p className="mb-0" style={{ whiteSpace: 'pre-wrap' }}>{selectedMessage.message}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowMessageModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;