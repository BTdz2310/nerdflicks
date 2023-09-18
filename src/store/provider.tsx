'use client'
import { Provider } from "react-redux";
import { store } from "./store";
import { JsxChild } from "typescript";

export const Providers = ({children}:{children: any}) => {
    return (
        <Provider store={store}>
            {children}
        </Provider>
    )
}