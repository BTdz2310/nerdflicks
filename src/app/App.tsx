'use client'
import React, {useEffect, useState} from 'react';
import { useCookies } from 'next-client-cookies';
import {useDispatch, useSelector} from "react-redux";
import {logout, selectLoggedIn, setUser} from "@/store/features/userSlice/userSlice";

const App = ({children}:{children: any}) => {

    const cookies = useCookies();
    const dispatch = useDispatch();


    useEffect( () => {
        (
            async () => {
                const LocomotiveScroll = (await import('locomotive-scroll')).default
                const locomotiveScroll = new LocomotiveScroll();
            }
        )()
    }, [])

    useEffect( () => {
        const check = async()=>{
            if(cookies.get('token')){
                const response = await fetch('http://localhost:5001/api/credential', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json; charset=utf-8',
                        'Authorization': `Bearer ${cookies.get('token')}`
                    },
                })
                const json = await response.json();
                console.log(json)
                if(response.status !== 200){
                    cookies.remove('token')
                    dispatch(logout())
                    window.location.replace("/login");
                }else{
                    dispatch(setUser(json))
                }
            }
        }
        check()
    },[])

    return(
        <>
            {children}
        </>
    )
};

export default App;