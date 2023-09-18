import React from 'react'
import {BsFillEmojiAngryFill, BsFillEmojiExpressionlessFill, BsFillEmojiSmileFill, BsEmojiHeartEyesFill, BsFillEmojiSmileUpsideDownFill} from 'react-icons/bs'
import '../styles/rating-icon.css'

const checkIcon = (score: number, size: number) => {
    if(score>0&&score<4){
        return (
            <div className='rating-icon'>
                <BsFillEmojiAngryFill color='#ff4545' fontSize={size}/>
                <span className='score' style={{fontSize: `${size}px`}}>{score}</span>
            </div>
        )
    }else if(score>=4&&score<6.5){
        return (
            <div className='rating-icon'>
                <BsFillEmojiExpressionlessFill color='#ffa534' fontSize={size}/>
                <span className='score' style={{fontSize: `${size}px`}}>{score}</span>
            </div>
        )
    }else if(score>=6.5&&score<8){
        return (
            <div className='rating-icon'>
                <BsFillEmojiSmileFill color='#ffe234' fontSize={size}/>
                <span className='score' style={{fontSize: `${size}px`}}>{score}</span>
            </div>
        )
    }else if(score>=8&&score<=10){
        return (
            <div className='rating-icon'>
                <BsEmojiHeartEyesFill color='#57e32c' fontSize={size}/>
                <span className='score' style={{fontSize: `${size}px`}}>{score}</span>
            </div>
        )
    }else{
        return (
            <div className='rating-icon'>
                <BsFillEmojiSmileUpsideDownFill fontSize={size} />
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