import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

const VolunteerDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    eventsRegistered: 0,
    totalDonated: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(() => {
      fetchStats();
    }, 30000);
    return () => clearInterval(interval);
  }, [refreshKey]);

  const fetchStats = async () => {
    try {
      const [events, donations] = await Promise.all([
        api.get("/volunteers/my-events").catch(() => ({ data: { count: 0 } })),
        api.get("/donations/my-donations").catch(() => ({ data: { donations: [] } })),
      ]);

      setStats({
        eventsRegistered: events.data.count || 0,
        totalDonated: donations.data.donations.reduce(
          (sum, d) => sum + parseFloat(d.amount || 0),
          0
        ),
      });
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    setLoading(true);
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 text-center text-md-start">
        <div>
          <h2 className="fw-bold text-success">
            Welcome, {user?.name || "Volunteer"} 🌱
          </h2>
          <p className="text-muted mb-0">
            Making the world greener, one step at a time.
          </p>
        </div>
        <button
          className="btn btn-outline-success mt-3 mt-md-0"
          onClick={handleRefresh}
          disabled={loading}
        >
          {loading ? "Refreshing..." : "🔄 Refresh Data"}
        </button>
      </div>

      {/* Loader */}
      {loading && refreshKey === 0 ? (
        <div className="text-center py-5">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Fetching your dashboard data...</p>
        </div>
      ) : (
        <>
          {/* Stats Section */}
          <div className="row g-4 mb-5">
            <div className="col-md-6 col-sm-12">
              <div
                className="card shadow-sm border-0 rounded-4 text-center stat-card"
                style={{
                  background: "linear-gradient(135deg, #a8e063, #56ab2f)",
                  color: "white",
                }}
              >
                <div className="card-body">
                  <h3 className="fw-bold">{stats.eventsRegistered}</h3>
                  <p className="mb-0">Events Registered</p>
                </div>
              </div>
            </div>

            <div className="col-md-6 col-sm-12">
              <div
                className="card shadow-sm border-0 rounded-4 text-center stat-card"
                style={{
                  background: "linear-gradient(135deg, #7f00ff, #e100ff)",
                  color: "white",
                }}
              >
                <div className="card-body">
                  <h3 className="fw-bold">₹{stats.totalDonated.toFixed(2)}</h3>
                  <p className="mb-0">Total Donated</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Section */}
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm rounded-4">
                <div className="card-body text-center p-4">
                  <i
                    className="bi bi-calendar-event text-success"
                    style={{ fontSize: "3rem" }}
                  ></i>
                  <h5 className="mt-3 fw-bold">My Events</h5>
                  <p className="text-muted">
                    Explore and participate in upcoming events.
                  </p>
                  <Link to="/volunteer/events" className="btn btn-success">
                    View Events
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100 border-0 shadow-sm rounded-4">
                <div className="card-body text-center p-4">
                  <i
                    className="bi bi-cash-stack text-success"
                    style={{ fontSize: "3rem" }}
                  ></i>
                  <h5 className="mt-3 fw-bold">Make a Donation</h5>
                  <p className="text-muted">
                    Contribute to environmental and community causes.
                  </p>
                  <Link to="/donate" className="btn btn-success">
                    Donate Now
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default VolunteerDashboard;
