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

const TVPage = ({ params }: { params: { id: number } }) => {

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
      `https://api.themoviedb.org/3/tv/${params.id}?append_to_response=credits%2Cimages%2Cvideos%2Creviews%2Crecommendations%2Csimilar%2Ckeywords`,
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
              <h2>{dataA.name}</h2>
              <div className="info-line">
                <div className="info-box"></div>
                <p>thông tin</p>
              </div>
              <div className="info-out">
                <p className='info-text'>
                  <span>{`${dataA.first_air_date&&dataA.first_air_date.split('-')[0]} - ${dataA.status==='Ended'?dataA.last_air_date&&dataA.last_air_date.split('-')[0]:'nay'}`}</span>
                  {dataA.genres&&dataA.genres.map((genre: iGenre)=>(<span key={genre.id}><Link href={'#'}>{genre.name}</Link></span>))}
                  {(dataA.number_of_episodes&&dataA.number_of_seasons)&&(<span>{`${dataA.number_of_seasons} mùa - ${dataA.number_of_episodes} tập`}</span>)}
                </p>
              </div>
              <p className='info-overview'>{dataA.overview?dataA.overview:dataB.overview}</p>
              <table>
                <tbody>
                <tr>
                  <td style={{paddingRight: '20px'}}><p>Người khởi xướng</p></td>
                  <td><p className='info-text'>{dataB.created_by&&dataB.created_by.map((act: iGenre, ind: number) => ind<3&&(<span key={act.id}><Link href={''}>{act.name}</Link></span>))}</p></td>
                </tr>
                <tr >
                  <td style={{paddingTop: '10px', paddingRight: '20px'}}><p>Diễn viên</p></td>
                  <td style={{paddingTop: '10px'}}><p className='info-text'>{dataB.credits.cast&&dataB.credits.cast.map((act: iGenre, ind: number) => ind<3&&(<span key={act.id}><Link href={''}>{act.name}</Link></span>))}</p></td>
                </tr>
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

          </LeftBeside>
          <RightBeside>

          </RightBeside>
        </StyledBeside>

      </div>
  );
};
// https://www.themoviedb.org/t/p/w1066_and_h600_bestv2
export default TVPage;
