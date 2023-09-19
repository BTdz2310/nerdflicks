'use client'
import React, { useState } from 'react'
import useSWR from 'swr';
import { Spinner } from 'react-bootstrap';

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
        console.log('>>>>', data)

        if(isLoading) return <Spinner animation="grow"/>


  return (
    <div className="trendingContainer">
        <div className="titleTrending">
            <p className="trendingText">Trending</p>
            <div className="dayOrWeek">
                <p className="day"></p>
                <p className="week"></p>
            </div>
        </div>
        <div className="listContainer">
            
        </div>
    </div>
  )
}

export default Trending