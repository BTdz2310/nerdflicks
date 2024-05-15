'use client'
import React from 'react';
import {nowPlayingMovie} from "@/components/type/typeSome";
import Link from "next/link";
import {genreById} from "@/components/GenreIcon";
import styled from "styled-components";
import {useSearchParams} from "next/navigation";
import useSWR from "swr";
import {fetcher} from "@/utils/utils";
import Spinner from "react-bootstrap/Spinner";

const RightSearch = styled.div`
  flex-basis: 75%;
  height: 100%;
  padding-right: 40px;
  //flex-shrink: 0;
  
  h2{
    text-transform: uppercase;
  }
`

const ItemList = styled.div`
  //display: grid;
  //grid-template-columns: 1fr 1fr 1fr 1fr;
  //grid-gap: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Item = styled.div`
  //width: 200px;
  //height: 340px;
  cursor: pointer;
  width: 100%;
  min-height: 200px;
  border-radius: 12px;
  position: relative;
  padding: 16px 20px;
  gap: 20px;
  overflow: hidden;
  background-color: #171717;
  display: flex;
  align-items: center;
  
  img{
    //max-width: 112px;
    //padding: 16px 30px;
    object-fit: cover;
    height: 168px;
    width: 112px;
    z-index: 10;
    position: relative;
    //border-radius: 12px;
  }
`

const ItemCenter = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 2;
  
  h2{
    text-transform: uppercase;
    padding: 16px 0 10px;
  }

  .type-item{
    width: fit-content;
    padding: 4px 8px;
    //border-radius: 12px;
    //border: 5px solid;
    //border-image-source: linear-gradient(to left, #eeaeca, #94bbe9);
    border-width: 2px;
    border-style: solid;
    //border-image: linear-gradient(to right, darkblue, darkorchid) 1;
    border-image: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%) 1;
  }
  
  .type-item p{
    width: fit-content;
    text-transform: uppercase;
    background: -webkit-linear-gradient(#eeaeca, #94bbe9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`

const ItemRight = styled.div`
  height: 100%;
  width: 100px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  
  p{
    font-size: 32px;
  }
`

interface type{
    tv: string,
    person: string,
    movie: string
}

const divColor: type = {
    'tv': 'linear-gradient(to right, darkblue, darkorchid) 1',
    'person': 'linear-gradient(to right, #C9FFBF, #fc466b) 1',
    'movie': 'linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%) 1'
}

const SearchDisplay = () => {

    const searchParams = useSearchParams()

    const search = searchParams.get('search');
    const type = searchParams.get('type') ? searchParams.get('type') : 'multi';

    const { data: dataA} = useSWR(
        `https://api.themoviedb.org/3/search/${type}?query=${search}&include_adult=false&language=vi-VN&page=1`,
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    if (!dataA) return <Spinner animation="grow" />;

    return (
        <RightSearch>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px'}}>
                <h2>{`Kết quả tìm kiếm cho "${search}"`}</h2>
                <p style={{color: 'gray'}}>{`${dataA.total_results} kết quả`}</p>
            </div>
            <ItemList>
                {dataA.results.map((it: nowPlayingMovie)=>(
                    <Link key={it.id} prefetch href={`/${type!=='multi'?type:it.media_type}/${it.id}`} passHref>
                        <Item>
                            {it.poster_path?<img src={`https://media.themoviedb.org/t/p/w188_and_h282_bestv2${it.poster_path}`} alt='img1'/>:(it.profile_path?(<img src={`https://media.themoviedb.org/t/p/w180_and_h180_face${it.profile_path}`} alt='img'/>):(<img src='https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2086941550.jpg' alt='img'/>))}
                            <ItemCenter>
                                <h2>{`${it.title?it.title:it.name} ${it.media_type==='tv'?(it.first_air_date?`(${it.first_air_date.split('-')[0]})`:''):(it.media_type==='movie'?(it.release_date?`(${it.release_date.split('-')[0]})`:''):'')}`}</h2>
                                <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px'}}>
                                    {type==='multi'&&(<div className="type-item" style={{borderImage: divColor[it.media_type]}}>
                                        <p>{it.media_type}</p>
                                    </div>)}
                                    <p className='info-text'>
                                        {(type==='multi'&&it.media_type==='person'||type==='person')?(<span>{it.known_for_department}</span>):(
                                            <>
                                                {it.genre_ids&&it.genre_ids.map((genre: 28 | 12 | 16 | 35 | 80 | 99 | 18 | 10751 | 14 | 36 | 27 | 10402 | 9648 | 10749 | 878 | 10770 | 53 | 10752 | 37 | 10759 | 10762 | 10763 | 10764 | 10765 | 10766 | 10767 | 10768)=>(<span key={genre}>{genreById[genre]}</span>))}
                                            </>
                                        )}
                                    </p>
                                </div>
                                <p>
                                    {(type==='multi'&&it.media_type==='person'||type==='person')?`Các phim tham gia: ${it.known_for.map(mv=>` ${mv.title?mv.title:mv.name}`)}`:it.overview.slice(0, 200)}
                                </p>
                            </ItemCenter>
                            <ItemRight>
                                {(it.media_type==='tv'||it.media_type==='movie'||type==='tv'||type==='movie')&&<p style={{flexGrow: '2'}}>{it.vote_average?it.vote_average:'-'}</p>}
                            </ItemRight>
                        </Item>
                    </Link>

                ))}
            </ItemList>
        </RightSearch>
    );
};

export default SearchDisplay;