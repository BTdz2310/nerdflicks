'use client'
import React, { useState } from 'react'
import useSWR from 'swr';
import { Spinner } from 'react-bootstrap';
import { MDataRtns } from './SearchModal';
import MovieCard from './MovieCard';
import { rtnList} from './type/typeSome';
import '@/styles/trending-popular.css'

const Trending = () => {
    const [type, setType] = useState('day');

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
        const { data, error,isLoading } = useSWR(`https://api.themoviedb.org/3/trending/all/${type}?language=vi-VN`, fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false
        })
        // console.log('>>>>', data.results.map((obj:object)=>obj.genre_ids))

        if(isLoading) return <Spinner animation="grow"/>


  return (
    <div className="trendingContainer">
        <div className="titleTrending">
            <p className="trendingText">Trending</p>
            <div className="dayOrWeek">
                <p className="day">Ngày</p>
                <p className="week">Tuần</p>
            </div>
        </div>
        <div>
            <div className="listContainer">
                {data.results.map((obj: MDataRtns, index: number)=>{
                    const object: rtnList = {
                        id: obj.id,
                        name: obj.name?obj.name:obj.title?obj.title:'',
                        poster_path: obj.poster_path,
                        genre_ids: obj.genre_ids?obj.genre_ids:[], 
                        release_date: obj.release_date?obj.release_date:'',
                        vote_average: obj.vote_average?obj.vote_average:0,
                        media_type: obj.media_type
                    };
                    return (
                        <MovieCard obj={object} key={index} />
                    )
                })}
            </div>
        </div>
    </div>
  )
}

export default Trending