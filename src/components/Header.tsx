"use client";
import React, {lazy, useCallback, useState, useEffect, useRef} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import "@/styles/header.css";
import { motion } from "framer-motion"
import {Spinner} from "react-bootstrap";
import {options} from "@/utils/utils";
import useDebounce from "@/utils/useDebounce";
import {keyword} from "@/components/type/typeSome";
import styled from "styled-components";
import Logo from "@/components/Logo";

const StyledHeader = styled.div`

  position: fixed;
  width: 100vw;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 9999;
  height: 80px;
  background:linear-gradient(to bottom, rgba(34, 34, 34, 0.4), rgba(34, 34, 34, 0));

  header{
    max-width: 1200px;
    margin: 0 auto;
    height: 80px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
`

const LeftHeader = styled.div`
  display: flex;
  align-items: end;
  cursor: pointer;
  
  h2{
    font-family: 'Fjalla One', sans-serif !important;
    font-size: 24px;
    font-weight: bold;
    position: relative;
    overflow: hidden;
    left: 2px;
    bottom: -5px;
    margin: 0;
  }
`

const RightHeader = styled.div`
  position: relative;
  display: flex;
  gap: 20px;
`

const SearchBar = styled.div`
  width: 260px;
  position: relative;
  
  input{
    background: inherit;
    border: 1px solid rgb(235, 245, 255);
    height: 36px;
    width: 100%;
    border-radius: 18px;
    padding-left: 16px;
  }
  
  input:focus{
    outline: none;
  }
  
  svg{
    position: absolute;
    cursor: pointer;
    top: 5.5px;
    right: 16px;
    fill: white;
  }
`

const CollapsedContainer = styled(motion.div)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: inherit;
  color: white;
`

const CollapsedBackground = styled(motion.div)`
  background-color: #0B0B0B;
  position: fixed;
  top: 0;
  right: 0;
  width: 400px;
  height: 100vh;
`

const CollapsedButton = styled(motion.div)`
  cursor: pointer;
  background: inherit;
  border: none;
  border-radius: 50%;
  z-index: 1000;
  height: 25px;
  width: 25px;
`

const CollapsedLinks = styled(motion.div)`
  position: absolute;
  width: 100%;
  height: 100%;
  bottom: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 20px;
  
  a{
    color: white;
    font-size: 28px;
    text-decoration: none;
  }
`

const SearchBox = styled.div`
  width: 100%;
  position: absolute;
  top: 44px;
  border-radius: 20px;
  min-height: 200px;
  max-height: 400px;
  overflow: scroll;
  visibility: hidden;
  background-color: rgba(11, 11, 11, 0.8);
`

const Keyword = styled.div`
  margin-top: 10px;
  
  a{
    color: white;
    text-decoration: none;
    display: flex;
    padding: 8px 10px;
    cursor: pointer;
    justify-content: space-between;
    gap: 10px;
    align-items: center;
  }
  
  a:nth-child(even){
    background-color: rgba(44, 44, 44, 0.6);
  }
`

const Header = () => {
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const searchRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounce = useDebounce(searchText, 200);

  useEffect(()=>{
    const loadKeyword = async () => {
      setLoading(true);

      const response = await fetch(`https://api.themoviedb.org/3/search/multi?query=${encodeURI(debounce)}&include_adult=false&language=en-US&page=1`, options);
      const json = await response.json();
      console.log(json)
      setData(json.results);

      setLoading(false);
    }

    loadKeyword();
  }, [debounce])

  const handleHome = () => {
    router.push("/");
  };

  const variants = {
    open: {
      clipPath: 'circle(1600px at 400px 0px)',
      transition: {
        type: 'spring',
        stiffness: 20
      }
    },
    closed: {
      clipPath: 'circle(0px at 400px 0px)',
      transition: {
        delay: 0.5,
        type: 'spring',
        stiffness: 400,
        damping: 40,
      }
    }
  }

  const variantsLink = {
    open: {
      transition: {
        staggerChildren: 0.1,
      },
    },
    closed: {
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    open: {
      y: 0,
      opacity: 1,
    },
    closed: {
      y: 50,
      opacity: 0,
    },
  };

  const titleVariants = {
    hidden: {
        opacity: 0,
        x: -20
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 2,
          delay: 1,
          ease: 'easeInOut'
        }
    }
  }

  // const checkClick = (e: any) => {
  //   // if (!e.target.closest('.selected-element')) {
  //   //   // Xử lý khi click vào không gian bên ngoài phần tử đã chọn
  //   //   console.log('Clicked outside selected element');
  //   // }
  //   if(searchRef.current) console.log(searchRef.current.contains(e.target))
  // }

  // return (<header>keke</header>)

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if(!searchText) return;
    router.push(`/search?search=${searchText}`, {scroll : false})
  }

  const handleGo = (link: string) => {
    router.push(`${link}`, {scroll : false})
    setOpen(false);
  }

  return (
    // <StyledHeader>
    <div className='styled-header'>
      <header>

          <div className='left-header' onClick={()=>handleHome()}>
              <div className="header--logo">
                <div className="logo_container">
                  <div className="logo__left"></div>
                  <div className="logo__center"></div>
                  <div className="logo__right"></div>
                </div>
              </div>
              <motion.h2 variants={titleVariants} initial='hidden' animate='visible'>erdflicks</motion.h2>
          </div>

          <div className='right-header'>
            <div className='header--searchBar'>
              <form onSubmit={(e)=>handleSubmit(e)}>
                <input type="text" onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} onChange={(e)=>setSearchText(e.target.value)} value={searchText}/>
                <button style={{border: 'none'}}>
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
                    <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
                  </svg>
                </button>
              </form>
              {(searchText&&data.length>0)&&<div className='header--searchBox' style={{visibility: isFocused ? 'visible' : 'hidden', transform: isFocused ? 'none' : 'translateY(-8px)', opacity: isFocused ? '1' : '0', transition: '0.2s'}}>
                <>
                  {loading?(<div className='__loading'><Spinner animation="grow"/></div>):(<div className='header--keyword'>
                    {data.map((keyword: keyword)=>(
                      <Link href={`/search?search=${keyword.media_type==='movie'?keyword.title:keyword.name}&type=${keyword.media_type}`} key={keyword.id}>
                        <p>{keyword.media_type==='movie'?(keyword.title.length>25?`${keyword.title.slice(0, 25)} ...`: keyword.title):(keyword.name.length>25?`${keyword.name.slice(0, 25)} ...`: keyword.name)}</p>
                        <div style={{width: '20px', height: '20px'}}>{keyword.media_type==='person'?(<i className="fa-regular fa-user"></i>):(keyword.media_type==='tv'?(<i className="fa-solid fa-tv"></i>):(<i className="fa-solid fa-film"></i>))}</div>
                      </Link>
                    ))}
                  </div>)}
                </>
              </div>}
            </div>
            <motion.div className='header--collapse-container' animate={open ? 'open' : 'closed'}>
              <motion.div className='header--collapse-background' variants={variants}>
                <motion.div className='header--collapse-links' variants={variantsLink}>
                  <motion.p
                      variants={itemVariants}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={()=>handleGo('/movie')}
                  >
                    Điện Ảnh
                  </motion.p>
                  <motion.p
                      variants={itemVariants}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={()=>handleGo('/tv')}
                  >
                    Truyền Hình
                  </motion.p>
                  <motion.a
                      href='/people'
                      variants={itemVariants}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                  >
                    Diễn Viên
                  </motion.a>
                </motion.div>
              </motion.div>
              <div className='header--collapse-button' onClick={()=>setOpen(prev=>!prev)}>
                <svg width="23" height="23" viewBox="0 0 23 23">
                  <motion.path strokeWidth="3" stroke="white" strokeLinecap="round" d="M 2 2.5 L 20 2.5"
                   variants={{
                      closed: { d: "M 2 2.5 L 20 2.5" },
                      open: { d: "M 3 16.5 L 17 2.5" },
                    }}></motion.path>
                  <motion.path strokeWidth="3" stroke="white" strokeLinecap="round" d="M 2 9.423 L 20 9.423" opacity="1"
                   variants={{
                     closed: { opacity: 1 },
                     open: { opacity: 0 },
                   }}></motion.path>
                  <motion.path strokeWidth="3" stroke="white" strokeLinecap="round" d="M 2 16.346 L 20 16.346"
                   variants={{
                     closed: { d: "M 2 16.346 L 20 16.346" },
                     open: { d: "M 3 2.5 L 17 16.346" },
                   }}></motion.path>
                </svg></div>
            </motion.div>
          </div>

      </header>
    </div>
  );
};

export default Header;
