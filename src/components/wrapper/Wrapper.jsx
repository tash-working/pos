import React, { useEffect, useState } from 'react';
import supabase from '../../helper/SupabaseClient';
import { Navigate } from 'react-router-dom';

function Wrapper({ children }) {
  const [authenticated, setAuthenticated] = useState(null); // null indicates unknown state
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getSession = async () => {
    
        const {
          data: { session },
        } = await supabase.auth.getSession();

        setAuthenticated(!!session); // Set authenticated based on session
        setLoading(false);

    };

    // Get the session when the component mounts
    getSession();

  }, []);

  // Handle loading state
  if (loading) {
    return <div>Loading...</div>; // Show a loading indicator while session is being checked
  }

  // Redirect if not authenticated
  else if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Render children if authenticated
  return <>{children}</>;
}

export default Wrapper;
