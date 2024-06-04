'use client'
import { RootState } from "@/store/store";
import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import {nowPlayingMovie} from "@/components/type/typeSome";
import {toast} from "react-toastify";

interface listI{
    [key: string]: Array<nowPlayingMovie>
}

export const setFavorite = createAsyncThunk("userSlice/setFavorite", async (data: {dataList: Array<Object>, token: any}, thunkAPI) => {
    const response = await fetch('https://nerdflicks-backend.vercel.app/api/favorite', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${data.token}`
        },
        body: JSON.stringify(data.dataList)
    })
    const json = await response.json();
    return {
        json,
        status: response.status
    };
});

export const setList = createAsyncThunk("userSlice/setList", async (data: {dataList: listI, token: any}, thunkAPI) => {
    const response = await fetch('https://nerdflicks-backend.vercel.app/api/list', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json; charset=utf-8',
            'Authorization': `Bearer ${data.token}`
        },
        body: JSON.stringify(data.dataList)
    })
    const json = await response.json();
    return {
        json,
        status: response.status
    };
});

interface UserState {
    isLoggedIn: boolean,
    isAdmin: boolean,
    favorite: Array<nowPlayingMovie>,
    list:{
        [key: string]: Array<nowPlayingMovie>
    },
    _id: string,
    username: string,
    avatar: string,
    followers: Array<string>,
    followings: Array<string>
}

const initialState: UserState = {
    isLoggedIn: false,
    isAdmin: false,
    favorite: [],
    list: {},
    _id: '',
    username: '',
    avatar: '',
    followers: [],
    followings: []
}

export const userSlice = createSlice({
    name: 'userSlice',
    initialState,
    reducers: {
        setUser: (state, action) => {
            console.log(action.payload)
            state.isLoggedIn = true;
            state.isAdmin = action.payload.isAdmin;
            state.favorite = action.payload.user.favorite;
            state.list = action.payload.user.list;
            state._id = action.payload.user._id;
            state.username = action.payload.user.username;
            state.avatar = action.payload.user.avatar;
            state.followers = action.payload.user.followers;
            state.followings = action.payload.user.followings;
        },
        logout: (state) => {
            state.isLoggedIn = false;
            state.isAdmin = false;
            state.favorite = [];
            state.list = {};
            state._id = '';
            state.username = '';
            state.avatar = '';
            state.followings = [];
            state.followers = []
            console.log('OUT>>>')
        },
        newList: (state, action) => {
            state.list[action.payload] = [];
        },
        addList: (state, action) => {
            const itemCheck = state.list[action.payload.key].filter((item1: nowPlayingMovie)=>action.payload.value.media_type===item1.media_type&&action.payload.value.id===item1.id);
            if(itemCheck.length){
                state.list[action.payload.key] = state.list[action.payload.key].filter((item1: nowPlayingMovie)=>action.payload.value.media_type!==item1.media_type&&action.payload.value.id!==item1.id);
            }else{
                state.list[action.payload.key].push(action.payload.value)
            }
        },
        addFavorite: (state, action) => {
            const itemCheck = state.favorite.filter((item1: nowPlayingMovie)=>action.payload.media_type===item1.media_type&&action.payload.id===item1.id);
            if(itemCheck.length){
                state.favorite = state.favorite.filter((item1: nowPlayingMovie)=>action.payload.media_type!==item1.media_type&&action.payload.id!==item1.id);
            }else{
                state.favorite.push(action.payload)
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(setFavorite.fulfilled, (state, action) => {
            // console.log(action.payload)
            if(action.payload.status===200){
                // toast.success(action.payload.json.msg);
                state.favorite = action.payload.json.data;
            }else{
                toast.error(action.payload.json.msg);
            }
        });
        builder.addCase(setList.fulfilled, (state, action) => {
            if(action.payload.status===200){
                // toast.success(action.payload.json.msg);
                state.list = action.payload.json.data;
            }else{
                toast.error(action.payload.json.msg);
            }
        });
    }
})

export const selectFollowers = (state: RootState) => state.userSlice.followers;
export const selectFollowings = (state: RootState) => state.userSlice.followings;
export const selectLoggedIn = (state: RootState) => state.userSlice.isLoggedIn;
export const selectAvatar = (state: RootState) => state.userSlice.avatar;
export const selectUsername = (state: RootState) => state.userSlice.username;
export const selectId = (state: RootState) => state.userSlice._id;
export const selectList = (state: RootState) => state.userSlice.list;
export const selectFavorite = (state: RootState) => state.userSlice.favorite;
export const {setUser, logout, newList, addList, addFavorite} = userSlice.actions;
export default userSlice.reducer;