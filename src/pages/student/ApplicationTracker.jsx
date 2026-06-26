import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import API from "../../api/axios";

const getStatusColor = (status) => {
  const colors = {
    pending: "bg-blue-100 text-blue-700",
    reviewing: "bg-purple-100 text-purple-700",
    shortlisted: "bg-indigo-100 text-indigo-700",
    interviewing: "bg-yellow-100 text-yellow-700",
    offered: "bg-orange-100 text-orange-700",
    accepted: "bg-green-100 text-green-700",
    rejected: "bg-red-100 text-red-700",
    withdrawn: "bg-gray-100 text-gray-700",
  };
  return colors[status] || "bg-gray-100 text-gray-700";
};

const ApplicationTracker = () => {
  const [applications, setApplications] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [stats, setStats] = useState({});

  useEffect(() => {
    fetchApplications();
  }, []);

  useEffect(() => {
    if (filter === "") {
      setFiltered(applications);
    } else {
      setFiltered(applications.filter((a) => a.status === filter));
    }
  }, [filter, applications]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const { data } = await API.get("/applications/my");
      const apps = data.applications || [];
      setApplications(apps);
      setFiltered(apps);

      const statusCount = {};
      apps.forEach((a) => {
        statusCount[a.status] = (statusCount[a.status] || 0) + 1;
      });
      setStats(statusCount);
    } catch (error) {
      toast.error("Failed to fetch applications");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await API.put(`/applications/${applicationId}/status`, { status: newStatus });
      toast.success("Status updated!");
      fetchApplications();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <nav className="bg-white shadow px-8 py-4 flex justify-between items-center">
        <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">
          InternTrack Pro
        </Link>
        <div className="flex gap-6">
          <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
          <Link to="/internships" className="text-gray-600 hover:text-indigo-600">Internships</Link>
          <Link to="/profile" className="text-gray-600 hover:text-indigo-600">Profile</Link>
        </div>
      </nav>

      <div className="p-8">

        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Application Tracker</h1>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {[
            { label: "Pending", key: "pending", color: "bg-blue-50 text-blue-700 border-blue-200" },
            { label: "Interviewing", key: "interviewing", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
            { label: "Offered", key: "offered", color: "bg-orange-50 text-orange-700 border-orange-200" },
            { label: "Accepted", key: "accepted", color: "bg-green-50 text-green-700 border-green-200" },
            { label: "Rejected", key: "rejected", color: "bg-red-50 text-red-700 border-red-200" },
          ].map((s) => (
            <div key={s.key} className={`border rounded-xl p-4 text-center ${s.color}`}>
              <p className="text-2xl font-bold">{stats[s.key] || 0}</p>
              <p className="text-sm font-medium">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-3 mb-6 flex-wrap">
          {["", "pending", "reviewing", "shortlisted", "interviewing", "offered", "accepted", "rejected", "withdrawn"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
                filter === s
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400"
              }`}
            >
              {s === "" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>

        {/* Total count */}
        <p className="text-gray-500 mb-4 text-sm">
          Showing <span className="font-semibold text-gray-700">{filtered.length}</span> application(s)
        </p>

        {/* List */}
        {loading ? (
          <div className="text-center py-20 text-indigo-600 font-semibold">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">No applications found</p>
            <Link
              to="/internships"
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Browse Internships
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <div
                key={app._id}
                className="bg-white p-6 rounded-xl shadow hover:shadow-md transition flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
              >
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-xl font-bold text-gray-800">
                      {app.internship?.company || "Company"}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>
                  <p className="text-gray-600 font-medium">
                    {app.internship?.role || "Role"}
                  </p>
                  <div className="flex gap-4 mt-2 text-sm text-gray-400 flex-wrap">
                    {app.internship?.location && (
                      <span>📍 {app.internship.location}</span>
                    )}
                    {app.internship?.stipend > 0 && (
                      <span>💰 ₹{app.internship.stipend?.toLocaleString()}/month</span>
                    )}
                    <span>📅 Applied: {new Date(app.appliedAt || app.createdAt).toLocaleDateString()}</span>
                  </div>
                  {app.coverLetter && (
                    <p className="text-gray-400 text-sm mt-2 line-clamp-1">
                      📝 {app.coverLetter}
                    </p>
                  )}
                </div>

                {/* Update Status */}
                <div className="flex items-center gap-3 flex-wrap">
                  <select
                    value={app.status}
                    onChange={(e) => handleUpdateStatus(app._id, e.target.value)}
                    className="p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="interviewing">Interviewing</option>
                    <option value="offered">Offered</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                    <option value="withdrawn">Withdrawn</option>
                  </select>
                  <Link
                    to={`/internship/${app.internship?._id}`}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 text-sm"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationTracker;