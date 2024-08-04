import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/LoginSignup/Home';
import LoginSignUp from './Components/LoginSignup/LoginSignup';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignUp />} />
      </Routes>
    </Router>
  );
}

export default App;
