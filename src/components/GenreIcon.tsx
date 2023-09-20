'use client'
import React from 'react'
import '../styles/genre-icon.css'
import Link from 'next/link'

const genreColor = {
  28: '#FFEBCD',
  12: '#0000FF',
  16: '#FFFF00',
  35: '#00FF00',
  80: '#808080',
  99: '#FFFFFF',
  18: '#FF8000',
  10751: '#E6E6FA',
  14: '#00FFFF',
  36: '#666666',
  27: '#FF0000',
  10402: '#0000CD',
  9648: '#000000',
  10749: '#FF00FF',
  878: '#00FFFF',
  10770: '#FFFFFF',
  53: '#8B0000',
  10752: '#808080',
  37: '#FF0000',
  10759: '#FF0000',
  10762: '#00FFFF',
  10763: '#FFFFFF',
  10764: '#FFC0CB',
  10765: '#00FFFF',
  10766: '#FF00FF',
  10767: '#000000',
  10768: '#808080',
}

const genreName = {
    28: 'Action',
    12: 'Adventure',
    16: 'Animation',
    35: 'Comedy',
    80: 'Crime',
    99: 'Documentary',
    18: 'Drama',
    10751: 'Family',
    14: 'Fantasy',
    36: 'History',
    27: 'Horror',
    10402: 'Music',
    9648: 'Mystery',
    10749: 'Romance',
    878: 'Science Fiction',
    10770: 'TV Movie',
    53: 'Thriller',
    10752: 'War',
    37: 'Western',
    10759: 'Action & Adventure',
    10762: 'Kids',
    10763: 'News',
    10764: 'Reality',
    10765: 'Sci-Fi & Fantasy',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'War & Politics',
}

const genreId = {
  10759: 'Action & Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  10762: 'Kids',
  9648: 'Mystery',
  10763: 'News',
  10764: 'Reality',
  10765: 'Sci-Fi & Fantasy',
  10766: 'Soap',
  10767: 'Talk',
  10768: 'War & Politics',
  37: 'Western',
}

function getColor(rgb:string) {
    const hex = rgb.slice(1);
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
  
    const brightness = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (brightness > 0.5) {
      return '#000';
    }
    return '#fff';
  }

const GenreIcon = ({arr, media_type, link}: {arr:Array<28|12|16|35|80|99|18|10751|14|36|27|10402|9648|10749|878|10770|53|10752|37>|Array<10759|16|35|80|99|18|10751|10762|9648|10763|10764|10765|10766|10767|10768|37>, media_type: string, link:boolean}) => {
  // console.log('>>>>MEDIA', media_type)
  return (
    <>
        {arr.map((id: 28|12|16|35|80|99|18|10751|14|36|27|10402|9648|10749|878|10770|53|10752|37|10759|16|35|80|99|18|10751|10762|9648|10763|10764|10765|10766|10767|10768|37, index: number)=>(
            link?(<Link href={`/genre/${media_type}/${id}`} className="genreElement" key={index} style={{backgroundColor: genreColor[id], color: getColor(genreColor[id])}}>{genreName[id]}</Link>):(<span className="genreElement" key={index} style={{backgroundColor: genreColor[id], color: getColor(genreColor[id])}}>{genreName[id]}</span>)
        ))}
    </>
  )
}

export default GenreIcon