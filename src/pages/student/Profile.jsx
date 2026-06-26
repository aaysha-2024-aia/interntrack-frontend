import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import API from "../../api/axios";

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    rollNumber: "",
    branch: "",
    year: "",
    cgpa: "",
    bio: "",
    skills: "",
    links: { linkedin: "", github: "", portfolio: "" },
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const { data } = await API.get("/profile/me");
      setProfile(data.data);
      setFormData({
        rollNumber: data.data.rollNumber || "",
        branch: data.data.branch || "",
        year: data.data.year || "",
        cgpa: data.data.cgpa || "",
        bio: data.data.bio || "",
        skills: data.data.skills?.join(", ") || "",
        links: {
          linkedin: data.data.links?.linkedin || "",
          github: data.data.links?.github || "",
          portfolio: data.data.links?.portfolio || "",
        },
      });
    } catch (error) {
      // Profile doesn't exist yet
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
        year: Number(formData.year),
        cgpa: Number(formData.cgpa),
      };
      if (profile) {
        await API.put("/profile", payload);
        toast.success("Profile updated!");
      } else {
        await API.post("/profile", payload);
        toast.success("Profile created!");
      }
      setEditing(false);
      fetchProfile();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save profile");
    }
  };

  const handleResumeUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("resume", file);
    try {
      await API.put("/profile/resume", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Resume uploaded!");
      fetchProfile();
    } catch (error) {
      toast.error("Failed to upload resume");
    }
  };

  const handleDeleteResume = async () => {
    try {
      await API.delete("/profile/resume");
      toast.success("Resume deleted!");
      fetchProfile();
    } catch (error) {
      toast.error("Failed to delete resume");
    }
  };

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
        <Link to="/dashboard" className="text-2xl font-bold text-indigo-600">InternTrack Pro</Link>
        <div className="flex gap-6">
          <Link to="/dashboard" className="text-gray-600 hover:text-indigo-600">Dashboard</Link>
          <Link to="/internships" className="text-gray-600 hover:text-indigo-600">Internships</Link>
          <Link to="/applications" className="text-gray-600 hover:text-indigo-600">Applications</Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto p-8">

        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
          <button
            onClick={() => setEditing(!editing)}
            className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700"
          >
            {editing ? "Cancel" : "Edit Profile"}
          </button>
        </div>

        {/* Profile Completion */}
        {profile && (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="font-semibold text-gray-700">Profile Completion</span>
              <span className="text-indigo-600 font-bold">{profile.completionScore}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-indigo-600 h-3 rounded-full transition-all"
                style={{ width: `${profile.completionScore}%` }}
              />
            </div>
          </div>
        )}

        {/* User Info Card */}
        <div className="bg-white rounded-xl shadow p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-600">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{user?.name}</h2>
              <p className="text-gray-500">{user?.email}</p>
              <span className="bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full text-sm font-semibold">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        {editing ? (
          <div className="bg-white rounded-xl shadow p-6 mb-6">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Edit Profile</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="CS2021001"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                  <select
                    value={formData.branch}
                    onChange={(e) => setFormData({...formData, branch: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Branch</option>
                    <option value="Computer Science">Computer Science</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Mechanical">Mechanical</option>
                    <option value="Civil">Civil</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <select
                    value={formData.year}
                    onChange={(e) => setFormData({...formData, year: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="">Select Year</option>
                    <option value="1">1st Year</option>
                    <option value="2">2nd Year</option>
                    <option value="3">3rd Year</option>
                    <option value="4">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">CGPA</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.cgpa}
                    onChange={(e) => setFormData({...formData, cgpa: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="8.5"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({...formData, bio: e.target.value})}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Tell us about yourself..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
                <input
                  type="text"
                  value={formData.skills}
                  onChange={(e) => setFormData({...formData, skills: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="React, Node.js, MongoDB"
                />
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn</label>
                  <input
                    type="url"
                    value={formData.links.linkedin}
                    onChange={(e) => setFormData({...formData, links: {...formData.links, linkedin: e.target.value}})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub</label>
                  <input
                    type="url"
                    value={formData.links.github}
                    onChange={(e) => setFormData({...formData, links: {...formData.links, github: e.target.value}})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://github.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Portfolio</label>
                  <input
                    type="url"
                    value={formData.links.portfolio}
                    onChange={(e) => setFormData({...formData, links: {...formData.links, portfolio: e.target.value}})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="https://yourportfolio.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 font-semibold"
              >
                Save Profile
              </button>
            </form>
          </div>
        ) : (
          profile ? (
            <div className="space-y-6">

              {/* Academic Info */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Academic Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div><p className="text-gray-500 text-sm">Roll Number</p><p className="font-semibold">{profile.rollNumber || "Not set"}</p></div>
                  <div><p className="text-gray-500 text-sm">Branch</p><p className="font-semibold">{profile.branch || "Not set"}</p></div>
                  <div><p className="text-gray-500 text-sm">Year</p><p className="font-semibold">{profile.year ? `${profile.year}${["st","nd","rd","th"][profile.year-1]} Year` : "Not set"}</p></div>
                  <div><p className="text-gray-500 text-sm">CGPA</p><p className="font-semibold">{profile.cgpa || "Not set"}</p></div>
                </div>
              </div>

              {/* Bio */}
              {profile.bio && (
                <div className="bg-white rounded-xl shadow p-6">
                  <h3 className="text-lg font-bold mb-2 text-gray-800">About Me</h3>
                  <p className="text-gray-600">{profile.bio}</p>
                </div>
              )}

              {/* Skills */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Skills</h3>
                {profile.skills?.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map((skill, i) => (
                      <span key={i} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-semibold">
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No skills added yet</p>
                )}
              </div>

              {/* Links */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Links</h3>
                <div className="space-y-2">
                  {profile.links?.linkedin && (
                    <a href={profile.links.linkedin} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-blue-600 hover:underline">
                      🔗 LinkedIn
                    </a>
                  )}
                  {profile.links?.github && (
                    <a href={profile.links.github} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-gray-800 hover:underline">
                      💻 GitHub
                    </a>
                  )}
                  {profile.links?.portfolio && (
                    <a href={profile.links.portfolio} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-green-600 hover:underline">
                      🌐 Portfolio
                    </a>
                  )}
                  {!profile.links?.linkedin && !profile.links?.github && !profile.links?.portfolio && (
                    <p className="text-gray-400">No links added yet</p>
                  )}
                </div>
              </div>

              {/* Resume */}
              <div className="bg-white rounded-xl shadow p-6">
                <h3 className="text-lg font-bold mb-4 text-gray-800">Resume</h3>
                {profile.resume?.url ? (
                  <div className="flex items-center justify-between">
                    <a href={profile.resume.url} target="_blank" rel="noreferrer"
                      className="text-indigo-600 hover:underline font-medium">
                      📄 View My Resume
                    </a>
                    <button onClick={handleDeleteResume}
                      className="text-red-500 hover:text-red-700 text-sm font-medium">
                      🗑 Delete Resume
                    </button>
                  </div>
                ) : (
                  <div>
                    <p className="text-gray-400 mb-3">No resume uploaded yet</p>
                    <input
                      type="file"
                      accept=".pdf"
                      onChange={handleResumeUpload}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                  </div>
                )}
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-xl shadow p-12 text-center">
              <p className="text-gray-400 text-xl mb-4">No profile found</p>
              <button
                onClick={() => setEditing(true)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700"
              >
                Create Profile
              </button>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Profile;