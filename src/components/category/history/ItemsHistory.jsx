import React, { useEffect, useState } from "react";
import Navbar from "../../navbar/Navbar";
import { Link } from "react-router-dom";

const ItemsHistory = () => {
  const [id, setId] = useState(null);

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("id"));
    setId(id); // Returns null if no user or parsing fails
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />

      {/* Navigation */}
      <nav className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <Link to={`/${id}/dashboard/history`} className="py-4 px-1">
              <span className="text-sm font-medium text-gray-500 hover:text-gray-700">
                Order History
              </span>
            </Link>
            <Link
              to={`/${id}/dashboard/history_items`}
              className="border-b-2 border-indigo-500 py-4 px-1"
            >
              <span className="text-sm font-medium text-indigo-600">
                Items History
              </span>
            </Link>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default ItemsHistory;
