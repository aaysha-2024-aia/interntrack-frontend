import React from "react";

const StatCard = ({ title, value }) => {
  return (
    <div className="bg-white shadow rounded-xl p-5">
      <h3 className="text-gray-500">{title}</h3>
      <h1 className="text-3xl font-bold mt-2">{value}</h1>
    </div>
  );
};

export default StatCard;