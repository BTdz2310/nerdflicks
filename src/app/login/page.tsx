'use client'
import React, {useEffect, useState} from 'react';
import { Link } from 'next-view-transitions'
import "@/styles/auth.css";
import SocialLogin from "@/components/SocialLogin";
import {toast} from "react-toastify";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import { useCookies } from 'next-client-cookies';
import {setUser} from "@/store/features/userSlice/userSlice";
import {useDispatch} from "react-redux";

const Page = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [show1, setShow1] = useState(true);
    const router = useRouter();
    const cookies = useCookies();
    const dispatch = useDispatch();

    const searchParams = useSearchParams()

    const backFrom = searchParams.get('from')

    useEffect(() => {
        if(cookies.get('token')){
            router.push('/')
        }
    }, []);

    const reset = () => {
        setUsername('');
        setPassword('');
    }

    const handleSubmit = async (e:any) => {
        e.preventDefault();

        if(!username || !password) return;

        const data = {
            username: username,
            password: password
        };

        reset();

        const response = await fetch('https://nerdflicks-backend.vercel.app/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
            body: JSON.stringify(data)
        });
        const json = await response.json();

        if(response.status === 200){
            dispatch(setUser(json));
            toast.success('Đăng Nhập Thành Công');
            cookies.set('token', json.access_token);
            router.push(`${backFrom ? backFrom : '/'}`, {scroll : false});
        }else{
            toast.error(json);
        }
    }

    return (
        <div className="main__container login__form">
            <form onSubmit={(e)=>handleSubmit(e)} className="box">
                <h1>Đăng Nhập</h1>
                <input type="text" name="" placeholder="Tên Đăng Nhập" value={username} onChange={(e)=>setUsername(e.target.value)}/>
                {/*<input type="password" name="" placeholder="Password" value={password} onChange={(e)=>setPassword(e.target.value)} />*/}
                <div className="passTxt">
                    <input type={show1?"password":"text"} name="" placeholder="Mật Khẩu" value={password} onChange={(e)=>setPassword(e.target.value)} />
                    {show1?(<i className="fa-regular fa-eye hidePass" id={password.length===0?'hidePass':undefined} onClick={()=>setShow1(prev=>!prev)}></i>):(<i className="fa-regular fa-eye-slash hidePass" id={password.length===0?'hidePass':undefined} onClick={()=>setShow1(prev=>!prev)}></i>)}
                </div>
                <Link className="signup text-muted" href={`/register?from=${encodeURIComponent(backFrom||'/')}`}>Chưa có tài khoản?&nbsp; Đăng ký</Link>
                <input type="submit" name="" value="Đăng Nhập" />
                <SocialLogin />
            </form>
        </div>
    );
};

export default Page;