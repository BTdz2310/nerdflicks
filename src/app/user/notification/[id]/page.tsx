'use client'
import React, {Fragment, useEffect} from 'react';
import '@/styles/userPage.css'
import UserNavbar from "@/components/UserNavbar";
import useSWR from "swr";
import {useCookies} from "next-client-cookies";
import {useSelector} from "react-redux";
import {selectId, selectLoggedIn} from "@/store/features/userSlice/userSlice";
import {notifyRtn} from "@/components/Header";
import {Link} from "next-view-transitions";
import ReactLoading from "react-loading";
import {formatCreatedUtc, shortenString} from "@/utils/utils";
import {useRouter} from "next/navigation";
import {toast} from "react-toastify";
import ErrorPage from "next/error";
const Page = ({params}: {params: {id: string}}) => {

    const selectedLoggedIn = useSelector(selectLoggedIn);
    const selectedId = useSelector(selectId);
    const cookies = useCookies();
    const router = useRouter();

    // useEffect(() => {
    //     if(params.id!==selectedId){
    //         toast.error('Bạn không thể truy cập trang này!!!');
    //         router.push('/')
    //     }
    // }, []);

    const fetcherAuth = (url: string) =>
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${cookies.get('token')}`
            }
        }).then((res) => res.json());

    const { data: dataN, isLoading, mutate} = useSWR(selectedLoggedIn?`http://localhost:5001/api/notifications`:null, fetcherAuth,
        {
            revalidateIfStale: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true
        })

    if(isLoading) return (<div className='__loading-container'><ReactLoading type={'spinningBubbles'} color={'white'} height={50} width={50}/></div>)

    const handleRead = async (id: string, link: string) => {
        const response = await fetch(`http://localhost:5001/api/readNotify/${id}`,{
            headers: {
                'Authorization': `Bearer ${cookies.get('token')}`
            }
        })
        router.push(link)
    }

    const handleReadAll = async () => {
        const response = await fetch(`http://localhost:5001/api/readAllNotify`,{
            headers: {
                'Authorization': `Bearer ${cookies.get('token')}`
            }
        })
        await mutate();
    }

    return (
        <>
            {params.id===selectedId?(
                <div className='main__container user__container'>
                    <UserNavbar id={params.id}/>
                    <div className="user__right notify__container">
                        <div style={{display: 'flex', justifyContent: 'end'}}><p className='notify__readAll' onClick={()=>handleReadAll()}>Đánh Dấu Tất Cả Là Đã Đọc</p></div>
                        <div className="notify__list">
                            {dataN&&dataN.data.map((notify: notifyRtn)=>(
                                <div className='notify__item' key={notify._id} onClick={()=>handleRead(notify._id, notify.link)}>
                                    {/*<Link href={notify.link}>*/}
                                    <div className="notify__item-left">
                                        <img src={notify.img} alt="img"/>
                                    </div>
                                    <div className={notify.isRead?"notify__item-center notify__item-center--read":"notify__item-center"}>
                                        <h4>{shortenString(notify.content, 100)}</h4>
                                        <p>{formatCreatedUtc(notify.created_at)}</p>
                                    </div>
                                    <div className="notify__item-right">
                                        {!notify.isRead?<div className="__notify-circle"></div>:undefined}
                                    </div>
                                    {/*</Link>*/}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ):<ErrorPage statusCode={404}></ErrorPage>}
        </>
    );
};

export default Page;