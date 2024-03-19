import React, {useLayoutEffect, useRef} from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';
import styled from "styled-components";

const phrases = ["Los Flamencos National Reserve", "is a nature reserve located", "in the commune of San Pedro de Atacama", "The reserve covers a total area", "of 740 square kilometres (290 sq mi)"]

const StyledDiv = styled.div`
  position: relative;
  color: white;
  font-size: 3vw;
  text-transform: uppercase;
  margin-top: 200vh;
  margin-left: 10vw;
`

const StyledP = styled.p`
  margin: 0px;
  position: relative;
`
const Check = () => {
    const text1 = useRef(null);
    const text2 = useRef(null);
    const text3 = useRef(null);
    const text4 = useRef(null);
    const text5 = useRef(null);

    useLayoutEffect( () => {
        gsap.registerPlugin(ScrollTrigger);
        gsap.from(text1.current, {
            scrollTrigger: {
                trigger: text1.current,
                scrub: true,
                start: "0px bottom",
                end: "bottom+=400px bottom",
                markers: true
            },
            opacity: 0,
            left: "-200px",
            ease: "power3.Out"
        })
        gsap.from(text2.current, {
            scrollTrigger: {
                trigger: text2.current,
                scrub: true,
                start: "0px bottom",
                end: "bottom+=400px bottom",
                markers: true
            },
            opacity: 0,
            left: "-200px",
            ease: "power3.Out"
        })
        gsap.from(text3.current, {
            scrollTrigger: {
                trigger: text3.current,
                scrub: true,
                start: "0px bottom",
                end: "bottom+=400px bottom",
                markers: true
            },
            opacity: 0,
            left: "-200px",
            ease: "power3.Out"
        })
        gsap.from(text4.current, {
            scrollTrigger: {
                trigger: text4.current,
                scrub: true,
                start: "0px bottom",
                end: "bottom+=400px bottom",
                markers: true
            },
            opacity: 0,
            left: "-200px",
            ease: "power3.Out"
        })
        gsap.from(text5.current, {
            scrollTrigger: {
                trigger: text5.current,
                scrub: true,
                start: "0px bottom",
                end: "bottom+=400px bottom",
                markers: true
            },
            opacity: 0,
            left: "-200px",
            ease: "power3.Out"
        })
    }, [])



    return (
        <>
            <StyledDiv>
                <StyledP ref={text1}>{phrases[0]}</StyledP>
                <StyledP ref={text2}>{phrases[1]}</StyledP>
                <StyledP ref={text3}>{phrases[2]}</StyledP>
                <StyledP style={{opacity: 1}} ref={text4}>{phrases[3]}</StyledP>
                <StyledP ref={text5}>{phrases[4]}</StyledP>
            </StyledDiv>
        </>
    )
};

export default Check;