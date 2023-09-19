
import React from 'react'
import { rtnListMovie } from './type/typeSome'
import { Card } from 'react-bootstrap'

const MovieCard = ({obj}: {obj: rtnListMovie}) => {
  return (
    <Card className='movieInList'>
        <img src={`https://image.tmdb.org/t/p/w220_and_h330_face/${obj.poster_path}`} alt={obj.title} />
    </Card>
  )
}

export default MovieCard