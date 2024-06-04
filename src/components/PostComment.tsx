'use client'
import React, {useCallback, useEffect, useState} from 'react';
import "@/styles/forum.css";
import useDebounce from "@/utils/useDebounce";
import {usePathname, useRouter} from "next/navigation";
import {fetcher, options} from "@/utils/utils";
import useSWR from "swr";
import ReactLoading from "react-loading";
import Comment from "@/components/Comment";
import {router} from "next/client";
import {useCookies} from "next-client-cookies";
import NestedComment from "@/components/ListComment";
import {useSelector} from "react-redux";
import {selectUsername} from "@/store/features/userSlice/userSlice";

const mentionsInputStyle ={
    control: {
        // backgroundColor: '#171717',
        // fontSize: 16,
        // color: '#171717'
        // fontWeight: 'normal',

    },
    '&multiLine': {
        control: {
            fontFamily: '"Space Grotesk", sans-serif',
            minHeight: 160,
            // padding: 10
        },
        highlighter: {
            padding: 16,
            border: '1px solid transparent',
        },
        input: {
            padding: 16,
            border: '1px solid silver',
            // color: 'black',
            // caretColor: 'white'
},
    },
    // '&singleLine': {
    //     display: 'inline-block',
    //     width: 180,
    //     highlighter: {
    //         padding: 1,
    //         border: '2px inset transparent',
    //     },
    //     input: {
    //         padding: 1,
    //         border: '2px inset',
    //     },
    // },
    suggestions: {
        list: {
            backgroundColor: '#171717',
            border: '1px solid #CCCED4',
            fontSize: 16,
        },
        item: {
            padding: '5px 15px',
            borderBottom: '1px solid rgba(0,0,0,0.15)',
            '&focused': {
                backgroundColor: '#FAFAEB',
                color: 'black'
            },
        },
    },
}

const mentionStyle = {
    // backgroundColor: "black",
    color: '#3498db',
    // fontSize: '16px'
    zIndex: '100000',
    position: 'relative',
    fontWeight: 'bold'

}

export interface iThirdComment {
    postId: string,
    author: {
        username: string,
        avatar: string,
        _id: string
    },
    created_at: number,
    updated_at: Array<{
        time: number,
        content: string
    }>,
    content: string,
    reply: string,
    _id: string,
    like: Array<string>
}

export interface iLayerComment{
    postId: string,
    author: {
        username: string,
        avatar: string,
        _id: string
    },
    created_at: number,
    updated_at: Array<{
        time: number,
        content: string
    }>,
    content: string,
    reply: Array<iThirdComment>,
    _id: string,
    like: Array<string>
}

export interface iFirstLayerCmt {
    postId: string,
    author: {
        username: string,
        avatar: string,
        _id: string
    },
    created_at: number,
    updated_at: Array<{
        time: number,
        content: string
    }>,
    content: string,
    reply: {
        [id: string]: iSecondLayerCmt
    },
    _id: string,
    like: Array<string>
}

export interface iSecondLayerCmt {
    postId: string,
    author: {
        username: string,
        avatar: string,
        _id: string
    },
    created_at: number,
    updated_at: Array<{
        time: number,
        content: string
    }>,
    content: string,
    reply: {
        [id: string]: iThirdComment
    },
    _id: string,
    like: Array<string>
}

interface rdMap{
    [id: string]: iThirdComment
}

interface ndMap{
    [id: string]: rdMap
}

const PostComment = ({id}: {id: string}) => {

    const [comments, setComments] = useState<Array<iThirdComment>|null>(null);
    const selectedUsername = useSelector(selectUsername);

    const { data: dataA } = useSWR(`https://nerdflicks-backend.vercel.app/api/allUser`, fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        })

    const { data: dataB } = useSWR(`https://nerdflicks-backend.vercel.app/api/comments/${id}`, fetcher,
        {
            revalidateIfStale: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true
        })


    if(!dataA||!dataB) return (<div className='__loading-container'><ReactLoading type={'spinningBubbles'} color={'white'} height={50} width={50}/></div>)

    console.log(dataB.data)

    const layerComment = (arr: Array<iThirdComment>) => {

        const rtn: {
            [id: string] : iLayerComment
        } = {};


        for(let i=0; i<arr.length; i++){
            if(!arr[i].reply){
                rtn[arr[i]._id] = {
                    ...arr[i],
                    reply: []
                }
            }
        }

        for(let i=0; i<arr.length; i++){
            if(arr[i].reply){
                if(rtn[arr[i].reply]){
                    rtn[arr[i].reply].reply.push(arr[i]);
                }
            }
        }

        // console.log(rtnMap)

        return rtn;
    }

    const superLayerCmt = (arr: Array<iThirdComment>) => {
        const mapCmt: {
            [id: string]: iThirdComment
        } = {};

        const rtnMap: {
            [id: string]: iFirstLayerCmt
        } = {};

        for(let i=0; i<arr.length; i++){
            mapCmt[arr[i]._id] = arr[i];
        }

        for(let i=0; i<arr.length; i++){
            if(!arr[i].reply){
                rtnMap[arr[i]._id] ={
                    ...arr[i],
                    reply: {}
                }
            }
        }


        for(let i=0; i<arr.length; i++){
            if(rtnMap[arr[i].reply]){
                rtnMap[arr[i].reply].reply[arr[i]._id] ={
                    ...arr[i],
                    reply: {}
                }
            }
        }

        for(let i=0; i<arr.length; i++){
            if(arr[i].reply&&mapCmt[arr[i].reply].reply&&rtnMap[mapCmt[arr[i].reply].reply].reply[arr[i].reply]){
                rtnMap[mapCmt[arr[i].reply].reply].reply[arr[i].reply].reply[arr[i]._id] = arr[i]
            }

            if(arr[i].reply) console.log('>>>>>>>', mapCmt[arr[i].reply].reply)
        }
        console.log(rtnMap)
        //
        return rtnMap;
    }

    return (
        <div className='post-comment'>
            <Comment initValue={''} comments={comments} setComments={setComments} reply={''} id={id} data={dataA.data.filter((user: {_id: string, username: string})=>user.username!==selectedUsername).map((user: {_id: string, username: string})=>{
                return {
                    id: user._id,
                    display: user.username
                }
            })}/>
            <h2 className="post-comment-list">
                {`${(comments!==null?comments:dataB.data).length} bình luận`}
            </h2>
            <div className="post-comment__list">
                {/*{console.log(layerComment(comments!==null?comments:dataB.data))}*/}
                {/*{Object.values(layerComment(comments!==null?comments:dataB.data)).map((cmt: iLayerComment)=>(*/}
                {/*    <ListComment comments={comments} setComments={setComments} key={cmt._id} data={cmt} id={id} users={dataA.data.filter((user: {_id: string, username: string})=>user.username!==selectedUsername).map((user: {_id: string, username: string})=>{*/}
                {/*        return {*/}
                {/*            id: user._id,*/}
                {/*            display: user.username*/}
                {/*        }*/}
                {/*    })}/>*/}
                {/*))}*/}

                {
                    Object.values(superLayerCmt(comments!==null?comments:dataB.data)).map((cmt: iFirstLayerCmt)=>(
                    <NestedComment key={cmt._id} data={[cmt]} comments={comments} setComments={setComments} users={dataA.data.filter((user: {_id: string, username: string})=>user.username!==selectedUsername).map((user: {_id: string, username: string})=>{
                        return {
                            id: user._id,
                            display: user.username
                        }
                    })} id={id}/>
                ))
                }
            </div>
        </div>
    );
};

export default PostComment;