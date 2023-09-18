"use client";
import React, { lazy, useCallback, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "next/image";
import logo from "../../public/images/1275121.png";
import "../styles/header.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcSearch, FcFilmReel } from "react-icons/fc";
import SearchModal from "./SearchModal";

// const SearchModal = lazy(()=> import('./SearchModal'))
let lastScroll = 0;
const Header = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const [lastScrollTop, setLastScrollTop] = useState<number>(0);

  const router = useRouter();

  const handleHome = () => {
    router.push("/");
  };

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      if (scrollTop > lastScroll && scrollTop > 40) {
        setIsHeaderHidden(true);

      } else {
        setIsHeaderHidden(false);
      }
      // setLastScrollTop(scrollTop);
      lastScroll = scrollTop;
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleShowModal = useCallback(() => {
    setShowModal(true);
  }, []);

  return (
    <div className="header">
      <header className={isHeaderHidden ? "header--hidden" : undefined}>
        <Navbar expand="lg" className="bg-body-tertiary" id="nav-bar">
          <Container>
            <Navbar.Brand>
              <Image src={logo} alt="logo" width={40} height={40} />
              <h2>Xem Gì</h2>
            </Navbar.Brand>
            {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
            <Navbar.Collapse id="basic-navbar-nav">
              <div className="dropdown">
                <Link
                  href=""
                  className="dropdown-toggle"
                  // id="dropdownMenuButton"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  movies
                </Link>
                <ul
                  aria-labelledby="dropdownMenuButton"
                  className='dropdown-menu'
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      popular
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      top rated
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      now playing
                    </a>
                  </li>
                  <NavDropdown.Divider />
                  <li>
                    <a className="dropdown-item" href="#">
                      all
                    </a>
                  </li>
                </ul>
              </div>

              <div className="dropdown">
                <Link
                  href=""
                  className="dropdown-toggle"
                  // id="dropdownMenuButton"
                  data-mdb-toggle="dropdown"
                  aria-expanded="false"
                >
                  TV Shows
                </Link>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton"
                >
                  <li>
                    <a className="dropdown-item" href="#">
                      popular
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      top rated
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="#">
                      airing today
                    </a>
                  </li>
                  <NavDropdown.Divider />
                  <li>
                    <a className="dropdown-item" href="#">
                      all
                    </a>
                  </li>
                </ul>
              </div>

              <Link href="/" className="navLinkHeader">
                people
              </Link>
              <Link href="/" className="navLinkHeader">
                by genre
              </Link>
            </Navbar.Collapse>
            <div className="searchNav">
              <FcFilmReel fontSize={40} />
              <FcSearch
                fontSize={40}
                className="searchIcon"
                onClick={handleShowModal}
              />
            </div>
            {/* <Navbar.Toggle> */}
            {/* </Navbar.Toggle> */}
          </Container>
        </Navbar>
      </header>
      {showModal ? <SearchModal setShowModal={setShowModal} /> : undefined}
    </div>
  );
};

export default Header;
