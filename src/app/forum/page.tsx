'use client'
import React from 'react';
import "@/styles/forum.css";
import {Link} from "next-view-transitions";
import {Spinner} from "react-bootstrap";
import useSWR from "swr";
import {fetcher, shortenString} from "@/utils/utils";
import {nowPlayingMovie} from "@/components/type/typeSome";
import {useCookies} from "next-client-cookies";
import ReactLoading from "react-loading";

export interface postI{
    author: {
        _id: string,
        username: string,
        avatar: string
    },
    created_at: number,
    updated_at: Array<number>,
    tags: Array<string>,
    title: string,
    content: string,
    list_review: Array<nowPlayingMovie>,
    isPublic: boolean,
    _id: string
}

const Page = () => {

    const cookies = useCookies();

    const { data, error,isLoading } = useSWR('http://localhost:5001/api/posts', fetcher,
        {
            revalidateIfStale: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true
        })

    if(isLoading) return (<div className='__loading-container'><ReactLoading type={'spinningBubbles'} color={'white'} height={50} width={50}/></div>)

    console.log(data)

    return (
        <div className='forum__container main__container'>
            <div className="forum__content main__content">
                <div className="forum__left">
                    <div className="forum__head">
                        <h1>Diễn Đàn</h1>
                        <Link href={!cookies.get('token')?'/login':'/forum/new'}><i className="fa-solid fa-plus"></i>Bài Viết Mới</Link>
                    </div>
                    <div className="forum__list">
                        {data.data.map((post: postI)=>(
                            <Link href={`/post/main/${post._id}`} key={post._id} className='post__card'>
                                <div className="post__card--left">
                                    <div className="post__card--left-info">
                                        <img src={post.author.avatar} alt="avatar"/>
                                        <p>{post.author.username}</p>
                                    </div>
                                    <div className="post__card--left-overview">
                                        <h3>{post.title}</h3>
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
                            </Link>
                        ))}
                    </div>
                </div>
                <div className="forum__right">

                </div>
            </div>
        </div>
    );
};

export default Page;