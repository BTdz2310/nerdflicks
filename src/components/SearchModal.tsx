'use client'
import React, { useEffect, lazy } from 'react'
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import '../styles/modal.css'
import debounce from 'lodash/debounce'
import { StoreSearch, selectFavoriteSearch, selectRecentlySearch } from '@/store/features/searchSlice/searchSlice';
import { useSelector } from 'react-redux';

const CardSearch = lazy(()=>import('./CardSearch'))


export interface MDataRtns {
    adult: boolean,
    id: number,
    media_type: string,
    popularity: number,
    backdrop_path?: any,
    title?: string,
    name?: string,
    original_name?: string,
    original_language?: string,
    original_title?: string,
    overview?: string,
    poster_path?: any,
    genre_ids?: Array<28|12|16|35|80|99|18|10751|14|36|27|10402|9648|10749|878|10770|53|10752|37>|Array<10759|16|35|80|99|18|10751|10762|9648|10763|10764|10765|10766|10767|10768|37>,
    release_date?: string,
    video?: boolean,
    vote_average?: number,
    vote_count?: number,
    known_for?: Array<object>,
    gender?: number,
    known_for_department?: string,
    profile_path?: any,
    first_air_date?: string,
    origin_country?: Array<string>
}

// {showModal} : {showModal: boolean}
const SearchModal = ({setShowModal}: {setShowModal: Function}) => {
    const [text, setText] = useState<string>('');

    console.log(typeof setText)

    const [searchResult, setSearchResult] = useState<Array<MDataRtns>>([])

    const [show, setShow] = useState(true);
    // console.log('>>>show',show)

    const selectedFavoriteSearch = useSelector(selectFavoriteSearch);
    const selectedRecentlySearch = useSelector(selectRecentlySearch)

    useEffect(()=>{
        if(!show){
            setShowModal(false)
        }
    }, [show])


    const handleChange = debounce((e:string) => {
        const options = {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OWJiODExODczYTgwNjMwMGY1ZTE5NThhYjUzMzhhMiIsInN1YiI6IjYzZTRiNDJlMGU1OTdiMDBjZDdiYTQzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jj9_04xOHbR519EDCfhgf9jFAz6AtMGNECxGgeg-i2M'
            }
          };
          
          fetch(`https://api.themoviedb.org/3/search/multi?query=${e}&include_adult=false&language=vi-VN&page=1`, options)
            .then(response => response.json())
            .then(response => {
                setSearchResult(response.results)
                console.log(response)
            })
            .catch(err => console.error(err));
    }, 500)

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
        <Modal show={show} onHide={handleClose}>
          <Modal.Body>
            <div className="searchModal">
                <input type='text' id='searchText' placeholder='Tìm Kiếm Tên Phim, Diễn Viên...' onChange={(e)=>{
                    // setText(e.target.value)
                    handleChange(e.target.value)
                }} />
            </div>
            <div className="listSearch">
                {searchResult.length!==0?(
                    <>
                        <p className='typeSearch'>Tìm Kiếm</p>
                        <div className='containerSearch'>
                            <div className="searchingSearch">
                            {searchResult.map((obj: MDataRtns, index: number)=>{
                                const object: StoreSearch = {
                                    id: obj.id,
                                    media_type: obj.media_type,
                                    name: obj.name?obj.name:obj.title?obj.title:'',
                                    popularity: obj.popularity
                                };
                                return (
                                    <CardSearch key={index} obj={object}/>
                                )
                            })}
                            </div>
                        </div>
                    </>
                ):(
                    <div style={{maxHeight: '480px', overflow: 'scroll'}}>
                        <p className="typeSearch">Yêu Thích</p>
                        <div id="favoriteSearch">
                            <div className="searchingSearch">
                            {selectedFavoriteSearch.map((obj: StoreSearch, index: number)=>(
                                <CardSearch key={index} obj={obj}/>
                            ))}
                            </div>
                        </div>
                        <p className="typeSearch" id='recentSearch'>Gần Đây</p>
                        <div id="favoriteSearch">
                            <div className="searchingSearch">
                            {selectedRecentlySearch.map((obj: StoreSearch, index: number)=>(
                                <CardSearch key={index} obj={obj}/>
                            ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
}

export default SearchModal
