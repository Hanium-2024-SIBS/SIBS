import {useNavigate} from "react-router-dom";
import {useEffect} from "react";
import axios from "axios";

/*const LoginHandeler = (props) => {
	const navigate = useNavigate();
	const code = new URL(window.location.href).searchParams.get("code");

	//인가코드 백으로 보내는 코드
	useEffect(() => {
		const kakaoLogin = async () => {
			await axios({
				method: "GET",
				url: `${process.env.REACT_APP_REDIRECT_URL}/?code=${code}`,
				headers: {
					"Content-Type": "application/json;charset=utf-8", //json형태로 데이터를 보내겠다는뜻
					"Access-Control-Allow-Origin": "*", //이건 cors 에러때문에 넣어둔것. 당신의 프로젝트에 맞게 지워도됨
				},
			}).then((res) => { //백에서 완료후 우리사이트 전용 토큰 넘겨주는게 성공했다면
				console.log(res);
				//계속 쓸 정보들( ex: 이름) 등은 localStorage에 저장해두자
				// localStorage.setItem("name", res.data.account.kakaoName);
				//로그인이 성공하면 이동할 페이지
				navigate("/home");
			});
		};
		kakaoLogin();
	}, [props.history]);

	return (
		<div className = "LoginHandeler">
			<div className = "notice">
				<p>로그인 중입니다.</p>
				<p>잠시만 기다려주세요.</p>
				<div className = "spinner"></div>
			</div>
		</div>
	);
};

export default LoginHandeler;*/

const KakaoCallback = (props) => {
	const navigate = useNavigate();

	useEffect(() => {
		const params = new URL(document.location.toString()).searchParams;
		const code = params.get('code');
		const grantType = "authorization_code";
		const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
		const REDIRECT_URI = process.env.REACT_APP_REDIRECT_URI;
		const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;

		axios.post(
			`https://kauth.kakao.com/oauth/token?grant_type=${grantType}&client_id=${REST_API_KEY}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URI}&code=${code}`,
			{},
			{headers: {"Content-type": "application/x-www-form-urlencoded;charset=utf-8"}}
		)
			.then((res) => {
				console.log(res);
				const {access_token} = res.data;
				axios.post(
					`https://kapi.kakao.com/v2/user/me`,
					{},
					{
						headers: {
							Authorization: `Bearer ${access_token}`,
							"Content-type": "application/x-www-form-urlencoded;charset=utf-8",
						}
					}
				)
					.then((res) => {
						console.log('2번쨰', res);
						navigate("/home");
					})
			})
			.catch((Error) => {
				console.log(Error)
			})
	},)

	return (
		<>
		</>
	)
}
export default KakaoCallback;