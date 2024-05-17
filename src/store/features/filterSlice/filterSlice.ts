'use client'
import { RootState } from "@/store/store";
import { createSlice } from "@reduxjs/toolkit";

interface StringObject {
    [key: string]: string;
}

interface FilterState {
    movie: {
        // type: 'all' | 'now_playing' | 'popular' | 'top_rated' | 'upcoming',
        type: string,
        certification: string,
        release_date1: string,
        release_date2: string,
        vote_average: string,
        vote_count: string,
        with_origin_country: string,
        with_companies: StringObject,
        with_people: StringObject,
        with_runtime1: string,
        with_runtime2: string,
        with_status: Array<string>,
        with_genres: StringObject,
        with_keywords: StringObject,
        sorting: string
    },
    tv:{
        // type: 'all' | 'airing_today' | 'on_the_air' | 'popular' | 'top_rated',
        type: string,
        certification: string,
        with_status: Array<string>,
        release_date1: string,
        release_date2: string,
        vote_average: string,
        vote_count: string,
        with_origin_country: string,
        with_people: StringObject,
        with_companies: StringObject,
        with_runtime1: string,
        with_runtime2: string,
        with_genres: StringObject,
        with_keywords: StringObject,
        sorting: string
    }
}

const initialState: FilterState = {
    movie: {
        type: 'all',
        certification: '',
        release_date1: '',
        release_date2: '',
        vote_average: '',
        vote_count: '',
        with_origin_country: '',
        with_companies: {},
        with_people: {},
        with_runtime1: '',
        with_runtime2: '',
        with_genres: {},
        with_status: [],
        with_keywords: {},
        sorting: 'popularity.desc'
    },
    tv: {
        type: 'all',
        certification: '',
        with_status: [],
        with_people: {},
        release_date1: '',
        release_date2: '',
        vote_average: '',
        vote_count: '',
        with_origin_country: '',
        with_companies: {},
        with_runtime1: '',
        with_runtime2: '',
        with_genres: {},
        with_keywords: {},
        sorting: 'popularity.desc'
    }
}

interface pickIOne{
    type: string,
    payload: {
        head: 'tv' | 'movie',
        body: 'type' | 'certification' | 'release_date1' | 'release_date2' | 'vote_average' | 'vote_count' | 'with_origin_country' | 'with_runtime1' | 'with_runtime2' | 'sorting',
        value: string
    }
}

interface pickIArray{
    type: string,
    payload: {
        head: 'tv' | 'movie',
        body: 'with_status',
        value: string
    }
}

interface pickIObject{
    type: string,
    payload: {
        head: 'tv' | 'movie',
        body: 'with_people' | 'with_companies' | 'with_genres' | 'with_keywords',
        key: string,
        value: string
    }
}

export const filterSlice = createSlice({
    name: 'searchSlice',
    initialState,
    reducers: {
        pickOne: (state, action: pickIOne) =>{
            state[action.payload.head][action.payload.body] = action.payload.value;
        },
        pickArray: (state, action: pickIArray) => {
            if(state[action.payload.head][action.payload.body].includes(action.payload.value)){
                state[action.payload.head][action.payload.body] = state[action.payload.head][action.payload.body].filter((str: string)=>str!==action.payload.value);
            }else{
                state[action.payload.head][action.payload.body].push(action.payload.value);
            }
        },
        pickObject: (state, action: pickIObject) => {
            if(Object.keys(state[action.payload.head][action.payload.body]).includes(action.payload.key)){
                // delete state[action.payload.head][action.payload.body][action.payload.key];

                state[action.payload.head][action.payload.body] = Object.keys(state[action.payload.head][action.payload.body]).filter(key =>
                    key !== action.payload.key).reduce((obj: StringObject, key) =>
                {
                    obj[key] = state[action.payload.head][action.payload.body][key];
                    console.log(obj)
                    return obj;
                }, {});

            }else{
                state[action.payload.head][action.payload.body][action.payload.key] = action.payload.value;
            }
        },
    }
})

export const selectFilter = (state: RootState) => state.filterSlice;

export const selectMovieFilter = (state: RootState) => state.filterSlice.movie;
export const selectTVFilter = (state: RootState) => state.filterSlice.tv;

export const {pickOne, pickArray, pickObject} = filterSlice.actions;
export default filterSlice.reducer;