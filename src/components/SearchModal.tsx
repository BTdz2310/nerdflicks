'use client'
import React, { useEffect } from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState } from 'react';
import '../styles/modal.css'
import { Card } from 'react-bootstrap';
import debounce from 'lodash/debounce'
import {PiTelevisionSimpleBold, PiChartLineUpDuotone} from 'react-icons/pi'
import {BiMovie} from 'react-icons/bi'
import {BsPerson} from 'react-icons/bs'
import {AiOutlineStar, AiFillStar} from 'react-icons/ai'
import { SearchState, StoreSearch, addFavorite, addRecent, removeFavorite, selectFavoriteSearch, selectRecentlySearch } from '@/store/features/searchSlice/searchSlice';
import { useDispatch, useSelector } from 'react-redux';


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
    genre_ids?: Array<number>,
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
const SearchModal = ({setShowModal}) => {
    const [text, setText] = useState<string>('');

    const [searchResult, setSearchResult] = useState<Array<MDataRtns>>([])

    const [show, setShow] = useState(true);
    // console.log('>>>show',show)

    const dispatch = useDispatch();
    const selectedFavoriteSearch = useSelector(selectFavoriteSearch);
    const selectedRecentlySearch = useSelector(selectRecentlySearch)

    useEffect(()=>{
        if(!show){
            setShowModal(false)
        }
    }, [show])

    const checkFavorite = (obj: StoreSearch) => {
        // console.log('>>>>SELECTED',selectedFavoriteSearch)
        // console.log(selectedFavoriteSearch.includes(obj))
        // console.log(obj)
        
        // console.log('leng',selectedFavoriteSearch.length)
        let k = 0;
        for(let i=0; i<selectedFavoriteSearch.length; i++){
            // console.log(selectedFavoriteSearch[i])

            // console.log(obj2)
            if(selectedFavoriteSearch[i].id===obj.id&&selectedFavoriteSearch[i].media_type===obj.media_type&&selectedFavoriteSearch[i].name===obj.name&&selectedFavoriteSearch[i].popularity===obj.popularity){
                k = 1;
                break;
            }
        }
        if(k===1) return true;
        return false;
    }

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

    const handleFavorite = (element: StoreSearch) => {
        dispatch(addFavorite(element))
    }

    const handleRemoveFavorite = (element: StoreSearch) => {
        dispatch(removeFavorite(element))
    }

    const handleRecent = (element: StoreSearch) => {
        dispatch(addRecent(element))
    }

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
  
    return (
      <>
                {/* {console.log(searchResult.length)} */}

        {/* {console.log('<<<SELECT', selectedFavoriteSearch)} */}
        <Modal show={show} onHide={handleClose}>
          {/* <Modal.Header >
          </Modal.Header> */}
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
                            {searchResult.map((obj: MDataRtns, index: number)=>(
                                <Card className='cardSearch' key={index}>
                                    {obj.media_type==='tv'?(
                                        <>
                                            <div className="typeObjSearch"  onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:obj.title?obj.title:'', popularity: obj.popularity})}>
                                                <PiTelevisionSimpleBold fontSize={24}/>
                                            </div>
                                            <div className="nameObjSearch"  onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:obj.title?obj.title:'', popularity: obj.popularity})}>
                                                <p>{obj.name} (<PiChartLineUpDuotone /> {obj.popularity})</p>
                                            </div>
                                            <div className="taskObjSearch"  onClick={()=>{
                                                    const check = checkFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity});
                                                    if(check){
                                                        handleRemoveFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }else{
                                                        handleFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }                     
                                                }}>
                                                {/* <AiOutlineStar fontSize={24} className='favoriteStar'/> */}
                                                <AiFillStar fontSize={24} className={checkFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})?'favoriteStar':undefined}/>
                                            </div>
                                        </>
                                    ):obj.media_type==='movie'?(
                                        <>
                                            <div className="typeObjSearch"  onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:obj.title?obj.title:'', popularity: obj.popularity})}>
                                                <BiMovie fontSize={24}/>
                                            </div>
                                            <div className="nameObjSearch"  onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:obj.title?obj.title:'', popularity: obj.popularity})}>
                                                <p>{obj.title} (<PiChartLineUpDuotone /> {obj.popularity})</p>
                                            </div>
                                            <div className="taskObjSearch"  onClick={()=>{
                                                    const check = checkFavorite({id: obj.id, media_type: obj.media_type, name: obj.title?obj.title:'', popularity: obj.popularity});
                                                    if(check){
                                                        handleRemoveFavorite({id: obj.id, media_type: obj.media_type, name: obj.title?obj.title:'', popularity: obj.popularity})
                                                    }else{
                                                        handleFavorite({id: obj.id, media_type: obj.media_type, name: obj.title?obj.title:'', popularity: obj.popularity})
                                                    }                     
                                                }}>
                                                {/* <AiOutlineStar fontSize={24} className='favoriteStar'/> */}
                                                <AiFillStar fontSize={24}  className={checkFavorite({id: obj.id, media_type: obj.media_type, name: obj.title?obj.title:'', popularity: obj.popularity})?'favoriteStar':undefined} />
                                            </div>

                                        </>
                                    ):(
                                        <>
                                            <div className="typeObjSearch"  onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:obj.title?obj.title:'', popularity: obj.popularity})}>
                                                <BsPerson fontSize={24}/>
                                            </div>
                                            <div className="nameObjSearch"  onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:obj.title?obj.title:'', popularity: obj.popularity})}>
                                                <p>{obj.name} (<PiChartLineUpDuotone /> {obj.popularity})</p>
                                            </div>
                                            <div className="taskObjSearch"  onClick={()=>{
                                                    const check = checkFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity});
                                                    if(check){
                                                        handleRemoveFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }else{
                                                        handleFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }                     
                                                }}>
                                                {/* <AiOutlineStar fontSize={24} className='favoriteStar'/> */}
                                                <AiFillStar fontSize={24}  className={checkFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})?'favoriteStar':undefined}/>
                                            </div>
                                            
                                        </>
                                    )}
                                </Card>
                            ))}
                            </div>
                        </div>
                    </>
                ):(
                    <div style={{maxHeight: '480px', overflow: 'scroll'}}>
                        <p className="typeSearch">Yêu Thích</p>
                        <div id="favoriteSearch">
                            <div className="searchingSearch">
                            {selectedFavoriteSearch.map((obj: StoreSearch, index: number)=>(
                                <Card className='cardSearch' key={index} >
                                    {obj.media_type==='tv'?(
                                        <>
                                            <div className="typeObjSearch" onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name, popularity: obj.popularity})}>
                                                <PiTelevisionSimpleBold fontSize={24}/>
                                            </div>
                                            <div className="nameObjSearch" onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name, popularity: obj.popularity})}>
                                                <p>{obj.name} (<PiChartLineUpDuotone /> {obj.popularity})</p>
                                            </div>
                                            <div className="taskObjSearch"  onClick={()=>{
                                                    const check = checkFavorite(obj);
                                                    if(check){
                                                        handleRemoveFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }else{
                                                        handleFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }                     
                                                }}>
                                                {/* <AiOutlineStar fontSize={24} className='favoriteStar'/> */}
                                                <AiFillStar fontSize={24} className={checkFavorite(obj)?'favoriteStar':undefined}/>
                                            </div>
                                        </>
                                    ):obj.media_type==='movie'?(
                                        <>
                                            <div className="typeObjSearch" onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name, popularity: obj.popularity})}>
                                                <BiMovie fontSize={24}/>
                                            </div>
                                            <div className="nameObjSearch" onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name, popularity: obj.popularity})}>
                                                <p>{obj.name} (<PiChartLineUpDuotone /> {obj.popularity})</p>
                                            </div>
                                            <div className="taskObjSearch"  onClick={()=>{
                                                    const check = checkFavorite(obj);
                                                    if(check){
                                                        handleRemoveFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }else{
                                                        handleFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }                     
                                                }}>
                                                {/* <AiOutlineStar fontSize={24} className='favoriteStar'/> */}
                                                <AiFillStar fontSize={24}  className={checkFavorite(obj)?'favoriteStar':undefined} />
                                            </div>

                                        </>
                                    ):(
                                        <>
                                            <div className="typeObjSearch" onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name, popularity: obj.popularity})}>
                                                <BsPerson fontSize={24}/>
                                            </div>
                                            <div className="nameObjSearch" onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name, popularity: obj.popularity})}>
                                                <p>{obj.name} (<PiChartLineUpDuotone /> {obj.popularity})</p>
                                            </div>
                                            <div className="taskObjSearch"  onClick={()=>{
                                                    const check = checkFavorite(obj);
                                                    if(check){
                                                        handleRemoveFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }else{
                                                        handleFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }                     
                                                }}>
                                                {/* <AiOutlineStar fontSize={24} className='favoriteStar'/> */}
                                                <AiFillStar fontSize={24}  className={checkFavorite(obj)?'favoriteStar':undefined}/>
                                            </div>
                                            
                                        </>
                                    )}
                                </Card>
                            ))}
                            </div>
                        </div>
                        <p className="typeSearch" style={{marginTop: '20px'}}>Gần Đây</p>
                        <div id="favoriteSearch">
                            <div className="searchingSearch">
                            {selectedRecentlySearch.map((obj: StoreSearch, index: number)=>(
                                <Card className='cardSearch' key={index}>
                                    {obj.media_type==='tv'?(
                                        <>
                                            <div className="typeObjSearch" onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name, popularity: obj.popularity})}>
                                                <PiTelevisionSimpleBold fontSize={24}/>
                                            </div>
                                            <div className="nameObjSearch" onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name, popularity: obj.popularity})}>
                                                <p>{obj.name} (<PiChartLineUpDuotone /> {obj.popularity})</p>
                                            </div>
                                            <div className="taskObjSearch"  onClick={()=>{
                                                    const check = checkFavorite(obj);
                                                    if(check){
                                                        handleRemoveFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }else{
                                                        handleFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }                     
                                                }}>
                                                {/* <AiOutlineStar fontSize={24} className='favoriteStar'/> */}
                                                <AiFillStar fontSize={24} className={checkFavorite(obj)?'favoriteStar':undefined}/>
                                            </div>
                                        </>
                                    ):obj.media_type==='movie'?(
                                        <>
                                            <div className="typeObjSearch" onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name, popularity: obj.popularity})}>
                                                <BiMovie fontSize={24}/>
                                            </div>
                                            <div className="nameObjSearch" onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name, popularity: obj.popularity})}>
                                                <p>{obj.name} (<PiChartLineUpDuotone /> {obj.popularity})</p>
                                            </div>
                                            <div className="taskObjSearch"  onClick={()=>{
                                                    const check = checkFavorite(obj);
                                                    if(check){
                                                        handleRemoveFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }else{
                                                        handleFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }                     
                                                }}>
                                                {/* <AiOutlineStar fontSize={24} className='favoriteStar'/> */}
                                                <AiFillStar fontSize={24}  className={checkFavorite(obj)?'favoriteStar':undefined} />
                                            </div>

                                        </>
                                    ):(
                                        <>
                                            <div className="typeObjSearch" onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name, popularity: obj.popularity})}>
                                                <BsPerson fontSize={24}/>
                                            </div>
                                            <div className="nameObjSearch" onClick={()=>handleRecent({id: obj.id, media_type: obj.media_type, name: obj.name, popularity: obj.popularity})}>
                                                <p>{obj.name} (<PiChartLineUpDuotone /> {obj.popularity})</p>
                                            </div>
                                            <div className="taskObjSearch"  onClick={()=>{
                                                    const check = checkFavorite(obj);
                                                    if(check){
                                                        handleRemoveFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }else{
                                                        handleFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity})
                                                    }                     
                                                }}>
                                                {/* <AiOutlineStar fontSize={24} className='favoriteStar'/> */}
                                                <AiFillStar fontSize={24}  className={checkFavorite(obj)?'favoriteStar':undefined}/>
                                            </div>
                                            
                                        </>
                                    )}
                                </Card>
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

// className={checkFavorite({id: obj.id, media_type: obj.media_type, name: obj.title?obj.title:'', popularity: obj.popularity})?'favoriteStar':undefined}