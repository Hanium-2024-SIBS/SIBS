import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <button onClick={goToLogin}>Login</button>
    </div>
  );
}

export default Home;
