import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-5">
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>🌿 GreenPulse India</h5>
            <p>Making India greener, one step at a time.</p>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/events" className="text-white">Events</a></li>
              <li><a href="/donate" className="text-white">Donate</a></li>
              <li><a href="/recycling" className="text-white">Recycling</a></li>
              <li><a href="/contact" className="text-white">Contact</a></li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <p>Email: info@greenpulse.in</p>
            <p>Phone: +91 98765 43210</p>
            <p>Address: Mumbai, Maharashtra, India</p>
          </div>
        </div>
        <hr className="bg-white" />
        <div className="text-center">
          <p>&copy; 2025 GreenPulse India. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;