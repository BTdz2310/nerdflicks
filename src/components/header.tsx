'use client'
import React, { lazy, useState } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Image from 'next/image';
import logo from '../../public/images/1275121.png'
import '../styles/header.css'
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {FcSearch} from 'react-icons/fc'
// import SearchModal from './SearchModal';

const SearchModal = lazy(()=> import('./SearchModal'))

const Header = () => {
    const [showModal, setShowModal] = useState<boolean>(false);

    const router = useRouter();

    const handleHome = () => {
        router.push('/')
    }

  return (
    <>
            {console.log('>>modalShow: ', showModal)}
        <header>
            <Navbar expand="lg" className="bg-body-tertiary" id='nav-bar'>
                <Container>
                    <Navbar.Brand >
                        <Image src={logo} alt='logo' width={40} height={40}/>
                        <h2>Xem Gì</h2>
                    </Navbar.Brand>
                    {/* <Navbar.Toggle aria-controls="basic-navbar-nav" /> */}
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <Link href='/'>Mới Ra Mắt</Link>
                            <NavDropdown title="Thể Loại" id="basic-nav-dropdown">
                                <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.2">
                                    Another action
                                </NavDropdown.Item>
                                <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item href="#action/3.4">
                                    Separated link
                                </NavDropdown.Item>
                            </NavDropdown>
                            <Link href='/'>Top 50</Link>
                        </Nav>
                    </Navbar.Collapse>
                    <div className="searchNav">
                        <FcSearch fontSize={40} className='searchIcon' onClick={()=>setShowModal(true)}/>
                    </div>
                    {/* <Navbar.Toggle> */}
                    {/* </Navbar.Toggle> */}
                </Container>
            </Navbar>
        </header>
        {showModal?(<SearchModal setShowModal={setShowModal}/>):undefined}
    </>
  )
}

export default Header