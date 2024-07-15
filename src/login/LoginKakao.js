/*
import KakaoLogin from "react-kakao-login";

const SocialKakao =()=>{

    const kakaoClientId = 'f9d642ed254301af08807f905ae6cb7d'
    const kakaoOnSuccess = async (data)=>{
      	console.log(data)
        const idToken = data.response.access_token  // 엑세스 토큰 백엔드로 전달
    }
    const kakaoOnFailure = (error) => {
        console.log(error);
    };
    return(
        <>
          <KakaoLogin
              token={kakaoClientId}
              onSuccess={kakaoOnSuccess}
              onFail={kakaoOnFailure}
          />
        </>
    )
}

export default SocialKakao*/

import kakaoImage from './assets/Kakao.png';

const CLIENT_ID = process.env.REACT_APP_REST_API_KEY;
const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;

/*export const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`;

const KakaoLoginButton = () => {
	return (
		<>
			<a href = {KAKAO_AUTH_URL} className = "kakaobtn">
				{/!*<img src = {process.env.PUBLIC_URL + `assets/Kakao.png`}/>*!/}
				<img src = {kakaoImage} alt = {"카카오 로그인"}/>
			</a>
		</>
	);
};*/

const KakaoLogin = () => {
	const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`

	return (
		<img
			alt = "카카오 로그인"
			src = {kakaoImage}
			/*width = "255"
			height = "35"
			style = {{margin: '0px 24px 16px 24px'}}*/
			onClick = {() => window.location.href = kakaoURL}
		/>
	)
}

export default KakaoLogin;