'use client'
import React from 'react'
import '../styles/genre-icon.css'
import Link from 'next/link'

const genreColor = {
    28: '#FF0000',
    12: '#FFFF00',
    16: '#00FF00',
    35: '#0000FF',
    80: '#FF00FF',
    99: '#808000',
    18: '#8B0000',
    10751: '#00FFFF',
    14: '#D8BFD8',
    36: '#8B4513',
    27: '#000000',
    10402: '#FF00AF',
    9648: '#9E3A9E',
    10749: '#FFB6C1',
    878: '#0000FF',
    10770: '#ADD8E6',
    53: '#FF6347',
    10752: '#808080',
    37: '#654321'
}

const genreName = {
    28: '"Action"',
    12: '"Adventure"',
    16: '"Animation"',
    35: '"Comedy"',
    80: '"Crime"',
    99: '"Documentary"',
    18: '"Drama"',
    10751: '"Family"',
    14: '"Fantasy"',
    36: '"History"',
    27: '"Horror"',
    10402: '"Music"',
    9648: '"Mystery"',
    10749: '"Romance"',
    878: '"Science Fiction"',
    10770: '"TV Movie"',
    53: '"Thriller"',
    10752: '"War"',
    37: '"Western"',
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

const GenreIcon = ({arr}: {arr:Array<28|12|16|35|80|99|18|10751|14|36|27|10402|9648|10749|878|10770|53|10752|37>}) => {
  return (
    <>
        {arr.map((id: 28|12|16|35|80|99|18|10751|14|36|27|10402|9648|10749|878|10770|53|10752|37, index: number)=>(
            <Link href={`/genre/${id}`} className="genreElement" key={index} style={{backgroundColor: genreColor[id], color: getColor(genreColor[id])}}>{genreName[id].replaceAll('"', '')}</Link>    
        ))}
    </>
  )
}

export default GenreIcon