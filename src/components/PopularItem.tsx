'use client';
import React, {useLayoutEffect, useRef} from 'react';
import {nowPlayingMovie} from "@/components/type/typeSome";
import Link from "next/link";
import gsap from "gsap";
import {ScrollTrigger} from "gsap/ScrollTrigger";

const PopularItem = ({data, type}: {data: nowPlayingMovie, type: string}) => {

    const textRef = useRef(null);
    const linkRef = useRef(null);
    const hideRef = useRef(null);
    const imgRef = useRef(null);

    useLayoutEffect( () => {
        gsap.registerPlugin(ScrollTrigger);

        gsap.to(textRef.current, {
            scrollTrigger: {
                trigger: textRef.current,
                scrub: true,
                // start: '0 top',
                // end: '400 top',
                start: 'top bottom',
                end: 'top top',
                markers: true
            },
            transform: 'translate3d(0px, -20px, 0px)',
            ease: "power1"
        })

        gsap.to(linkRef.current,{
            scrollTrigger: {
                trigger: textRef.current,
                // scrub: true,
                // start: '0 top',
                // end: '400 top',
                start: 'top bottom',
                markers: true
            },
            delay: 0.4,
            opacity: '1',
            y: 0
        })

        gsap.to(hideRef.current,{
            scrollTrigger: {
                trigger: hideRef.current,
                // scrub: true,
                // start: '0 top',
                // end: '400 top',
                start: 'top bottom',
                markers: true
            },
            delay: 0.4,
            height: '100%'
            // color: 'red'
        })

        gsap.to(imgRef.current,{
            scrollTrigger: {
                trigger: imgRef.current,
                scrub: true,
                // start: '0 top',
                start: 'top bottom',
                end: 'top top',
                markers: true
            },
            transform: 'translate3d(0px, 5vh, 0px)'
        })

    }, [])

    return (
        <div className='__popular--item'>
            <div className="__popular--content">
                <img style={{transform: 'translate3d(0px, -5vh, 0px)'}} ref={imgRef} src={`https://image.tmdb.org/t/p/w1920_and_h800_multi_faces/${data.backdrop_path}`} alt={data.title?data.title:data.name}/>
            </div>
            <div className="__popular--info" ref={textRef} style={{transform: `translate3d(0px, 20px, 0px)`}}>
                <div className="__popular--circle"></div>
                <div className="__popular--hide" ref={hideRef}></div>
                <Link href={`/${type}/${data.id}`} className="__popular--text" ref={linkRef}>
                    {data.title?data.title:data.name}
                </Link>
            </div>
        </div>
    );
};

export default PopularItem;