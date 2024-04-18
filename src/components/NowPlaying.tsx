'use client'
import React, {useEffect, useState, lazy, useRef, useLayoutEffect} from 'react'
import useSWR from 'swr'
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {nameGenre, options} from '@/utils/utils';
import {nowPlayingMovie} from './type/typeSome';
import styled from "styled-components";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const Spinner = lazy(()=>import('react-bootstrap/Spinner'))

const posterDefault: string = 'https://png.pngtree.com/background/20230616/original/pngtree-wall-of-movie-posters-on-display-picture-image_3620105.jpg';

export interface iColor {
    r: number,
    g: number,
    b: number
}

const StyledNowPlaying = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
`

const StyledBackground = styled.div`
  opacity:1;
  background-position: center;
  transition: background 0.4s ease-in-out;
  background-size: cover;
  width: 100%;
  height: 100%;
  position: absolute;
  min-height: 600px!important;
  top: 0;
  left: 0;
`

const NowPlayingInfo = styled.div`
  position: relative;
  padding: 0 20px;
  margin: 100px auto;
  display: flex;
  
  div{
    opacity: 1;
    position: absolute;
    width: 100%;
    padding: 20px;
    top: 300px;
    left: 0;
    background-color: rgba(28,28,28,.6);
  }
  
  div:last-child{
    opacity: 0;
  }
  
  div>span{
    max-width: 1200px;
    margin: 0 auto;
    font-family: Arial, Helvetica, sans-serif;
  }

  div>span>span{
    width: 60%;
  }
  
  div>span>span>span{
    font-size: 20px;
    text-decoration: underline;
  }

  div>span>span>span:not(:last-child):after{
    content: ' | ';
  }
`

const SpanTitle = styled.span`
  font-weight: 600;
  text-transform: uppercase;
  font-size: 50px;
  display: flex!important;
  flex-direction: column;
  gap: 10px;
`

const SpanOverview =  styled.span`
  font-size: 16px;
  display: flex!important;
  flex-direction: column;
  gap: 10px;
`

const NowPlayingSide = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 10px;
  right: 40px;
  z-index: 1000;
`

const NowPlayingCircle = styled.div`
  cursor: pointer;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: #9B9B9B;
`

const NowPlaying = ({data}: {data: Array<nowPlayingMovie>}) => {
    const [index, setIndex] = useState<number>(0);

    const ref1 = useRef(null);
    const ref2 = useRef(null);
    const certainLeft = useRef(null);
    const certainRight = useRef(null);

    useLayoutEffect( () => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to(ref1.current, {
            scrollTrigger: {
                trigger: ref1.current,
                scrub: true,
                // start: '0 top',
                // end: '400 top',
                start: 0,
                end: 400,
                // markers: true
            },
            opacity: 0,
            y: -40,
            ease: "power1"
        })

        gsap.to(ref2.current, {
            scrollTrigger: {
                trigger: ref2.current,
                scrub: true,
                // start: '0 top',
                // end: '400 top',
                start: 400,
                end: 800,
                // markers: true
            },
            opacity: 1,
            y: -40,
            ease: "power1"
        })


    }, [])

    const router = useRouter();



    // if(isLoading) return (<div className='__loading'><Spinner animation="grow"/></div>)

  return (
      <>
        <StyledNowPlaying>
            <StyledBackground style={{backgroundImage: data[index].backdrop_path?`url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${data[index].backdrop_path})`:`url(${posterDefault})`}}></StyledBackground>
            <NowPlayingInfo>
                {/*<div style={{opacity: (offsetY > 200 ? 1 - (offsetY - 200) / 200 : 1) < 0 ? 0 : offsetY > 200 ? 1 - (offsetY - 200) / 200 : 1, transform: `translateY(${0 - (offsetY - 200) / 10 < -20 ? -20 : 0 - (offsetY - 200) / 10}px)`}}>*/}
                <div ref={ref1}>
                    <SpanTitle>
                        <span style={{textTransform: 'none', fontSize: '24px', color: '#FD39C3', fontWeight: '300'}}>Đang Chiếu Rạp</span>
                        <Link href={`/movie/${data[index].id}`}>
                            <span style={{fontSize: '56px'}}>{data[index].title}</span>
                        </Link>
                    </SpanTitle>
                </div>

                {/*<div style={{opacity: offsetY < 400 ? 0 : (offsetY - 400)/400 > 1 ? 1 : offsetY < 400 ? 0 : (offsetY - 400)/400, transform: `translateY(${0 - (offsetY - 400) / 10 < -40 ? -40 : 0 - (offsetY - 400) / 10}px)`}}>*/}
                <div ref={ref2}>
                    <SpanOverview>
                        <span>Thể Loại: &nbsp;&nbsp;{data[index].genre_ids.map((id: 28 | 12 | 16 | 35 | 80 | 99 | 18 | 10751 | 14 | 36 | 27 | 10402 | 9648 | 10749 | 878 | 10770 | 53 | 10752 | 37 | 10759 | 10762 | 10763 | 10764 | 10765 | 10766 | 10767 | 10768) =>(<span key={id} className='__splash--text-genre'>{nameGenre[id]}</span>))}</span>
                        <span>{data[index].overview.length>400?`${data[index].overview.slice(0, 400)} ...`: data[index].overview}</span>
                    </SpanOverview>
                </div>
            </NowPlayingInfo>

            <NowPlayingSide>
                {data.map((movie: nowPlayingMovie, ind: number)=>(
                    <React.Fragment key={ind}>
                        <NowPlayingCircle className="__tooltip" onClick={()=>setIndex(ind)} style={{backgroundColor: ind===index?'white':'#9B9B9B'}}>
                            <div className="__tooltip--text" style={{right: '20px'}}>
                                {movie.title}
                            </div>
                        </NowPlayingCircle>
                    </React.Fragment>
                ))}
            </NowPlayingSide>
        </StyledNowPlaying>
          {/*<div className="__trending">*/}
          {/*    <div className="__trending--background"></div>*/}
          {/*</div>*/}
      </>
  )


    // return (
    //     <div style={{marginTop: '100vh'}}>
    //         {
    //             phrases.map( (phrase, index) => {
    //                 return <AnimatedText key={index}>{phrase}</AnimatedText>
    //             })
    //         }
    //     </div>
    // )
}

export default NowPlaying