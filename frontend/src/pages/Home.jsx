import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';


const Home = () => {
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUpcomingEvents();
  }, []);

  const fetchUpcomingEvents = async () => {
    try {
      const response = await api.get('/events?status=upcoming');
      setUpcomingEvents(response.data.events.slice(0, 3));
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section bg-success text-white py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h1 className="display-4 fw-bold">Make India Greener</h1>
              <p className="lead">
                Join us in our mission to create a sustainable future through tree plantation,
                recycling, and environmental awareness.
              </p>
              
            </div>
            <div className="col-md-6">
              <img
                src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600"
                alt="Environment"
                className="img-fluid rounded"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section py-5">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <h2 className="mb-4">About GreenPulse India</h2>
              <p>
                GreenPulse India is dedicated to promoting environmental sustainability through
                community-driven initiatives. We focus on tree plantation, recycling programs, and
                creating awareness about climate change.
              </p>
              <p>
                Our mission is to engage volunteers and communities across India to take concrete
                actions towards a greener future. Together, we've planted over 10,000 trees and
                collected tons of recyclable waste.
              </p>
            </div>
            <div className="col-md-6">
              <div className="row g-3">
                <div className="col-6">
                  <div className="card text-center">
                    <div className="card-body">
                      <h3 className="text-success">10K+</h3>
                      <p>Trees Planted</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card text-center">
                    <div className="card-body">
                      <h3 className="text-success">50+</h3>
                      <p>Events Conducted</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card text-center">
                    <div className="card-body">
                      <h3 className="text-success">5K+</h3>
                      <p>Volunteers</p>
                    </div>
                  </div>
                </div>
                <div className="col-6">
                  <div className="card text-center">
                    <div className="card-body">
                      <h3 className="text-success">100+</h3>
                      <p>Cities Covered</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Events */}
      <section className="events-section py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">Upcoming Events</h2>
          {loading ? (
            <p className="text-center">Loading events...</p>
          ) : (
            <div className="row g-4">
              {upcomingEvents.map((event) => (
                <div className="col-md-4" key={event.id}>
                  <div className="card h-100">
                    <img
                      src={
                        event.image_url ||
                        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400'
                      }
                      className="card-img-top"
                      alt={event.title}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{event.title}</h5>
                      <p className="card-text">
                        {event.description ? event.description.substring(0, 100) + '...' : ''}
                      </p>
                      <p className="text-muted">
                        <small>📅 {new Date(event.date).toLocaleDateString()}</small>
                        <br />
                        <small>📍 {event.location}</small>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-center mt-4">
            <Link to="/events" className="btn btn-success">
              View All Events
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section py-5 bg-success text-white">
        <div className="container text-center">
          <h2>Ready to Make a Difference?</h2>
          <p className="lead">Join thousands of volunteers working towards a greener India</p>
          <Link to="/signup" className="btn btn-light btn-lg">
            Get Started
          </Link>
        </div>
      </section>
      
      {/* Floating Donate Button */}
      <Link to="/donate" className="floating-donate-btn">
        💰 Donate
      </Link>
    </div>
  );
};

export default Home;
