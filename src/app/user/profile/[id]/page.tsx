'use client'
import React, {useEffect, useRef, useState} from 'react';
import '@/styles/userPage.css'
import useSWR from "swr";
import {fetcher} from "@/utils/utils";
import {Spinner} from "react-bootstrap";
import ErrorPage from "@/components/ErrorPage";
import {useSelector} from "react-redux";
import {selectId} from "@/store/features/userSlice/userSlice";
import {toast} from "react-toastify";
import {useCookies} from "next-client-cookies";
import UserNavbar from "@/components/UserNavbar";
import ReactLoading from 'react-loading';

const backgroundRandom = ['https://4kwallpapers.com/images/walls/thumbs_3t/8621.jpeg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8616.jpeg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8626.jpeg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8574.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8538.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8633.jpeg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8618.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8623.jpeg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8582.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8568.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8608.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8610.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8604.jpg', 'https://4kwallpapers.com/images/walls/thumbs_3t/8404.png'];

function hasSpecialChars(str: string) {
    const specialCharsRegex: RegExp = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    return specialCharsRegex.test(str);
}

const checkEmail = (str: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(str);
}


const Page = ({ params }: { params: { id: string } }) => {

    const selectedId = useSelector(selectId);

    // const [data, setData] = useState({});
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('');
    const [background, setBackground] = useState('');
    const [email, setEmail] = useState('');
    const [checkedUsername, setCheckedUsername] = useState<boolean|null>(null);
    const [checkedEmail, setCheckedEmail] = useState<boolean|null>(null);
    const [uploadAvatar, setUploadAvatar] = useState<File|null>(null);
    const [showBG, setShowBG] = useState(false);
    const [loading, setLoading] = useState(false);

    const cookies = useCookies();

    const usernameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);

    const { data, error,isLoading } = useSWR(`http://localhost:5001/api/user/${params.id}`, fetcher,
        {
            revalidateIfStale: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true
        })

    // useEffect(() => {
    //     console.log(data,params.id===selectedId)
    //     if (typeof data === "undefined") return;
    //     if(params.id===selectedId){
    //         console.log(data)
    //         setUsername(data.user.username);
    //         setAvatar(data.user.avatar);
    //         setBackground(data.user.background);
    //         setEmail(data.user.email);
    //     }
    // }, [data]);

    useEffect(() => {
        if(usernameRef!==null&&usernameRef.current!==null) {
            usernameRef.current.style.borderBottom = '1px solid white';
        }
        if(data){
            if(username!==data.user.username){
                setCheckedUsername(false);
            }else{
                setCheckedUsername(null);
            }
        }
    }, [username]);

    useEffect(() => {
        if(emailRef!==null&&emailRef.current!==null) {
            emailRef.current.style.borderBottom = '1px solid white';
        }
        if(data){
            if(email!==data.user.email){
                setCheckedEmail(false);
            }else{
                setCheckedEmail(null);
            }
        }
    }, [email]);

    if(isLoading) return (<div className='__loading-container'><ReactLoading type={'spinningBubbles'} color={'white'} height={50} width={50}/></div>)

    if(!data.user) return <ErrorPage />

    const handleUsername = () => {
        if(!username){
            setUsername(data.user.username);
        }
        if(usernameRef!==null&&usernameRef.current!==null){
            usernameRef.current.readOnly = false;
            usernameRef.current.focus();
        }
    }

    const clearData = () => {
        setUsername('')
        setAvatar('')
        setBackground('')
        setEmail('')
        setCheckedUsername(null)
        setCheckedEmail(null)
        setUploadAvatar(null)
        setShowBG(false)
    }

    const handleEmail = () => {
        if(!email){
            setEmail(data.user.email);
        }
        if(emailRef!==null&&emailRef.current!==null){
            emailRef.current.readOnly = false;
            emailRef.current.focus();
        }
    }

    const handleCheckUsername = async () => {

        console.log(hasSpecialChars(username))

        if(username.length<6){
            toast.error('Tên username phải dài hơn 6 kí tự');
            if(usernameRef&&usernameRef.current){
                usernameRef.current.readOnly = false;
                usernameRef.current.focus();
                usernameRef.current.style.borderBottom = '1px solid red';
            }
            return;
        }

        if(hasSpecialChars(username)){
            toast.error('Tên username không được chứa các kí tự đặc biệt');
            if(usernameRef&&usernameRef.current){
                usernameRef.current.readOnly = false;
                usernameRef.current.focus();
                usernameRef.current.style.borderBottom = '1px solid red';
            }
            return;
        }

        const response = await fetch(`http://localhost:5001/api/checkUsername/${username}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });
        const json = await response.json();
        console.log(json)
        if(response.status===200){
            toast.success(json.msg);
            setCheckedUsername(true);
            if(usernameRef&&usernameRef.current){
                usernameRef.current.readOnly = true;
                usernameRef.current.style.borderBottom = '1px solid green';
            }
        }else{
            toast.error(json.msg);
            setCheckedUsername(false);
            if(usernameRef&&usernameRef.current){
                usernameRef.current.readOnly = false;
                usernameRef.current.focus();
                usernameRef.current.style.borderBottom = '1px solid red';
            }
        }
    }

    const handleCheckEmail = async () => {

        if(!checkEmail(email)){
            toast.error('Email không hợp lệ');
            if(emailRef&&emailRef.current){
                emailRef.current.readOnly = false;
                emailRef.current.focus();
                emailRef.current.style.borderBottom = '1px solid red';
            }
            return;
        }

        const response = await fetch(`http://localhost:5001/api/checkEmail/${email}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
            },
        });
        const json = await response.json();
        console.log(json)

        if(response.status===200){
            toast.success(json.msg);
            setCheckedEmail(true);
            if(emailRef&&emailRef.current){
                emailRef.current.readOnly = true;
                emailRef.current.style.borderBottom = '1px solid green';
            }
        }else{
            toast.error(json.msg);
            setCheckedEmail(false);
            if(emailRef&&emailRef.current){
                emailRef.current.readOnly = false;
                emailRef.current.focus();
                emailRef.current.style.borderBottom = '1px solid red';
            }
        }
    }

    console.log(data)

    const handleSubmit = async () => {
        console.log(checkedUsername)

        if(checkedUsername===false){
            toast.error('Vui lòng kiểm tra username')
            return
        }
        if(checkedEmail===false){
            toast.error('Vui lòng kiểm tra email')
            return
        }
        setLoading(true);
        let imgAvatar = '';
        if(uploadAvatar) {
            const formData = new FormData();
            formData.append('file', uploadAvatar);
            formData.append('upload_preset', 'an5vueim');

            const response = await fetch('https://api.cloudinary.com/v1_1/dmcrzul2v/image/upload', {
                method: 'POST',
                body: formData
            })
            const json = await response.json();
            imgAvatar = json.url;
        }

        const response = await fetch(`http://localhost:5001/api/user/${params.id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${cookies.get('token')}`
            },
            body: JSON.stringify({
                username: username||data.user.username,
                email: email||data.user.email,
                background: background||data.user.background,
                avatar: imgAvatar||data.user.avatar
            })
        });
        const json = await response.json();
        setLoading(false);
        if(response.status===200){
            toast.success(json.msg)
            // clearData();
        }else{
            toast.error(json.msg)
        }
    }

    const previewAvatar = (event: React.ChangeEvent<HTMLInputElement>) => {
        if(!avatar){
            setAvatar(data.user.avatar);
        }
        const file = event.target.files ? event.target.files[0] : null;
        setUploadAvatar(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatar(reader.result ? reader.result.toString() : '');
            };
            reader.readAsDataURL(file);
        } else {
            // setAvatar('');
        }
    }

    const handleBackground = (img: string) => {
        setBackground(img);
        setShowBG(false)
    }

    const checkButton = () => {
        return (!username || username===data.user.username) && (!email || email===data.user.email) && (!background || background===data.user.background) && !avatar && !uploadAvatar;
    }

    return (
        <div className='main__container user__container'>
            <UserNavbar />
            <div className="user__right">
                {loading?(<div className='__loading-container'><ReactLoading type={'spinningBubbles'} color={'white'} height={50} width={50}/></div>):(
                    <>
                        <div className="user__right-first">
                            <div className='user__background'>
                                <img src={background || data.user.background} alt="background"/>
                                {params.id === selectedId && (
                                    <p style={{
                                        position: 'absolute',
                                        bottom: '20px',
                                        right: '20px',
                                        backgroundColor: '#171717',
                                        color: 'rgb(253, 57, 195)',
                                        padding: '10px 20px',
                                        borderRadius: '12px',
                                        cursor: 'pointer'
                                    }} onClick={() => setShowBG(prev => !prev)}>Thay Background</p>
                                )}
                                {showBG && (
                                    <div className="user__background-table" onWheel={(e) => e.stopPropagation()}>
                                        {backgroundRandom.map((img: string) => (
                                            <img src={img} alt="background-change" loading='lazy' key={img}
                                                 style={{border: img === (background || data.user.background) ? '1px solid rgb(253, 57, 195)' : 'none'}}
                                                 onClick={() => handleBackground(img)}/>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="user__right--info">
                                <div className="user__right--info-left">
                                    <div className="user__right--info-img">
                                        <img src={avatar || data.user.avatar} alt="avatar"/>
                                        {params.id === selectedId && (
                                            <p style={{
                                                paddingTop: '10px',
                                                fontSize: '14px',
                                                textAlign: 'right',
                                                color: 'rgb(253, 57, 195)'
                                            }}>
                                                <label style={{cursor: 'pointer'}}>Thay Đổi
                                                    <input style={{display: 'none'}} type="file" accept='.jpg,.jpeg,.png'
                                                           onChange={(e) => previewAvatar(e)}/>
                                                </label>
                                            </p>
                                        )}
                                    </div>
                                    <h2>{data.user.username}</h2>
                                </div>
                                <div className="user__right--info-right">
                                    <p>{`${data.user.followers.length} đang theo dõi`}</p>
                                    <p>{`${data.user.followings.length} người theo dõi`}</p>
                                </div>
                            </div>
                        </div>
                        {params.id === selectedId && (
                            <div className="user__right-second">
                                <table className="user__right-table">
                                    <tbody>
                                    <tr>
                                        <td className="user__right-label">Username</td>
                                        <td className='user__right-text'>
                                            <input ref={usernameRef} type="text" readOnly={true}
                                                   value={username || data.user.username}
                                                   onChange={(e) => setUsername(e.target.value)}/>
                                            <i className="fa-solid fa-pen-to-square" onClick={() => handleUsername()}></i>
                                            {(username && username !== data.user.username) && (
                                                <p className={'user__right-check'} onClick={() => handleCheckUsername()}>Kiểm
                                                    Tra</p>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="user__right-label">Email</td>
                                        <td className='user__right-text'>
                                            <input ref={emailRef} type="text" readOnly={true} value={email || data.user.email}
                                                   onChange={(e) => setEmail(e.target.value)}/>
                                            <i className="fa-solid fa-pen-to-square" onClick={() => handleEmail()}></i>
                                            {(email && email !== data.user.email) && (
                                                <p className={'user__right-check'} onClick={() => handleCheckEmail()}>Kiểm Tra</p>
                                            )}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className="user__right-label">Mật Khẩu</td>
                                        <td className='user__right-text'>
                                            <input type="text" readOnly={true} value={'************'}/>
                                            <i className="fa-solid fa-pen-to-square" onClick={()=>toast.info('Chức năng này chưa được hoàn thành.')}></i>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <div className='user__right-button'>
                                    <button disabled={checkButton()} onClick={() => handleSubmit()}>Xác Nhận</button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default Page;