import React from "react";
import { useParams } from "react-router-dom";

const InternshipDetails = () => {
  const { id } = useParams();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-xl shadow">

        <h1 className="text-3xl font-bold text-gray-800">
          Internship Details
        </h1>

        <p className="text-gray-500 mt-2">
          Internship ID: {id}
        </p>

        <div className="mt-6">
          <h2 className="text-xl font-bold">Frontend Developer Intern</h2>
          <p className="text-gray-600">Google</p>

          <div className="mt-4 text-gray-700">
            <p>📍 Location: Remote</p>
            <p>💰 Stipend: ₹20,000/month</p>
          </div>

          <div className="mt-6">
            <h3 className="font-bold">Description</h3>
            <p className="text-gray-600 mt-2">
              Work on real-world frontend projects using React.js, build UI components,
              and collaborate with experienced engineers.
            </p>
          </div>

          <div className="mt-6 flex gap-4">
            <button className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">
              Apply Now
            </button>

            <button className="bg-blue-600s text-white px-4 py-2 rounded hover:bg-blue-700">
              Save Internship
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default InternshipDetails;