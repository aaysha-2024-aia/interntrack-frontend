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
  const [showAddModal, setShowAddModal] = useState(false);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [applying, setApplying] = useState(false);
  const [appliedIds, setAppliedIds] = useState([]);
  const [formData, setFormData] = useState({
    company: "", role: "", location: "",
    status: "pending", stipend: "", description: "", jobLink: "",
  });

  useEffect(() => {
    fetchInternships();
    fetchMyApplications();
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

  const fetchMyApplications = async () => {
    try {
      const { data } = await API.get("/applications/my");
      const ids = (data.applications || []).map((a) => a.internship?._id);
      setAppliedIds(ids);
    } catch (error) {
      console.error("Failed to fetch applications");
    }
  };

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
      setFormData({ company: "", role: "", location: "", status: "pending", stipend: "", description: "", jobLink: "" });
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
        <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">InternTrack Pro</Link>
        <div className="flex gap-6">
          <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
          <Link to="/applications" className="text-gray-600 hover:text-indigo-600">Applications</Link>
          <Link to="/profile" className="text-gray-600 hover:text-indigo-600">Profile</Link>
        </div>
      </nav>

      <div className="p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Browse Internships</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
          >
            + Add Internship
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by company or role..."
            className="p-3 border border-gray-300 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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

        {/* Cards */}
        {loading ? (
          <div className="text-center py-20 text-indigo-600 font-semibold">Loading...</div>
        ) : internships.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-xl mb-4">No internships found</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
            >
              Add Your First Internship
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internships.map((job) => {
              const alreadyApplied = appliedIds.includes(job._id);
              return (
                <div key={job._id} className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">{job.role}</h2>
                      <p className="text-indigo-600 font-semibold">{job.company}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1 mb-4">
                    {job.location && <p>📍 {job.location}</p>}
                    {job.stipend > 0 && <p>💰 ₹{job.stipend?.toLocaleString()}/month</p>}
                    {job.description && <p className="line-clamp-2 text-gray-400">{job.description}</p>}
                    <p>📅 {new Date(job.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <Link
                      to={`/internship/${job._id}`}
                      className="flex-1 text-center bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 text-sm"
                    >
                      View Details
                    </Link>
                    {alreadyApplied ? (
                      <span className="flex-1 text-center bg-green-100 text-green-700 px-3 py-2 rounded-lg text-sm font-semibold">
                        ✅ Applied
                      </span>
                    ) : (
                      <button
                        onClick={() => { setSelectedInternship(job); setShowApplyModal(true); }}
                        className="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 text-sm"
                      >
                        Apply Now
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(job._id)}
                      className="bg-red-100 text-red-600 px-3 py-2 rounded-lg hover:bg-red-200 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Apply Modal */}
      {showApplyModal && selectedInternship && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-2 text-gray-800">Apply to {selectedInternship.company}</h2>
            <p className="text-gray-500 mb-6">{selectedInternship.role} • {selectedInternship.location}</p>
            <form onSubmit={handleApply} className="space-y-4">
              <textarea
                placeholder="Cover Letter (optional) — Tell them why you're a great fit..."
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                rows={5}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={applying}
                  className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold disabled:opacity-50"
                >
                  {applying ? "Applying..." : "Submit Application"}
                </button>
                <button
                  type="button"
                  onClick={() => { setShowApplyModal(false); setCoverLetter(""); }}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Internship Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-8 w-full max-w-md max-h-screen overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Add Internship</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input type="text" placeholder="Company Name *" required
                value={formData.company}
                onChange={(e) => setFormData({...formData, company: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input type="text" placeholder="Role/Position *" required
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input type="text" placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input type="number" placeholder="Stipend (₹)"
                value={formData.stipend}
                onChange={(e) => setFormData({...formData, stipend: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <textarea placeholder="Description" rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <input type="url" placeholder="Job Link (optional)"
                value={formData.jobLink}
                onChange={(e) => setFormData({...formData, jobLink: e.target.value})}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <div className="flex gap-3">
                <button type="submit"
                  className="flex-1 bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
                >Add Internship</button>
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 font-semibold"
                >Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InternshipList;