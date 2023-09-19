import React from 'react'
import { Card } from 'react-bootstrap';
import {PiTelevisionSimpleBold, PiChartLineUpDuotone} from 'react-icons/pi'
import {BiMovie} from 'react-icons/bi'
import {BsPerson} from 'react-icons/bs'
import {AiFillStar} from 'react-icons/ai'
import { StoreSearch, addFavorite, addRecent, removeFavorite, selectFavoriteSearch, selectRecentlySearch } from '@/store/features/searchSlice/searchSlice';
import { useDispatch, useSelector } from 'react-redux';

const CardSearch = ({obj}: {obj: StoreSearch}) => {


    const dispatch = useDispatch();
    const selectedFavoriteSearch = useSelector(selectFavoriteSearch);
    const selectedRecentlySearch = useSelector(selectRecentlySearch)

    const checkFavorite = (obj: StoreSearch) => {
        let k = 0;
        for(let i=0; i<selectedFavoriteSearch.length; i++){
            // console.log(selectedFavoriteSearch[i])
            if(selectedFavoriteSearch[i].id===obj.id&&selectedFavoriteSearch[i].media_type===obj.media_type&&selectedFavoriteSearch[i].name===obj.name&&selectedFavoriteSearch[i].popularity===obj.popularity){
                k = 1;
                break;
            }
        }
        if(k===1) return true;
        return false;
    }

    const handleRecent = () => {
        dispatch(addRecent({id: obj.id, media_type: obj.media_type, name: obj.name, popularity: obj.popularity}))
    }

    const handleFavorite = () => {
        dispatch(addFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity}))
    }

    const handleRemoveFavorite = () => {
        dispatch(removeFavorite({id: obj.id, media_type: obj.media_type, name: obj.name?obj.name:'', popularity: obj.popularity}))
    }

  return (
    <Card className='cardSearch'>
        <div className="typeObjSearch" onClick={()=>handleRecent()}>
            {obj.media_type==='tv'?(<PiTelevisionSimpleBold fontSize={24}/>):obj.media_type==='movie'?(<BiMovie fontSize={24}/>):(<BsPerson fontSize={24}/>)}
        </div>
        <div className="nameObjSearch"  onClick={()=>handleRecent()}>
            <p>{obj.name} (<PiChartLineUpDuotone /> {obj.popularity})</p>
        </div>
        <div className="taskObjSearch"  onClick={()=>{
            const check = checkFavorite(obj);
            if(check){
                handleRemoveFavorite()
            }else{
                handleFavorite()
            }                     
        }}>
        <AiFillStar fontSize={24} className={checkFavorite(obj)?'favoriteStar':undefined}/>
        </div>
    </Card>
  )
}

export default CardSearch