import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginNaver = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNaverUserData = async () => {
      const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';
      const NAVER_USER_INFO_URL = 'https://openapi.naver.com/v1/nid/me';

      const code = new URL(window.location.href).searchParams.get("code");
      const state = new URL(window.location.href).searchParams.get("state");

      if (!code || !state) {
        console.error('Authorization code or state not found in URL');
        return null;
      }

      try {
        console.log('Authorization Code:', code);
        console.log('State:', state);

        const savedState = sessionStorage.getItem('naver_oauth_state');
        if (state !== savedState) {
          console.error('OAuth state mismatch. Potential CSRF attack.');
          return;
        }

        const { data: tokenData } = await axios.post(NAVER_TOKEN_URL, null, {
          params: {
            grant_type: 'authorization_code',  // 발급을 위한 grant_type 설정
            client_id: process.env.REACT_APP_NAVER_CLIENT_ID,
            client_secret: process.env.REACT_APP_NAVER_CLIENT_SECRET,
            code,  // 인증 요청 API 호출에 성공하고 리턴받은 인증 코드
            state, // CSRF 방지를 위해 저장된 state 값
            redirect_uri: process.env.REACT_APP_NAVER_REDIRECT_URI, // 필요한 경우 URI를 포함
          },
        });

        const accessToken = tokenData.access_token;

        console.log('Access Token:', accessToken);

        const { data: userData } = await axios.get(NAVER_USER_INFO_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        // API 응답 데이터를 로그로 출력하여 구조 확인
        console.log('Naver API response:', userData);

        // Naver API로부터 받은 사용자 정보
        const userInfo = {
          name: userData.response.name,
          email: userData.response.email,
        };

        console.log('Naver user data:', userInfo);

        const savedUserData = JSON.parse(localStorage.getItem('userData'));
        if (savedUserData && savedUserData.email === userInfo.email) {
          navigate('/', { state: userInfo });
        } else {
          navigate('/signup', { state: userInfo });
        }

        return userInfo;
      } catch (error) {
        if (error.response) {
          console.error('Error response:', error.response.data);
          console.error('Error status:', error.response.status);
          console.error('Error headers:', error.response.headers);
        } else if (error.request) {
          console.error('Error request:', error.request);
        } else {
          console.error('General Error:', error.message);
        }
        return null;
      }
    };

    fetchNaverUserData();
  }, [navigate]);

  return (
    <div>
      <h1>Naver Login Callback</h1>
      <p>Loading user information...</p>
    </div>
  );
};

export default LoginNaver;
