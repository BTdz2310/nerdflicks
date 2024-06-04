import React, {useCallback, useEffect, useState} from 'react';
import { Mention, MentionsInput } from "react-mentions";
import "@/styles/forum.css";
import useDebounce from "@/utils/useDebounce";
import {usePathname, useRouter} from "next/navigation";
import {fetcher, options} from "@/utils/utils";
import useSWR from "swr";
import ReactLoading from "react-loading";
import {toast} from "react-toastify";
import {useCookies} from "next-client-cookies";
import {iThirdComment} from "@/components/PostComment";
import {useSelector} from "react-redux";
import {selectAvatar, selectUsername} from "@/store/features/userSlice/userSlice";

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
            minHeight: 40,
            // padding: 10
        },
        highlighter: {
            // padding: 16,
            // border: '1px solid transparent',
        },
        input: {
            // padding: 16,
            // border: '1px solid silver',
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
    backgroundColor: "black",
    color: '#3498db',
    // fontSize: '16px'
    zIndex: '100000',
    position: 'relative',
    fontWeight: 'bold'

}

export interface userRtn {
    id: string,
    display: string
}

const Comment = ({data, reply, id, comments, setComments, initValue, setShow, cmtId}: {data: Array<userRtn>, reply: string, id: string, comments: Array<iThirdComment>|null, setComments: Function, initValue: string, setShow?: Function, cmtId?: string}) => {

    const [value, setValue] = useState<string>(initValue);
    const [tags, setTags] = useState<Array<string>>([]);
    const cookies = useCookies();
    const router = useRouter();
    const pathname = usePathname();

    const selectedAvatar = useSelector(selectAvatar);
    const selectedUsername = useSelector(selectUsername);

    // const [data, setData] = useState([]);
    // const emailRegex = /(([^\s@]+@[^\s@]+\.[^\s@]+))$/;

    console.log(value)

    useEffect(() => {
        setValue(initValue)
    }, [initValue]);

    const handleCheck = () => {
        if(!cookies.get('token')){
            router.push(`/login?from=${encodeURIComponent(pathname)}`)
            return;
        }
    }

    const handleTag = (id: string) => {
        if(!tags.includes(id)){
            setTags(prev=>[...prev, id]);
        }
        console.log(tags)
    }

    const handleSubmit = async () => {

        // console.log('sub')
        if(!value.trim()){
            toast.error('Bình Luận Bị Trống!!');
            return;
        }
        console.log('check1',tags);

        const validTags = tags.filter((tag: string)=>value.includes(tag));

        // return;
        const response = await fetch(`https://nerdflicks-backend.vercel.app/api/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${cookies.get('token')}`
            },
            body: JSON.stringify({
                postId: id,
                created_at: Date.now(),
                content: value,
                reply: reply,
                tags: validTags,
                username: selectedUsername,
                avatar: selectedAvatar
            })
        });
        const json = await response.json();
        console.log(json)
        if(response.status===200){
            // toast.success(json.msg);
            setComments(json.data);
            setValue('');
            if(setShow){
                setShow([])
            }
            setTags([]);
        }else{
            toast.error(json.msg)
        }

    }

    const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLInputElement>) => {
        if (e.keyCode == 13 && !e.shiftKey)
        {
            e.preventDefault();
            handleSubmit()
        }
    }

    const handleRemove = () => {
        if(setShow){
            setShow((prev: Array<string>)=>prev.filter((_id: string)=>_id!==cmtId))
        }
    }

    return (
        <div style={{display: 'flex', gap: '20px', margin: '20px 0'}}>
            <div style={{position: 'relative', marginTop: '5px'}}>
                {selectedAvatar?(<img className='post-comment__avatar-self' src={selectedAvatar} alt="avatar"/>):undefined}
                {setShow?(
                    <div className="post-comment__remove" onClick={()=>handleRemove()}>
                        <div className="post-comment__remove-bg"></div>
                        <i className="fa-solid fa-x"></i>
                    </div>
                ):undefined}
            </div>
            <form style={{flexGrow: '2'}} onSubmit={(e)=>{
                e.preventDefault();
                handleSubmit();
            }}>
                <div className="post-comment__input" onClick={()=>handleCheck()}>
                    <div className='post-comment__area'>
                        <MentionsInput
                            onKeyDown={(e)=>handleKey(e)}
                            style={mentionsInputStyle}
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder='Bình Luận...'
                        >

                            <Mention style={mentionStyle} data={(search) => {
                                if(search.length) return data.filter((user: userRtn)=>user.display.toLowerCase().includes(search.toString())).slice(0, 3);
                                return [];
                            }} appendSpaceOnAdd={true}  onAdd={(id, display)=>handleTag(id.toString())} trigger={'@'} className='post-comment__mention'/>

                        </MentionsInput>

                    </div>
                    <button className="post-comment__send" disabled={!value.trim()}>
                        <i className="fa-regular fa-paper-plane"></i>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Comment;