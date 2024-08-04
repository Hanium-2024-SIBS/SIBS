import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Components/LoginSignup/Home';
import LoginSignUp from './Components/LoginSignup/LoginSignup';

import {ApolloClient, ApolloProvider, InMemoryCache, HttpLink} from '@apollo/client';

const createApolloClient = () => {
  return new ApolloClient({
    link: new HttpLink({
      uri: "http://3.27.78.179/v1/graphql"
    }),
    cache: new InMemoryCache(),
  });
};

function App() {
  return (
    <ApolloProvider client={createApolloClient()}>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginSignUp />} />
        </Routes>
      </Router>
    </ApolloProvider>
  );
}

export default App;
