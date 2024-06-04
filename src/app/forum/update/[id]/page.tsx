'use client'
import React from 'react';
import useSWR from "swr";
import {fetcher} from "@/utils/utils";
import ReactLoading from "react-loading";
import {useSelector} from "react-redux";
import {selectId, selectLoggedIn} from "@/store/features/userSlice/userSlice";
import {useCookies} from "next-client-cookies";
import ErrorPage from "next/error";
import PostCustom from "@/components/PostCustom";

const Page = ({params}: {params: {id: string}}) => {

    const cookies = useCookies();
    const selectedLoggedIn = useSelector(selectLoggedIn);
    const selectedId = useSelector(selectId);

    const fetcherAuth = (url: string) =>
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${cookies.get('token')}`
            }
        }).then((res) => res.json());

    const { data, isLoading, mutate} = useSWR(`http://localhost:5001/api/postAuth/${params.id}`,fetcherAuth,
        {
            revalidateIfStale: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true
        })

    if(isLoading) return (<div className='__loading-container'><ReactLoading type={'spinningBubbles'} color={'white'} height={50} width={50}/></div>)

    console.log(data)

    return (
        <>
            {data.post?(<>
                <PostCustom title={data.post.title} content={data.post.content} listMedia={data.post.list_review} listTag={data.post.tags} publish={data.post.isPublic} where={'update'} _id={data.post._id}/>
            </>):(<ErrorPage statusCode={404}></ErrorPage>)}
        </>
    );
};

export default Page;