import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import logo_img from '../Assets/logo.png';
import chatting_img from '../Assets/chatting.png';
import minigame1_img from '../Assets/vote.png';
import minigame2_img from '../Assets/roulette.png';

function App() {
  const [action, setAction] = useState("Login");
  const [leftContentIndex, setLeftContentIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState("show");
  const [userData, setUserData] = useState({ name: "", email: "" });
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(false); // Google 로그인 상태

  const google = <FontAwesomeIcon icon={faGoogle} size="2x" />;
  const oAuthURL = `https://accounts.google.com/o/oauth2/v2/auth?client_id=291815217838-rs2shve1q824p135226rob4nm0pt5o95.apps.googleusercontent.com&response_type=token&redirect_uri=http://localhost:3000&scope=https://www.googleapis.com/auth/userinfo.email`;

  const oAuthHandler = () => {
    window.location.assign(oAuthURL);
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFadeClass("fade");
      setTimeout(() => {
        setLeftContentIndex(prevIndex => (prevIndex + 1) % leftContents.length);
        setFadeClass("show");
      }, 2000); // 페이드아웃 효과를 위한 2초
    }, 7000); // 각 콘텐츠마다 7초 간격 (페이드아웃 2초 + 페이드인 2초 + 3초 표시 시간)

    // 컴포넌트 언마운트 시 인터벌 정리
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const url = new URL(window.location.href);
      const hash = url.hash;
      if (hash) {
        const accessToken = hash.split("=")[1].split("&")[0];
        try {
          const response = await axios.get('https://www.googleapis.com/oauth2/v2/userinfo?access_token=' + accessToken, {
            headers: {
              authorization: `Bearer ${accessToken}`,
              accept: 'application/json',
            },
          });
          console.log(response.data);
          setUserData({ name: response.data.name, email: response.data.email });
          setIsGoogleLoggedIn(true); // 구글 로그인 성공 상태 설정
        } catch (error) {
          console.log('oAuth token expired', error);
        }
      }
    };

    fetchData();
  }, []);

  const leftContents = [
    {
      text: "SIBS",
      subText: "Suwon Internet Broadcasting System",
      imgSrc: [logo_img]
    },
    {
      text: "AI를 통한 실시간 채팅 필터링",
      subText: "비속어 및 설정된 금지어를 자동으로 필터링하세요!",
      imgSrc: [chatting_img]
    },
    {
      text: "방송 도구를 활용한 실시간 소통",
      subText: "투표, 미니게임 등 다양한 확장 프로그램을 통해 시청자와 소통하세요!",
      imgSrc: [minigame1_img]
    }
  ];

  const { text, subText, imgSrc } = leftContents[leftContentIndex];

  return (
    <div className="container">
      <div className='left-container'>
        <div className={`text ${fadeClass}`}>{text}</div>
        <div className={`text2 ${fadeClass}`}>{subText}</div>
        <div className={`image-container ${fadeClass}`}>
          {imgSrc.map((src, index) => (
            <img key={index} src={src} alt="Content Image" className="logo-image" />
          ))}
        </div>
      </div>
      
      <div className='right-container'>
        <div className='header'>
          <div className='title'>{action}</div>
          <div className="underline"></div>
        </div>
        <div className="inputs">
          {(action === "Sign Up" && !isGoogleLoggedIn) && (
            <>
              <div className="input">
                <img src={user_icon} alt="User Icon" className="" />
                <input type="text" placeholder="Name" />
              </div>
              <div className="input">
                <img src={email_icon} alt="Email Icon" className="" />
                <input type="email" placeholder="Email ID" />
              </div>
            </>
          )}
          {((action === "Sign Up" && isGoogleLoggedIn) || action === "Login") && (
            <>
              {isGoogleLoggedIn && (
                <>
                  <div className="input">
                    <img src={user_icon} alt="User Icon" className="" />
                    <input 
                      type="text" 
                      placeholder="Name" 
                      value={userData.name} 
                      readOnly 
                    />
                  </div>
                  <div className="input">
                    <img src={email_icon} alt="Email Icon" className="" />
                    <input 
                      type="email" 
                      placeholder="Email ID" 
                      value={userData.email} 
                      readOnly 
                    />
                  </div>
                </>
              )}
              <div className="input">
                <img src={password_icon} alt="Password Icon" className="" />
                <input type="password" placeholder="Password" />
              </div>
            </>
          )}
        </div>
        {action === "Login" && (
          <div className="forgot-password">Lost Password? <span>Click Here!</span></div>
        )}
        
        <div className="social-login">
          <div className="social-button kakao">
            {action === "Login" ? "Login with Kakao" : "Sign Up with Kakao"}
          </div>
          <div className="social-button google" onClick={oAuthHandler}>
            {action === "Login" ? "Login with Google" : "Sign Up with Google"}
          </div>
        </div>

        <div className="submit-container">
          <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { setAction("Sign Up"); setIsGoogleLoggedIn(false); }}>
            Sign Up
          </div>
          <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { setAction("Login"); setIsGoogleLoggedIn(false); }}>
            Login
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
