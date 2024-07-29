import {useEffect, useState} from "react";

const NaverLogin = () => {
	const {naver} = window;
	const [user, setUser] = useState(null);

	const naverLogin = new naver.LoginWithNaverId({
		clientId: process.env.REACT_APP_NAVER_CLIENT_ID,
		callbackUrl: process.env.REACT_APP_NAVER_REDIRECT_URI,
		isPopup: false,
		loginButton: {
			color: "green",
			type: 3,
			height: 50
		},
	});

	const getUser = async () => {
		await naverLogin.getLoginStatus((status) => {
			console.log(`로그인?: ${status}`);
			if (status) {
				setUser({...naverLogin.user});
				window.history.replaceState({}, document.title, window.location.pathname);
			}
		});
	}

	const naverLogout = () => {
		localStorage.removeItem("com.naver.nid.access_token");
		window.location.reload();
	}

	useEffect(() => {
		const naverIdLoginElement = document.getElementById('naverIdLogin');
		if (naverIdLoginElement) {
			naverLogin.init();
			getUser();
		}
	},);

	console.log(user);

	return (
		<div>
			<div><h2>네이버 로그인</h2></div>
			{user ? (
				<div>
					<h2>네이버 로그인 성공!</h2>
					<h3>사용자 이름</h3>
					<div>{user.name}</div>
					<h3>사용자 아이디</h3>
					<div>{user.id}</div>
					<h3>사용자 프로필사진</h3>
					<img src = {user.profile_image} alt = "프로필 사진"/>
					<button onClick = {naverLogout}>로그아웃</button>
				</div>
			) : (
				// 네이버 로그인 버튼
				<div>
					<div id = "naverIdLogin"></div>
				</div>
			)}
		</div>
	);
}

export default NaverLogin;