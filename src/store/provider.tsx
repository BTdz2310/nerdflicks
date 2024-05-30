'use client'
import {Provider} from "react-redux";
import { store } from "./store";

store.subscribe(()=>{
    console.log('update')
    console.log(store.getState())
})

console.log(store.getState())

export const Providers = ({children}:{children: any}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}