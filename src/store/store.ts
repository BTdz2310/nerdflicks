'use client'
import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "./features/searchSlice/searchSlice";
import filterSlice from "@/store/features/filterSlice/filterSlice";

export const store = configureStore({
    reducer: {
        searchSlice: searchSlice,
        filterSlice: filterSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;