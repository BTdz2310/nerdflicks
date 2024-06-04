'use client'
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import '@/styles/userPage.css'
import "@/styles/forum.css";
import {selectId, selectList, selectLoggedIn, setList} from "@/store/features/userSlice/userSlice";
import {useCookies} from "next-client-cookies";
import {useRouter} from "next/navigation";
import useSWR, {useSWRConfig} from "swr";
import ReactLoading from "react-loading";
import UserNavbar from "@/components/UserNavbar";
import {nowPlayingMovie} from "@/components/type/typeSome";
import {Link} from "next-view-transitions";
import {shortenString} from "@/utils/utils";
import {genreById} from "@/components/GenreIcon";
import {ThunkDispatch} from "@reduxjs/toolkit";
import ErrorPage from "next/error";

const Page = ({params}: {params: {id: string}}) => {

    const selectedLoggedIn = useSelector(selectLoggedIn);
    const cookies = useCookies();
    const router = useRouter();
    const selectedList = useSelector(selectList);
    const [nameList, setNameList] = useState('');
    const selectedId = useSelector(selectId);

    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    const {mutate} = useSWRConfig();

    useEffect(() => {
        if(selectedList){
            setNameList(Object.keys(selectedList)[0]);
        }
    }, [selectedList]);

    if(!selectedList) return (<div className='__loading-container'><ReactLoading type={'spinningBubbles'} color={'white'} height={50} width={50}/></div>)

    const handleList = async (id: number, media: string, data: nowPlayingMovie) => {

        const listTemp = {
            ...selectedList,
            [nameList]: selectedList[nameList].filter((item: nowPlayingMovie)=>item.id!==id||item.media_type!==media)
        }

        // console.log(listTemp)

        // return;

        const response = await dispatch(setList({
            dataList: listTemp,
            token: cookies.get('token')
        }));

        await mutate('http://localhost:5001/api/notifications')

    }

    return (
        <>
            {params.id===selectedId?(
                <div className='main__container user__container'>
                    <UserNavbar id={params.id}/>
                    <div className="user__right list__container">
                        <div className="list__container-left">
                            <div className="list-name__list">
                                {Object.keys(selectedList).map((name: string)=>(
                                    <p key={name} onClick={()=>setNameList(name)} className={nameList===name?'list-name--selected':undefined}>{name}</p>
                                ))}
                            </div>
                        </div>
                        <div className="list__container-right">
                            {selectedList[nameList]&&selectedList[nameList].map((item: nowPlayingMovie)=>(
                                <div key={item.id} className='post-list__item'>
                                    <img src={item.poster_path?`https://media.themoviedb.org/t/p/w188_and_h282_bestv2${item.poster_path}`:'https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2086941550.jpg'} alt=""/>
                                    <div className='post-list__info'>
                                        <div className="post-list__info-first">
                                            <div className='post-list__info-text'>
                                                <h2><Link href={`/${item.media_type}/${item.id}`}>{item.title?shortenString(item.title, 40):shortenString(item.name, 40)}</Link></h2>
                                                <p>{item.release_date?(item.release_date?item.release_date.split('-')[0]:''):(item.first_air_date?item.first_air_date.split('-')[0]:'')} - {item.genre_ids&&item.genre_ids.map((genre: 28 | 12 | 16 | 35 | 80 | 99 | 18 | 10751 | 14 | 36 | 27 | 10402 | 9648 | 10749 | 878 | 10770 | 53 | 10752 | 37 | 10759 | 10762 | 10763 | 10764 | 10765 | 10766 | 10767 | 10768)=>genreById[genre]).join(', ')}</p>
                                            </div>
                                            <button onClick={()=>handleList(item.id, item.title?'movie':'tv', item)}>
                                                <i className="fa-solid fa-x"></i>
                                            </button>
                                        </div>
                                        <div className="post-list__info-second">
                                            <p>{shortenString(item.overview, 200)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ):<ErrorPage statusCode={404}></ErrorPage>}
        </>
    );
};

export default Page;