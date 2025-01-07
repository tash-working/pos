import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../navbar/Navbar";
import supabase from "../../helper/SupabaseClient";

const Settings = () => {
  const [isToggled, setIsToggled] = useState(false); // Manage Pay First toggle state
  const navigate = useNavigate();

  // Toggle Pay First button state
  const handleTogglePayFirst = () => {
    setIsToggled((prevState) => !prevState);
    console.log(`Pay First is now ${!isToggled ? "ON" : "OFF"}`);
  };

  // Logout function
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Clear localStorage and redirect to login
      localStorage.clear();
      console.log("Logged out successfully");
      navigate("/login"); // Use React Router for smooth navigation
    } catch (error) {
      console.error("Error logging out:", error.message);
      alert("An error occurred while logging out. Please try again.");
    }
  };

  return (
    <div>
      <Navbar />
      <div className="flex flex-col items-start p-6 space-y-6">
        {/* Pay First Toggle */}
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-800">Pay First</h1>
          <button
            onClick={handleTogglePayFirst}
            className={`px-6 py-2 rounded-lg text-white font-medium transition-colors ${
              isToggled
                ? "bg-green-500 hover:bg-green-600"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            {isToggled ? "ON" : "OFF"}
          </button>
        </div>

        {/* Edit  menu */}

        <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-6">
            Menu Customization Options
          </h2>
          <div className="flex flex-col space-y-4">
            <Link
              to={`/${JSON.parse(
                localStorage.getItem("id")
              )}/settings/add_item`}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Item
            </Link>
            <Link
              to={`/${JSON.parse(
                localStorage.getItem("id")
              )}/settings/delete_item`}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Delete Item
            </Link>
          </div>
        </div>

        {/* Logout Button */}
        <div>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
