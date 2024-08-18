import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginNaver = () => {
    const navigate = useNavigate();





    useEffect(() => {
        const fetchNaverUserData = async () => {
            try {
                const CLIENT_ID = process.env.REACT_APP_NAVER_CLIENT_ID;
                const REDIRECT_URI = process.env.REACT_APP_NAVER_REDIRECT_URI;
                const state = process.env.REACT_APP_NAVER_CLIENT_SECRET;
                
                // state 값을 로컬 스토리지에 저장

            
                const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&state=${state}`;
            
                window.location.href = NAVER_AUTH_URL;
                
                const NAVER_TOKEN_URL = 'https://nid.naver.com/oauth2.0/token';
                const NAVER_USER_INFO_URL = 'https://openapi.naver.com/v1/nid/me';
                
                const code = new URL(window.location.href).searchParams.get('code');
                const receivedState = new URL(window.location.href).searchParams.get('state');

                // 로컬 스토리지에 저장된 state 가져오기
                const originalState = localStorage.getItem('oauth_state');
                console.log("Original state:", originalState);
                console.log("Received state:", receivedState);

                if (receivedState !== originalState) {
                    console.error('Invalid state parameter');
                    return;
                }

                if (!code || !receivedState) {
                    console.error('Authorization code or state not found in URL');
                    return;
                }
                console.log("Authorization code:", code);

                console.log('Sending token request to Naver...');
                
                const tokenResponse = await axios.post(NAVER_TOKEN_URL, null, {
                    params: {
                        grant_type: 'authorization_code',
                        client_id: process.env.REACT_APP_NAVER_CLIENT_ID,
                        client_secret: process.env.REACT_APP_NAVER_CLIENT_SECRET,
                        code: code,
                        state: receivedState, // state 추가
                        redirect_uri: process.env.REACT_APP_NAVER_REDIRECT_URI,
                    },
                });

                console.log('Token response:', tokenResponse);

                if (tokenResponse.status !== 200) {
                    console.error('Failed to fetch access token:', tokenResponse.status, tokenResponse.statusText);
                    return;
                }

                const accessToken = tokenResponse.data.access_token;
                if (!accessToken) {
                    console.error('Access token not found in response:', tokenResponse.data);
                    return;
                }

                console.log('Access Token:', accessToken);

                // 사용자 정보 요청
                const userDataResponse = await axios.get(NAVER_USER_INFO_URL, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                    },
                });

                console.log('Naver API response:', userDataResponse);

                if (userDataResponse.status !== 200) {
                    console.error('Failed to fetch user data:', userDataResponse.status, userDataResponse.statusText);
                    return;
                }

                const userInfo = userDataResponse.data.response;
                if (!userInfo || !userInfo.name || !userInfo.email) {
                    console.error('User data is incomplete:', userInfo);
                    return;
                }

                console.log('Naver user data:', userInfo);

                // 로그인 후 SignUp 탭으로 이동하면서 사용자 정보를 전달
                navigate('/login', { state: { name: userInfo.name, email: userInfo.email } });

            } catch (error) {
                console.error('An error occurred while fetching the token or user data.');

                if (error.response) {
                    console.error('Error response data:', error.response.data);
                    console.error('Error response status:', error.response.status);
                    console.error('Error response headers:', error.response.headers);
                } else if (error.request) {
                    console.error('Error request:', error.request);
                } else {
                    console.error('General error message:', error.message);
                }
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