import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginSignup.css';
import axios from 'axios';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import birthday_icon from '../Assets/birthday.png';
import logo_img from '../Assets/logo.png';
import chatting_img from '../Assets/chatting.png';
import minigame1_img from '../Assets/vote.png';
import minigame2_img from '../Assets/roulette.png';

import signup_google from '../Assets/signup_google.png';
import login_google from '../Assets/login_google.png';
import signup_naver from '../Assets/signup_naver.png';
import login_naver from '../Assets/login_naver.png';
import signup_kakao from '../Assets/signup_kakao.png';
import login_kakao from '../Assets/login_kakao.png';

import { googleOAuthHandler, fetchGoogleUserData } from './LoginGoogle';
import { kakaoOAuthHandler, fetchKakaoUserData } from './LoginKakao';

function LoginSignUp() {
  const [action, setAction] = useState("Login");
  const [leftContentIndex, setLeftContentIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState("show");
  const [userData, setUserData] = useState({ name: "", email: "", password: "", birthday: "" });
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(false);
  const [googleEmail, setGoogleEmail] = useState("");
  const [isKakaoLoggedIn, setIsKakaoLoggedIn] = useState(false);
  const [kakaoEmail, setKakaoEmail] = useState("");
  
  const naverOAuthURL = `https://nid.naver.com/oauth2.0/authorize?client_id=YOUR_NAVER_CLIENT_ID&response_type=code&redirect_uri=http://localhost:3000&state=STATE_STRING`;
  const naverOAuthHandler = () => {
    window.location.assign(naverOAuthURL);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFadeClass("fade");
      setTimeout(() => {
        setLeftContentIndex(prevIndex => (prevIndex + 1) % leftContents.length);
        setFadeClass("show");
      }, 2000);
    }, 7000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const userInfo = await fetchGoogleUserData();
      if (userInfo) {
        setUserData({ name: userInfo.name, email: userInfo.email, password: "", birthday: "" });
        setGoogleEmail(userInfo.email);
        setIsGoogleLoggedIn(true);

        const savedUserData = JSON.parse(localStorage.getItem('userData'));
        if (savedUserData && savedUserData.email === userInfo.email) {
          navigate('/');
        } else {
          setAction("Sign Up"); 
        }
      }
    };

    const fetchKakaoData = async () => {
      const userInfo = await fetchKakaoUserData();
      if (userInfo) {
        setUserData({ name: userInfo.properties.nickname, email: userInfo.kakao_account.email, password: "", birthday: "" });
        setKakaoEmail(userInfo.kakao_account.email);
        setIsKakaoLoggedIn(true);

        const savedUserData = JSON.parse(localStorage.getItem('userData'));
        if (savedUserData && savedUserData.email === userInfo.kakao_account.email) {
          navigate('/'); // 동일한 이메일이 있다면 Home.jsx로 이동
        } else {
          setAction("Sign Up"); // 동일한 이메일이 없다면 추가 정보 입력
        }
      }
    };

    fetchData();
    fetchKakaoData();
  }, [navigate]);

  useEffect(() => {
    if (action === "Login") {
      setUserData(prevState => ({ ...prevState, email: "", password: "" })); // 초기화
    } else if (action === "Sign Up" && (isGoogleLoggedIn || isKakaoLoggedIn)) {
      setUserData(prevState => ({
        ...prevState,
        email: isGoogleLoggedIn ? googleEmail : kakaoEmail
      }));
    }
  }, [action, isGoogleLoggedIn, googleEmail, isKakaoLoggedIn, kakaoEmail]);

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
      text: "방송도구를 활용한 실시간 소통",
      subText: "투표, 미니게임 등 다양한 확장 프로그램을 통해 시청자와 소통하세요!",
      imgSrc: [minigame1_img]
    }
  ];

  const { text, subText, imgSrc } = leftContents[leftContentIndex];

  const handleSubmit = () => {
    if (action === "Sign Up") {
      localStorage.setItem('userData', JSON.stringify(userData));
      alert(`Sign Up Data:\nName: ${userData.name}\nEmail: ${userData.email}\nPassword: ${userData.password}\nBirthday: ${userData.birthday}`);
      setIsGoogleLoggedIn(false); // Reset Google login state
      setIsKakaoLoggedIn(false); // Reset Kakao login state
      setAction("Login"); // Switch back to login
      setUserData(prevState => ({ ...prevState, password: "" })); // Reset password
    } else {
      const savedUserData = JSON.parse(localStorage.getItem('userData'));
      if (savedUserData && savedUserData.email === userData.email && savedUserData.password === userData.password) {
        alert(`Login Data:\nEmail: ${userData.email}\nPassword: ${userData.password}`);
        navigate('/'); // Redirect to Home.jsx
      } else {
        alert("Invalid email or password");
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

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
          {action === "Sign Up" && (
            <>
              {isGoogleLoggedIn || isKakaoLoggedIn ? (
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
                  <div className="input">
                    <img src={password_icon} alt="Password Icon" className="" />
                    <input 
                      type="password" 
                      placeholder="Password" 
                      name="password"
                      value={userData.password}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="input">
                    <img src={birthday_icon} alt="Birthday Icon" className="" />
                    <input 
                      type="date" 
                      placeholder="Birthday" 
                      name="birthday"
                      value={userData.birthday}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="input create-account" onClick={handleSubmit}>계정 만들기</div>
                </>
              ) : (
                <>
                  <div className="social-login vertical">
                    <div className="social-button signup-button" onClick={kakaoOAuthHandler} style={{ backgroundImage: `url(${signup_kakao})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                    </div>
                    <div className="social-button signup-button" onClick={googleOAuthHandler} style={{ backgroundImage: `url(${signup_google})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                    </div>
                    <div className="social-button signup-button" onClick={naverOAuthHandler} style={{ backgroundImage: `url(${signup_naver})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
          {action === "Login" && (
            <>
              <div className="input">
                <img src={email_icon} alt="Email Icon" className="" />
                <input 
                  type="email" 
                  placeholder="Email ID"
                  name="email"
                  value={userData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input">
                <img src={password_icon} alt="Password Icon" className="" />
                <input 
                  type="password" 
                  placeholder="Password" 
                  name="password"
                  value={userData.password}
                  onChange={handleInputChange}
                />
              </div>
              <div className="input login-button" onClick={handleSubmit}>로그인</div>
            </>
          )}
        </div>
        
        {action === "Login" && (
          <div className="social-login horizontal">
            <div className="social-button rect-button" onClick={kakaoOAuthHandler} style={{ backgroundImage: `url(${login_kakao})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            </div>
            <div className="social-button login-button" onClick={googleOAuthHandler} style={{ backgroundImage: `url(${login_google})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            </div>
            <div className="social-button login-button" onClick={naverOAuthHandler} style={{ backgroundImage: `url(${login_naver})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
            </div>
          </div>
        )}

        <div className="submit-container">
          <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { setAction("Sign Up"); }}>
            Sign Up
          </div>
          <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { setAction("Login"); }}>
            Login 
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSignUp;
