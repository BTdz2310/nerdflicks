
import React from 'react'
import { rtnList } from './type/typeSome'
import RatingIcon from './RatingIcon'
import Link from 'next/link'
import GenreIcon from './GenreIcon'

const MovieCard = ({obj}: {obj: rtnList}) => {
    // console.log('>>>>>OBJ',obj.media_type)
  return (
    <div        
        className='movieInList'>
        <div className="inList">
            <div className="imgList">
                <img src={`https://image.tmdb.org/t/p/w220_and_h330_face/${obj.poster_path}`} alt={obj.name} width='180px' height='270px' loading='lazy'/>
                <div className="iconList">
                    <RatingIcon score={Number(obj.vote_average.toFixed(1))} size={30}/>
                </div>
                <div className="genreList">

                    <div>
                        <GenreIcon arr={obj.genre_ids} media_type={obj.media_type} link={false}/>
                    </div>
                    {/* {console.log(obj.genre_ids)} */}
                </div>
            </div>
            <Link href={`/${obj.media_type}/${obj.id}`} className="nameList">
                <p>{obj.name}</p>
            </Link>
        </div>
    </div>
  )
}

export default MovieCard