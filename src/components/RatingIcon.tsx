import React from 'react'
import '../styles/rating-icon.css'

const checkIcon = (score: number, size: number) => {
    if(score>0&&score<4){
        return (
            <div className='rating-icon'>
                <img width={size} height={size} src="https://img.icons8.com/fluency/48/angry.png" alt="angry"/>
                <span className='score' style={{fontSize: `${size}px`}}>{score}</span>
            </div>
        )
    }else if(score>=4&&score<6.5){
        return (
            <div className='rating-icon'>
                <img width={size} height={size} src="https://img.icons8.com/fluency/48/sad.png" alt="sad"/>
                <span className='score' style={{fontSize: `${size}px`}}>{score}</span>
            </div>
        )
    }else if(score>=6.5&&score<8){
        return (
            <div className='rating-icon'>
                <img width={size} height={size} src="https://img.icons8.com/fluency/48/blushing.png" alt="blushing"/>
                <span className='score' style={{fontSize: `${size}px`}}>{score}</span>
            </div>
        )
    }else if(score>=8&&score<=10){
        return (
            <div className='rating-icon'>
                <img width={size} height={size} src="https://img.icons8.com/fluency/48/in-love.png" alt="in-love"/>
                <span className='score' style={{fontSize: `${size}px`}}>{score}</span>
            </div>
        )
    }else{
        return (
            <div className='rating-icon'>
                <img width={size} height={size} src="https://img.icons8.com/fluency/48/angry-face-meme.png" alt="angry-face-meme"/>
                <span className='score' style={{fontSize: `${size}px`}}>--</span>
            </div>
        )
    }
}

const RatingIcon = ({score, size}: {score: number, size: number}) => {
  return (
    <>
        {checkIcon(score, size)}
    </>
  )
}

export default RatingIcon