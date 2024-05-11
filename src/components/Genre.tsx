import React, {useEffect, useLayoutEffect, useRef} from 'react';
import styled from "styled-components";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

const StyledGenre = styled.div`
  height: 100vh;
  background: black;
  z-index: 100;
  position: relative;
  width: 100vw;
  overflow: hidden;
`

const StyledContainer = styled.div`
  display: flex;
  //top: 0;
  //left: 0;
  //position: sticky;
  padding-left: 100vw;
`

const StyledBox = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  flex-shrink: 0;
`

const StyledImg = styled.div`
  width: 600px;
  height: 400px;
  webkit-transform: translate3d(-50%, -50%, 0);
  transform: translate3d(-50%, -50%, 0);
  //border-radius: 12px;
  //overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  //width: 80%;
  //max-width: 800px;
  //height: 60%;
  //max-height: 600px;
  
  img{
    perspective: 2000px;
    //transform: matrix(0.43301, 0.25, -0.25, 0.43301, 0, 0);
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    top: 0;
    width: 100%;
    height: 100%;
    max-width: 800px;
    transform: rotate(20deg);
  }
`

const StyledTitle = styled.h3`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  margin: 0;
`

const Genre = () => {

    const width = window.innerWidth;
    const divRef = useRef(null);
    const scrollRef = useRef(null);
    const img1 = useRef(null);
    const img2 = useRef(null);
    const img3 = useRef(null);
    const img4 = useRef(null);
    const img5 = useRef(null);
    const img6 = useRef(null);
    const img7 = useRef(null);

    useEffect(() => {
        console.log('USEEFF')
    }, []);

    useLayoutEffect(()=>{
        gsap.registerPlugin(ScrollTrigger);

        const ctx = gsap.context(()=>{
            gsap.to(divRef.current, {
                scrollTrigger: {
                    trigger: divRef.current,
                    start: "top top",
                    end: `top+=${window.innerWidth*7} top`,
                    // start: "top 80%",
                    // end: `top 30%`,
                    pin: true,
                    // pinSpacing: false,
                    pinnedContainer: divRef.current,
                    // markers: {
                    //     startColor: 'yellow',
                    //     endColor: 'yellow'
                    // },
                    // scrub: true
                },
                // x: window.innerWidth*-7
            })

            gsap.to(scrollRef.current, {
                scrollTrigger: {
                    trigger: divRef.current,
                    start: "top top",
                    end: `top+=${window.innerWidth*7} top`,
                    // markers: {
                    //     startColor: 'red',
                    //     endColor: 'red'
                    // },
                    scrub: true
                },
                x: window.innerWidth*-7
            })

            gsap.to(img1.current, {
                scrollTrigger: {
                    trigger: divRef.current,
                    start: "top top",
                    end: `top+=${window.innerWidth} top`,
                    // markers: {
                    //     startColor: 'red',
                    //     endColor: 'red'
                    // },
                    scrub: true
                },
                transform: 'rotate(-20deg)',
                scale: 1.2
            })

            gsap.to(img2.current, {
                scrollTrigger: {
                    trigger: img2.current,
                    start: `top+=${window.innerWidth} top`,
                    // start: "top top",
                    end: `top+=${window.innerWidth*2} top`,
                    markers: {
                        startColor: 'blue',
                        endColor: 'blue'
                    },
                    scrub: true
                },
                transform: 'rotate(-45deg)'
            })

            gsap.to(img3.current, {
                scrollTrigger: {
                    trigger: divRef.current,
                    start: `top+=${window.innerWidth*2} top`,
                    end: `top+=${window.innerWidth*3} top`,
                    // markers: {
                    //     startColor: 'red',
                    //     endColor: 'red'
                    // },
                    scrub: true
                },
                transform: 'rotate(-45deg)'
            })

            gsap.to(img4.current, {
                scrollTrigger: {
                    trigger: divRef.current,
                    start: `top+=${window.innerWidth*3} top`,
                    end: `top+=${window.innerWidth*4} top`,
                    // markers: {
                    //     startColor: 'red',
                    //     endColor: 'red'
                    // },
                    scrub: true
                },
                transform: 'rotate(-45deg)'
            })

            gsap.to(img5.current, {
                scrollTrigger: {
                    trigger: divRef.current,
                    start: `top+=${window.innerWidth*4} top`,
                    end: `top+=${window.innerWidth*5} top`,
                    // markers: {
                    //     startColor: 'red',
                    //     endColor: 'red'
                    // },
                    scrub: true
                },
                transform: 'rotate(-45deg)'
            })

            gsap.to(img6.current, {
                scrollTrigger: {
                    trigger: divRef.current,
                    start: `top+=${window.innerWidth*5} top`,
                    end: `top+=${window.innerWidth*6} top`,
                    // markers: {
                    //     startColor: 'red',
                    //     endColor: 'red'
                    // },
                    scrub: true
                },
                transform: 'rotate(-45deg)'
            })

            gsap.to(img7.current, {
                scrollTrigger: {
                    trigger: divRef.current,
                    start: `top+=${window.innerWidth*6} top`,
                    end: `top+=${window.innerWidth*7} top`,
                    // markers: {
                    //     startColor: 'red',
                    //     endColor: 'red'
                    // },
                    scrub: true
                },
                transform: 'rotate(-45deg)'
            })
        })

        return () => ctx.revert();

    }, [])

    return (
        <StyledGenre ref={divRef}>
            <StyledContainer ref={scrollRef}>
                <StyledBox>
                    <StyledImg>
                        <img ref={img1} src="../images/imgGen1.webp" alt='action' width='1200' height='659' />
                        <StyledTitle style={{fontSize: '50px'}}>HÀNH ĐỘNG</StyledTitle>
                    </StyledImg>
                </StyledBox>
                <StyledBox>
                    <StyledImg>
                        <img ref={img2} src="../images/com.webp" alt='comedy' width='100%' height='100%'/>
                        <StyledTitle style={{fontSize: '60px', color: 'mediumvioletred'}}>HÀI</StyledTitle>
                    </StyledImg>
                </StyledBox>
                <StyledBox>
                    <StyledImg>
                        <img ref={img3} src="../images/image.webp" alt='drama' width='100%' height='100%'/>
                        <StyledTitle style={{fontSize: '60px', color: 'crimson'}}>DRAMA</StyledTitle>
                    </StyledImg>
                </StyledBox>
                <StyledBox>
                    <StyledImg>
                        <img ref={img4} src="../images/Gen4.jpg" alt='sc-ft' width='100%' height='100%'/>
                        <StyledTitle style={{fontSize: '40px', left: '20%', transform: 'translate(-10%, -50%)', color: 'cadetblue'}}>KHOA HỌC VIỄN TƯỞNG</StyledTitle>
                    </StyledImg>
                </StyledBox>
                <StyledBox>
                    <StyledImg>
                        <img ref={img5} src="../images/Gen5.jpg" alt='horror' width='100%' height='100%'/>
                        <StyledTitle style={{fontSize: '60px', color: 'darkgray'}}>KINH DỊ</StyledTitle>
                    </StyledImg>
                </StyledBox>
                <StyledBox>
                    <StyledImg>
                        <img ref={img6} src="../images/image1.webp" alt='romance' width='100%' height='100%'/>
                        <StyledTitle style={{fontSize: '60px', color: 'indianred'}}>LÃNG MẠN</StyledTitle>
                    </StyledImg>
                </StyledBox>
                <StyledBox>
                    <StyledImg>
                        <img ref={img7} src="../images/image2.webp" alt='animation' width='100%' height='100%'/>
                        <StyledTitle style={{fontSize: '52px', color: 'fuchsia'}}>HOẠT HÌNH</StyledTitle>
                    </StyledImg>
                </StyledBox>
            </StyledContainer>
        </StyledGenre>
    );
};

export default Genre;