import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const [id, setId] = useState(undefined);
  const navigate = useNavigate();

  useEffect(() => {
    const storedId = localStorage.getItem('id');
    if (storedId) {
      const parsedId = JSON.parse(storedId);
      setId(parsedId);
      navigate(`/${parsedId}`);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  return <div>Home</div>;
};

export default Home;
