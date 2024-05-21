"use client";
import React, {lazy, useCallback, useState, useEffect, useRef} from "react";
import { useRouter } from "next/navigation";
import "@/styles/header.css";
import { motion } from "framer-motion"
import {Spinner} from "react-bootstrap";
import {options} from "@/utils/utils";
import { useCookies } from 'next-client-cookies';
import useDebounce from "@/utils/useDebounce";
import {keyword} from "@/components/type/typeSome";
import { Link } from 'next-view-transitions'


const Header = () => {
  const [open, setOpen] = useState<boolean>(false);

  const router = useRouter();

  const searchRef = useRef(null);
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState<string>('');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const debounce = useDebounce(searchText, 200);
  const cookies = useCookies();

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

  useEffect(() => {
    window.addEventListener('click', () => {
      setIsFocused(false)
    });

    return () => {
      window.removeEventListener('click', () => {
        setIsFocused(false)
      });
    }
  }, []);

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

  const handleSubmit = (e:any) => {
    e.preventDefault();
    if(!searchText) return;
    router.push(`/search?search=${searchText}`, {scroll : false})
  }

  const handleGo = (link: string) => {
    setOpen(false);
    // router.push(`${link}`, {scroll : false})
  }

  const handleLogout = () => {
    setOpen(false);
    cookies.remove('token');
    // router.push(`/`, {scroll : false})
  }

  return (
    // <StyledHeader>
    <div className='styled-header'>
      <header>

          <div className='left-header' onClick={()=>handleHome()}>
              <Link href='/'>
                <div className="header--logo">
                  <div className="logo_container">
                    <div className="logo__left"></div>
                    <div className="logo__center"></div>
                    <div className="logo__right"></div>
                  </div>
                </div>
                <motion.h2 variants={titleVariants} initial='visible' animate='visible'>erdflicks</motion.h2>
              </Link>
          </div>

          <div className='right-header'>
            <div className='header--searchBar' onClick={(e)=>e.stopPropagation()}>
              <form onSubmit={(e)=>handleSubmit(e)}>
                <input onFocus={()=>setIsFocused(true)} type="text" onChange={(e)=>setSearchText(e.target.value)} value={searchText}/>
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
                      <Link onClick={()=>setIsFocused(false)} href={`/search?search=${keyword.media_type==='movie'?keyword.title:keyword.name}&type=${keyword.media_type}`} key={keyword.id}>
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
                      // whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={()=>handleGo('/movie')}
                  >
                    <Link href={'/movie'}><i className="fa-solid fa-clapperboard"></i>Điện Ảnh</Link>
                  </motion.p>
                  <motion.p
                      variants={itemVariants}
                      // whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={()=>handleGo('/tv')}
                  >
                    <Link href={'/tv'}><i className="fa-solid fa-film"></i>Truyền Hình</Link>
                  </motion.p>
                  <motion.p
                      variants={itemVariants}
                      // whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={()=>handleGo('/forum')}
                  >
                    <Link href={'/forum'}><i className="fa-solid fa-people-line"></i>Diễn Đàn</Link>
                  </motion.p>
                  {cookies.get('token')&&(
                      <motion.p
                          variants={itemVariants}
                          // whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={()=>handleGo('/user')}
                      >
                        <Link href={'/user'}><i className="fa-solid fa-user"></i>Hồ Sơ</Link>
                      </motion.p>
                  )}
                  {cookies.get('token')?(
                      <motion.p
                          variants={itemVariants}
                          // whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={()=>handleLogout()}
                      >
                        <Link href={'/'}><i className="fa-solid fa-arrow-up-from-bracket" style={{transform: 'rotate(-90deg)'}}></i>Đăng Xuất</Link>
                      </motion.p>
                  ):(
                      <motion.p
                          variants={itemVariants}
                          // whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={()=>handleGo('/login')}
                      >
                        <Link href={'/login'}><i className="fa-solid fa-right-to-bracket"></i>Đăng Nhập</Link>
                      </motion.p>
                  )}
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
