import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import styled from "styled-components";
import Link from 'next/link'
import {nowPlayingMovie} from "@/components/type/typeSome";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";


const StyledPopular = styled.div`
  width: 100vw;
  //height: calc(800px + 100vh);
  height: auto;
  position: relative;
  //padding-bottom: calc(100vh + 800px);
  //display: flex;
  //flex-direction: column;
  //gap: calc(-100vh);
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin-top: calc(100vh + 800px);
  //background-color: black;
`

const PopularContainer = styled.div`
  position: relative;
  //max-width: 1320px;
  padding-top: 100px;
  top: 0;
  left: 0;
  height:100vh;
  width: 100%;
  background-color: black;
  z-index: 200;
  //background-image: url("/images/popular-background.jpeg");
  
  //margin: 0 auto;
  
  h2{
    font-size: 3vw;
    text-transform: uppercase;
    color: rgb(253, 57, 195);
  }
`

const PopularInner = styled.div`
  height: 100%;
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
`

const StyledType = styled.div`
  border-radius: 20px;
  width: fit-content;
  border: 1px solid white;
  display: flex;
  position: relative;
  overflow: hidden;
  opacity: 0;
  transform: translateY(40px);
  
  div{
    cursor: pointer;
    padding: 8px 12px;
    border: 0;
    width: 120px;
    text-align: center;
  }
  
  div:last-child{
    border-left: 1px solid white;
  }
`

const StyledBackground = styled.div`
  opacity:1;
  width: 100%;
  height: 100%;
  position: absolute;
  min-height: 600px!important;
  top: 0;
  left: 0;
`

const StyledLeft = styled.div`
    a{
      height: 400px;
      width: 400px;
      position: relative;
      overflow: hidden;
      display: block;
    }
    
    a>div{
      //height: 900px;
      width: 100%;
    }
  
    a>div>div{
      position: absolute;
      top: 0;
      right: 0;
      left: 0;
      height: 100%;
      overflow: hidden;
    }
  
    img{
      width: 100%;
      height: auto;
      position: absolute;
    }
  
`

const StyledRight = styled.div`
  flex-grow: 1;
  height: calc(100% - 40px);
  position: relative;
`

const PopularList = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  display: flex;
  flex-direction: column;
  
`

const StyledAlign = styled.div`
  flex-grow: 10;
`

const pastStyle = {
    paddingBottom: '0',
    paddingTop: '100vh + 800px'
}

interface objProp {
    movie: Array<nowPlayingMovie>,
    tv: Array<nowPlayingMovie>
}

const Popular = ({data}: {data: objProp}) => {

    const [index, setIndex] = useState(0);
    const [type, setType] = useState<'movie'|'tv'>('movie');

    // const [offsetY, setOffsetY] = useState<number>(0);
    //
    // const handleScroll = () => setOffsetY(window.pageYOffset);
    //
    // useEffect(() => {
    //     window.addEventListener('scroll', handleScroll);
    //
    //     return () => window.removeEventListener('scroll', handleScroll);
    // }, []);

    const refImg = useRef(null);
    const divRef = useRef(null);
    const typeRef = useRef(null);
    const textRef = useRef(null);

    useEffect( () => {
        gsap.registerPlugin(ScrollTrigger);

        // gsap.to(refImg.current, {
        //     scrollTrigger: {
        //         trigger: refImg.current,
        //         scrub: true,
        //         // start: '0 top',
        //         // end: '400 top',
        //         start: 'top-=225px bottom',
        //         end: 800,
        //         markers: true
        //     },
        //     transform: 'transform: translate3d(0px, -60px, 0px);',
        //     ease: "power1"
        // })

        gsap.to(textRef.current, {
            scrollTrigger: {
                trigger: textRef.current,
                scrub: true,

                // start: '0 top',
                // end: '400 top',
                start: 'top-=100 bottom',
                end: `top+=${window.innerHeight * 0.5} bottom`,
                // markers: true
            },
            x: 0
        })

        gsap.to(typeRef.current, {
            scrollTrigger: {
                trigger: typeRef.current,
                scrub: true,

                start: 'top-=100 bottom',
                end: `top+=${window.innerHeight * 0.5} bottom`,
                // start: 'top+=360 bottom',
                // end: 'top+=520 bottom',
                // markers: true
            },
            opacity: 1,
            y: 0
        })

        gsap.to(divRef.current, {
            scrollTrigger: {
                trigger: divRef.current,
                // scrub: true,
                // pin: divRef.current,
                // pinSpacing: false,
                // pinSpacing: '20px',
                start: "top top",
                end: "top+=400 top",
                pin: true,
                pinSpacing: false,
                pinnedContainer: divRef.current,

            },
        })

        gsap.to(refImg.current, {
            scrollTrigger: {
                trigger: refImg.current,
                scrub: true,
                // start: '0 top',
                // end: '400 top',
                start: 'top top',
                end: 'top+=800 top',
                // markers: true
            },
            y: -60
        })

    }, [])

    return (
        <StyledPopular>
            {/*<StyledBackground />*/}

            {/*<StyledAlign/>*/}
            
            <PopularContainer ref={divRef}>

                <PopularInner>
                    <div  style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
                        <h2 style={{transform: 'translateX(-160px)'}} ref={textRef}>Thịnh Hành</h2>

                        <StyledType ref={typeRef}>
                            <div style={{width: '50%', height: '100%', background: 'white', position: 'absolute', top: '0', left: '0', transform: `translateX(${type === 'movie' ? 0 : 100}%)`, transition: '0.5s'}}></div>
                            <div style={{color: type === 'movie' ? 'black' : 'white', zIndex: '10', transition: '1s'}}
                                 onClick={()=>setType('movie')}
                            >Điện Ảnh</div>
                            <div style={{color: type === 'tv' ? 'black' : 'white', zIndex: '10', transition: '1s'}}
                                 onClick={()=>setType('tv')}
                            >Truyền Hình</div>
                        </StyledType>

                        {/*<Type type={type} setType={setType}/>*/}

                    </div>

                    <div style={{flexGrow: '3', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '40px'}}>
                        <StyledLeft>
                            <Link href={`/${type}/${data[type][index].id}`}>
                                <div>
                                    <div >
                                        <img ref={refImg} src={`https://media.themoviedb.org/t/p/w600_and_h900_bestv2${data[type][index].poster_path}`} alt={data[type][index].title || data[type][index].name}/>
                                    </div>
                                </div>
                            </Link>
                        </StyledLeft>
                        <StyledRight>
                            <PopularList>
                                <h2>{data[type][0].title?data[type][0].title:data[type][0].name}</h2>
                                <h2>{data[type][1].title?data[type][1].title:data[type][1].name}</h2>
                                <h2>{data[type][2].title?data[type][2].title:data[type][2].name}</h2>
                                <h2>{data[type][3].title?data[type][3].title:data[type][3].name}</h2>
                                <h2>{data[type][4].title?data[type][4].title:data[type][4].name}</h2>
                            </PopularList>
                        </StyledRight>
                    </div>
                </PopularInner>

            </PopularContainer>

        </StyledPopular>
    );
};

export default Popular;