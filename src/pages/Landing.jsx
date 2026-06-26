import React, { useState } from "react";
import { Link } from "react-router-dom";

const Landing = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 px-6 md:px-12 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">IT</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">InternTrack <span className="text-indigo-600">Pro</span></h1>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
            <a href="#stats" className="text-gray-600 hover:text-indigo-600 transition-colors">Stats</a>
            <a href="#testimonials" className="text-gray-600 hover:text-indigo-600 transition-colors">Testimonials</a>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium transition-colors">
              Login
            </Link>
            <Link to="/register" className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors">
              Get Started
            </Link>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-600">
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-gray-100 pt-4 space-y-3">
            <a href="#features" className="block text-gray-600 hover:text-indigo-600 px-2">Features</a>
            <a href="#stats" className="block text-gray-600 hover:text-indigo-600 px-2">Stats</a>
            <Link to="/login" className="block text-gray-600 hover:text-indigo-600 px-2">Login</Link>
            <Link to="/register" className="block bg-indigo-600 text-white px-4 py-2 rounded-lg text-center">Get Started</Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 md:px-12 bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              🚀 Trusted by 500+ students across India
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Track Your
              <span className="text-indigo-600"> Internship </span>
              Journey
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto leading-relaxed">
              Manage applications, monitor interview progress, track offers,
              and organize your entire internship journey — all in one place.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register"
                className="px-8 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-lg">
                Start For Free →
              </Link>
              <Link to="/login"
                className="px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-colors text-lg">
                Login to Dashboard
              </Link>
            </div>
          </div>

          {/* Hero Stats Row */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto">
            {[
              { value: "500+", label: "Active Students" },
              { value: "1000+", label: "Applications" },
              { value: "250+", label: "Interviews" },
              { value: "120+", label: "Offers Received" },
            ].map((stat, i) => (
              <div key={i} className="text-center bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <div className="text-2xl font-bold text-indigo-600">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              A complete platform built for students to manage their internship journey professionally.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "📋",
                title: "Application Tracking",
                desc: "Track every internship application with real-time status updates from Pending to Offer.",
                color: "bg-blue-50",
              },
              {
                icon: "🎯",
                title: "Interview Management",
                desc: "Stay updated with interview schedules, modes, and preparation notes in one place.",
                color: "bg-purple-50",
              },
              {
                icon: "📊",
                title: "Analytics Dashboard",
                desc: "Visualize your internship progress with beautiful charts and statistics.",
                color: "bg-green-50",
              },
              {
                icon: "👤",
                title: "Smart Profile",
                desc: "Build a complete student profile with skills, resume, education, and social links.",
                color: "bg-orange-50",
              },
              {
                icon: "🔍",
                title: "Internship Search",
                desc: "Browse and filter hundreds of internship opportunities by role, location, and stipend.",
                color: "bg-pink-50",
              },
              {
                icon: "📄",
                title: "Resume Upload",
                desc: "Upload and manage your resume directly on the platform for easy applications.",
                color: "bg-yellow-50",
              },
            ].map((feature, i) => (
              <div key={i} className={`${feature.color} rounded-2xl p-8 hover:shadow-md transition-shadow`}>
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="stats" className="py-20 px-6 md:px-12 bg-indigo-600">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">Trusted by Students Nationwide</h2>
            <p className="text-indigo-200 text-lg">Real numbers from real students using InternTrack Pro</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "500+", label: "Students Registered", icon: "👨‍🎓" },
              { value: "1000+", label: "Applications Tracked", icon: "📋" },
              { value: "250+", label: "Interviews Scheduled", icon: "🎯" },
              { value: "120+", label: "Offers Received", icon: "🏆" },
            ].map((stat, i) => (
              <div key={i} className="bg-white bg-opacity-10 rounded-2xl p-6">
                <div className="text-4xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold text-white mb-2">{stat.value}</div>
                <div className="text-indigo-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-6 md:px-12 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">What Students Say</h2>
            <p className="text-gray-600 text-lg">Hear from students who landed their dream internships</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Rahul Sharma",
                role: "CS Student, IIT Delhi",
                text: "InternTrack Pro helped me stay organized during my internship hunt. I tracked 20+ applications and landed my dream role at Google!",
                avatar: "R",
                color: "bg-blue-500",
              },
              {
                name: "Priya Patel",
                role: "IT Student, NIT Surat",
                text: "The dashboard is amazing! I could see all my application statuses at a glance. Got placed at Microsoft thanks to proper tracking.",
                avatar: "P",
                color: "bg-purple-500",
              },
              {
                name: "Arjun Menon",
                role: "ECE Student, VIT",
                text: "Resume upload and profile management made it so easy to apply. The interview tracking feature is a game changer!",
                avatar: "A",
                color: "bg-green-500",
              },
            ].map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <p className="text-gray-600 leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${t.color} rounded-full flex items-center justify-center text-white font-bold`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{t.name}</div>
                    <div className="text-sm text-gray-500">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Ready to Track Your Internship Journey?
          </h2>
          <p className="text-gray-600 text-lg mb-10">
            Join 500+ students who are already using InternTrack Pro to land their dream internships.
          </p>
          <Link to="/register"
            className="px-10 py-4 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition-colors text-lg">
            Get Started For Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10 px-6 md:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">IT</span>
            </div>
            <span className="text-white font-bold">InternTrack Pro</span>
          </div>
          <p className="text-sm">© 2026 InternTrack Pro. Built for students, by students.</p>
          <div className="flex gap-6 text-sm">
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Landing;