'use client'
import React, { useEffect, useState, lazy } from 'react'
import useSWR from 'swr'
import RatingIcon from './RatingIcon';
import GenreIcon from './GenreIcon';
import Link from 'next/link';
// import Spinner from 'react-bootstrap/Spinner';
// import Image from "next/image";
import { useRouter } from 'next/navigation';

const Spinner = lazy(()=>import('react-bootstrap/Spinner'))

const posterDefault: string = 'https://www.oppl.org/wp-content/uploads/2022/10/Scary-Movies-800x400w.jpg';
// https://wallpapers.com/images/hd/movie-poster-background-q1zm830g0hfww2lk.jpg
// 

const NowPlaying = () => {
    const [index, setIndex] = useState<number>(0);

    const router = useRouter();

    const handleIncreaseIndex = () => {
        setIndex(prev=>prev===data.results.length-1?0:prev+1)
    }

    const handleDecreaseIndex = () => {
        setIndex(prev=>prev===0?data.results.length-1:prev-1)
    }


    const options = {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OWJiODExODczYTgwNjMwMGY1ZTE5NThhYjUzMzhhMiIsInN1YiI6IjYzZTRiNDJlMGU1OTdiMDBjZDdiYTQzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jj9_04xOHbR519EDCfhgf9jFAz6AtMGNECxGgeg-i2M'
        }
      };

    const fetcher = (url: string) => fetch(url, options)
        .then((res) => res.json());
        // 
        const { data, error,isLoading } = useSWR(`https://api.themoviedb.org/3/movie/now_playing?language=vi-VN&page=1&region=VN`, fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        })
        console.log('>>>>', data)

        if(isLoading) return <Spinner animation="grow"/>

        // setTimeout(()=>{
        //     handleIncreaseIndex()
        // }, 5000)

        const handleMove = () => {
            router.push(`/movie/${data.results[index].id}`);
        }

  return (
    <>
        <div className="heroImg" style={{backgroundImage: data.results[index].backdrop_path?`url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${data.results[index].backdrop_path})`:`url(${posterDefault})`}}></div>
        <div className="playingSite" >
            <h2 className='hero-header'>Đang chiếu rạp</h2>
            <div className="leftMovie" onClick={()=>handleDecreaseIndex()}>
                <img width="48" height="48" src="https://img.icons8.com/fluency/48/circled-left.png" alt="circled-left"/>
            </div>
            <div className="rightMovie" onClick={()=>handleIncreaseIndex()}>
                <img width="48" height="48" src="https://img.icons8.com/fluency/48/circled-right.png" alt="circled-right"/>
            </div>
            <div className="nowPlayingMovie">
                <div className="informationMoviePlaying">
                    <div className="detailMoviePlaying">
                        <p className="titleMoviePlaying" onClick={handleMove}>{data.results[index].title}</p>
                        <div className="genreMoviePlaying"><GenreIcon arr={data.results[index].genre_ids} media_type={'movie'} link={true}/></div>
                        <p className="releaseMoviePlaying">{data.results[index].release_date.split('-').reverse().join(' - ')}</p>
                        <RatingIcon score={data.results[index].vote_average} size={20}/>
                    </div>
                    <p className="overviewMoviePlaying">{data.results[index].overview}</p>
                    <Link href={`/movie/${data.results[index].id}`} className='intoMovie'>Chi Tiết</Link>
                </div>
                <div className="imageMoviePlaying">
                    <img src={`https://image.tmdb.org/t/p/w300_and_h450_bestv2${data.results[index].poster_path}`} alt={data.results[index].title} width='300px' height='450px'/>
                </div>
            </div>
        </div>
        
    </>
  )
}

export default NowPlaying