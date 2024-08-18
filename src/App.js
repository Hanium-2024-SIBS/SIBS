import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Home';
import LoginSignUp from './Components/LoginSignup/LoginSignup';
import LoginKakao from './Components/LoginSignup/LoginKakao';
import LoginNaver from './Components/LoginSignup/LoginNaver';
import ChatRoom from './Components/ChatRoom/ChatRoom';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginSignUp />} />
        <Route path="/auth/kakao/callback" element={<LoginKakao />} />
        <Route path="/auth/naver/callback" element={<LoginNaver />} />
        <Route path="/chatroom" element={<ChatRoom />}/>
      </Routes>
    </Router>
  );
}

export default App;
