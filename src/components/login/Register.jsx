import React, { useEffect, useState } from "react";
import { useNavigate, Link, Navigate } from "react-router-dom";
import supabase from "../../helper/SupabaseClient";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [message, setMessage] = useState("");
  const [redirectTo, setRedirectTo] = useState(null);

  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();
    setMessage("");

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      console.log(error.message);
      setMessage("Error: " + error.message);
      return;
    }

    if (data?.user) {
      const userId = data.user.id;
      console.log("User ID:", userId);

      fetch(`https://server-08ld.onrender.com/${userId}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          email,
        }),
      })
        .then((response) => response.json())
        .then(() => {
          navigate("/login"); // Redirect to login page
        })
        .catch((error) => console.error("Error fetching data:", error));
    }

    setEmail("");
    setPassword("");
    setBusinessName("");
  };

  useEffect(() => {
    const id = JSON.parse(localStorage.getItem("id"));
    if (id) {
      setRedirectTo(`/${id}`);
    }
  }, []);

  if (redirectTo) {
    return <Navigate to={redirectTo} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-3xl font-extrabold mb-4 text-gray-800">Register</h1>
      {message && <p className="text-green-500 mb-4">{message}</p>}
      <form
        onSubmit={handleSignUp}
        className="bg-white shadow-md rounded-lg p-6 w-full max-w-md flex flex-col items-center space-y-4"
      >
        <h1 className="text-2xl font-bold text-gray-700">
          Supabase Authentication
        </h1>
        <input
          type="text"
          placeholder="Business Name"
          value={businessName}
          onChange={(e) => setBusinessName(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
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
            Sign Up
          </button>
        </div>
      </form>
      <h2 className="mt-4">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-500 hover:underline">
          Login
        </Link>
      </h2>
    </div>
  );
};

export default Register;
