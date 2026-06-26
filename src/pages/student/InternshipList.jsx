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

const InternshipList = () => {
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
useEffect(() => {
  const loadData = async () => {
    await fetchInternships();
    await fetchMyApplications();
  };

  loadData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [search, statusFilter]);
  const fetchInternships = async () => {
    try {
      setLoading(true);

      let url = "/internships?";
      if (search) url += `keyword=${search}&`;
      if (statusFilter) url += `status=${statusFilter}&`;

      const { data } = await API.get(url);
      setInternships(data.internships || []);
    } catch (error) {
      toast.error("Failed to fetch internships");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this internship?")) return;

    try {
      await API.delete(`/internships/${id}`);
      toast.success("Deleted successfully");
      fetchInternships();
    } catch {
      toast.error("Failed to delete");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      <nav className="bg-white shadow px-8 py-4 flex justify-between">
        <Link to="/dashboard" className="font-bold text-indigo-600">
          InternTrack Pro
        </Link>

        <div className="flex gap-6">
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/applications">Applications</Link>
          <Link to="/profile">Profile</Link>
        </div>
      </nav>

      <div className="p-8">

        <div className="flex gap-4 mb-6">
          <input
            placeholder="Search..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border p-2 rounded"
          >
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {loading ? (
          <p>Loading...</p>
        ) : internships.length === 0 ? (
          <p>No internships found</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-4">
            {internships.map((job) => (
              <div key={job._id} className="bg-white p-4 rounded shadow">
                <h2 className="font-bold">{job.role}</h2>
                <p className="text-indigo-600">{job.company}</p>

                <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${getStatusColor(job.status)}`}>
                  {job.status}
                </span>

                <div className="mt-3 flex gap-2">
                  <Link
                    to={`/internship/${job._id}`}
                    className="bg-indigo-600 text-white px-3 py-1 rounded"
                  >
                    View
                  </Link>

                  <button
                    onClick={() => handleDelete(job._id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InternshipList;