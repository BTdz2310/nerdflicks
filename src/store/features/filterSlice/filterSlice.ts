'use client'
import { RootState } from "@/store/store";
import { createSlice } from "@reduxjs/toolkit";

interface FilterState {
    movie: {
        type: 'all' | 'now_playing' | 'popular' | 'top_rated' | 'upcoming',
        certification: string,
        release_date1: string,
        release_date2: string,
        vote_average: string,
        vote_count: string,
        with_origin_country: string,
        with_companies: Object,
        with_people: Object,
        with_runtime1: string,
        with_runtime2: string,
        with_genres: Object,
        with_keywords: Object,
        sorting: 'popularity.asc' | 'popularity.desc' | 'title.asc' | 'title.desc' | 'vote_average.asc' | 'vote_average.desc' | 'vote_count.asc' | 'vote_count.desc'
    },
    tv:{
        type: 'all' | 'airing_today' | 'on_the_air' | 'popular' | 'top_rated',
        certification: string,
        with_status: Array<string>,
        release_date1: string,
        release_date2: string,
        vote_average: string,
        vote_count: string,
        with_origin_country: string,
        with_companies: Object,
        with_runtime1: string,
        with_runtime2: string,
        with_genres: Object,
        with_keywords: Object,
        sorting: 'popularity.asc' | 'popularity.desc' | 'title.asc' | 'title.desc' | 'vote_average.asc' | 'vote_average.desc' | 'vote_count.asc' | 'vote_count.desc'
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
        with_companies: [],
        with_people: [],
        with_runtime1: '',
        with_runtime2: '',
        with_genres: [],
        with_keywords: [],
        sorting: 'popularity.desc'
    },
    tv: {
        type: 'all',
        certification: '',
        with_status: [],
        release_date1: '',
        release_date2: '',
        vote_average: '',
        vote_count: '',
        with_origin_country: '',
        with_companies: [],
        with_runtime1: '',
        with_runtime2: '',
        with_genres: [],
        with_keywords: [],
        sorting: 'popularity.desc'
    }
}

interface pickI{
    type: string,
    payload: {
        head: 'tv' | 'movie',
        body: |'with_people' | 'certification' | 'with_status' | 'release_date' | 'vote_average' | 'vote_count' | 'with_origin_country' | 'with_companies' | 'with_runtime' | 'with_genres' | 'with_keywords',
        value: string
    }
}

export const filterSlice = createSlice({
    name: 'searchSlice',
    initialState,
    reducers: {
        pickOne: (state, action) =>{
            state[action.payload.head][action.payload.body] = action.payload.value;
        },
        pickArray: (state, action) => {
            if(state[action.payload.head][action.payload.body].includes(action.payload.value)){
                state[action.payload.head][action.payload.body] = state[action.payload.head][action.payload.body].filter((str: string)=>str!==action.payload.value);
            }else{
                state[action.payload.head][action.payload.body].push(action.payload.value);
            }
        },
        pickObject: (state, action) => {
            if(state[action.payload.head][action.payload.body][action.payload.key]){
                delete state[action.payload.head][action.payload.body][action.payload.key];
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