import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Home from './Home';
import LoginSignUp from './Components/LoginSignup/LoginSignup';
import LoginKakao from './Components/LoginSignup/LoginKakao';
import LoginNaver from './Components/LoginSignup/LoginNaver';
import ChatRoom from './Components/ChatRoom/ChatRoom';
import Query from './query-test/data';

import {ApolloClient, ApolloProvider, InMemoryCache} from '@apollo/client';
import {WebSocketLink} from 'apollo-link-ws';

const wsLink = new WebSocketLink({
	uri: "http://3.27.63.83:8080/v1/graphql", options: {
		reconnect: true
	}
});

const createApolloClient = () => {
	return new ApolloClient({
		link: wsLink, cache: new InMemoryCache()
	});
};

function App() {
	return (
		<ApolloProvider client = {createApolloClient()}>
			<Router>
				<Routes>
					<Route path = "/" element = {<Home/>}/>
					<Route path = "/login" element = {<LoginSignUp/>}/>
					<Route path = "/auth/kakao/callback" element = {<LoginKakao/>}/>
					<Route path = "/naver" element = {<LoginNaver/>}/>
					<Route path = "/query" element = {<Query/>}/>
					<Route path = "chatroom" element = {<ChatRoom/>}/>
				</Routes>
			</Router>
		</ApolloProvider>
	);
}

export default App;