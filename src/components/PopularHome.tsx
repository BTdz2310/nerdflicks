import React, {useState} from 'react';
import '../styles/popular.css'
import PopularItem from "@/components/PopularItem";
import {nowPlayingMovie} from "@/components/type/typeSome";

interface objProp {
    movie: Array<nowPlayingMovie>,
    tv: Array<nowPlayingMovie>
}

const PopularHome = ({data}: {data: objProp}) => {

    const [index, setIndex] = useState(0);
    const [type, setType] = useState<'movie'|'tv'>('movie');

    return (
        <div className='__popular'>
            <div className="__popular--head">
                {/*<p>Thịnh Hành</p>*/}
                <div className="__popular--switch">
                    <div style={{width: '50%', height: '100%', background: 'white', position: 'absolute', top: '0', left: '0', transform: `translateX(${type === 'movie' ? 0 : 100}%)`, transition: '0.5s'}}></div>
                    <div style={{color: type === 'movie' ? 'black' : 'white', zIndex: '10', transition: '1s'}}
                         onClick={()=>setType('movie')}
                    >Điện Ảnh</div>
                    <div style={{color: type === 'tv' ? 'black' : 'white', zIndex: '10', transition: '1s'}}
                         onClick={()=>setType('tv')}
                    >Truyền Hình</div>
                </div>
            </div>
            <div className='__popular--container'>
                <div className='__popular--line'></div>
                <div className='__popular--list'>
                    <PopularItem type={type} data={data[type][0]}/>
                    <PopularItem type={type} data={data[type][1]}/>
                    <PopularItem type={type} data={data[type][2]}/>
                    <PopularItem type={type} data={data[type][3]}/>
                    <PopularItem type={type} data={data[type][4]}/>
                </div>
            </div>
        </div>
    );
};

export default PopularHome;