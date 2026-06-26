import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import StatCard from "../../components/StatCard";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await API.get("/dashboard/stats");
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  // Prepare pie chart data from status counts
  const pieData = stats ? [
    { name: "Pending", value: stats.pending || 0 },
    { name: "Reviewing", value: stats.reviewing || 0 },
    { name: "Interview", value: stats.interviewing || 0 },
    { name: "Offered", value: stats.offered || 0 },
    { name: "Accepted", value: stats.accepted || 0 },
    { name: "Rejected", value: stats.rejected || 0 },
  ].filter(item => item.value > 0) : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-indigo-600 text-xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">InternTrack Pro</h1>
        <div className="flex items-center gap-6">
          <Link to="/internships" className="text-gray-600 hover:text-indigo-600">Internships</Link>
          <Link to="/applications" className="text-gray-600 hover:text-indigo-600">Applications</Link>
          <Link to="/profile" className="text-gray-600 hover:text-indigo-600">Profile</Link>
          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-8">

        {/* Welcome */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">
            Welcome back, {user?.name}! 👋
          </h2>
          <p className="text-gray-500 mt-1">Here's your internship journey overview</p>
        </div>

        {/* Profile Completion */}
        {stats?.profileCompletionScore < 100 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6 flex justify-between items-center">
            <div>
              <p className="font-semibold text-yellow-800">
                Profile {stats?.profileCompletionScore}% complete
              </p>
              <p className="text-yellow-600 text-sm">Complete your profile to get better opportunities</p>
            </div>
            <Link
              to="/profile"
              className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
            >
              Complete Profile
            </Link>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatCard title="Total Applications" value={stats?.totalApplications || 0} color="indigo" />
          <StatCard title="Interviewing" value={stats?.interviewing || 0} color="blue" />
          <StatCard title="Offered" value={stats?.offered || 0} color="green" />
          <StatCard title="Rejected" value={stats?.rejected || 0} color="red" />
        </div>

        {/* Charts */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">

          {/* Pie Chart */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Application Status</h3>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">
                No applications yet
              </div>
            )}
          </div>

          {/* Recent Applications */}
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-lg font-bold mb-4 text-gray-800">Recent Applications</h3>
            {stats?.recentApplications?.length > 0 ? (
              <div className="space-y-3">
                {stats.recentApplications.map((app) => (
                  <div key={app._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-800">{app.internship?.company}</p>
                      <p className="text-sm text-gray-500">{app.internship?.role}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      app.internship?.status === "accepted" ? "bg-green-100 text-green-700" :
                      app.internship?.status === "rejected" ? "bg-red-100 text-red-700" :
                      "bg-blue-100 text-blue-700"
                    }`}>
                      {app.internship?.status}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                <p>No applications yet</p>
                <Link
                  to="/internships"
                  className="mt-3 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                  Browse Internships
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="text-lg font-bold mb-4 text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link to="/internships" className="bg-indigo-50 text-indigo-600 p-4 rounded-xl text-center hover:bg-indigo-100">
              <div className="text-2xl mb-2">🔍</div>
              <p className="font-semibold">Browse Internships</p>
            </Link>
            <Link to="/applications" className="bg-green-50 text-green-600 p-4 rounded-xl text-center hover:bg-green-100">
              <div className="text-2xl mb-2">📋</div>
              <p className="font-semibold">My Applications</p>
            </Link>
            <Link to="/profile" className="bg-yellow-50 text-yellow-600 p-4 rounded-xl text-center hover:bg-yellow-100">
              <div className="text-2xl mb-2">👤</div>
              <p className="font-semibold">Edit Profile</p>
            </Link>
            <Link to="/profile" className="bg-purple-50 text-purple-600 p-4 rounded-xl text-center hover:bg-purple-100">
              <div className="text-2xl mb-2">📄</div>
              <p className="font-semibold">Upload Resume</p>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;