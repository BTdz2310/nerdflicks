'use client'
import { Provider } from "react-redux";
import { store } from "./store";
import { JsxChild } from "typescript";
import {useEffect} from "react";
import Header from "@/components/Header";
import Spinner from "react-bootstrap/Spinner";
import { useCookies } from 'next-client-cookies';

store.subscribe(()=>{
    console.log('update')
    console.log(store.getState())
})

export const Providers = ({children}:{children: any}) => {

    const cookies = useCookies();

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
                if(response.status !== 200){
                    cookies.remove('token')
                    window.location.replace("/login");
                }
            }
        }
        check()
    },[])

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}