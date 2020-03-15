import React, { useState } from 'react'
import { Redirect } from 'react-router-dom'
import GoogleLogin from 'react-google-login'
import { socialLogin, authenticate } from '../auth'
 
const SocialLogin = () => {
    const [values, setValues] = useState({
        redirectToReferrer: false
    })

    const { redirectToReferrer } = values

    const responseGoogle = response => {
        console.log(response)
        const tokenId = response.tokenId
        const user = {
            tokenId: tokenId
        }
        // console.log("user obj to social login: ", user);
        socialLogin(user).then(data => {
            console.log("signin data: ", data);
            if (data.error) {
                // console.log("Error Login. Please try again..")
            } else {
                console.log("social login response from api", data)
                authenticate(data, () => {
                    setValues({ redirectToReferrer: true })
                })
            }
        })
    }

    const ToHome = () => {
        if (redirectToReferrer) {
            return <Redirect to="/" />;
        }
    }
 
    return(
        <div className="container">
            {ToHome()}
            <GoogleLogin
                clientId="1001890532399-eiiiv9o5447o3trgbg6drtumk0habi13.apps.googleusercontent.com"
                buttonText="Login with Google"
                onSuccess={responseGoogle}
                onFailure={responseGoogle}
            />
        </div>
    )
}
 
export default SocialLogin