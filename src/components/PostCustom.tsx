'use client'
import React, {Fragment, useEffect, useState} from 'react';
import {CustomLink} from "@/components/CustomLink";
import useSWR, { useSWRConfig } from 'swr'
import "@/styles/forum.css";
import {fetcher, options, shortenString} from "@/utils/utils";
import {Spinner} from "react-bootstrap";
import useDebounce from "@/utils/useDebounce";
import {nowPlayingMovie} from "@/components/type/typeSome";
import Image from 'next/image'
import {iGenre} from "@/app/movie/[id]/page";
import {genreById} from "@/components/GenreIcon";
import { useRouter } from "next/navigation";
import {Blocker} from "@/components/Blocker";
import {toast} from "react-toastify";
import {useCookies} from "next-client-cookies";
import {Link} from "next-view-transitions";
import {useSelector} from "react-redux";
import {selectId} from "@/store/features/userSlice/userSlice";


const Item = ({data, action, check, big}: {data: nowPlayingMovie, action: Function, check: boolean, big: boolean}) => {
    return (
        <>
            {big?(
                <div className='post__item'>
                    <div className="post__item-left">
                        <img width={100} height={150} src={data.poster_path?`https://media.themoviedb.org/t/p/w188_and_h282_bestv2${data.poster_path}`:'https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2086941550.jpg'} alt="img"/>
                    </div>
                    <div className="post__item-center">
                        <h3>{data.title?data.title:data.name}</h3>
                        <p>{data.release_date?(data.release_date?data.release_date.split('-')[0]:''):(data.first_air_date?data.first_air_date.split('-')[0]:'')} - {data.genre_ids&&data.genre_ids.map((genre: 28 | 12 | 16 | 35 | 80 | 99 | 18 | 10751 | 14 | 36 | 27 | 10402 | 9648 | 10749 | 878 | 10770 | 53 | 10752 | 37 | 10759 | 10762 | 10763 | 10764 | 10765 | 10766 | 10767 | 10768)=>genreById[genre]).join(', ')}</p>
                        {/*<p className='info-text'>*/}
                        {/*    {data.genre_ids&&data.genre_ids.map((genre: 28 | 12 | 16 | 35 | 80 | 99 | 18 | 10751 | 14 | 36 | 27 | 10402 | 9648 | 10749 | 878 | 10770 | 53 | 10752 | 37 | 10759 | 10762 | 10763 | 10764 | 10765 | 10766 | 10767 | 10768)=>(<span key={genre}>{genreById[genre]}</span>))}*/}
                        {/*</p>*/}
                        <p>{shortenString(data.overview, 200)}</p>
                    </div>
                    <div className="post__item-right" onClick={()=>action(data)}>
                        {check?(
                            <i className="fa-solid fa-xmark"></i>
                        ):(
                            <i className="fa-solid fa-plus"></i>
                        )}
                    </div>
                </div>
            ):(
                <div className='check__item'>
                    <img src={data.poster_path?`https://media.themoviedb.org/t/p/w188_and_h282_bestv2${data.poster_path}`:'https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2086941550.jpg'} alt="img"/>
                    <p>{data.title?data.title:data.name}</p>
                    <div className="check__item-right" onClick={()=>action(data)}>
                        {check?(
                            <i className="fa-solid fa-xmark"></i>
                        ):(
                            <i className="fa-solid fa-plus"></i>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}

const tags = ["Phiêu Lưu", "Kỳ Ảo", "Hoạt Hình", "Drama", "Kinh Dị", "Hành Động", "Hài", "Lịch Sử", "Cao Bồi", "Giật Gân", "Tội Phạm", "Tài Liệu", "Viễn Tưởng", "Kỳ Bí", "Âm Nhạc", "Lãng Mạn", "Gia Đình", "Chiến Tranh", "Hành Động & Phiêu Lưu", "Trẻ Em", "Thời Sự", "Thực Tế", "Khoa Học Viễn Tưởng & Giả Tưởng", "Dài Tập", "Trò Chuyện", "Chiến Tranh Và Chính Trị", "Điện Ảnh Truyền Hình", "Mới", "Hot", "Đánh Giá", "Giới thiệu", "Hỏi Đáp", "Giải Thưởng", "Thịnh Hành", "Truyền Hình", "Điện Ảnh", "Diễn Viên", "Chuyện Bên Lề", "Phải Xem"];

const PostCustom = ({title, content, listMedia, listTag, publish, where, _id}: {title: string, content: string, listMedia: Array<nowPlayingMovie>, listTag: Array<string>, publish: boolean, where: 'new'|'update', _id?: string}) => {

    const [titleText, setTitleText] = useState(title);
    const [contentText, setContentText] = useState(content);
    const [searchText, setSearchText] = useState('');
    const [mediaType, setMediaType] = useState<'tv'|'movie'>('movie');
    const [loading, setLoading] = useState(false);
    const [dataSearch, setDataSearch] = useState([]);
    const [mediaList, setMediaList] = useState<Array<nowPlayingMovie>>(listMedia);
    const [tagList, setTagList] = useState<Array<string>>(listTag);
    const [check, setCheck] = useState(false);

    const selectedId = useSelector(selectId);

    const debounce = useDebounce(searchText, 200);
    const cookies = useCookies();

    const router = useRouter();
    const { mutate } = useSWRConfig()

    useEffect(() => {
        if(!cookies.get('token')){
            router.push('/login')
        }
    }, []);

    useEffect(() => {
        function beforeUnload(e: BeforeUnloadEvent) {
            if(check){
                const message = 'Are you sure you want to leave?';
                e.returnValue = message;
                return message;
            }
        }

        // console.log(!!(titleText || contentText || mediaList.length || tagList.length))

        // if(titleText || contentText || mediaList.length || tagList.length){
        window.addEventListener('beforeunload', beforeUnload);

        return () => {
            window.removeEventListener('beforeunload', beforeUnload);
        };
        // }
    }, [check]);

    useEffect(() => {
        console.log((titleText!==title), (contentText!==content), !checkEqualArrString(tagList, listTag), !checkEqualArrMedia(mediaList, listMedia))
        if((titleText!==title) || (contentText!==content) || !checkEqualArrString(tagList, listTag) || !checkEqualArrMedia(mediaList, listMedia)){
            setCheck(true)
            // console.log(check)
        }else{
            setCheck(false)
        }
        console.log(check)
    }, [titleText, contentText, mediaList, tagList]);

    useEffect(() => {
        console.log('>>>',check)
    }, [check]);

    useEffect(()=>{
        const loadKeyword = async () => {
            setLoading(true);

            const response = await fetch(`https://api.themoviedb.org/3/search/${mediaType}?query=${encodeURI(debounce)}&include_adult=false&language=vi-VN&page=1`, options);
            const json = await response.json();

            setDataSearch(json.results);

            console.log(dataSearch)

            setLoading(false);
        }

        loadKeyword();
    }, [debounce, mediaType])

    const checkEqualArrString = (a: Array<string>, b: Array<string>) => {
        console.log(a, b)
        return a.every(item => b.includes(item)) && b.every(item => a.includes(item))
    }

    const checkEqualArrMedia = (a: Array<nowPlayingMovie>, b: Array<nowPlayingMovie>) => {
        return a.map((item:nowPlayingMovie)=>item.id).every(item => b.map((item:nowPlayingMovie)=>item.id).includes(item)) && b.map((item:nowPlayingMovie)=>item.id).every(item => a.map((item:nowPlayingMovie)=>item.id).includes(item))
    }

    const checkInclude = (id: number, media: string) => {
        const itemCheck = mediaList.filter((item1: nowPlayingMovie)=>media===item1.media_type&&id===item1.id);
        return !!itemCheck.length;
    }

    const handleAction = (item: nowPlayingMovie) => {

        const itemCheck = mediaList.filter((item1: nowPlayingMovie)=>(item.title ? 'movie' : 'tv')===item1.media_type&&item.id===item1.id);

        if(itemCheck.length){
            setMediaList(mediaList.filter((item1: nowPlayingMovie)=>item.media_type!==item1.media_type||item.id!==item1.id))
        }else{
            setMediaList(prev=>[...prev, {
                ...item,
                media_type: item.title ? 'movie' : 'tv'
            }])
        }
    }

    const handleTag = (str: string) => {
        if(tagList.includes(str)){
            setTagList(tagList.filter((tag: string)=>tag!==str));
        }else{
            setTagList(prev=>[...prev, str]);
        }
    }

    const handleSave = async (save: boolean) => {
        if(!titleText){
            toast.error('Vui lòng nhập tiêu đề');
        }
        const data = {
            created_at: Date.now(),
            tags: tagList,
            title: titleText,
            content: contentText,
            list_review: mediaList,
            isPublic: save
        }

        const response = await fetch('https://nerdflicks-backend.vercel.app/api/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${cookies.get('token')}`
            },
            body: JSON.stringify(data)
        });
        const json = await response.json();

        if(response.status === 200){
            // toast.success(json);
            if(save){
                router.push(`/post/main/${json.id}`)
            }else{
                router.push(`/user/post/${selectedId}`)
            }
            await mutate('https://nerdflicks-backend.vercel.app/api/notifications')
        }else{
            toast.error(json);
        }

    }

    const handleRemove = async () => {
        const response = fetch(`https://nerdflicks-backend.vercel.app/api/post/${_id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${cookies.get('token')}`
            },
        });
        await mutate('https://nerdflicks-backend.vercel.app/api/notifications')
        router.push(`/user/post/${selectedId}`)
    }

    const handleChange = async () => {
        const dataChange: {
            title?: string,
            content?: string,
            tags?: Array<string>,
            list_review?: Array<nowPlayingMovie>,
            updated_at: number
        } = {
            updated_at: Date.now()
        };
        if(titleText!==title) dataChange.title = title
        if(contentText!==content) dataChange.content = content
        if(!checkEqualArrString(tagList, listTag)) dataChange.tags = listTag
        if(!checkEqualArrMedia(mediaList, listMedia)) dataChange.list_review = listMedia

        const response = await fetch(`https://nerdflicks-backend.vercel.app/api/post/${_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${cookies.get('token')}`
            },
            body: JSON.stringify({
                title: titleText,
                content: contentText,
                tags: tagList,
                list_review: mediaList,
                updated_at: dataChange
            })
        });
        const json = await response.json()
        if(response.status===200){
            await mutate('https://nerdflicks-backend.vercel.app/api/notifications')
            router.push(`/post/main/${_id}`)
        }else{
            toast.error(json.msg)
        }
    }

    const handleAlreadySave = async (save: boolean) => {
        console.log('click')
        if(!titleText){
            toast.error('Vui lòng nhập tiêu đề');
        }
        const data = {
            created_at: Date.now(),
            tags: tagList,
            title: titleText,
            content: contentText,
            list_review: mediaList,
            isPublic: save
        }

        const response = await fetch(`https://nerdflicks-backend.vercel.app/api/post/${_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${cookies.get('token')}`
            },
            body: JSON.stringify(data)
        });

        const json = await response.json()

        console.log(response)

        if(response.status === 200){
            // toast.success(json);
            if(save){
                router.push(`/post/main/${json.id}`)
            }else{
                router.push(`/user/post/${selectedId}`)
            }
            await mutate('https://nerdflicks-backend.vercel.app/api/notifications')
        }else{
            toast.error(json);
        }
    }

    return (
        <>
            <Blocker />
            <div className='main__container forum-new__container'>
                <div className="main__content forum__content">
                    <div className="forum__left">
                        {check ? (
                            <CustomLink setAction={handleSave} href={where==='new'?'/forum':`/user/post/${selectedId}`} className='forum-new__link'><i className="fa-solid fa-left-long"></i>{where==='new'?'Quay Lại Diễn Đàn':'Quay Lại Hồ Sơ'}</CustomLink>
                        ):(
                            <Link href={where==='new'?'/forum':`/user/post/${selectedId}`} className='forum-new__link'><i className="fa-solid fa-left-long"></i>{where==='new'?'Quay Lại Diễn Đàn':'Quay Lại Hồ Sơ'}</Link>
                        )}
                        <div className="forum__head">
                            <h1>{where==='new'?'Bài Đăng Mới':'Chỉnh Sửa Bài Đăng'}</h1>
                        </div>
                        <div className="forum__main">
                            {/*{data.data.map((text: string)=>(<p key={text}>{text}</p>))}*/}

                            <div className="post__group">
                                <p>Tiêu Đề</p>
                                <textarea onWheel={(e)=>e.stopPropagation()} name="title" rows={2} value={titleText} onChange={(e)=>setTitleText(e.target.value)}></textarea>
                            </div>

                            <div className="post__group">
                                <p>Nội dung</p>
                                <textarea onWheel={(e)=>e.stopPropagation()} name="title" rows={6} value={contentText} onChange={(e)=>setContentText(e.target.value)}></textarea>
                            </div>

                            <div className="post__group">
                                <p>Chọn phim thảo luận</p>
                                <div className="post__table">
                                    <div className="post__table-head">
                                        <div className="post__table-switch">
                                            <p style={{backgroundColor: mediaType === 'movie' ? 'black' : 'inherit', color: mediaType === 'movie' ? 'powderblue' : 'white'}} onClick={()=>setMediaType('movie')}>Movie</p>
                                            <p style={{backgroundColor: mediaType === 'tv' ? 'black' : 'inherit', color: mediaType === 'tv' ? 'powderblue' : 'white'}} onClick={()=>setMediaType('tv')}>TV</p>
                                        </div>
                                        <div className="post__table-search">
                                            <input type="text" value={searchText} onChange={(e)=>setSearchText(e.target.value)}/>
                                            <i className="fa-solid fa-spinner" style={{visibility: loading ? 'visible' : 'hidden'}}></i>
                                        </div>
                                    </div>
                                    {/*{console.log(mediaType)}*/}
                                    <div className="post__table-list" onWheel={(e)=>e.stopPropagation()}>
                                        {!loading&&dataSearch.map((item: nowPlayingMovie)=>(
                                            <Fragment key={item.id}>
                                                <Item data={item} action={handleAction} check={checkInclude(item.id, item.title ? 'movie' : 'tv')} big={true}/>
                                            </Fragment>
                                        ))}
                                    </div>
                                </div>
                                <div className="post__table" style={{backgroundColor: 'inherit', marginTop: '20px'}}>
                                    <div className="post__table-list" style={{height: 'unset', maxHeight: '280px', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '12px', marginBottom: '40px', paddingTop: '20px'}} onWheel={(e)=>e.stopPropagation()}>
                                        <p style={{fontWeight: 'bold', paddingBottom: '20px'}}>Phim đã chọn</p>
                                        {mediaList.map((item: nowPlayingMovie)=>(
                                            <Fragment key={item.id}>
                                                <Item data={item} action={handleAction} check={checkInclude(item.id, item.title ? 'movie' : 'tv')} big={false}/>
                                            </Fragment>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="post__group">
                            <p>Gắn Tag</p>
                            <div className="tag__group">
                                {tags.sort(function(a, b){
                                    if(a < b) { return -1; }
                                    if(a > b) { return 1; }
                                    return 0;
                                }).map((str: string)=>(<button onClick={()=>handleTag(str)} className={tagList.includes(str)?'tag-chose':undefined} key={str}>{str.toLowerCase()}</button>))}
                            </div>
                        </div>
                        <div className="post__group" style={{justifyContent: 'end', display: 'flex', gap: '20px', marginTop: '40px'}}>
                            {/*{publish?(*/}
                            {/*    <button className='post__button' style={{cursor: 'pointer', backgroundColor: 'grey'}} onClick={async()=>{*/}
                            {/*        await handleRemove();*/}
                            {/*    }}>Xoá Bài</button>*/}
                            {/*):(*/}
                            {/*    <button disabled={!check} className='post__button' style={{cursor: 'pointer', backgroundColor: 'grey'}} onClick={async()=>{*/}
                            {/*        await handleSave(false);*/}
                            {/*        setCheck(false);*/}
                            {/*    }}>Lưu</button>*/}
                            {/*)}*/}
                            {/*{where==='new'?(<button className='post__button' style={{cursor: 'pointer'}} onClick={()=>handleSave(true)}>Đăng Bài</button>):(*/}
                            {/*    <>*/}
                            {/*        {publish?(*/}
                            {/*            <button className='post__button' style={{cursor: 'pointer'}} disabled={!check} onClick={()=>handleSave(true)}>Chính Sửa</button>*/}
                            {/*        ):(*/}
                            {/*            <button className='post__button' style={{cursor: 'pointer'}} onClick={()=>handlePublic()}>Đăng Bài</button>*/}
                            {/*        )}*/}
                            {/*    </>*/}
                            {/*)}*/}

                            {where==='new'?(
                                <>
                                    <button className='post__button' disabled={!check} style={{cursor: 'pointer', backgroundColor: 'grey'}} onClick={()=>handleSave(false)}>Lưu</button>
                                    <button className='post__button' disabled={!check} style={{cursor: 'pointer'}} onClick={()=>handleSave(true)}>Đăng Bài</button>
                                </>
                            ):(
                                <>
                                    {publish?(
                                        <>
                                            <button className='post__button' style={{cursor: 'pointer', backgroundColor: 'red'}} onClick={()=>handleRemove()}>Xoá Bài</button>
                                            <button className='post__button' style={{cursor: 'pointer'}} disabled={!check} onClick={()=>handleChange()}>Chính Sửa</button>
                                        </>
                                    ):(
                                        <>
                                            <button className='post__button' style={{cursor: 'pointer', backgroundColor: 'red'}} onClick={()=>handleRemove()}>Xoá Bài</button>
                                            <button className='post__button' disabled={!check} style={{cursor: 'pointer', backgroundColor: 'grey'}} onClick={()=>handleAlreadySave(false)}>Lưu</button>
                                            <button className='post__button' style={{cursor: 'pointer'}} disabled={!check} onClick={()=>handleAlreadySave(true)}>Đăng Bài</button>
                                        </>
                                    )}
                                </>
                            )}

                        </div>
                    </div>
                    <div className="forum__right">

                    </div>
                </div>
            </div>
        </>
    );
};

export default PostCustom;