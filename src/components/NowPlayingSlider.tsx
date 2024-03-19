'use client'
import React, { useEffect, useState } from 'react'
import '../styles/nowplaying-slider.css'
import { getAverageColor } from '@/utils/utils'
import { iColor } from './NowPlaying'

const NowPlayingSlider = ({arr, index, setIndex, setColor}: {arr:Array<string>, index: number, setIndex: Function, setColor: Function}) => {
    const maxPages = Math.ceil(arr.length/3);
    const [mauSac, setMauSac] = useState<Record<number,iColor>>({});
    const [currentPage, setCurrentPage] = useState(0);

    // console.log(arr)

    const increasePage = () => {
        setCurrentPage(prev=>prev+1)
    }

    const decreasePage = () => {
        setCurrentPage(prev=>prev-1)
    }

    useEffect(()=>{
        if(Object.keys(mauSac).length!==0){
            setColor(mauSac[index])
        }
        // console.log(index)
        // console.log(mauSac)
    }, [index])

    const handleClick = (ind:number) => {
        setIndex(ind)
    }

    const handleSacMau = (e:any,  ind: number) => {
        if(ind===0){
            setColor(getAverageColor(e.target, 4))
        }
        // console.log('>>>>MAU: ',getAverageColor(e.target, 4))
        setMauSac(prev=>{
            return {...prev,
            [ind]: getAverageColor(e.target, 4)}
        })
    }

  return (
    <>
        <div className="sliderContainer">
            <div className={currentPage===0?'circleChange circleHidden':'circleChange'} id='changeLeft' onClick={()=>decreasePage()}>
                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>
            </div>
            <div className="sliderFlexContainer">
                <div className="sliderFlex" style={{transform: `translateX(${-390*currentPage}px)`}}>
                    {arr.map((ele:string, ind:number)=>(
                        <img src={`https://image.tmdb.org/t/p/w220_and_h330_face${ele}`} alt={ele} key={ind} width={120} height={180} className='slideElement' id={ind===index?'focusIndex':undefined} onClick={()=>handleClick(ind)} crossOrigin='' loading={ind<3?'eager':'lazy'} onLoad={(e)=>handleSacMau(e, ind)}/>
                    ))}
                </div>
            </div>
            {/* <img width="50" height="50" src="https://img.icons8.com/ios-filled/50/circled-chevron-right.png" alt="circled-chevron-right" className='circleRight'/> */}
            <div className={currentPage===maxPages-1?'circleChange circleHidden':'circleChange'} id='changeRight' onClick={()=>increasePage()}>
                <svg focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>
            </div>
        </div>
    </>
  )
}

export default NowPlayingSlider