'use client'
import { RootState } from "@/store/store";
import { createSlice } from "@reduxjs/toolkit";

export interface StoreSearch {
    id: number,
    media_type: string,
    name: string,
    popularity: number
}

export interface SearchState {
    favorite: Array<StoreSearch>,
    recently: Array<StoreSearch>
}

const initialState: SearchState = {
    favorite: [],
    recently: []
}

export const searchSlice = createSlice({
    name: 'searchSlice',
    initialState,
    reducers: {
        addFavorite: (state, action:{type:string, payload:StoreSearch}) => {
            state.favorite.push(action.payload)
        },
        removeFavorite: (state, action:{type:string, payload:StoreSearch}) => {
            state.favorite = state.favorite.filter((obj:StoreSearch)=>obj.id!==action.payload.id||obj.media_type!==action.payload.media_type||obj.name!==action.payload.name||obj.popularity!==action.payload.popularity)
        },
        addRecent: (state, action:{type:string, payload:StoreSearch}) => {
            state.recently = [action.payload, ...state.recently.filter((object:StoreSearch)=>object.id!==action.payload.id||object.media_type!==action.payload.media_type||object.name!==action.payload.name||object.popularity!==action.payload.popularity)]
        },
    }
})

export const selectFavoriteSearch = (state: RootState) => state.searchSlice.favorite;
export const selectRecentlySearch = (state: RootState) => state.searchSlice.recently;

export const {addFavorite, removeFavorite, addRecent} = searchSlice.actions;
export default searchSlice.reducer;