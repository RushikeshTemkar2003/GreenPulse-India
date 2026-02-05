import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Public Pages
import Home from './pages/Home';
import About from './pages/About';
import Events from './pages/Events';
import Contact from './pages/Contact';
import Donate from './pages/Donate';
import Recycling from './pages/Recycling';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Volunteer Pages
import VolunteerDashboard from './components/volunteer/Dashboard';
import MyEvents from './components/volunteer/MyEvents';



// Delivery Boy Pages
import DeliveryDashboard from './components/delivery/Dashboard';
import MyTasks from './components/delivery/MyTasks';

// Admin Pages
import AdminDashboard from './components/admin/Dashboard';
import ManageEvents from './components/admin/ManageEvents';
import ManageUsers from './components/admin/ManageUsers';
import ManageDonations from './components/admin/ManageDonations';
import ManageRecycling from './components/admin/ManageRecycling';

// Common Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import PrivateRoute from './components/common/PrivateRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="app-container">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/events" element={<Events />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/recycling" element={<Recycling />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />

              {/* Volunteer Routes */}
              <Route path="/volunteer/dashboard" element={<PrivateRoute role="volunteer"><VolunteerDashboard /></PrivateRoute>} />
              <Route path="/volunteer/events" element={<PrivateRoute role="volunteer"><MyEvents /></PrivateRoute>} />
             
            

              {/* Delivery Boy Routes */}
              <Route path="/delivery/dashboard" element={<PrivateRoute role="delivery_boy"><DeliveryDashboard /></PrivateRoute>} />
              <Route path="/delivery/my-tasks" element={<PrivateRoute role="delivery_boy"><MyTasks /></PrivateRoute>} />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={<PrivateRoute role="admin"><AdminDashboard /></PrivateRoute>} />
              <Route path="/admin/events" element={<PrivateRoute role="admin"><ManageEvents /></PrivateRoute>} />
              <Route path="/admin/users" element={<PrivateRoute role="admin"><ManageUsers /></PrivateRoute>} />
              <Route path="/admin/donations" element={<PrivateRoute role="admin"><ManageDonations /></PrivateRoute>} />
              <Route path="/admin/recycling" element={<PrivateRoute role="admin"><ManageRecycling /></PrivateRoute>} />
            </Routes>

            
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;