'use client'
import '../styles/home.css'
// import NowPlaying from '@/components/NowPlaying'
import {lazy, useEffect, useRef, useState} from 'react'
import Check from "@/components/Check";
import {getAccessTokenGithub, options} from "@/utils/utils";
import useSWR from "swr";
import {Spinner} from "react-bootstrap";
import {nowPlayingMovie} from "@/components/type/typeSome";
import Genre from "@/components/Genre";
import PopularHome from "@/components/PopularHome";
import Header from "@/components/Header";
import {useSearchParams} from "next/navigation";
import {toast} from "react-toastify";
import { useCookies } from 'next-client-cookies';

const NowPlaying = lazy(()=>import('@/components/NowPlaying'))
const Trending = lazy(()=>import('@/components/Trending'))

export default function Home() {

    const searchParams = useSearchParams()

    const codeParam = searchParams.get('code');
    const cookies = useCookies();

    useEffect(() => {
        if(codeParam){
            getAccessTokenGithub(codeParam).then(async (resp) => {
                const response = await fetch(`http://localhost:5001/api/github/login?accessToken=${resp.access_token}`);
                const json = await response.json();
                if(response.status===200){
                    cookies.set('token', json);
                    toast.success(json.msg);
                }else{
                    toast.error(json.msg);
                }
            })
        }
    }, [codeParam]);

    // const refScrollContainer = useRef(null);

    const fetcher = (url: string) => fetch(url, options)
        .then((res) => res.json());
    //
    const { data, error,isLoading } = useSWR(`https://api.themoviedb.org/3/movie/now_playing?language=vi-VN&page=1&region=VN`, fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        })

    const movie = useSWR(`https://api.themoviedb.org/3/movie/popular?language=vi&page=1`, fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        })

    const tv = useSWR(`https://api.themoviedb.org/3/tv/popular?language=vi&page=1`, fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        })

    // useEffect(() => {
    //     const fetchData = async () => {
    //         setLoading(true);
    //
    //         const responseMovie = fetch(`https://api.themoviedb.org/3/movie/popular?language=vi&page=1`, options);
    //         const responseTV = fetch(`https://api.themoviedb.org/3/tv/popular?language=vi&page=1`, options);
    //         const jsonMovie = await responseMovie;
    //         const jsonTV = await responseTV;
    //
    //         const movie = await jsonMovie.json();
    //         const tv = await jsonTV.json();
    //
    //         setPopularMovie(movie.results);
    //         setPopularTV(tv.results);
    //
    //         setLoading(false);
    //     }
    //
    //     fetchData();
    // }, []);

    // useEffect( () => {
    //     (
    //         async () => {
    //             const LocomotiveScroll = (await import('locomotive-scroll')).default
    //             const locomotiveScroll = new LocomotiveScroll();
    //         }
    //     )()
    // }, [])

    if(isLoading||movie.isLoading||tv.isLoading) return (<div className='__loading'><Spinner animation="grow"/></div>)

  return (
      <>
    <main>

        {/*<div style={{height: '2000px', background: 'red'}}></div>*/}
        <NowPlaying data={data.results}/>
        {/*<Popular data={{*/}
        {/*    movie: movie.data.results,*/}
        {/*    tv: tv.data.results*/}
        {/*}}/>*/}
        <PopularHome data={{
            movie: movie.data.results,
            tv: tv.data.results
        }}/>
        <Genre />
        <div className="__home" style={{height: '100vh', backgroundColor: 'red', marginTop: '700vw'}}>

        </div>
        <div className='__hide' style={{display: 'none'}}>
            {data.results.map((ele:nowPlayingMovie)=>(<img loading='eager' key={ele.id} src={`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${ele.backdrop_path}`} style={{display: 'none'}}/>))}
        </div>


        {/*<Check />*/}
      {/*/!*<div className="trending">*!/*/}
      {/*  <Trending />*/}
      {/*</div>*/}
    </main>
      </>
  )
}
