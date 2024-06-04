import React from 'react';
import "@/styles/forum.css";
import {nowPlayingMovie} from "@/components/type/typeSome";
import {genreById} from "@/components/GenreIcon";
import {shortenString} from "@/utils/utils";
import AddTo from "@/components/AddTo";
import {Link} from "next-view-transitions";

const PostList = ({data}: {data: Array<nowPlayingMovie>|undefined}) => {
    return (
        <div className='post-list__list'>
            {!data||data.length===0?(
                <p>Không Có Phim Nào Được Đính Kèm</p>
            ):(
                <>
                    {data.map((item: nowPlayingMovie)=>(
                        <div key={item.id} className='post-list__item'>
                            <img src={item.poster_path?`https://media.themoviedb.org/t/p/w188_and_h282_bestv2${item.poster_path}`:'https://www.shutterstock.com/image-vector/default-image-icon-vector-missing-260nw-2086941550.jpg'} alt=""/>
                            <div className='post-list__info'>
                                <div className="post-list__info-first">
                                    <div className='post-list__info-text'>
                                        <h2><Link href={`/${item.media_type}/${item.id}`}>{item.title?shortenString(item.title, 40):shortenString(item.name, 40)}</Link></h2>
                                        <p>{item.release_date?(item.release_date?item.release_date.split('-')[0]:''):(item.first_air_date?item.first_air_date.split('-')[0]:'')} - {item.genre_ids&&item.genre_ids.map((genre: 28 | 12 | 16 | 35 | 80 | 99 | 18 | 10751 | 14 | 36 | 27 | 10402 | 9648 | 10749 | 878 | 10770 | 53 | 10752 | 37 | 10759 | 10762 | 10763 | 10764 | 10765 | 10766 | 10767 | 10768)=>genreById[genre]).join(', ')}</p>
                                    </div>
                                    <AddTo id={item.id} media={item.media_type==='person'?'movie':item.media_type} data={item} />
                                </div>
                                <div className="post-list__info-second">
                                    <p>{shortenString(item.overview, 200)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </>
            )}
        </div>
    );
};

export default PostList;