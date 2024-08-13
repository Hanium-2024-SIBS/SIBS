import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './LoginSignup.css';

// 이미지 및 기타 파일들
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

const kakaoOAuthHandler = () => {
  const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
  const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
  const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`;

  window.location.href = KAKAO_AUTH_URL;
};

const naverOAuthHandler = () => {
  const CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
  const REDIRECT_URI = process.env.REACT_APP_NAVER_REDIRECT_URI;
  const STATE = Math.random().toString(36).substring(2);
  const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&state=${STATE}`;

  window.location.href = NAVER_AUTH_URL;
};

function LoginSignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { name: kakaoName, email: kakaoEmail } = location.state || { name: "", email: "" };

  const [action, setAction] = useState("Login");
  const [leftContentIndex, setLeftContentIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState("show");
  const [email, setEmail] = useState(kakaoEmail || "");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(kakaoName || "");
  const [birthday, setBirthday] = useState("");
  const [isGoogleLoggedIn, setIsGoogleLoggedIn] = useState(false);
  const [isKakaoLoggedIn, setIsKakaoLoggedIn] = useState(!!kakaoEmail);

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
      const googleUserInfo = await fetchGoogleUserData();
      if (googleUserInfo) {
        console.log('Google User Info:', googleUserInfo); // 로그로 구글 사용자 정보 확인
        setName(googleUserInfo.name);
        setEmail(googleUserInfo.email);
        setIsGoogleLoggedIn(true);
        setAction("Sign Up"); // SignUp 탭으로 전환
  
        const savedUserData = JSON.parse(localStorage.getItem('userData'));
        if (savedUserData && savedUserData.email === googleUserInfo.email) {
          navigate('/home', { state: { email: googleUserInfo.email, name: googleUserInfo.name } });
        }
      }
    };
  
    fetchData();
  }, [navigate]);

  useEffect(() => {
    if (action === "Login") {
      setEmail("");
      setPassword("");
    } else if (action === "Sign Up") {
      if (isGoogleLoggedIn) {
        setEmail(email);
        setName(name);
      } else if (isKakaoLoggedIn) {
        setEmail(kakaoEmail);
        setName(kakaoName);
      }
    }
  }, [action, isGoogleLoggedIn, isKakaoLoggedIn, kakaoEmail, kakaoName, email, name]);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (action === "Sign Up") {
      const userData = { name, email, password, birthday };
      localStorage.setItem('userData', JSON.stringify(userData));
      alert(`Sign Up Data:\nName: ${name}\nEmail: ${email}\nPassword: ${password}\nBirthday: ${birthday}`);
      setIsGoogleLoggedIn(false);
      setIsKakaoLoggedIn(false);
      setAction("Login");
      setPassword("");
    } else {
      const savedUserData = JSON.parse(localStorage.getItem('userData'));
      if (savedUserData && savedUserData.email === email && savedUserData.password === password) {
        alert(`Login Data:\nEmail: ${email}\nPassword: ${password}`);
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userName', savedUserData.name);
        navigate('/', { state: { email, name: savedUserData.name } });
      } else {
        alert("Invalid email or password");
      }
    }
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
        <form onSubmit={handleSubmit}>
          <div className="inputs">
            {action === "Sign Up" && (
              <>
                {isGoogleLoggedIn || isKakaoLoggedIn || email ? (
                  <>
                    <div className="input">
                      <img src={user_icon} alt="User Icon" />
                      <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        readOnly
                      />
                    </div>
                    <div className="input">
                      <img src={email_icon} alt="Email Icon" />
                      <input
                        type="email"
                        placeholder="Email ID"
                        value={email}
                        readOnly
                      />
                    </div>
                    <div className="input">
                      <img src={password_icon} alt="Password Icon" />
                      <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <div className="input">
                      <img src={birthday_icon} alt="Birthday Icon" />
                      <input
                        type="date"
                        placeholder="Birthday"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                      />
                    </div>
                    <div className="input create-account">
                      <button type="submit">계정 만들기</button>
                    </div>
                  </>
                ) : (
                  <div className="social-login vertical">
                    <div className="social-button signup-button" onClick={kakaoOAuthHandler} style={{ backgroundImage: `url(${signup_kakao})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                    </div>
                    <div className="social-button signup-button" onClick={googleOAuthHandler} style={{ backgroundImage: `url(${signup_google})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                    </div>
                    <div className="social-button signup-button" onClick={naverOAuthHandler} style={{ backgroundImage: `url(${signup_naver})`, backgroundSize: 'contain', backgroundPosition: 'center', backgroundRepeat: 'no-repeat' }}>
                    </div>
                  </div>
                )}
              </>
            )}
            {action === "Login" && (
              <>
                <div className="input">
                  <img src={email_icon} alt="Email Icon" />
                  <input
                    type="email"
                    placeholder="Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="input">
                  <img src={password_icon} alt="Password Icon" />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="input login-button">
                  <button type="submit">로그인</button>
                </div>
              </>
            )}
          </div>
        </form>

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
