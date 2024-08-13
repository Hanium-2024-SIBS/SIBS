import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginKakao = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchKakaoUserData = async () => {
      const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
      const KAKAO_USER_INFO_URL = 'https://kapi.kakao.com/v2/user/me';

      const code = new URL(document.location.toString()).searchParams.get('code');
      if (!code) {
        console.error('Authorization code not found in URL');
        return null;
      }

      try {
        console.log('Authorization Code:', code);

        const { data: tokenData } = await axios.post(KAKAO_TOKEN_URL, null, {
          params: {
            grant_type: 'authorization_code',
            client_id: process.env.REACT_APP_REST_API_KEY,
            redirect_uri: process.env.REACT_APP_REDIRECT_URI,
            code,
            client_secret: process.env.REACT_APP_CLIENT_SECRET,
          },
        });

        const accessToken = tokenData.access_token;

        console.log('Access Token:', accessToken);

        const { data: userData } = await axios.get(KAKAO_USER_INFO_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`, // 수정된 부분
          },
        });

        // API 응답 데이터를 로그로 출력하여 구조 확인
        console.log('Kakao API response:', userData);

        // Optional Chaining을 사용하여 안전하게 데이터에 접근
        const userInfo = {
          name: userData?.kakao_account?.name || 'Unknown',
          email: userData?.kakao_account?.email || userData?.kakao_account?.account_email || 'Unknown',
        };

        console.log('Kakao user data:', userInfo);

        const savedUserData = JSON.parse(localStorage.getItem('userData'));
        if (savedUserData && savedUserData.email === userInfo.email) {
          navigate('/', { state: userInfo });
        } else {
          navigate('/login', { state: userInfo });
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

    fetchKakaoUserData();
  }, [navigate]);

  return (
    <div>
      <h1>Kakao Login Callback</h1>
      <p>Loading user information...</p>
    </div>
  );
};

export default LoginKakao;