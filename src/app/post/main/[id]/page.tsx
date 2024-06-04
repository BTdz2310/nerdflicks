'use client'
import React from 'react';
import PostHead from "@/components/PostHead";
import useSWR from "swr";
import {fetcher, shortenString} from "@/utils/utils";
import ReactLoading from "react-loading";
import {nowPlayingMovie} from "@/components/type/typeSome";
import {Link} from "next-view-transitions";
import {genreById} from "@/components/GenreIcon";
import AddTo from "@/components/AddTo";
import PostList from "@/components/PostList";
import ErrorPage from 'next/error'

const Page = ({params}: {params: {id: string}}) => {

    const { data, error,isLoading } = useSWR(`http://localhost:5001/api/post/${params.id}`, fetcher,
        {
            revalidateIfStale: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true
        })

    if(isLoading) return (<div className='__loading-container'><ReactLoading type={'spinningBubbles'} color={'white'} height={50} width={50}/></div>)


    return (
        <>
            {data.post?(
                <div className='main__container'>
                    <div className='main__content'>
                        <PostHead id={params.id}/>
                        <div className="post__display">
                            <div className="post__display-left">
                                <PostList data={data.post.list_review} />
                            </div>
                            <div className="post__display-right">

                            </div>
                        </div>
                    </div>
                </div>
            ):<ErrorPage statusCode={404}/>}
        </>
    );
};

export default Page;