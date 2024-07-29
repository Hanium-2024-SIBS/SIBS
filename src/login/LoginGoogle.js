import {GoogleLogin, GoogleOAuthProvider} from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";

const GoogleLoginButton = () => {
	const clientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
	return (
		<>
			<GoogleOAuthProvider clientId = {clientId}>
				<GoogleLogin
					onSuccess = {(res) => {
						console.log(res);
						console.log(res.credential);

						const responsePayload = jwtDecode(res.credential);

						console.log("ID: " + responsePayload.sub);
						console.log('Full Name: ' + responsePayload.name);
						console.log('Given Name: ' + responsePayload.given_name);
						console.log('Family Name: ' + responsePayload.family_name);
						console.log("Image URL: " + responsePayload.picture);
						console.log("Email: " + responsePayload.email);
					}}
					onFailure = {(err) => {
						console.log(err);
					}}
				/>
			</GoogleOAuthProvider>
		</>
	);
};

export default GoogleLoginButton