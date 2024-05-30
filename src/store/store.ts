'use client'
import { configureStore } from "@reduxjs/toolkit";
import searchSlice from "./features/searchSlice/searchSlice";
import filterSlice from "@/store/features/filterSlice/filterSlice";
import userSlice from "@/store/features/userSlice/userSlice";

export const store = configureStore({
    reducer: {
        searchSlice: searchSlice,
        filterSlice: filterSlice,
        userSlice: userSlice
    }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;