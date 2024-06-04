'use client'
import React, {useEffect, useRef, useState} from 'react';
import "@/styles/details.css";
import styled from "styled-components";
import {
    addFavorite,
    addList,
    newList,
    selectFavorite,
    selectList,
    setFavorite,
    setList
} from "@/store/features/userSlice/userSlice";
import {useDispatch, useSelector} from "react-redux";
import {toast} from "react-toastify";
import {nowPlayingMovie} from "@/components/type/typeSome";
import {useCookies} from "next-client-cookies";
import {ThunkDispatch} from "@reduxjs/toolkit";
import {usePathname, useRouter} from "next/navigation";
import {store} from "@/store/store";
import {useSWRConfig} from "swr";

interface listI{
    [key: string]: Array<nowPlayingMovie>
}

const AddTo = ({id, media, data}: {id: number, media: 'tv'|'movie', data: nowPlayingMovie}) => {

    const [show, setShow] = useState(false);
    const [showAdd, setShowAdd] = useState(false);
    const [newName, setNewName] = useState('');
    const [tempList, setTempList] = useState<listI>({});

    const {mutate} = useSWRConfig()

    const pathname = usePathname();

    console.log(store.getState())

    const dispatch = useDispatch<ThunkDispatch<any, any, any>>();
    const cookies = useCookies();
    const router = useRouter();

    const selectedList = useSelector(selectList);
    const selectedFavorite = useSelector(selectFavorite);

    useEffect(() => {
        if(!show){
            setShowAdd(false);
            setNewName('')
        }
    }, [show]);

    useEffect(()=>{
        setTempList(selectedList)
    }, [])

    const handleNew = () => {
        if(Object.keys(selectedList).includes(newName)){
            toast.error('Tên Đã Tồn Tại');
            return;
        }
        setTempList({
            ...tempList,
            [newName]: []
        })
        setShowAdd(false);
        setNewName('');
    }

    const checkInclude = (key: string) => {
        const itemCheck = tempList[key].filter((item1: nowPlayingMovie)=>media===item1.media_type&&id.toString()===item1.id.toString());
        return !!itemCheck.length;
    }

    const checkInclude2 = () => {
        const itemCheck = selectedFavorite.filter((item1: nowPlayingMovie)=>media===item1.media_type&&id.toString()===item1.id.toString());
        return !!itemCheck.length;
    }

    const handleAdd = (str: string) => {
        const itemCheck = tempList[str].filter((item1: nowPlayingMovie)=>media===item1.media_type&&id.toString()===item1.id.toString());
        if(itemCheck.length){
            setTempList({
                ...tempList,
                [str]: tempList[str].filter((item1: nowPlayingMovie)=>media!==item1.media_type||id!==item1.id)
            })
        }else{
            setTempList({
                ...tempList,
                [str]: [
                    ...tempList[str],
                    {
                        ...data,
                        media_type: media
                    }
                ]
            })
        }
    }

    const handleList = async () => {
        if(!cookies.get('token')){
            router.push(`/login?from=${encodeURIComponent(pathname)}`)
            return;
        }
        const response = await dispatch(setList({
            dataList: tempList,
            token: cookies.get('token')
        }));
        await mutate('http://localhost:5001/api/notifications')
        setShow(false);
    }

    const handleFavorite = async () => {
        if(!cookies.get('token')){
            router.push(`/login?from=${encodeURIComponent(pathname)}`)
            return;
        }
        const itemCheck = selectedFavorite.filter((item1: nowPlayingMovie)=>media===item1.media_type&&id.toString()===item1.id.toString());
        let dataList: Array<Object> = [];
        if(itemCheck.length){
            dataList = selectedFavorite.filter((item1: nowPlayingMovie)=>media!==item1.media_type||id.toString()!==item1.id.toString());
        }else{
            dataList = [
                ...selectedFavorite,
                {
                    ...data,
                    media_type: media
                }
            ]
        }
        const response = await dispatch(setFavorite({
            dataList,
            token: cookies.get('token')
        }));

        await mutate('http://localhost:5001/api/notifications')
    }

    return (
        <div className='addTo__container'>
            <button onClick={()=>handleFavorite()} style={{color: checkInclude2() ? 'rgb(253, 57, 195)' : 'white'}}>
                <i className="fa-solid fa-heart"></i>
            </button>
            <button onClick={()=>{
                if(!cookies.get('token')){
                    router.push(`/login?from=${encodeURIComponent(pathname)}`)
                    return;
                }
                setShow(prev=>!prev);
            }}>
                <i className="fa-solid fa-list"></i>
                <div className='addTo__table' style={{visibility: show ? 'visible' : 'hidden'}} onClick={(e)=>e.stopPropagation()}>
                    <h2>Thêm vào danh sách</h2>
                    <div style={{display: 'flex', justifyContent: 'space-between'}}>
                        <p onClick={()=>setShowAdd(prev=>!prev)} style={{fontSize: '12px', padding: '4px 8px', border: '1px solid white', borderRadius: '8px', width: 'fit-content', cursor: 'pointer'}}><i className="fa-solid fa-plus" style={{paddingRight: '5px'}}></i>Mới</p>
                        <input value={newName} onChange={(e)=>setNewName(e.target.value)} type="text" placeholder='Nhập tên...' style={{visibility: showAdd ? 'visible' : 'hidden'}}/>
                        <p style={{fontSize: '12px', padding: '4px 8px', border: '1px solid white', borderRadius: '8px', width: 'fit-content', cursor: 'pointer', visibility: showAdd ? 'visible' : 'hidden'}} onClick={()=>handleNew()}>Thêm</p>
                    </div>
                    <div className="addTo__list" onWheel={(e)=>e.stopPropagation()}>
                        {Object.keys(tempList).map((key: string)=>(
                            <label key={key}>{key}
                                <input type="checkbox" checked={checkInclude(key)} onChange={()=>handleAdd(key)}/>
                            </label>
                        ))}
                    </div>
                    <div className="addTo__button">
                        <p style={{fontSize: '12px', padding: '4px 8px', border: '1px solid white', borderRadius: '8px', width: 'fit-content', cursor: 'pointer', backgroundColor: 'darkcyan'}} onClick={()=>handleList()}>Xác Nhận</p>
                    </div>
                </div>
            </button>
        </div>
    );
};

export default AddTo;