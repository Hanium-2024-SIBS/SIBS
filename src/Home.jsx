import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Home.module.css';
import logo from './Components/Assets/logo.png';
import LoginSignup from './Components/LoginSignup/LoginSignup'; // LoginSignup 컴포넌트를 불러옴
import { useModal } from './ModalContext';  // ModalContext 사용

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email, name } = location.state || { email: "", name: "" };
  const { isModalOpen, openModal, closeModal } = useModal();  // 모달 상태와 조작 함수 가져오기

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const storedLoggedInState = localStorage.getItem('isLoggedIn');
    return storedLoggedInState === 'true';
  });

  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || "";
  });

  useEffect(() => {
    if (email && name) {
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userEmail', email);
      localStorage.setItem('userName', name);
      setIsLoggedIn(true);
      setUserName(name);
    } else {
      const storedEmail = localStorage.getItem('userEmail');
      const storedName = localStorage.getItem('userName');
      if (storedEmail && storedName) {
        setIsLoggedIn(true);
        setUserName(storedName);
      }
    }
  }, [email, name]);

  const handleAuthAction = () => {
    if (isLoggedIn) {
      // Logout process
      localStorage.setItem('isLoggedIn', 'false');
      localStorage.removeItem('userEmail');
      localStorage.removeItem('userName');
      setIsLoggedIn(false);
      setUserName("");
      navigate('/');
    } else {
      openModal();  // Login 버튼을 누르면 모달 열기
    }
  };

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    // 여기서 모달을 닫지 않음
    setUserName(localStorage.getItem('userName'));
  };

  const navigateToHome = () => {
    navigate('/');  // 홈 화면으로 이동
  };

  return (
    <div className={styles.root}>
      <header className="w-full bg-white fixed top-0 left-0 shadow">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex-1 flex items-center">
              <a className="block text-teal-600" href="#" onClick={navigateToHome}>
                <span className="sr-only">Home</span>
                <img src={logo} alt="Logo" className="h-8" />
              </a>
              <h2 className="text-2xl font-semibold ml-1">SIBS</h2>
            </div>

            <div className="md:flex md:items-center md:gap-12">
              <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-center gap-6 text-sm">
                  <li><a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Live </a></li>
                  <li>
                    <button
                      className="text-gray-500 transition hover:text-gray-500/75"
                      onClick={() => navigate('/chatroom')}
                    >
                      Chat
                    </button>
                  </li>
                  <li><a className="text-gray-500 transition hover:text-gray-500/75" href="#"> History </a></li>
                  <li><a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Services </a></li>
                  <li><a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Projects </a></li>
                  <li><a className="text-gray-500 transition hover:text-gray-500/75" href="#"> Blog </a></li>
                </ul>
              </nav>

              <div className="flex items-center gap-4">
                <div className="sm:flex sm:gap-4">
                  {isLoggedIn ? (
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium text-gray-500">
                        환영합니다, {userName}님!
                      </span>
                      <button
                        className="rounded-md bg-red-500 px-4 py-2 text-sm font-medium text-white shadow"
                        onClick={handleAuthAction}
                      >
                        Logout
                      </button>
                    </div>
                  ) : (
                    <button
                      className="rounded-md bg-black px-5 py-2.5 text-sm font-medium text-white shadow"
                      onClick={handleAuthAction}
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Rest of your sections */}
      {/* ... */}
      
      {isModalOpen && (
        <>
          <div className={styles.overlay}></div> {/* 배경을 어둡게 하기 위한 오버레이 */}
          <div className={`${styles.loginSignupContainer} ${styles.showContainer}`}>
            <LoginSignup onLoginSuccess={handleLoginSuccess} />
            <button onClick={closeModal} className={styles.closeButton}>Close</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
