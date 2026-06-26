import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";
import StatCard from "../../components/StatCard";
import {
  PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer,
} from "recharts";

const COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#8b5cf6"];

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await API.get("/dashboard/stats");
      setStats(data.stats);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const pieData = stats
    ? [
        { name: "Pending", value: stats.pending || 0 },
        { name: "Reviewing", value: stats.reviewing || 0 },
        { name: "Interview", value: stats.interviewing || 0 },
        { name: "Offered", value: stats.offered || 0 },
        { name: "Accepted", value: stats.accepted || 0 },
        { name: "Rejected", value: stats.rejected || 0 },
      ].filter((i) => i.value > 0)
    : [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-indigo-600">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">InternTrack Pro</h1>
        <div className="flex gap-6">
          <Link to="/internships">Internships</Link>
          <Link to="/applications">Applications</Link>
          <Link to="/profile">Profile</Link>
          <button onClick={logout} className="text-red-500">Logout</button>
        </div>
      </nav>

      <div className="p-8">

        <h2 className="text-3xl font-bold">
          Welcome back, {user?.name} 👋
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-6">
          <StatCard title="Total" value={stats?.totalApplications || 0} />
          <StatCard title="Interviewing" value={stats?.interviewing || 0} />
          <StatCard title="Offered" value={stats?.offered || 0} />
          <StatCard title="Rejected" value={stats?.rejected || 0} />
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h3 className="font-bold mb-4">Application Status</h3>

          {pieData.length ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} dataKey="value" label>
                  {pieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p>No applications yet</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;