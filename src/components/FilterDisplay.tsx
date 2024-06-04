import React, {useEffect, useRef, useState} from 'react';
import useSWR from "swr";
import {fetcher, getAverageColor, getColorHex, nameGenre, options, shortenString,} from "@/utils/utils";
import Spinner from "react-bootstrap/Spinner";
import {useSelector} from "react-redux";
import {selectFilter} from "@/store/features/filterSlice/filterSlice";
import styled from "styled-components";
import {nowPlayingMovie} from "@/components/type/typeSome";
import {Link} from "next-view-transitions";
import { FastAverageColor } from 'fast-average-color';
import {iGenre} from "@/app/movie/[id]/page";
import {genreColor} from "@/components/GenreIcon";
import ReactLoading from "react-loading";
import InfiniteScroll from "react-infinite-scroll-component";
// import {ntc} from 'https://www.color-blindness.com/color-name-hue-tool/js/ntc.js'

const queryArray = (arr: Array<string>) => {
    return arr.join('|');
}

const queryObject = (obj: Object, str: string) => {
    const arr: Array<string> = [];
    Object.keys(obj).forEach((key: string)=>{
        arr.push(key)
    })
    if(arr.length===0) return '';
    return `${str}${arr.join('|')}`;
}

const ListItem = styled.div`
  //display: flex;
  //flex-wrap: wrap;
  //justify-content: space-between;
  display: flex;
  column-gap: 50px;
  row-gap: 40px;
  //grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 60px;




  .__background, img{
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    object-fit: cover!important;
    //opacity: 0.8;
    filter: brightness(0.8);
    border-radius: 12px;
  }

  .flip-card--front p{
    z-index: 100;
    text-align: center;
    transform: translateZ(50px);
    font-size: 20px;
    border-bottom: 10px;
    border-bottom: 1px solid white;
  }

  .flip-card{
    perspective: 1000px;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    //background-color: #171717;
    width: 200px;
    height: 300px;
    position: relative;
    //overflow: hidden;
    //padding: 16px 30px;
    align-items: center;
    justify-content: center;
    background-size: cover!important;
  }

  .flip-card--container{
    position: relative;
    width: 100%;
    height: 100%;
    text-align: center;
    transition: transform 0.6s;
    transform-style: preserve-3d;
  }

  .flip-card:hover .flip-card--container {
    transform: rotateY(180deg);
  }

  .flip-card--front, .flip-card--back{
    position: absolute;
    width: 100%;
    height: 100%;
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
  }

  .flip-card--front{
    display: flex;
    border-radius: 12px;
    align-items: center;
    justify-content: center;
    perspective: 500px;
    transform-style: preserve-3d;
    padding: 0 20px;
  }

  .flip-card--back{
    padding: 0 20px;
    transform: rotateY(180deg);
    border-radius: 12px;
    align-items: center;
    display: flex;
    flex-direction: column;
    gap: 10px;
    perspective: 500px;
    transform-style: preserve-3d;
    justify-content: center;
  }

  .genre-list{
    display: flex;
    gap: 5px;
    flex-wrap: wrap;
    justify-content: center;
    transform: translateZ(50px);
    
  }
  
  //.genre-list p{
  //  text-align: center;
  //  transform: translateZ(50px);
  //}

  .__loadMore{
    padding: 40px;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  
  .__loadMore button{
    padding: 10px 20px;
    font-size: 20px;
    background-color: inherit;
    border: 1px solid white;
    color: white;
    cursor: pointer;
  }

  .__loadMore button:hover{
    border: 1px solid rgb(253, 57, 195);
    color: rgb(253, 57, 195);
  }
  
`

const MediaItem = ({ele, type}: {ele: nowPlayingMovie, type: 'tv'|'movie'}) => {

    const [colorCode, setColorCode] = useState('');

    return (
        // <Item key={ele.id}>
            <div>
                <Link href={`/${type}/${ele.id}`} className='flip-card'>

                    <div className="flip-card--container">
                        <div className="flip-card--front">
                        {/*<div className="flip-card--back">*/}
                            <img src={ele.poster_path?`https://media.themoviedb.org/t/p/w440_and_h660_face${ele.poster_path}`:'https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2086941550.jpg'} alt={'background'} onLoad={(e)=> {
                                const fac = new FastAverageColor();
                                fac.getColorAsync(`https://media.themoviedb.org/t/p/w440_and_h660_face${ele.poster_path}?not-from-cache-please`)
                                    .then(color => {
                                        setColorCode(color.rgb)
                                    })
                                    .catch(e => {
                                        console.log(e);
                                    });
                            }}/>
                            <p>{ele.title?ele.title:ele.name}</p>
                        </div>
                        <div className="flip-card--back" style={{backgroundColor: ele.poster_path?colorCode:'#C1C2C2'}}>
                        {/*<div className="flip-card--front" style={{backgroundColor: colorCode}}>*/}
                            <div className="genre-list">
                                {ele.genre_ids.slice(0, 3).map((genre: number) => (
                                    <p style={{padding: '4px', color: getColorHex(genreColor[genre.toString()]), backgroundColor: genreColor[genre.toString()]}} key={genre}>{nameGenre[genre.toString()]}</p>))}
                                <p>{shortenString(ele.overview, 100)}</p>
                            </div>
                        </div>
                    </div>

                </Link>
            </div>
        // </Item>
    )
}

const FilterDisplay = ({type, searchText}: {type: 'tv'|'movie', searchText: string}) => {

    const selectedFilter = useSelector(selectFilter);
    const [page, setPage] = useState(1);
    const [data, setData] = useState<Array<nowPlayingMovie>>([]);
    const [totalPage, setTotalPage] = useState(0);
    const [newLoad, setNewLoad] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setPage(1);
        setTotalPage(1);
        setData([]);
        setNewLoad(prev=>!prev)
    }, [selectedFilter]);


    useEffect(() => {

        const fetchData = async () => {

            setIsLoading(true);
            const response = await fetch(type==='movie' ? queryMovie() : queryTV(), options);

            const json = await response.json();

            setData([...data, ...json.results]);
            // setTotalData(json.total_results);
            setTotalPage(json.total_pages);

            console.warn(json.results)
            setIsLoading(false)
        }

        fetchData()

    }, [page, newLoad]);


    const queryMovie = () => {
        switch (selectedFilter[type].type){
            case 'all':
                return `https://api.themoviedb.org/3/discover/movie?${selectedFilter.movie.certification?`certification=${selectedFilter.movie.certification}&`:''}certification_country=US&include_adult=false&include_video=false&language=vi-VN&page=${page}&region=US${selectedFilter.movie.release_date1?`&release_date.gte=${selectedFilter.movie.release_date1}`:''}${selectedFilter.movie.release_date2?`&release_date.lte=${selectedFilter.movie.release_date2}`:''}&sort_by=${selectedFilter.movie.sorting}${selectedFilter.movie.vote_average?`&vote_average.gte=${selectedFilter.movie.vote_average}`:''}${selectedFilter.movie.vote_count?`&vote_count.gte=${selectedFilter.movie.vote_count}`:''}${queryObject(selectedFilter.movie.with_companies, '&with_companies=')}${queryObject(selectedFilter.movie.with_genres, '&with_genres=')}${queryObject(selectedFilter.movie.with_keywords, '&with_keywords=')}${selectedFilter.movie.with_origin_country?`&with_origin_country=${selectedFilter.movie.with_origin_country.toUpperCase()}`:''}${queryObject(selectedFilter.movie.with_people, '&with_people=')}${selectedFilter.movie.with_runtime1?`&with_runtime.gte=${selectedFilter.movie.with_runtime2}`:''}${selectedFilter.movie.with_runtime2?`&with_runtime.lte=${selectedFilter.movie.with_runtime2}`:''}`;
            case 'now_playing':
                return `https://api.themoviedb.org/3/movie/now_playing?language=vi-VN&page=${page}&region=VN`;
            case 'popular':
                return `https://api.themoviedb.org/3/movie/popular?language=vi-VN&page=${page}&region=VN`;
            case 'top_rated':
                return `https://api.themoviedb.org/3/movie/top_rated?language=vi-VN&page=${page}&region=VN`;
            case 'upcoming':
                return `https://api.themoviedb.org/3/movie/upcoming?language=vi-VN&page=${page}&region=VN`;
            default:
                return `https://api.themoviedb.org/3/movie/popular?language=vi-VN&page=${page}&region=VN`;
        }
    }

    const queryTV = (): RequestInfo => {
        switch (selectedFilter[type].type){
            case 'all':
                return `https://api.themoviedb.org/3/discover/tv?${selectedFilter.tv.certification?`certification=${selectedFilter.tv.certification}&`:''}certification_country=US&include_adult=false&include_null_first_air_dates=false&language=vi-VN&page=${page}&region=US${selectedFilter.tv.release_date1?`&first_air_date.gte=${selectedFilter.tv.release_date1}`:''}${selectedFilter.tv.release_date2?`&first_air_date.lte=${selectedFilter.tv.release_date2}`:''}&sort_by=${selectedFilter.tv.sorting}${selectedFilter.tv.vote_average?`&vote_average.gte=${selectedFilter.tv.vote_average}`:''}${selectedFilter.tv.vote_count?`&vote_count.gte=${selectedFilter.tv.vote_count}`:''}${queryObject(selectedFilter.tv.with_companies, '&with_companies=')}${queryObject(selectedFilter.tv.with_genres, '&with_genres=')}${queryObject(selectedFilter.tv.with_keywords, '&with_keywords=')}${selectedFilter.tv.with_origin_country?`&with_origin_country=${selectedFilter.tv.with_origin_country.toUpperCase()}`:''}${selectedFilter.tv.with_runtime1?`&with_runtime.gte=${selectedFilter.tv.with_runtime2}`:''}${selectedFilter.tv.with_runtime2?`&with_runtime.lte=${selectedFilter.tv.with_runtime2}`:''}${selectedFilter.tv.with_status.length?`&with_status=${queryArray(selectedFilter.tv.with_status)}`:''}`;
            case 'airing_today':
                return `https://api.themoviedb.org/3/tv/airing_today?language=vi-VN&page=${page}`;
            case 'on_the_air':
                return `https://api.themoviedb.org/3/tv/on_the_air?language=vi-VN&page=${page}`;
            case 'popular':
                return `https://api.themoviedb.org/3/tv/popular?language=vi-VN&page=${page}`;
            case 'top_rated':
                return `https://api.themoviedb.org/3/tv/top_rated?language=vi-VN&page=${page}`;
            default:
                return `https://api.themoviedb.org/3/tv/popular?language=vi-VN&page=${page}`;
        }
    }


    return (
        <ListItem>
            {data.filter((item: nowPlayingMovie)=>type==='movie'?(item.title.toLowerCase().includes(searchText.toLowerCase())||item.original_title.toLowerCase().includes(searchText.toLowerCase())):((item.name.toLowerCase().includes(searchText.toLowerCase()))||(item.original_name.toLowerCase().includes(searchText.toLowerCase())))).map((ele: nowPlayingMovie)=>(
                <MediaItem key={ele.id} type={type} ele={ele}/>
            ))}
            {isLoading&&(<div className='__loading-container'><ReactLoading type={'spinningBubbles'} color={'white'} height={50} width={50}/></div>)}
            {page<Math.min(totalPage, 500)&&(
                <div className='__loadMore'>
                    <button onClick={()=>setPage(prev=>prev+1)}>Hiện Thêm</button>
                </div>
            )}
        </ListItem>
    );
};

export default FilterDisplay;