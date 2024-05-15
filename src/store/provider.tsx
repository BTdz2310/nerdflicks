'use client'
import { Provider } from "react-redux";
import { store } from "./store";
import { JsxChild } from "typescript";
import {useEffect} from "react";
import Header from "@/components/Header";

export const Providers = ({children}:{children: any}) => {

    useEffect( () => {
        (
            async () => {
                const LocomotiveScroll = (await import('locomotive-scroll')).default
                const locomotiveScroll = new LocomotiveScroll();
            }
        )()
    }, [])

    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}