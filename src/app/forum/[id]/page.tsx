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

function formatDateTime(timestamp: number): string {
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

const Page = ({ params }: { params: { id: string } }) => {

    const [liked, setLiked] = useState<Array<string>|null>(null);
    const [unliked, setUnliked] = useState<Array<string>|null>(null);
    const [type, setType] = useState<'list'|'comment'|'history'|'same'>('list')

    const cookies = useCookies();
    const pathname = usePathname();
    const router = useRouter();
    const selectedId = useSelector(selectId);

    const { data, error,isLoading } = useSWR(`http://localhost:5001/api/post/${params.id}`, fetcher,
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
        const response = await fetch(`http://localhost:5001/api/${str}/${params.id}`, {
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

    const SwitchType = () => {
        switch (type){
            case "list":
                return <PostList data={data.post.list_review} />
            case "comment":
                return <PostComment id={params.id}/>
        }
    }

    return (
        <div className='main__container'>
            <div className='main__content'>
                <div className="post__head">
                    <h2 className="post__title">{data.post.title}</h2>
                    <p className="post__content">{data.post.content}</p>
                    <div className="post__under">
                        <p className="post__info">bởi <Link href={`/user/profile/${data.post.author._id}`}>{data.post.author.username}</Link> {formatDateTime(data.post.created_at)}</p>
                        <div className='post__react'>
                            <p onClick={()=>handleLike('likePost')} style={{color: (liked!==null?liked:data.post.like).includes(selectedId) ? 'chartreuse' : 'grey'}}><i className="fa-solid fa-thumbs-up"></i>{(liked!==null?liked:data.post.like).length}</p>
                            <p onClick={()=>handleLike('unlikePost')} style={{color: (unliked!==null?unliked:data.post.unlike).includes(selectedId) ? 'red' : 'grey'}}><i className="fa-solid fa-thumbs-up" style={{transform: 'rotate(180deg)'}}></i>{(unliked!==null?unliked:data.post.unlike).length}</p>
                        </div>
                    </div>
                </div>
                <div className="post__navbar">
                    <p style={{color: type==='list' ? 'rgb(253, 57, 195)' : 'white', borderBottom: type==='list' ? '1px solid rgb(253, 57, 195)' : '1px solid white'}} onClick={()=>setType('list')}>Danh Sách Phim</p>
                    <p style={{color: type==='comment' ? 'rgb(253, 57, 195)' : 'white', borderBottom: type==='comment' ? '1px solid rgb(253, 57, 195)' : '1px solid white'}} onClick={()=>setType('comment')}>Bình Luận</p>
                    <p style={{color: type==='history' ? 'rgb(253, 57, 195)' : 'white', borderBottom: type==='history' ? '1px solid rgb(253, 57, 195)' : '1px solid white'}} onClick={()=>setType('history')}>Lịch Sử Chỉnh Sửa</p>
                    <p style={{color: type==='same' ? 'rgb(253, 57, 195)' : 'white', borderBottom: type==='same' ? '1px solid rgb(253, 57, 195)' : '1px solid white'}} onClick={()=>setType('same')}>Bài Viết Tương Tự</p>
                </div>
                <div className="post__display">
                    <div className="post__display-left">
                        {SwitchType()}
                    </div>
                    <div className="post__display-right">

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;