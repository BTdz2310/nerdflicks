import React from 'react';
import {GithubLoginButton, GoogleLoginButton} from "react-social-login-buttons";
import {useGoogleLogin} from "@react-oauth/google";
import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
// import {socialLogin} from "../../features/auth/authSlice";
import { useCookies } from 'next-client-cookies';
import {useRouter} from "next/navigation";

const SocialLogin = () => {

    const dispatch = useDispatch();
    const router = useRouter();
    const cookies = useCookies();

    const loginToGoogle = useGoogleLogin({
        onSuccess:  async (tokenResponse: any) => {
            const response = await fetch(`http://localhost:5001/api/google/login?accessToken=${tokenResponse.access_token}`);
            const json = await response.json();
            if(response.status===200){
                cookies.set('token', json.access_token)
                toast.success(json.msg);
                router.push('/', {scroll : false});
            }else{
                toast.error(json.msg);
            }
        },
    })


    const loginToGithub = () => {
        window.location.assign(`https://github.com/login/oauth/authorize?client_id=Ov23liFyaFHHCEnUXAUo`)
    }


    return (
        <div className="login__social">
            <div className="login__social--or">
                <div className="login__social--line"></div>
                <span style={{color: 'rgb(108, 117, 125)'}}>hoặc</span>
                <div className="login__social--line"></div>
            </div>
            <div className="login__social-container">
                <GoogleLoginButton text='Google' onClick={()=>loginToGoogle()}/>
                <GithubLoginButton text='Github' onClick={()=>loginToGithub()}/>
            </div>
        </div>
    );
};

export default SocialLogin;