'use client'
import React from 'react';
import UserNavbar from "@/components/UserNavbar";
import '@/styles/userPage.css'
import "@/styles/forum.css";
import useSWR from "swr";
import ReactLoading from "react-loading";
import {useSelector} from "react-redux";
import {selectId, selectLoggedIn} from "@/store/features/userSlice/userSlice";
import {useCookies} from "next-client-cookies";
import {Link} from "next-view-transitions";
import {fetcher, shortenString} from "@/utils/utils";
import {postI} from "@/app/forum/page";

const Page = ({params}: {params: {id: string}}) => {

    const selectedLoggedIn = useSelector(selectLoggedIn);
    const selectedId = useSelector(selectId);
    const cookies = useCookies();

    const fetcherAuth = (url: string) =>
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${cookies.get('token')}`
            }
        }).then((res) => res.json());

    const { data, isLoading, mutate} = useSWR(selectedLoggedIn?`http://localhost:5001/api/getPostAuth/${params.id}`:`http://localhost:5001/api/getPostNoAuth/${params.id}`, selectedLoggedIn?fetcherAuth:fetcher,
        {
            revalidateIfStale: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true
        })

    if(isLoading) return (<div className='__loading-container'><ReactLoading type={'spinningBubbles'} color={'white'} height={50} width={50}/></div>)

    console.log(data)

    return (
        <div className='main__container user__container'>
            <UserNavbar id={params.id}/>
            <div className="user__right user-post__container">
                {selectedId===params.id?(
                    <div className="forum__head">
                        <Link href={!cookies.get('token')?'/login':'/forum/new'}><i className="fa-solid fa-plus"></i>Bài Viết Mới</Link>
                    </div>
                ):undefined}
                {data&&data.data.map((post: postI)=>(
                    <div key={post._id} className='user-post__card'>
                        <div className="post__card--left">
                            <div className="post__card--left-info">
                                <img src={post.author.avatar} alt="avatar"/>
                                <p>{post.author.username}</p>
                                {selectedId===params.id?(
                                    <>
                                        {post.isPublic?(
                                            <>
                                                <p className='user-post__public'>Đã Đăng</p>
                                                <p className='user-post__private' style={{cursor: 'pointer'}}><Link href={`/forum/update/${post._id}`}><i className="fa-solid fa-gear" style={{marginRight: '10px'}}></i>Chỉnh Sửa</Link></p>
                                            </>
                                        ):(<p className='user-post__private'>Chưa Đăng</p>)}
                                    </>
                                ):undefined}
                            </div>
                            <div className="post__card--left-overview">
                                <h3><Link href={`/${post.isPublic?'post/main':'forum/update'}/${post._id}`}>{post.title}</Link></h3>
                                <p className='post__card--content'>{shortenString(post.content, 200)}</p>
                                <div className='post__card--tags'>{post.tags.map((tag: string)=>(
                                    <p key={tag}>{tag}</p>
                                ))}</div>
                            </div>
                        </div>
                        <div className="post__card--right">
                            {post.list_review&&(
                                <>
                                    {post.list_review[0]&&(
                                        <img className='post__card--img1' src={`https://media.themoviedb.org/t/p/w188_and_h282_bestv2${post.list_review[0].poster_path}`} alt='img1'/>
                                    )}
                                    {post.list_review[1]&&(
                                        <img className='post__card--img2' src={`https://media.themoviedb.org/t/p/w188_and_h282_bestv2${post.list_review[1].poster_path}`} alt='img2'/>
                                    )}
                                    {post.list_review[2]&&(
                                        <img className='post__card--img3' src={`https://media.themoviedb.org/t/p/w188_and_h282_bestv2${post.list_review[2].poster_path}`} alt='img3'/>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;