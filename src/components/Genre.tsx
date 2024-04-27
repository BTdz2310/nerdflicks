import React, {useLayoutEffect, useRef} from 'react';
import styled from "styled-components";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

const StyledGenre = styled.div`
  margin-top: 800px;
  height: 100vh;
  background: black;
  z-index: 100;
  position: relative;
  width: 100vw;
  overflow: hidden;
`

const StyledContainer = styled.div`
  display: flex;
  
  padding-left: 100vw;
  position: relative;
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
  border-radius: 12px;
  overflow: hidden;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  img{
    
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

    const divRef = useRef(null);

    useLayoutEffect(()=>{
        gsap.registerPlugin(ScrollTrigger);

        gsap.to(divRef.current, {
            scrollTrigger: {
                trigger: divRef.current,
                start: "top top",
                end: `top+=${window.innerWidth * 7} top`,
                pin: true,
                pinSpacing: false,
                pinnedContainer: divRef.current,

            },
            x: window.innerWidth*7
        })
    }, [])

    return (
        <StyledGenre ref={divRef}>
            <StyledContainer>
                <StyledBox>
                    <StyledImg>
                        <img src="../images/Gen1.jpg" alt='action' width='100%' height='100%'/>
                        <StyledTitle style={{fontSize: '50px'}}>HÀNH ĐỘNG</StyledTitle>
                    </StyledImg>
                </StyledBox>
                <StyledBox>
                    <StyledImg>
                        <img src="../images/Gen2.jpg" alt='comedy' width='100%' height='100%'/>
                        <StyledTitle style={{fontSize: '60px'}}>HÀI</StyledTitle>
                    </StyledImg>
                </StyledBox>
                <StyledBox>
                    <StyledImg>
                        <img src="../images/Gen3.jpg" alt='drama' width='100%' height='100%'/>
                        <StyledTitle style={{fontSize: '60px'}}>DRAMA</StyledTitle>
                    </StyledImg>
                </StyledBox>
                <StyledBox>
                    <StyledImg>
                        <img src="../images/Gen4.jpg" alt='sc-ft' width='100%' height='100%'/>
                        <StyledTitle style={{fontSize: '40px', left: '20%', transform: 'translate(-10%, -50%)'}}>KHOA HỌC VIỄN TƯỞNG</StyledTitle>
                    </StyledImg>
                </StyledBox>
                <StyledBox>
                    <StyledImg>
                        <img src="../images/Gen5.jpg" alt='horror' width='100%' height='100%'/>
                        <StyledTitle style={{fontSize: '60px'}}>KINH DỊ</StyledTitle>
                    </StyledImg>
                </StyledBox>
                <StyledBox>
                    <StyledImg>
                        <img src="../images/Gen6.jpg" alt='romance' width='100%' height='100%'/>
                        <StyledTitle style={{fontSize: '60px'}}>LÃNG MẠN</StyledTitle>
                    </StyledImg>
                </StyledBox>
                <StyledBox>
                    <StyledImg>
                        <img src="../images/Gen7.jpeg" alt='animation' width='100%' height='100%'/>
                        <StyledTitle style={{fontSize: '52px'}}>HOẠT HÌNH</StyledTitle>
                    </StyledImg>
                </StyledBox>
            </StyledContainer>
        </StyledGenre>
    );
};

export default Genre;