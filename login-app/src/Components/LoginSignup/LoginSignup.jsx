import React, { useState, useEffect } from 'react';
import './LoginSignup.css';

import user_icon from '../Assets/person.png';
import email_icon from '../Assets/email.png';
import password_icon from '../Assets/password.png';
import logo_img from '../Assets/logo.png';
import chatting_img from '../Assets/chatting.png'
import minigame1_img from '../Assets/vote.png'
import minigame2_img from '../Assets/roulette.png'

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [leftContentIndex, setLeftContentIndex] = useState(0);
  const [fadeClass, setFadeClass] = useState("show");

  const leftContents = [
    {
      text: "SIBS",
      subText: "Suwon Internet Broadcasting System",
      imgSrc: [logo_img]
    },
    {
      text: "AI를 통한 실시간 채팅 필터링",
      subText: "비속어 및 설정된 금지어를 AI가 자동으로 필터링하세요!",
      imgSrc: [chatting_img]
    },
    {
      text: "확장 프로그램을 통한 실시간 소통",
      subText: "투표, 미니게임 등 다양한 확장 프로그램을 통해 시청자와 소통하세요!",
      imgSrc: [minigame1_img]
    }
  ];

  useEffect(() => {
    const intervalId = setInterval(() => {
      setFadeClass("fade");
      setTimeout(() => {
        setLeftContentIndex(prevIndex => (prevIndex + 1) % leftContents.length);
        setFadeClass("show");
      }, 2000); // 2 seconds for the fade-out effect
    }, 7000); // 7 seconds interval for each content (2 seconds fade-out + 2 seconds fade-in + 3 seconds display time)

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

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
          {action === "Login" ? <div></div> : (
            <div className="input">
              <img src={user_icon} alt="User Icon" className="" />
              <input type="text" placeholder="Name" />
            </div>
          )}
          
          <div className="input">
            <img src={email_icon} alt="Email Icon" className="" />
            <input type="email" placeholder="Email ID" />
          </div>
          <div className="input">
            <img src={password_icon} alt="Password Icon" className="" />
            <input type="password" placeholder="Password" />
          </div>
        </div>
        {action === "Sign Up" ? <div></div> : (
          <div className="forgot-password">Lost Password? <span>Click Here!</span></div>
        )}
        
        <div className="social-login">
          <div className="social-button kakao">
            {action === "Login" ? "Login with Kakao" : "Sign Up with Kakao"}
          </div>
          <div className="social-button google">
            {action === "Login" ? "Login with Google" : "Sign Up with Google"}
          </div>
        </div>

        <div className="submit-container">
          <div className={action === "Login" ? "submit gray" : "submit"} onClick={() => { setAction("Sign Up") }}>
            Sign Up
          </div>
          <div className={action === "Sign Up" ? "submit gray" : "submit"} onClick={() => { setAction("Login") }}>
            Login
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginSignup;
