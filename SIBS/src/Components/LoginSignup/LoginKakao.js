import axios from 'axios';
export const kakaoOAuthHandler = () => {
    const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
    const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`;
  
    window.location.href = KAKAO_AUTH_URL;
  };
  
  export const fetchKakaoUserData = async () => {
    const KAKAO_TOKEN_URL = 'https://kauth.kakao.com/oauth/token';
    const KAKAO_USER_INFO_URL = 'https://kapi.kakao.com/v2/user/me';
  
    const code = new URL(window.location.href).searchParams.get('code');
    if (!code) {
      return null;
    }
  
    try {
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
  
      const { data: userData } = await axios.get(KAKAO_USER_INFO_URL, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      return userData;
    } catch (error) {
      console.error('Error fetching Kakao user data:', error);
      return null;
    }
  };
  