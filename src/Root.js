import GoogleApp from "./LoginGoogle";
import KakaoApp from "./LoginKakao";

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