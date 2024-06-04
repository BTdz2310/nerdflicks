'use client'
import React from 'react';
import UserNavbar from "@/components/UserNavbar";
import useSWR, {useSWRConfig} from "swr";
import "@/styles/forum.css";
import "@/styles/userPage.css"
import {useCookies} from "next-client-cookies";
import {useRouter} from "next/navigation";
import {useDispatch, useSelector} from "react-redux";
import {selectFavorite, selectId, selectLoggedIn, setFavorite} from "@/store/features/userSlice/userSlice";
import ReactLoading from "react-loading";
import {nowPlayingMovie} from "@/components/type/typeSome";
import PostList from "@/components/PostList";
import {Link} from "next-view-transitions";
import {shortenString} from "@/utils/utils";
import {genreById} from "@/components/GenreIcon";
import AddTo from "@/components/AddTo";
import {ThunkDispatch} from "@reduxjs/toolkit";
import ErrorPage from "next/error";

const Page = ({params}: {params: {id: string}}) => {

    const selectedLoggedIn = useSelector(selectLoggedIn);
    const selectedId = useSelector(selectId);
    const selectedFavorite = useSelector(selectFavorite);
    const cookies = useCookies();
    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();

    const {mutate} = useSWRConfig();

    const fetcherAuth = (url: string) =>
        fetch(url, {
            headers: {
                'Authorization': `Bearer ${cookies.get('token')}`
            }
        }).then((res) => res.json());

    const { data, isLoading, mutate: mutate1} = useSWR(selectedLoggedIn?`http://localhost:5001/api/favorite`:null, fetcherAuth,
        {
            revalidateIfStale: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true
        })

    if(isLoading) return (<div className='__loading-container'><ReactLoading type={'spinningBubbles'} color={'white'} height={50} width={50}/></div>)

    const handleFavorite = async (id: number, media: string, data: nowPlayingMovie) => {
        const itemCheck = selectedFavorite.filter((item1: nowPlayingMovie)=>media===item1.media_type&&id.toString()===item1.id.toString());
        // console.log(selectedFavorite, media, id, selectedFavorite.filter((item1: nowPlayingMovie)=>media===item1.media_type||id.toString()===item1.id.toString()))
        let dataList: Array<Object> = [];
        if(itemCheck.length){
            dataList = selectedFavorite.filter((item1: nowPlayingMovie)=>media!==item1.media_type||id.toString()!==item1.id.toString());
            // console.log(dataList)
        }else{
            dataList = [
                ...selectedFavorite,
                {
                    ...data,
                    media_type: media
                }
            ]
        }

        const response = await dispatch(setFavorite({
            token: cookies.get('token'),
            dataList
        }));

        await mutate1();
        await mutate('http://localhost:5001/api/notifications')
    }

    return (
        <>
            {params.id===selectedId?(
                <div className='main__container user__container'>
                    <UserNavbar id={params.id}/>
                    <div className="user__right favorite__container">
                        {console.log(data, isLoading)}
                        {data&&data.data.favorite.map((item: nowPlayingMovie)=>(
                            <div key={item.id} className='post-list__item'>
                                <img src={item.poster_path?`https://media.themoviedb.org/t/p/w188_and_h282_bestv2${item.poster_path}`:'https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2086941550.jpg'} alt=""/>
                                <div className='post-list__info'>
                                    <div className="post-list__info-first">
                                        <div className='post-list__info-text'>
                                            <h2><Link href={`/${item.media_type}/${item.id}`}>{item.title?shortenString(item.title, 40):shortenString(item.name, 40)}</Link></h2>
                                            <p>{item.release_date?(item.release_date?item.release_date.split('-')[0]:''):(item.first_air_date?item.first_air_date.split('-')[0]:'')} - {item.genre_ids&&item.genre_ids.map((genre: 28 | 12 | 16 | 35 | 80 | 99 | 18 | 10751 | 14 | 36 | 27 | 10402 | 9648 | 10749 | 878 | 10770 | 53 | 10752 | 37 | 10759 | 10762 | 10763 | 10764 | 10765 | 10766 | 10767 | 10768)=>genreById[genre]).join(', ')}</p>
                                        </div>
                                        <button onClick={()=>handleFavorite(item.id, item.title?'movie':'tv', item)} style={{color: 'rgb(253, 57, 195)'}}>
                                            <i className="fa-solid fa-heart"></i>
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
            ):<ErrorPage statusCode={404}></ErrorPage>}
        </>
    );
};

export default Page;