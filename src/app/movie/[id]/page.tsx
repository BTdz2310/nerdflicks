"use client";
import React, {useLayoutEffect, useRef, useState} from "react";
import useSWR from "swr";
import Spinner from "react-bootstrap/Spinner";
import "@/styles/movie-page.css";
import styled from "styled-components";
import { Link } from 'next-view-transitions'
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {nowPlayingMovie} from "@/components/type/typeSome";
import {list} from "postcss";
import {fetcher, shortenString} from "@/utils/utils";
import {useDispatch} from "react-redux";
import {clearFilter, pickObject} from "@/store/features/filterSlice/filterSlice";
import AddTo from "@/components/AddTo";
import {useRouter} from "next/navigation";

function generateRandomDarkColor() {
    const darkColors = [
        "#000000", "#111111", "#222222", "#333333", "#444444",
        "#555555", "#666666", "#777777", "#888888", "#999999",
        "#AA0000", "#BB0000", "#CC0000", "#DD0000", "#EE0000",
        "#FF0000", "#00AA00", "#00BB00", "#00CC00", "#00DD00",
        "#00EE00", "#00FF00", "#0000AA", "#0000BB", "#0000CC",
        "#0000DD", "#0000EE", "#0000FF"
    ];

    const randomColorIndex = Math.floor(Math.random() * darkColors.length);
    return darkColors[randomColorIndex];
}

const StyledInfo = styled.div`
  height: 100vh;
  width: 100vw;
  //background-color: #131313;
  position: relative;
  //filter: brightness(0.8);
  padding-top: 100px;
`

const InfoBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  background-size: cover;
  background-repeat: no-repeat;
  //opacity: 0.4;
  //filter: brightness(0.5);
`

const InfoContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  height: 100%;
  align-items: center;
  gap: 40px;
  
  a{
    color: #cacaca;
    text-decoration: none;
  }

  p{
    margin: 0;
  }
`

const LeftInfo = styled.div`
  width: 50%;
  font-size: 14px;
  display: flex;
  color: #cacaca;
  flex-direction: column;
  gap: 20px;

  h2 {
    font-size: 40px;
    text-transform: uppercase;
    color: rgb(253, 57, 195);
  }

  .info-line {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .info-box {
    width: 40px;
    height: 20px;
    background-color: rgb(253, 57, 195);
  }

  .info-line p {
    text-transform: uppercase;
    font-weight: bolder;
    font-size: 20px;
    color: white;
  }

`

const RightInfo = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  //justify-content: center;
  align-items: center;
  
  img{
    width: 100%;
    max-width: 400px;
    object-fit: contain;
  }
`

const StyledBeside = styled.div`
  //background-color: #050c0f;
  display: flex;
  //position: relative;
  //z-index: -11;
  //height: 2000px;
  width: 100vw;
`

const LeftBeside = styled.div`
  height: 100vh;
  width: 30%;
  z-index: -2;
  background-color: #050c0f;
  position: fixed;
  overflow: hidden;
  //margin-top: 100vh;
  top: 0;
  left: 0;
  
  iframe{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
`

const RightBeside = styled.div`
  height: 100%;
  width: 70%;
  margin-left: 30%;
  padding: 40px 80px 100px 80px;
  background-color: #050c0f;
  color: #FCF1E6;
  display: flex;
  flex-direction: column;
  gap: 60px;
`

const InfoGroup = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 16px;
  
    h2{
      text-transform: uppercase;
      color: rgb(253, 57, 195);
      font-size: 32px;
      
    }

    .movie--group-title{
      color: gray;
      padding-right: 10px;
    }

  .movie--group-title::after{
    content: ':';
  }
  
    .cast-item img{
      width: 60px;
      height: 60px;
      border-radius: 50%;
    }
  
    .cast-list{
      display: flex;
      gap: 10px;
      width: 100%;
      overflow: scroll;
    }
  
    .cast-item{
      display: flex;
      flex-direction: column;
      width: 80px;
      align-items: center;
      flex-shrink: 0;
      justify-content: space-between;
    }

  .cast-item p{
    text-align: center;
  }

  .cast-name{
    //padding-bottom: 5px;
    color: #00FFFF;
  }
  
    .img-item{
      width: 250px;
      height: 141px;
      border-radius: 12px;
    }
  
    .review-avatar{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      overflow: hidden;
    }
  
    .review-avatar img, .review-avatar div{
        height: 100%;
      width: 100%;
    }
  
  .review-center p span{
    cursor: pointer;
    color: #00FFFF;
  }

  .review-center p span:hover{
    text-decoration: underline;
  }
  
  .review-list{
    display: flex;
    flex-direction: column;
    gap: 32px;
  }
  
  .review-item{
    display: flex;
    gap: 10px;
  }

  .review-center p:nth-child(2){
    text-align: right;
    color: #395B64;
  }
`

export interface iGenre {
    id: number,
    name: string,
    english_name: string
}

export interface crew {
    job: string,
    profile_path: string,
    character: string,
    name: string,
    id: number,
    roles: [{
        character: string
    }],
    total_episode_count: number
}

export interface videoRtn{
    site: string,
    key: string,
    type: string
}

export interface imgRtn{
    file_path: string
}

export interface reviewRtn{
    author: string,
    author_details: {
        avatar_path: string,
        name: string
    },
    content: string,
    created_at: string,
    id: string
}


const ReviewItem = ({review}: {review: reviewRtn}) => {

    const [full, setFull] = useState(false);

    return (
        <div className="review-item" key={review.id}>
            <div className="review-left">
                {/*<img src= alt=""/>*/}
                <div className="review-avatar">
                    {review.author_details.avatar_path?(<img src={`https://media.themoviedb.org/t/p/w90_and_h90_face${review.author_details.avatar_path}`} alt="avatar"/>):(<div style={{backgroundColor: 'pink', color: 'white', textTransform: 'uppercase', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{review.author.charAt(0)}</div>)}
                </div>
                {/*<p>{review.author}</p>*/}
            </div>
            <div className="review-center">
                {review.content.length<320?<p>{review.content}</p>:<p>{full?review.content:shortenString(review.content, 320)} {full?(<span onClick={()=>setFull(false)}>Ẩn bớt</span>):(<span onClick={()=>setFull(true)}>Hiển thị</span>)}</p>}
                <p>{review.created_at}</p>
            </div>
        </div>
    )
}

const MoviePage = ({ params }: { params: { id: number } }) => {

    let keyVideo = '';

    const dispatch = useDispatch();
    const router = useRouter()

    const handleKeyword = (id: number, name: string) => {
        dispatch(clearFilter());
        console.log('clear')
        dispatch(pickObject({
            head: 'movie',
            body: 'with_keywords',
            value: name,
            key: id.toString()
        }))
        router.push('/movie')
    }

    // useLayoutEffect(() => {
    //     if(isReady){
    //         gsap.registerPlugin(ScrollTrigger);
    //         gsap.to(videoRef.current, {
    //             scrollTrigger:{
    //                 trigger: videoRef.current,
    //                 pin: true,
    //                 start: 'top top',
    //                 end: 'top bottom',
    //                 markers: true
    //             }
    //         })
    //     }
    // }, [isReady]);


  //
  const { data: dataA} = useSWR(
    `https://api.themoviedb.org/3/movie/${params.id}?language=vi-VN`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

    const { data: dataB} = useSWR(
        `https://api.themoviedb.org/3/movie/${params.id}?append_to_response=credits%2Cimages%2Cvideos%2Creviews%2Crecommendations%2Csimilar%2Ckeywords`,
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const { data: dataC} = useSWR(
        `https://api.themoviedb.org/3/movie/${params.id}/videos?language=en-US`,
        fetcher,
        {
            revalidateIfStale: false,
            revalidateOnFocus: false,
            revalidateOnReconnect: false,
        }
    );

    const handleActor = (id: number, name: string) => {
        dispatch(clearFilter());
        dispatch(pickObject({
            head: "movie",
            body: 'with_people',
            key: id.toString(),
            value: name
        }))
        router.push('/movie')
    }

    const handleGenre = (id: number, name: string) => {
        dispatch(clearFilter());
        dispatch(pickObject({
            head: "movie",
            body: 'with_genres',
            key: id.toString(),
            value: name
        }))
        router.push('/movie')
    }

  if (!dataB || !dataA || !dataC) return <Spinner animation="grow" />;
  if(dataB) keyVideo = dataB.videos.results.filter((vi: videoRtn)=>vi.site==='YouTube'&&vi.type==='Trailer').length?dataB.videos.results.filter((vi: videoRtn)=>vi.site==='YouTube'&&vi.type==='Trailer')[0].key:'';
console.log(dataB)
console.log(dataC)

  return (
    <div>

        <StyledInfo style={{backgroundColor: 'rgba(0, 0, 0, 0.4)'}}>
            <InfoBackground style={{backgroundImage: `url(https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${dataA.backdrop_path})`}}></InfoBackground>
            <InfoContainer>
                <LeftInfo>
                    <h2>{dataA.title}</h2>
                    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                        <div className="info-line">
                            <div className="info-box"></div>
                            <p>thông tin</p>
                        </div>
                        <AddTo media='movie' id={params.id} data={dataA}/>
                    </div>
                    <div className="info-out">
                        <p className='info-text'>
                            <span>{dataA.release_date&&dataA.release_date.split('-')[0]}</span>
                            {dataA.genres&&dataA.genres.map((genre: iGenre)=>(<span key={genre.id} style={{cursor: 'pointer'}} onClick={()=>handleGenre(genre.id, genre.name)}>{genre.name}</span>))}
                            <p>{`${dataA.runtime>=60&&`${Math.trunc(dataA.runtime/60)}h`} ${(dataA.runtime%60<10)?`0${dataA.runtime%60}`:dataA.runtime%60}`}</p>
                        </p>
                    </div>
                    <p className='info-overview'>{dataA.overview?dataA.overview:dataB.overview}</p>
                    <table>
                        <tbody>
                            <tr>
                                <td style={{paddingRight: '10px'}}><p>Đạo diễn</p></td>
                                <td><p className='info-text'>{dataB.credits.crew&&dataB.credits.crew.filter((cr: crew)=>cr.job==='Director').map((act: iGenre, ind: number) => ind<3&&(<span key={act.id} onClick={()=>handleActor(act.id, act.name)}>{act.name}</span>))}</p></td>
                            </tr>
                            <tr >
                                <td style={{paddingTop: '10px', paddingRight: '10px'}}><p>Diễn viên</p></td>
                                <td style={{paddingTop: '10px'}}><p className='info-text'>{dataB.credits.cast&&dataB.credits.cast.map((act: iGenre, ind: number) => ind<3&&(<span key={act.id} onClick={()=>handleActor(act.id, act.name)}>{act.name}</span>))}</p></td>
                            </tr>
                        </tbody>
                    </table>
                </LeftInfo>
                <RightInfo>
                    <img src={`https://media.themoviedb.org/t/p/w600_and_h600_bestv2${dataA.poster_path}`} alt={dataA.title?dataA.title:dataA.name}/>
                </RightInfo>
            </InfoContainer>
        </StyledInfo>
        <StyledBeside>
            <LeftBeside>
                {/*{console.log(dataC.results.filter((vi: videoRtn)=>vi.site==='YouTube')[0].key)}*/}
                {/*<iframe style={{height: '100vh', width: '100vw'}}*/}
                <iframe style={{height: '100vh', width: '100vw'}}
                        src={`https://www.youtube.com/embed/${keyVideo}?autoplay=1&mute=1&loop=1&playlist=${keyVideo}`} frameBorder="0"
                        ></iframe>
                {/*<video autoPlay loop playsInline preload="auto" src="https://www.imdb.com/video/vi784910105/?playlistId=tt5537002" className="css-43qr9p eivus860" muted></video>*/}
                {/*https://www.youtube.com/watch?v=*/}
                {/*<iframe width="560" height="315" src="https://www.youtube.com/embed/EzFXDvC-EwM" autoPlay allowFullScreen></iframe>*/}
                {/*<img src={`https://media.themoviedb.org/t/p/w600_and_h600_bestv2${dataA.poster_path}`} alt={dataA.title?dataA.title:dataA.name}/>*/}
            </LeftBeside>
            <RightBeside>
                <InfoGroup>
                    <h2>Thông tin chi tiết</h2>
                    <p>
                        <span className='movie--group-title'>Slogan</span>
                        <span>{dataA.tagline?dataA.tagline:'Không'}</span>
                    </p>
                    <p>
                        <span className='movie--group-title'>Ngày Ra Mắt</span>
                        <span>{dataA.release_date}</span>
                    </p>
                    <p>
                        <span className='movie--group-title'>Thuộc Bộ Sưu Tập</span>
                        <span>{dataA.belongs_to_collection?<Link href={''}>{dataA.belongs_to_collection.name}</Link>:`Không`}</span>
                    </p>
                    <p>
                        <span className='movie--group-title'>Nước sản xuất</span>
                        <span>{dataA.production_countries.length?dataA.production_countries.map((cpn: iGenre, ind: number)=>(<span key={cpn.name}>{`${cpn.name}${ind!==dataA.production_countries.length-1?', ':''}`}</span>)):'Không'}</span>
                    </p>
                    <p>
                        <span className='movie--group-title'>Ngôn ngữ</span>
                        <span>{dataA.spoken_languages.length?dataA.spoken_languages.map((cpn: iGenre, ind: number)=>(<span key={cpn.english_name}>{`${cpn.english_name}${ind!==dataA.spoken_languages.length-1?', ':''}`}</span>)):'Không'}</span>
                    </p>
                    <p>
                        <span className='movie--group-title'>Công ty chịu trách nhiệm sản xuất</span>
                        <span>{dataA.production_companies.length?dataA.production_companies.map((cpn: iGenre, ind: number)=>(<span key={cpn.id}>{`${cpn.name}${ind!==dataA.production_companies.length-1?', ':''}`}</span>)):'Không'}</span>
                    </p>
                    <p>
                        <span className='movie--group-title'>Kinh phí</span>
                        <span>{dataA.budget===0?'-':dataA.budget}</span>
                    </p>
                    <p>
                        <span className='movie--group-title'>Doanh thu</span>
                        <span>{dataA.revenue===0?'-':dataA.revenue}</span>
                    </p>
                    <p>
                        <span className='movie--group-title'>Điểm trung bình</span>
                        <span>{dataA.vote_average}</span>
                    </p>
                    <p>
                        <span className='movie--group-title'>Lượt Đánh giá</span>
                        <span>{dataA.vote_count}</span>
                    </p>
                </InfoGroup>
                <InfoGroup>
                    <h2>diễn viên</h2>
                    <div className="cast-list">
                        {dataB.credits.cast.slice(0,10).map((act: crew)=>(
                            <div className="cast-item" key={act.id}>
                                <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px', cursor: 'pointer'}} onClick={()=>handleActor(act.id, act.name)}>
                                    <img src={act.profile_path?`https://image.tmdb.org/t/p/w100_and_h100_face${act.profile_path}`:'https://cdn.create.vista.com/api/media/small/134255626/stock-vector-avatar-male-profile-gray-person-picture-isolated-on-white-background-good-unknown-user-avatar-for'} alt={act.name}/>
                                    <p className='cast-name'>{act.name}</p>
                                </div>
                                <p>{act.character}</p>
                            </div>
                        ))}
                    </div>
                </InfoGroup>
                <InfoGroup>
                    <h2>ảnh</h2>
                    <div className="cast-list">
                        {dataB.images.backdrops.slice(0,10).map((img: imgRtn)=>(
                            <img key={img.file_path} src={`https://image.tmdb.org/t/p/w500_and_h282_bestv2${img.file_path}`} alt={`img`} className='img-item'/>
                        ))}
                    </div>
                </InfoGroup>
                <InfoGroup>
                    <h2>đánh giá</h2>
                    <div className="review-list">
                        {dataB.reviews.results.length?(
                            dataB.reviews.results.map((review: reviewRtn)=>(
                                <ReviewItem review={review} key={review.id} />
                            ))
                        ):(<p>Hiện chưa có bình luận nào</p>)}
                    </div>
                </InfoGroup>
                <InfoGroup>
                    <h2>Đề Xuất</h2>
                    <div className='cast-list'>
                        {dataB.recommendations.results.map((rec: nowPlayingMovie)=>(
                            <Link href={`/movie/${rec.id}`} className="movie--movie-item" key={rec.id}>
                                <img className='img-item' src={rec.backdrop_path?`https://media.themoviedb.org/t/p/w500_and_h282_face${rec.backdrop_path}`:'https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png'} alt='image movie'/>
                                <p>{rec.title}</p>
                            </Link>
                        ))}
                    </div>
                </InfoGroup>
                <InfoGroup>
                    <h2>Cùng Thể Loại</h2>
                    <div className='cast-list'>
                        {dataB.similar.results.map((rec: nowPlayingMovie)=>(
                            <Link href={`/movie/${rec.id}`} className="movie--movie-item" key={rec.id}>
                                <img className='img-item' src={rec.backdrop_path?`https://media.themoviedb.org/t/p/w500_and_h282_face${rec.backdrop_path}`:'https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png'} alt='image movie'/>
                                <p>{rec.title}</p>
                            </Link>
                        ))}
                    </div>
                </InfoGroup>
                <InfoGroup>
                    <h2>Keywords</h2>
                    <div style={{width: '100%', display: 'flex', flexWrap: 'wrap', gap: '5px'}}>
                        {dataB.keywords.keywords.map((kw: iGenre)=>(
                            <Link href={'/movie'} onClick={()=>handleKeyword(kw.id, kw.name)} key={kw.id} style={{padding: '4px 8px', backgroundColor: '#222'}}>{kw.name}</Link>
                        ))}
                    </div>
                </InfoGroup>
            </RightBeside>
        </StyledBeside>

    </div>
  );
};
// https://www.themoviedb.org/t/p/w1066_and_h600_bestv2
export default MoviePage;
