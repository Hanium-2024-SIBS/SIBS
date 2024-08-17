import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  const { email, name } = location.state || { email: "", name: "" };

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoggedInState = localStorage.getItem('isLoggedIn');
    return storedLoggedInState === 'true';
  });

  useEffect(() => {
    console.log(email, name);
    if (email && name) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);
      setIsLoggedIn(true);
    } else {
      const storedEmail = localStorage.getItem('userEmail');
      const storedName = localStorage.getItem('userName');
      if (storedEmail && storedName) {
        setIsLoggedIn(true);
      }
    }
  }, [email, name]);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      setIsLoggedIn(false);
      navigate('/login');
    } else {
      navigate('/login');
    }
  };

  const navigateToChatRoom = () => {
    navigate('/chatroom'); // '/chatroom' 경로로 이동
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      
      {isLoggedIn ? (
        <div>
          <p>Email: {localStorage.getItem('userEmail') || email}</p>
          <p>Name: {localStorage.getItem('userName') || name}</p>
        </div>
      ) : (
        <p>No user data available.</p>
      )}

      <button onClick={handleAuthAction}>
        {isLoggedIn ? 'Logout' : 'Login'}
      </button>

      {isLoggedIn && (
        <button onClick={navigateToChatRoom}>
          Go to Chat Room
        </button>
      )}
    </div>
  );
}

export default Home;
