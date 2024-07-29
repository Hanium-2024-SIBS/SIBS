import GoogleApp from "./login/LoginGoogle";
import KakaoApp from "./login/LoginKakao";

const Root = () => {
	return (
		<div className = {"App"}>
			<div className = {"Login"}>
				<GoogleApp/>
				<KakaoApp/>
			</div>
		</div>
	);
};

export default Root;