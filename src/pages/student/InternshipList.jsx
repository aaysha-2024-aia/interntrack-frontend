import React, { useState, useEffect, useCallback } from "react";
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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedIds, setAppliedIds] = useState([]);
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    location: "",
    status: "pending",
    stipend: "",
    description: "",
    jobLink: "",
  });

  // ✅ FIX: useCallback prevents re-creation issues
  const fetchInternships = useCallback(async () => {
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
  }, [search, statusFilter]);

  const fetchMyApplications = useCallback(async () => {
    try {
      const { data } = await API.get("/applications/my");
      const ids = (data.applications || []).map((a) => a.internship?._id);
      setAppliedIds(ids);
    } catch (error) {
      console.error("Failed to fetch applications");
    }
  }, []);

  useEffect(() => {
    fetchInternships();
  }, [fetchInternships]);

  useEffect(() => {
    fetchMyApplications();
  }, [fetchMyApplications]);

  const handleApply = async (e) => {
    e.preventDefault();
    try {
      setApplying(true);

      await API.post("/applications", {
        internshipId: selectedInternship._id,
        coverLetter,
      });

      toast.success(`Applied to ${selectedInternship.company}!`);
      setShowApplyModal(false);
      setCoverLetter("");
      fetchMyApplications();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post("/internships", {
        ...formData,
        stipend: Number(formData.stipend),
      });

      toast.success("Internship added!");
      setShowAddModal(false);

      setFormData({
        company: "",
        role: "",
        location: "",
        status: "pending",
        stipend: "",
        description: "",
        jobLink: "",
      });

      fetchInternships();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this internship?")) return;

    try {
      await API.delete(`/internships/${id}`);
      toast.success("Deleted successfully");
      fetchInternships();
    } catch (error) {
      toast.error("Failed to delete");
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
          <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">
            Dashboard
          </Link>
          <Link to="/applications" className="text-gray-600 hover:text-indigo-600">
            Applications
          </Link>
          <Link to="/profile" className="text-gray-600 hover:text-indigo-600">
            Profile
          </Link>
        </div>
      </nav>

      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Browse Internships
          </h1>

          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
          >
            + Add Internship
          </button>
        </div>

        {/* Search */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by company or role..."
            className="p-3 border rounded-lg w-full"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="p-3 border rounded-lg"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="interviewing">Interviewing</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-20">Loading...</div>
        ) : internships.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            No internships found
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((job) => {
              const alreadyApplied = appliedIds.includes(job._id);

              return (
                <div key={job._id} className="bg-white p-6 rounded-xl shadow">

                  <h2 className="text-xl font-bold">{job.role}</h2>
                  <p className="text-indigo-600 font-semibold">{job.company}</p>

                  <div className="mt-3 text-sm text-gray-500">
                    {job.location && <p>📍 {job.location}</p>}
                    {job.stipend > 0 && <p>💰 ₹{job.stipend}</p>}
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Link
                      to={`/internship/${job._id}`}
                      className="flex-1 bg-indigo-600 text-white text-center py-2 rounded-lg"
                    >
                      View
                    </Link>

                    {alreadyApplied ? (
                      <span className="flex-1 bg-green-100 text-green-700 text-center py-2 rounded-lg">
                        Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => {
                          setSelectedInternship(job);
                          setShowApplyModal(true);
                        }}
                        className="flex-1 bg-green-600 text-white py-2 rounded-lg"
                      >
                        Apply
                      </button>
                    )}

                    <button
                      onClick={() => handleDelete(job._id)}
                      className="bg-red-100 text-red-600 px-3 py-2 rounded-lg"
                    >
                      X
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default InternshipList;