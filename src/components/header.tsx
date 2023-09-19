"use client";
import React, { lazy, useCallback, useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Image from "next/image";
import logo from "../../public/images/1275121.png";
import "../styles/header.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import 'bootstrap/dist/css/bootstrap.min.css';

const SearchModal = lazy(()=> import('./SearchModal'))

let lastScroll = 0;

const Header = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);

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
            <Navbar.Brand onClick={()=>handleHome()}>
              <Image src={logo} alt="logo" width={40} height={40} />
              <h2>Xem Gì</h2>
            </Navbar.Brand>
            {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
            <Navbar.Collapse id="basic-navbar-nav">
              <div className="dropdown">
                <p
                  className="dropdown-toggle multi-navbar"
                  // id="dropdownMenuButton"
                  data-mdb-toggle="dropdown"
                >
                  movies
                </p>
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
                <p
                  className="dropdown-toggle multi-navbar"
                  // id="dropdownMenuButton"
                  data-mdb-toggle="dropdown"
                >
                  TV Shows
                </p>
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
              <div className="watchListHeader">
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 64 64">
                <path fill="#c5e4fa" d="M31,3C15.536,3,3,15.536,3,31s12.536,28,28,28s28-12.536,28-28S46.464,3,31,3z"></path><path fill="#e3f2ff" d="M12.71,52.29c2.65,2.521,5.769,4.498,9.18,5.82L56,24v-6.43c-1.056-1.75-2.3-3.38-3.71-4.86 L12.71,52.29z M10.76,50.24L50,11h-6L8.22,46.78C8.977,47.996,9.826,49.153,10.76,50.24z M7.79,43.21L41,10l-3-2L6.36,39.64 C6.754,40.862,7.232,42.054,7.79,43.21z"></path><path fill="#72caaf" d="M31,3C15.536,3,3,15.536,3,31s12.536,28,28,28s28-12.536,28-28S46.464,3,31,3z M31,53 C18.85,53.002,8.998,43.154,8.996,31.003C8.995,18.853,18.843,9.002,30.993,9c5.651-0.001,11.085,2.173,15.177,6.07l0.68,0.67 c0.26,0.267,0.51,0.54,0.75,0.82c7.975,9.167,7.009,23.063-2.158,31.038C41.438,51.082,36.308,53.001,31,53z"></path><path fill="#66bfa1" d="M31,53C18.85,53,9,43.15,9,31H7.34c-2.209-0.007-4.006,1.777-4.013,3.986 c-0.001,0.243,0.02,0.485,0.063,0.724c2.588,15.246,17.046,25.507,32.292,22.918C47.416,56.636,56.608,47.444,58.6,35.71 c0.392-2.174-1.052-4.254-3.226-4.646C55.138,31.021,54.899,31,54.66,31H53C53,43.15,43.15,53,31,53z"></path><path fill="#8d6c9f" d="M31,2C14.984,2,2,14.984,2,31s12.984,29,29,29s29-12.984,29-29S47.016,2,31,2z M31,58 C16.088,58,4,45.912,4,31S16.088,4,31,4s27,12.088,27,27S45.912,58,31,58z"></path><path fill="#8d6c9f" d="M15,30c-0.552,0-1,0.448-1,1s0.448,1,1,1h2c0.552,0,1-0.448,1-1s-0.448-1-1-1H15z"></path><path fill="#8d6c9f" d="M30,45v2c0,0.552,0.448,1,1,1s1-0.448,1-1v-2c0-0.552-0.448-1-1-1S30,44.448,30,45z"></path><path fill="#8d6c9f" d="M31,54C18.297,53.974,8.021,43.656,8.046,30.954S18.39,7.974,31.093,8 c1.093,0.002,2.185,0.082,3.267,0.24c0.552,0.08,0.935,0.593,0.855,1.145s-0.593,0.935-1.145,0.855 C33.054,10.086,32.028,10.006,31,10c-11.598,0.019-20.984,9.437-20.965,21.035S19.472,52.019,31.07,52 s20.984-9.437,20.965-21.035C52.024,24.529,49.063,18.453,44,14.48c-0.434-0.342-0.507-0.971-0.165-1.405 c0.342-0.434,0.971-0.507,1.405-0.165c9.991,7.845,11.731,22.303,3.886,32.294C44.758,50.767,38.073,54.011,31,54z"></path><path fill="#8d6c9f" d="M41,12.4c-0.157-0.001-0.311-0.039-0.45-0.11c-0.749-0.379-1.521-0.713-2.31-1 c-0.519-0.191-0.786-0.766-0.595-1.285c0.191-0.519,0.766-0.786,1.285-0.595c0.865,0.319,1.71,0.69,2.53,1.11 c0.486,0.262,0.668,0.869,0.405,1.355C41.693,12.194,41.362,12.395,41,12.4z"></path><g><path fill="#ed7899" d="M31,18c0.552,0,1-0.448,1-1v-2c0-0.552-0.448-1-1-1s-1,0.448-1,1v2C30,17.552,30.448,18,31,18z"></path><path fill="#ed7899" d="M48,31c0-0.552-0.448-1-1-1h-2c-0.552,0-1,0.448-1,1s0.448,1,1,1h2C47.552,32,48,31.552,48,31z"></path><path fill="#ed7899" d="M35.87,18.95c0.511,0.206,1.092-0.04,1.3-0.55l0.75-1.85c0.176-0.524-0.106-1.09-0.63-1.266 c-0.479-0.161-1.002,0.061-1.22,0.516l-0.75,1.85C35.114,18.161,35.36,18.742,35.87,18.95z M45.46,37.92 c0.524,0.176,1.09-0.106,1.266-0.63c0.161-0.479-0.061-1.002-0.516-1.22l-1.85-0.75c-0.524-0.176-1.09,0.106-1.266,0.63 c-0.161,0.479,0.061,1.002,0.516,1.22L45.46,37.92z M40,20.23c-0.384,0.398-0.373,1.031,0.025,1.415 c0.398,0.384,1.031,0.373,1.415-0.025l1.39-1.44c0.336-0.438,0.254-1.066-0.184-1.402c-0.37-0.284-0.886-0.275-1.246,0.022 L40,20.23z M41.77,40c-0.39-0.388-1.02-0.388-1.41,0c-0.14,0.156-0.227,0.352-0.25,0.56c-0.175,0.377-0.1,0.822,0.19,1.12 L41.61,43c0.388,0.375,1.002,0.375,1.39,0c0.04-0.095,0.115-0.17,0.21-0.21c0.388-0.39,0.388-1.02,0-1.41L41.77,40z M45.21,23.58 l-1.83,0.81c-0.505,0.224-0.734,0.815-0.51,1.32c0.224,0.505,0.815,0.734,1.32,0.51L46,25.41c0.505-0.224,0.734-0.815,0.51-1.32 c-0.224-0.505-0.815-0.734-1.32-0.51H45.21z"></path></g><g><circle cx="31" cy="31" r="2" fill="#8d6c9f"></circle></g><g><path fill="#8d6c9f" d="M38.532,39.518c-0.256,0-0.511-0.098-0.706-0.292l-7.533-7.518 c-0.391-0.39-0.392-1.023-0.001-1.415c0.389-0.391,1.022-0.393,1.415-0.001l7.532,7.518c0.392,0.391,0.392,1.023,0.002,1.414 C39.045,39.42,38.788,39.518,38.532,39.518z"></path></g><g><path fill="#8d6c9f" d="M31,32c-0.552,0-1-0.448-1-1V21c0-0.552,0.448-1,1-1s1,0.448,1,1v10C32,31.552,31.552,32,31,32z"></path></g>
                </svg>
              </div>
              <div className="searchIcon" onClick={handleShowModal}>
              <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="40" height="40" viewBox="0 0 48 48">
                <path fill="#616161" d="M29.171,32.001L32,29.172l12.001,12l-2.828,2.828L29.171,32.001z"></path><path fill="#616161" d="M36,20c0,8.837-7.163,16-16,16S4,28.837,4,20S11.163,4,20,4S36,11.163,36,20"></path><path fill="#37474f" d="M32.476,35.307l2.828-2.828l8.693,8.693L41.17,44L32.476,35.307z"></path><path fill="#64b5f6" d="M7,20c0-7.18,5.82-13,13-13s13,5.82,13,13s-5.82,13-13,13S7,27.18,7,20"></path>
                </svg>
              </div>
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
