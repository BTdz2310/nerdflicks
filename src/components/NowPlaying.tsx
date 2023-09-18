'use client'
import React, { useEffect, useState } from 'react'
import useSWR from 'swr'
import {FaArrowCircleRight, FaArrowCircleLeft} from 'react-icons/fa'
import RatingIcon from './RatingIcon';
import GenreIcon from './GenreIcon';
import Link from 'next/link';
import Spinner from 'react-bootstrap/Spinner';

const posterDefault: string = 'https://wallpapers.com/images/hd/movie-poster-background-q1zm830g0hfww2lk.jpg';

const NowPlaying = () => {
    const [index, setIndex] = useState<number>(0);

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
  return (
    <>
        <div className="heroImg" style={{backgroundImage: data.results[index].backdrop_path?`url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${data.results[index].backdrop_path})`:`url(${posterDefault})`}}></div>
        <div className="playingSite">
            <h2 className='hero-header'>đang chiếu rạp</h2>
            <div className="leftMovie">
                <FaArrowCircleLeft fontSize={40} onClick={()=>handleDecreaseIndex()}/>
            </div>
            <div className="rightMovie">
                <FaArrowCircleRight fontSize={40} onClick={()=>handleIncreaseIndex()}/>
            </div>
            <div className="nowPlayingMovie">
                <div className="informationMoviePlaying">
                    <div className="detailMoviePlaying">
                        <h4 className="titleMoviePlaying">{data.results[index].title}</h4>
                        <div className="genreMoviePlaying"><GenreIcon arr={data.results[index].genre_ids}/></div>
                        <p className="releaseMoviePlaying">{data.results[index].release_date.split('-').reverse().join(' - ')}</p>
                        <RatingIcon score={data.results[index].vote_average} size={20}/>
                    </div>
                    <p className="overviewMoviePlaying">{data.results[index].overview}</p>
                    <Link href={``} className='intoMovie'>Chi Tiết</Link>
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