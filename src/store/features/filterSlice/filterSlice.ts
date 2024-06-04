'use client'
import { RootState } from "@/store/store";
import { createSlice } from "@reduxjs/toolkit";
import {statusDisplay} from "@/components/ActionSwitch";

interface StringObject {
    [key: string]: string;
}

interface FilterState {
    movie: {
        [id: string] :any,
        // type: 'all' | 'now_playing' | 'popular' | 'top_rated' | 'upcoming',
        // type: string,
        // certification: string,
        // release_date1: string,
        // release_date2: string,
        // vote_average: string,
        // vote_count: string,
        // with_origin_country: string,
        // with_companies: StringObject,
        // with_people: StringObject,
        // with_runtime1: string,
        // with_runtime2: string,
        // with_status: Array<string>,
        // with_genres: StringObject,
        // with_keywords: StringObject,
        // sorting: string
    },
    tv:{
        [id: string]: any
        // type: 'all' | 'airing_today' | 'on_the_air' | 'popular' | 'top_rated',
        // type: string,
        // certification: string,
        // with_status: Array<string>,
        // release_date1: string,
        // release_date2: string,
        // vote_average: string,
        // vote_count: string,
        // with_origin_country: string,
        // with_people: StringObject,
        // with_companies: StringObject,
        // with_runtime1: string,
        // with_runtime2: string,
        // with_genres: StringObject,
        // with_keywords: StringObject,
        // sorting: string
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

const oneArr = ['certification', 'release_date1', 'release_date2', 'vote_average', 'vote_count', 'with_origin_country', 'with_runtime1', 'with_runtime2']

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
    name: 'filterSlice',
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
        clearFilter: (state) => {
            state.movie = {
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
            };
            state.tv = {
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
        },
        removeButton: (state, action:{
            type: string,
            payload: {
                type: 'tv' | 'movie',
                key: string,
                value: string
            }
        }) => {
            if(oneArr.includes(action.payload.key)){
                state[action.payload.type][action.payload.key] = '';
            }else if(action.payload.key === 'with_status'){
                state[action.payload.type].with_status = state[action.payload.type].with_status.filter((item: string)=>item!==action.payload.value)
            }else{
                delete state[action.payload.type][action.payload.key][action.payload.value]
            }
        }
    }
})

export const selectType = (state: RootState) => {
    return {
        tv: state.filterSlice.tv.type,
        movie: state.filterSlice.movie.type
    }
}

const filterDisplay:{
    [id: string]: string
} = {
    certification: 'Phân Loại',
    with_status: 'Trạng Thái',
    with_people: 'Có Sự Tham Gia Của',
    release_date1: 'Phát Hành Từ',
    release_date2: 'Phát Hành Đến',
    vote_average: 'Điểm Vote Trên',
    vote_count: 'Lượt Vote Trên',
    with_origin_country: 'Quốc Gia',
    with_companies: 'Công Ty SX',
    with_runtime1: 'Dài Trên',
    with_runtime2: 'Ngắn Hơn',
    with_genres: 'Thể Loại',
    with_keywords: 'Keyword',
}

export const filterMovieArr = (state: RootState) => {
    const arr: Array<{
        key: string,
        // key: 'certification' | 'release_date1' | 'release_date2' | 'vote_average' | 'vote_count' | 'with_origin_country' | 'with_runtime1' | 'with_runtime2' | 'sorting' | 'with_status' | 'with_people' | 'with_companies' | 'with_genres' | 'with_keywords',
        display: string,
        front: string,
        back: string
    }> = [];

    // for(let i=0; i<Object.keys(state.filterSlice.movie).length; i++){
    //     if(state.filterSlice.movie[Object.keys(state.filterSlice.movie)[i]])
    // }

    Object.keys(state.filterSlice.movie).forEach((key)=>{
        if(key!=='sorting'&&key!=='type'){
            if(oneArr.includes(key)){
                if(state.filterSlice.movie[key]){
                    arr.push({
                        key: key,
                        display: filterDisplay[key],
                        front: state.filterSlice.movie[key],
                        back: state.filterSlice.movie[key]
                    })
                }

            }else if(key === 'with_status'){
                for (let i=0; i<state.filterSlice.movie[key].length; i++){
                    arr.push({
                        key: key,
                        display: filterDisplay[key],
                        front: statusDisplay[state.filterSlice.movie[key][i]],
                        back: state.filterSlice.movie[key][i]
                    })
                }
            }else{
                for (let i=0; i<Object.keys(state.filterSlice.movie[key]).length; i++){
                    arr.push({
                        key: key,
                        display: filterDisplay[key],
                        back: Object.keys(state.filterSlice.movie[key])[i],
                        front: state.filterSlice.movie[key][Object.keys(state.filterSlice.movie[key])[i]]
                    })
                }
            }
        }
    })

    return arr;

}

export const filterTVArr = (state: RootState) => {
    const arr: Array<{
        key: string,
        // key: 'certification' | 'release_date1' | 'release_date2' | 'vote_average' | 'vote_count' | 'with_origin_country' | 'with_runtime1' | 'with_runtime2' | 'sorting' | 'with_status' | 'with_people' | 'with_companies' | 'with_genres' | 'with_keywords',
        display: string,
        front: string,
        back: string
    }> = [];

    // for(let i=0; i<Object.keys(state.filterSlice.movie).length; i++){
    //     if(state.filterSlice.movie[Object.keys(state.filterSlice.movie)[i]])
    // }

    Object.keys(state.filterSlice.tv).forEach((key)=>{
        if(key!=='sorting'&&key!=='type'){
            if(oneArr.includes(key)){
                if(state.filterSlice.tv[key]){
                    arr.push({
                        key: key,
                        display: filterDisplay[key],
                        front: state.filterSlice.tv[key],
                        back: state.filterSlice.tv[key]
                    })
                }

            }else if(key === 'with_status'){
                for (let i=0; i<state.filterSlice.tv[key].length; i++){
                    arr.push({
                        key: key,
                        display: filterDisplay[key],
                        front: statusDisplay[state.filterSlice.tv[key][i]],
                        back: state.filterSlice.tv[key][i]
                    })
                }
            }else{
                for (let i=0; i<Object.keys(state.filterSlice.tv[key]).length; i++){
                    arr.push({
                        key: key,
                        display: filterDisplay[key],
                        back: Object.keys(state.filterSlice.tv[key])[i],
                        front: state.filterSlice.tv[key][Object.keys(state.filterSlice.tv[key])[i]]
                    })
                }
            }
        }
    })

    return arr;

}

export const selectFilter = (state: RootState) => state.filterSlice;

export const selectMovieFilter = (state: RootState) => state.filterSlice.movie;
export const selectTVFilter = (state: RootState) => state.filterSlice.tv;

export const {pickOne, pickArray, pickObject, clearFilter, removeButton} = filterSlice.actions;
export default filterSlice.reducer;