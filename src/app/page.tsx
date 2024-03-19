'use client'
import '../styles/home.css'
// import NowPlaying from '@/components/NowPlaying'
import {lazy, useEffect, useRef} from 'react'
import Check from "@/components/Check";
import {options} from "@/utils/utils";
import useSWR from "swr";
import {Spinner} from "react-bootstrap";

const NowPlaying = lazy(()=>import('@/components/NowPlaying'))
const Trending = lazy(()=>import('@/components/Trending'))

export default function Home() {

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

    // useEffect(() => {
    //     let scroll:any;
    //     import("locomotive-scroll").then((locomotiveModule) => {
    //         scroll = new locomotiveModule.default({
    //             el: document.querySelector("[data-scroll-container]"),
    //             smooth: true,
    //             smoothMobile: false,
    //             resetNativeScroll: true
    //         });
    //     });
    //
    //     // `useEffect`'s cleanup phase
    //     return () => {
    //         if (scroll) scroll.destroy();
    //     }
    // });

    useEffect( () => {

        (

            async () => {

                const LocomotiveScroll = (await import('locomotive-scroll')).default

                const locomotiveScroll = new LocomotiveScroll();

            }

        )()

    }, [])

    if(isLoading) return (<div className='__loading'><Spinner animation="grow"/></div>)

  return (
    <main>

        {/*<div style={{height: '2000px', background: 'red'}}></div>*/}
        <NowPlaying data={data.results}/>
        {/*<Check />*/}
      {/*/!*<div className="trending">*!/*/}
      {/*  <Trending />*/}
      {/*</div>*/}
    </main>
  )
}
