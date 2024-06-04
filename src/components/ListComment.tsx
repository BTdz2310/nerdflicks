'use client'
import React, {Fragment, useEffect, useRef, useState} from 'react';
import {iThirdComment, iLayerComment, iFirstLayerCmt, iSecondLayerCmt} from "@/components/PostComment";
import {Link} from "next-view-transitions";
import {formatCreatedUtc} from "@/utils/utils";
import Comment, {userRtn} from "@/components/Comment";
import {useSelector} from "react-redux";
import {selectId} from "@/store/features/userSlice/userSlice";
import {useCookies} from "next-client-cookies";
import {usePathname, useRouter} from "next/navigation";

interface iLevelCmt {
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
        [id: string]: iLevelCmt
    }|string,
    _id: string,
    like: Array<string>
}


export const NestedComment = ({data, comments, setComments, id, users} : {data: Array<iLevelCmt>, comments: Array<iThirdComment>|null, setComments: Function, users: Array<userRtn>, id: string}) => {

    const [all, setAll] = useState<boolean|null>(null);
    // const [show, setShow] = useState(false);
    const [showArr, setShowArr] = useState<Array<string>>([]);
    const [tag, setTag] = useState('');

    const selectedId = useSelector(selectId)

    const cookies = useCookies();
    const router = useRouter();
    const pathname = usePathname();

    const convertText = (str: string) => {
        const regex = /@\[([^\]]+)\]\(([^)]+)\)/g;

        const arr = str.trim().split(/\s+/);

        return arr.map((str1: string)=>{
            const match = regex.exec(str1);
            if(match!==null) return (<Link key={str1} href={`/user/profile/${match[2]}`}>{`${match[1]} `}</Link>)
            return (<Fragment key={str1}>{`${str1} `}</Fragment>)
        });

    }

    const sorting = (boo: boolean, arr: Array<iLevelCmt>)=> {
        if(boo){
            return arr.slice().sort(function(a, b) {
                return b.created_at - a.created_at ;
            })
        }
        return arr.slice().sort(function(a, b) {
            return a.created_at - b.created_at ;
        })
    }

    const pushShowArr = (id: string) => {
        if(!showArr.includes(id)) setShowArr(prev=>[...prev, id]);
    }

    const handleClickCmtBox = ({_id, username}: {_id: string, username: string}) => {
        // setShow(true)
        setTag(`@[${username}](${_id})`)
    }

    const handleUpdateCmt = () =>{

    }


    return (
        <>

            {typeof data!=='string'&&sorting(false, data).map((data1: iLevelCmt)=>(
                <Fragment key={`${data1._id}-${data1.reply.length}`}>
                    {/*{console.log(data1)}*/}
                    {/*<p>hien thi {data.length}</p>*/}
                    <div className="post-comment__item">
                        {/*{console.log('adwad',data1._id)}*/}
                        <Link href={`/user/profile/${data1.author._id}`}><img src={data1.author.avatar} alt="avatar"/></Link>
                        <div className="post-comment__item-text">
                            <div className="post-comment__item--parent">
                                <h3 className='post-comment__item-author'><Link href={`/user/profile/${data1.author._id}`}>{data1.author.username}</Link></h3>
                                <p className='post-comment__item-content'>
                                    {convertText(data1.content)}
                                    {data1.like.length?(<p className='post-comment__item-like'><i className="fa-regular fa-thumbs-up"></i>{data1.like.length}</p>):undefined}
                                </p>
                                <div className="post-comment__item--parent-task">
                                    <span>{formatCreatedUtc(data1.created_at)}</span>
                                    <p onClick={()=> {
                                        if(!cookies.get('token')){
                                            router.push(`/login?from=${encodeURIComponent(pathname)}`)
                                            return;
                                        }
                                        console.log(typeof data1.reply !== 'string' ? data1._id : data1.reply, data1.author.username)
                                    }}>Thích</p>
                                    {selectedId===data1.author._id?(<p onClick={()=>handleUpdateCmt()}>Chỉnh Sửa</p>):undefined}
                                    <p onClick={()=>{
                                        if(!cookies.get('token')){
                                            router.push(`/login?from=${encodeURIComponent(pathname)}`)
                                            return;
                                        }
                                        pushShowArr(data1._id)
                                        setTag(selectedId===data1.author._id?'':`@[${data1.author.username}](${data1.author._id})`)
                                    }}>Phản hồi</p>
                                </div>
                            </div>

                            {/*{Object.values(data1).length>3&&(!all?(<p className='post-comment__item--all' onClick={()=>setAll(prev=>!prev)}>Hiển thị tất cả {Object.values(data1).length} bình luận</p>):((<p className='post-comment__item--all' onClick={()=>setAll(prev=>!prev)}>Ẩn tất cả bình luận</p>)))}*/}
                            {/*{typeof data1.reply!=='string'&&(<div style={{display: show ? 'block' : 'none', overflow: 'hidden'}}>*/}
                            {/*    <Comment key={data1._id} setShow={setShow} initValue={tag} comments={comments}*/}
                            {/*             setComments={setComments}*/}
                            {/*             reply={typeof data1.reply !== 'string' ? data1._id : data1.reply} id={id}*/}
                            {/*             data={users}/>*/}
                            {/*</div>)}*/}
                            {typeof data1.reply!=='string'&&(<div style={{display: showArr.includes(data1._id) ? 'block' : 'none', overflow: 'hidden'}}>
                                <Comment cmtId={data1._id} setShow={setShowArr} initValue={tag} comments={comments}
                                         setComments={setComments}
                                         reply={typeof data1.reply !== 'string' ? data1._id : data1.reply} id={id}
                                         data={users}/>
                            </div>)}
                            {(typeof data1.reply!=='string'&&Object.values(data1.reply).length)?(
                                <NestedComment key={`${data1._id}-${data1.reply.length}`} data={Object.values(data1.reply)} comments={comments} setComments={setComments} users={users} id={id}/>
                            ):undefined}
                        </div>
                    </div>

                    {typeof data1.reply==='string'&&(<div style={{display: showArr.includes(data1._id) ? 'block' : 'none', overflow: 'hidden'}}>
                        <Comment cmtId={data1._id} setShow={setShowArr} initValue={tag} comments={comments}
                                 setComments={setComments}
                                 reply={typeof data1.reply !== 'string' ? data1._id : data1.reply} id={id}
                                 data={users}/>
                    </div>)}

                </Fragment>
            ))}

        </>
    )

}

export default NestedComment;