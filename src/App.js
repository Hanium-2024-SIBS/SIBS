import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Home from './Home';
import LoginSignUp from './Components/LoginSignup/LoginSignup';
import LoginKakao from './Components/LoginSignup/LoginKakao';
import LoginNaver from './Components/LoginSignup/LoginNaver';
import ChatRoom from './Components/ChatRoom/ChatRoom';

import {ApolloClient, ApolloProvider, InMemoryCache, HttpLink} from '@apollo/client';

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: 'http://3.27.63.83:8080/v1/graphql'
    }),
    cache: new InMemoryCache(),
  });
};

function App() {
  return (
    <ApolloProvider client = {createApolloClient()}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignUp />} />
          <Route path="/auth/kakao/callback" element={<LoginKakao />} />
          <Route path="/naver" element={<LoginNaver />} />
          <Route path="chatroom" element={<ChatRoom />}/>
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
