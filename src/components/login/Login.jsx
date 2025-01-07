import React, { useEffect, useState } from "react";
import supabase from "../../helper/SupabaseClient";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Store the user ID in sessionStorage instead of localStorage
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    } else if (data.user) {
      console.log(data.user.id);
      localStorage.setItem("id", JSON.stringify(data.user.id)); // Use sessionStorage here
      setMessage("Login successful!");
      navigate(`/${data.user.id}`); // Navigate to the user-specific route
    }
  };

  useEffect(() => {
    const id =JSON.parse(localStorage.getItem("id")); // Check sessionStorage instead of localStorage
    if (id) {
      navigate(`/${id}`);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-extrabold mb-4 text-gray-800">Login</h1>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form
        onSubmit={handleLogin}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md flex flex-col items-center space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-700">Supabase Login</h1>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="flex justify-center w-full">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors w-full"
          >
            Login
          </button>
        </div>
      </form>
      <h2>
        Don't have an account? <Link to="/register">Sign Up</Link>
      </h2>
    </div>
  );
};

export default Login;
