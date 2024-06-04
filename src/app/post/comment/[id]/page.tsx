'use client'
import React, {useState} from 'react';
import PostHead from "@/components/PostHead";
import PostComment from "@/components/PostComment";
const Page = ({params}:{params: {id: string}}) => {

    return (
        <div className='main__container'>
            <div className='main__content'>
                <PostHead id={params.id}/>
                <div className="post__display">
                    <div className="post__display-left">
                        <PostComment id={params.id}/>
                    </div>
                    <div className="post__display-right">

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Page;