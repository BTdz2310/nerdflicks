"use client";
import React, {useLayoutEffect, useRef, useState} from "react";
import useSWR from "swr";
import Spinner from "react-bootstrap/Spinner";
import "@/styles/movie-page.css";
import styled from "styled-components";
import Link from "next/link";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {nowPlayingMovie} from "@/components/type/typeSome";
import {list} from "postcss";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {crew, iGenre, imgRtn, reviewRtn, videoRtn} from "@/app/movie/[id]/page";

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
  gap: 20px;
  align-items: center;
  
  img{
    width: 100%;
    max-width: 400px;
    object-fit: contain;
  }
  
  p{
    padding: 4px 8px;
    color: rgb(253, 57, 195);
    background-color: white;
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
`

const InfoGroup = styled.div`
    position: relative;
  
    h2{
      text-transform: uppercase;
      color: rgb(253, 57, 195);
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
`

interface season{
  id: number,
  name: string,
  episode_count: number,
  poster_path: string
}

const TVPage = ({ params }: { params: { id: number } }) => {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  let keyVideo = '';

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

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI4OWJiODExODczYTgwNjMwMGY1ZTE5NThhYjUzMzhhMiIsInN1YiI6IjYzZTRiNDJlMGU1OTdiMDBjZDdiYTQzOCIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.jj9_04xOHbR519EDCfhgf9jFAz6AtMGNECxGgeg-i2M",
    },
  };

  const fetcher = (url: string) =>
      fetch(url, options).then((res) => res.json());
  //
  const { data: dataA} = useSWR(
      `https://api.themoviedb.org/3/tv/${params.id}?language=vi-VN`,
      fetcher,
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
  );

  const { data: dataB} = useSWR(
      `https://api.themoviedb.org/3/tv/${params.id}?append_to_response=aggregate_credits%2Cimages%2Cvideos%2Creviews%2Crecommendations%2Csimilar%2Ckeywords`,
      fetcher,
      {
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: false,
      }
  );

  // const { data: dataC} = useSWR(
  //     `https://api.themoviedb.org/3/movie/${params.id}/videos?language=en-US`,
  //     fetcher,
  //     {
  //       revalidateIfStale: false,
  //       revalidateOnFocus: false,
  //       revalidateOnReconnect: false,
  //     }
  // );

  if (!dataB || !dataA) return <Spinner animation="grow" />;
  if(dataB) keyVideo = dataB.videos.results.filter((vi: videoRtn)=>vi.site==='YouTube'&&vi.type==='Trailer').length?dataB.videos.results.filter((vi: videoRtn)=>vi.site==='YouTube'&&vi.type==='Trailer')[0].key:'';
  console.log(dataA)

  return (
      <div>

        <StyledInfo style={{backgroundColor: 'rgba(0, 0, 0, 0.4)'}}>
          <InfoBackground style={{backgroundImage: `url(https://media.themoviedb.org/t/p/w1920_and_h800_multi_faces${dataA.backdrop_path})`}}></InfoBackground>
          <InfoContainer>
            <LeftInfo>
              <h2 onClick={handleShow}>{dataA.name}</h2>
              <div className="info-line">
                <div className="info-box"></div>
                <p>thông tin</p>
              </div>
              <div className="info-out">
                <p className='info-text'>
                  <span>{`${dataA.first_air_date&&dataA.first_air_date.split('-')[0]} - ${dataA.status==='Returning Series'?'nay':dataA.last_air_date&&dataA.last_air_date.split('-')[0]}`}</span>
                  {dataA.genres&&dataA.genres.map((genre: iGenre)=>(<span key={genre.id}><Link href={'#'}>{genre.name}</Link></span>))}
                  {(dataA.number_of_episodes&&dataA.number_of_seasons)&&(<span>{`${dataA.number_of_seasons} mùa - ${dataA.number_of_episodes} tập`}</span>)}
                </p>
              </div>
              <p className='info-overview'>{dataA.overview?dataA.overview:dataB.overview}</p>
              <table>
                <tbody>
                {dataB.created_by.length?(<tr>
                  <td style={{paddingRight: '20px'}}><p>Người khởi xướng</p></td>
                  <td><p
                      className='info-text'>{dataB.created_by.map((act: iGenre, ind: number) => ind < 3 && (
                      <span key={act.id}><Link href={''}>{act.name}</Link></span>))}</p></td>
                </tr>):undefined}
                {dataB.aggregate_credits.cast.length ? (<tr>
                  <td style={{paddingTop: '10px', paddingRight: '20px'}}><p>Diễn viên</p></td>
                  <td style={{paddingTop: '10px'}}><p
                      className='info-text'>{dataB.aggregate_credits.cast.map((act: iGenre, ind: number) => ind < 3 && (
                      <span key={act.id}><Link href={''}>{act.name}</Link></span>))}</p></td>
                </tr>):undefined}
                </tbody>
              </table>
            </LeftInfo>
            <RightInfo>
              {dataA.next_episode_to_air&&(<p>{`Tập tiếp theo được phát vào: ${dataA.next_episode_to_air.air_date}`}</p>)}
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
              <h2>Mùa</h2>
              <div className='cast-list'>
                {dataB.seasons.map((ss: season)=>(
                    <Link href={`/tv/${ss.id}`} className="movie--movie-item" key={ss.id}>
                      <img className='img-item' src={ss.poster_path?`https://image.tmdb.org/t/p/w454_and_h254_bestv2${ss.poster_path}`:'https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png'} alt='image movie'/>
                      <p>{`${ss.name} - ${ss.episode_count} tập`}</p>
                    </Link>
                ))}
              </div>
            </InfoGroup>
            <InfoGroup>
              <h2>Thông tin chi tiết</h2>
              <p>
                <span className='movie--group-title'>Slogan</span>
                <span>{dataA.tagline?dataA.tagline:'Không'}</span>
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
                {dataB.aggregate_credits.cast.slice(0,10).map((act: crew)=>(
                    <div className="cast-item" key={act.id}>
                      <img src={act.profile_path?`https://image.tmdb.org/t/p/w100_and_h100_face${act.profile_path}`:'https://cdn.create.vista.com/api/media/small/134255626/stock-vector-avatar-male-profile-gray-person-picture-isolated-on-white-background-good-unknown-user-avatar-for'} alt={act.name}/>
                      <p>{act.name}</p>
                      <p>{act.roles[0].character}</p>
                      <p style={{color: 'grey'}}>{`${act.total_episode_count} tập`}</p>
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
                        <div className="review-item" key={review.id}>
                          <div className="review-left">
                            {/*<img src= alt=""/>*/}
                            <div className="review-avatar">
                              {review.author_details.avatar_path?(<img src={`https://media.themoviedb.org/t/p/w90_and_h90_face${review.author_details.avatar_path}`} alt="avatar"/>):(<div style={{backgroundColor: 'pink', color: 'white', textTransform: 'uppercase', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>{review.author.charAt(0)}</div>)}
                            </div>
                            {/*<p>{review.author}</p>*/}
                          </div>
                          <div className="review-center">
                            <p>{review.content}</p>
                            <p>{review.created_at}</p>
                          </div>
                        </div>
                    ))
                ):(<p>Hiện chưa có bình luận nào</p>)}
              </div>
            </InfoGroup>
            <InfoGroup>
              <h2>Đề Xuất</h2>
              <div className='cast-list'>
                {dataB.recommendations.results.map((rec: nowPlayingMovie)=>(
                    <Link href={`/tv/${rec.id}`} className="movie--movie-item" key={rec.id}>
                      <img className='img-item' src={rec.backdrop_path?`https://media.themoviedb.org/t/p/w500_and_h282_face${rec.backdrop_path}`:'https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png'} alt='image movie'/>
                      <p>{rec.name}</p>
                    </Link>
                ))}
              </div>
            </InfoGroup>
            <InfoGroup>
              <h2>Cùng Thể Loại</h2>
              <div className='cast-list'>
                {dataB.similar.results.map((rec: nowPlayingMovie)=>(
                    <Link href={`/tv/${rec.id}`} className="movie--movie-item" key={rec.id}>
                      <img className='img-item' src={rec.backdrop_path?`https://media.themoviedb.org/t/p/w500_and_h282_face${rec.backdrop_path}`:'https://www.contentviewspro.com/wp-content/uploads/2017/07/default_image.png'} alt='image movie'/>
                      <p>{rec.name}</p>
                    </Link>
                ))}
              </div>
            </InfoGroup>
            <InfoGroup>
              {/*<h2>Keywords</h2>*/}
              {/*<div style={{width: '100%', display: 'flex', flexWrap: 'wrap', gap: '5px'}}>*/}
              {/*  {dataB.keywords.keywords.map((kw: iGenre)=>(*/}
              {/*      <p key={kw.id} style={{padding: '4px 8px', backgroundColor: '#222'}}>{kw.name}</p>*/}
              {/*  ))}*/}
              {/*</div>*/}
            </InfoGroup>
          </RightBeside>
        </StyledBeside>


      </div>
  );
};
// https://www.themoviedb.org/t/p/w1066_and_h600_bestv2
export default TVPage;
