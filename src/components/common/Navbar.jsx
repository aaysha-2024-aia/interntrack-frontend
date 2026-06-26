import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">IT</span>
          </div>
          <span className="text-xl font-bold text-gray-900">
            InternTrack <span className="text-indigo-600">Pro</span>
          </span>
        </Link>

        {/* Desktop Nav Links */}
        {user && (
          <div className="hidden md:flex items-center gap-1">
            {[
              { path: "/dashboard", label: "Dashboard", icon: "📊" },
              { path: "/internships", label: "Internships", icon: "🔍" },
              { path: "/applications", label: "Applications", icon: "📋" },
              { path: "/profile", label: "Profile", icon: "👤" },
            ].map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                  isActive(item.path)
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium text-sm">
                Login
              </Link>
              <Link to="/register" className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-600 text-xl"
        >
          {menuOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-6 py-4 space-y-2">
          {user ? (
            <>
              <div className="flex items-center gap-2 pb-3 border-b border-gray-100 mb-2">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-700">{user.name}</span>
              </div>
              {[
                { path: "/dashboard", label: "📊 Dashboard" },
                { path: "/internships", label: "🔍 Internships" },
                { path: "/applications", label: "📋 Applications" },
                { path: "/profile", label: "👤 Profile" },
              ].map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg font-medium transition-colors ${
                    isActive(item.path)
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-600 hover:text-indigo-600"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg font-medium"
              >
                🚪 Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 text-gray-600 hover:text-indigo-600 font-medium">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="block px-3 py-2 bg-indigo-600 text-white rounded-lg text-center font-medium">Get Started</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;