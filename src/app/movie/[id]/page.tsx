"use client";
import React, { useState } from "react";
import useSWR from "swr";
import Spinner from "react-bootstrap/Spinner";
import "@/styles/movie-page.css";

const MoviePage = ({ params }: { params: { id: number } }) => {
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
  const { data, error, isLoading } = useSWR(
    `https://api.themoviedb.org/3/movie/${params.id}?language=vi-VN`,
    fetcher,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );
  console.log(">>>>", data);

  if (isLoading) return <Spinner animation="grow" />;

  return (
    <>
      {/* <img src={`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces${data.backdrop_path}`} id='backdrop_path'/> */}

      {/* {console.log(getColor())} */}

      {/* <img src='https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/7dzngS8pLkGJpyeskCFcjPO9qLF.jpg' crossOrigin='' /> */}

      {/* <div className="colorBackground" style={{
            height: '500px'
        }}> */}

      <div className="containerDiv">
        <div className="round-bottom" style={{
          backgroundImage: `url(https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${data.backdrop_path})`
        }}>

        </div>
      </div>

      {/* </div> */}
    </>
  );
};

export default MoviePage;
