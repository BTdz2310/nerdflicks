import React from 'react';
import useSWR from "swr";
import {fetcher} from "@/utils/utils";
import Spinner from "react-bootstrap/Spinner";
import {useSelector} from "react-redux";
import {selectFilter} from "@/store/features/filterSlice/filterSlice";
import styled from "styled-components";
import {nowPlayingMovie} from "@/components/type/typeSome";
import {Simulate} from "react-dom/test-utils";
import change = Simulate.change;

const queryArray = (arr: Array<string>) => {
    return arr.join('-');
}

const queryObject = (obj: Object, str: string) => {
    const arr: Array<string> = [];
    Object.keys(obj).forEach((key: string)=>{
        if(obj[key]) arr.push(key)
    })
    if(arr.length===0) return '';
    return `${str}${arr.join('-')}`;
}

const ListItem = styled.div`
  //display: flex;
  //flex-wrap: wrap;
  //justify-content: space-between;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  gap: 20px;
  margin-top: 60px;
`

const Item = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  background-color: #171717;
  width: 200px;
  height: 340px;
  position: relative;
  overflow: hidden;

  img{
    padding: 16px 30px;
    width: 100%;
    height: auto;
    z-index: 10;
    position: relative;
    object-fit: cover;
    border-radius: 12px;
  }
`

const FilterDisplay = ({type}: {type: 'tv'|'movie'}) => {

    const selectedFilter = useSelector(selectFilter);

    const queryMovie = () => {
        switch (selectedFilter[type].type){
            case 'all':
                return `https://api.themoviedb.org/3/discover/movie?${selectedFilter.movie.certification?`certification=${selectedFilter.movie.certification}&`:''}certification_country=US&include_adult=false&include_video=false&language=vi-VN&page=1&region=US${selectedFilter.movie.release_date1?`&release_date.gte=${selectedFilter.movie.release_date1}`:''}${selectedFilter.movie.release_date2?`&release_date.lte=${selectedFilter.movie.release_date2}`:''}&sort_by=${selectedFilter.movie.sorting}${selectedFilter.movie.vote_average?`&vote_average.gte=${selectedFilter.movie.vote_average}`:''}${selectedFilter.movie.vote_count?`&vote_average.gte=${selectedFilter.movie.vote_count}`:''}${queryObject(selectedFilter.movie.with_companies, '&with_companies=')}${queryObject(selectedFilter.movie.with_genres, '&with_genres=')}${queryObject(selectedFilter.movie.with_keywords, '&with_keywords=')}${selectedFilter.movie.with_origin_country?`&with_origin_country=${selectedFilter.movie.with_origin_country.toUpperCase()}`:''}${queryObject(selectedFilter.movie.with_people, '&with_people=')}${selectedFilter.movie.with_runtime1?`&with_runtime.gte=${selectedFilter.movie.with_runtime2}`:''}${selectedFilter.movie.with_runtime2?`&with_runtime.lte=${selectedFilter.movie.with_runtime2}`:''}`;
            case 'now_playing':
                return 'https://api.themoviedb.org/3/movie/now_playing?language=vi-VN&page=1&region=VN';
            case 'popular':
                return 'https://api.themoviedb.org/3/movie/popular?language=vi-VN&page=1&region=VN';
            case 'top_rated':
                return 'https://api.themoviedb.org/3/movie/top_rated?language=vi-VN&page=1&region=VN';
            case 'upcoming':
                return 'https://api.themoviedb.org/3/movie/upcoming?language=vi-VN&page=1&region=VN';
        }
    }

    const queryTV = () => {
        switch (selectedFilter[type].type){
            case 'all':
                return `https://api.themoviedb.org/3/discover/tv?${selectedFilter.tv.certification?`certification=${selectedFilter.tv.certification}&`:''}certification_country=US&include_adult=false&include_video=false&language=vi-VN&page=1&region=US${selectedFilter.tv.release_date1?`&release_date.gte=${selectedFilter.tv.release_date1}`:''}${selectedFilter.tv.release_date2?`&release_date.lte=${selectedFilter.tv.release_date2}`:''}&sort_by=${selectedFilter.tv.sorting}${selectedFilter.tv.vote_average?`&vote_average.gte=${selectedFilter.tv.vote_average}`:''}${selectedFilter.tv.vote_count?`&vote_average.gte=${selectedFilter.tv.vote_count}`:''}${queryObject(selectedFilter.tv.with_companies, '&with_companies=')}${queryObject(selectedFilter.tv.with_genres, '&with_genres=')}${queryObject(selectedFilter.tv.with_keywords, '&with_keywords=')}${selectedFilter.tv.with_origin_country?`&with_origin_country=${selectedFilter.tv.with_origin_country.toUpperCase()}`:''}${selectedFilter.tv.with_runtime1?`&with_runtime.gte=${selectedFilter.tv.with_runtime2}`:''}${selectedFilter.tv.with_runtime2?`&with_runtime.lte=${selectedFilter.tv.with_runtime2}`:''}${selectedFilter.tv.with_status.length?`&with_status=${queryArray(selectedFilter.tv.with_status)}`:''}`;
            case 'airing_today':
                return 'https://api.themoviedb.org/3/tv/airing_today?language=vi-VN&page=1';
            case 'on_the_air':
                return 'https://api.themoviedb.org/3/tv/on_the_air?language=vi-VN&page=1';
            case 'popular':
                return 'https://api.themoviedb.org/3/tv/popular?language=vi-VN&page=1';
            case 'top_rated':
                return 'https://api.themoviedb.org/3/tv/top_rated?language=vi-VN&page=1';
        }
    }

    const { data: dataA} = useSWR(
        type==='movie' ? queryMovie() : queryTV(),
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    if (!dataA) return <Spinner animation="grow" />;

    console.log(queryMovie('all'))
    console.log(dataA)

    return (
        <ListItem>
            {dataA.results.map((ele: nowPlayingMovie)=>(
                <Item key={ele.id}>
                    <img src={`https://media.themoviedb.org/t/p/w440_and_h660_face${ele.poster_path}`} alt="img"/>
                    <p>{ele.title?ele.title:ele.name}</p>
                </Item>
            ))}
        </ListItem>
    );
};

export default FilterDisplay;