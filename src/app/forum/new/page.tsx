'use client'
import React, {Fragment, useEffect, useState} from 'react';
import {CustomLink} from "@/components/CustomLink";
import useSWR from "swr";
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

const Page = () => {

    const [titleText, setTitleText] = useState('');
    const [contentText, setContentText] = useState('');
    const [searchText, setSearchText] = useState('');
    const [mediaType, setMediaType] = useState<'tv'|'movie'>('movie');
    const [loading, setLoading] = useState(false);
    const [dataSearch, setDataSearch] = useState([]);
    const [mediaList, setMediaList] = useState<Array<nowPlayingMovie>>([]);
    const [tagList, setTagList] = useState<Array<string>>([]);
    const [check, setCheck] = useState(false);

    const debounce = useDebounce(searchText, 200);
    const cookies = useCookies();

    const router = useRouter();

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
    }, [titleText, contentText, mediaList, tagList]);

    useEffect(() => {
        if(titleText || contentText || mediaList.length || tagList.length){
            setCheck(true)
        }else{
            setCheck(false)
        }
    }, [titleText, contentText, mediaList, tagList]);

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

    const checkInclude = (id: number, media: string) => {
        const itemCheck = mediaList.filter((item1: nowPlayingMovie)=>media===item1.media_type&&id===item1.id);
        return !!itemCheck.length;
    }

    const handleAction = (item: nowPlayingMovie) => {

        const itemCheck = mediaList.filter((item1: nowPlayingMovie)=>(item.title ? 'movie' : 'tv')===item1.media_type&&item.id===item1.id);

        if(itemCheck.length){
            setMediaList(mediaList.filter((item1: nowPlayingMovie)=>item.media_type!==item1.media_type&&item.id!==item1.id))
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

        const response = await fetch('http://localhost:5001/api/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Authorization': `Bearer ${cookies.get('token')}`
            },
            body: JSON.stringify(data)
        });
        const json = await response.json();

        if(response.status === 200){
            toast.success(json);
            router.push('/forum', {scroll : false});
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
                            <CustomLink setAction={handleSave} href={'/forum'} className='forum-new__link'><i className="fa-solid fa-left-long"></i>Quay Lại Diễn Đàn</CustomLink>
                        ):(
                            <Link href={'/forum'} className='forum-new__link'><i className="fa-solid fa-left-long"></i>Quay Lại Diễn Đàn</Link>
                        )}
                        <div className="forum__head">
                            <h1>Bài Đăng Mới</h1>
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
                                <div className="post__table" style={{backgroundColor: 'inherit'}}>
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
                        <div className="post__group" style={{justifyContent: 'end', display: 'flex'}}>
                            <button className='post__button' style={{cursor: 'pointer'}} onClick={()=>handleSave(true)}>Đăng</button>
                        </div>
                    </div>
                    <div className="forum__right">

                    </div>
                </div>
            </div>
        </>
    );
};

export default Page;