'use client'
import React, {useState} from 'react';
import useSWR from "swr";
import {fetcher} from "@/utils/utils";
import ReactLoading from "react-loading";
import "@/styles/forum.css";
import {Link} from "next-view-transitions";
import {useCookies} from "next-client-cookies";
import {usePathname, useRouter} from "next/navigation";
import {useSelector} from "react-redux";
import {selectId} from "@/store/features/userSlice/userSlice";
import {toast} from "react-toastify";
import PostList from "@/components/PostList";
// import PostComment from "@/components/PostComment";
import { lazy } from 'react';

const PostComment = lazy(() => import("@/components/PostComment"));

export function formatDateTime(timestamp: number): string {
    const date: Date = new Date(timestamp);
    const options: Intl.DateTimeFormatOptions = {
        // weekday: 'long',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    };
    const formattedDate: string = date.toLocaleDateString('vi-VN', options);
    return formattedDate;
}

const PostHead = ({ id }: { id: string }) => {

    const [liked, setLiked] = useState<Array<string>|null>(null);
    const [unliked, setUnliked] = useState<Array<string>|null>(null);

    const cookies = useCookies();
    const pathname = usePathname();
    const router = useRouter();
    const selectedId = useSelector(selectId);

    const { data, error,isLoading } = useSWR(`https://nerdflicks-backend.vercel.app/api/post/${id}`, fetcher,
        {
            revalidateIfStale: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true
        })

    if(isLoading) return (<div className='__loading-container'><ReactLoading type={'spinningBubbles'} color={'white'} height={50} width={50}/></div>)

    console.log(data)

    const handleLike = async (str: string) => {

        if(!cookies.get('token')){
            router.push(`/login?from=${encodeURIComponent(pathname)}`)
            return;
        }
        const response = await fetch(`https://nerdflicks-backend.vercel.app/api/${str}/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${cookies.get('token')}`
            },
        });
        const json = await response.json();
        if(response.status===200){
            setLiked(json.liked);
            setUnliked(json.unliked);
        }else{
            toast.error(json.msg)
        }

    }

    return (
        <>
            <div className="post__head">
                <h2 className="post__title">{data.post.title}</h2>
                <p className="post__content">{data.post.content}</p>
                <div className="__post--tag-list">
                    {data.post.tags.map((tag: string)=>(
                        <p key={tag}>{tag}</p>
                    ))}
                </div>
                <div className="post__under">
                    <p className="post__info">bởi <Link href={`/user/profile/${data.post.author._id}`}>{data.post.author.username}</Link> {formatDateTime(data.post.created_at)}</p>
                    <div className='post__react'>
                        <p onClick={()=>handleLike('likePost')} style={{color: (liked!==null?liked:data.post.like).includes(selectedId) ? 'chartreuse' : 'grey'}}><i className="fa-solid fa-thumbs-up"></i>{(liked!==null?liked:data.post.like).length}</p>
                        <p onClick={()=>handleLike('unlikePost')} style={{color: (unliked!==null?unliked:data.post.unlike).includes(selectedId) ? 'red' : 'grey'}}><i className="fa-solid fa-thumbs-up" style={{transform: 'rotate(180deg)'}}></i>{(unliked!==null?unliked:data.post.unlike).length}</p>
                    </div>
                </div>
            </div>
            <div className="post__navbar">
                <Link href={`/post/main/${id}`} style={{borderBottom: pathname.includes('main') ? '1px solid rgb(253, 57, 195)' : '1px solid white'}}><p style={{color: pathname.includes('main') ? 'rgb(253, 57, 195)' : 'white'}}>Danh Sách Phim</p></Link>
                <Link href={`/post/comment/${id}`} style={{borderBottom: pathname.includes('comment') ? '1px solid rgb(253, 57, 195)' : '1px solid white'}}><p style={{color: pathname.includes('comment') ? 'rgb(253, 57, 195)' : 'white'}}>Bình Luận</p></Link>
                <Link href={`/post/history/${id}`} style={{borderBottom: pathname.includes('history') ? '1px solid rgb(253, 57, 195)' : '1px solid white'}}><p style={{color: pathname.includes('history') ? 'rgb(253, 57, 195)' : 'white'}}>Lịch Sử Chỉnh Sửa</p></Link>
                <Link href={`/post/same/${id}`} style={{borderBottom: pathname.includes('same') ? '1px solid rgb(253, 57, 195)' : '1px solid white'}}><p style={{color: pathname.includes('same') ? 'rgb(253, 57, 195)' : 'white'}}>Bài Viết Tương Tự</p></Link>
            </div>
        </>
    );
};

export default PostHead;