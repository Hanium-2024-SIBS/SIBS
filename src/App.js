/*
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
*/

// import {Routes, Route, Navigate} from 'react-router-dom';
import {Routes, Route} from 'react-router-dom';

import KakaoLoginHandler from './login/KakaoLoginHandler';
import NaverLogin from './login/LoginNaver';

import Home from './Home';
import Root from './Root';

function App() {
	return (
			<Routes>
				<Route path = "/" element = {<Root/>}/>
				<Route path = "/auth/kakao/callback" element = {<KakaoLoginHandler/>}/>
				<Route path = "/home" element = {<Home/>}/>
				<Route path = "/naver" element = {<NaverLogin/>}/>
				{/*<Route path = "*" element = {<Navigate to = "/" replace = {true}/>}/>*/}
			</Routes>
	);
}

export default App;