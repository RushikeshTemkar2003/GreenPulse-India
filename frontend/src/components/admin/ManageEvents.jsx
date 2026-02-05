import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageEvents = () => {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    status: 'upcoming'
  });
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await api.get('/events');
      setEvents(response.data.events);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('date', formData.date);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('status', formData.status);
    if (imageFile) {
      formDataToSend.append('image', imageFile);
    }

    try {
      if (editingEvent) {
        await api.put(`/events/${editingEvent.id}`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Event updated successfully!');
      } else {
        await api.post('/events', formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        alert('Event created successfully!');
      }
      
      setShowModal(false);
      setEditingEvent(null);
      setFormData({ title: '', description: '', date: '', location: '', status: 'upcoming' });
      setImageFile(null);
      fetchEvents();
    } catch (error) {
      alert('Failed to save event');
      console.error('Error:', error);
    }
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      date: event.date.split('T')[0],
      location: event.location,
      status: event.status
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      await api.delete(`/events/${id}`);
      alert('Event deleted successfully!');
      fetchEvents();
    } catch (error) {
      alert('Failed to delete event');
    }
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Manage Events</h1>
        <button 
          className="btn btn-success"
          onClick={() => {
            setEditingEvent(null);
            setFormData({ title: '', description: '', date: '', location: '', status: 'upcoming' });
            setShowModal(true);
          }}
        >
          + Create Event
        </button>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status"></div>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-custom">
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
                    <span className={`badge ${
                      event.status === 'upcoming' ? 'bg-primary' :
                      event.status === 'completed' ? 'bg-success' : 'bg-secondary'
                    }`}>
                      {event.status}
                    </span>
                  </td>
                 
                  <td>
                    <button 
                      className="btn btn-sm btn-primary me-2"
                      onClick={() => handleEdit(event)}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(event.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editingEvent ? 'Edit Event' : 'Create Event'}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Description *</label>
                    <textarea 
                      className="form-control"
                      rows="4"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      required
                    ></textarea>
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Date *</label>
                      <input 
                        type="date" 
                        className="form-control"
                        value={formData.date}
                        onChange={(e) => setFormData({...formData, date: e.target.value})}
                        required
                      />
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Status *</label>
                      <select 
                        className="form-select"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="upcoming">Upcoming</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Location *</label>
                    <input 
                      type="text" 
                      className="form-control"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      required
                    />
                  </div>
                  
                  <div className="mb-3">
                    <label className="form-label">Event Image</label>
                    <input 
                      type="file" 
                      className="form-control"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </div>
                </div>
                
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-success">
                    {editingEvent ? 'Update Event' : 'Create Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageEvents;

