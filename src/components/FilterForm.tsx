'use client'
import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";
import {useDispatch, useSelector} from "react-redux";
import {pickOne, selectFilter, selectMovieFilter} from "@/store/features/filterSlice/filterSlice";
import ActionSwitch from "@/components/ActionSwitch";

const FilterList = styled.div`
    flex-grow: 2;
  z-index: 100;
  
    button{
      background-color: inherit;
      border: 1px solid #cacaca;
      //padding: 6px 12px;
      border-radius: 8px;
      cursor: pointer;
      position: relative;
      //overflow: hidden;
    }
  
    button p:hover{
      background-color: #373737!important;
    }
  
    button p{
      padding: 6px 12px;
      border-radius: 8px;
    }
    
    button i{
      padding-right: 10px;
    }
  
`

const FilterTable = styled.div`
  position: absolute;
  display: flex;
  top: 40px;
  left: 0;
  opacity: 0;
  flex-direction: column;
  width: 320px;
  background-color: #171717;
  border-radius: 8px;
  border: 1px solid #cacaca;
  padding: 10px 4px;
  overflow: scroll;
  //transition: 0.2s;
  max-height: 0;
  
  p{
    text-align: left;
    font-size: 16px;
    padding: 8px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  p:hover{
    //text-decoration: underline;
    background-color: #272727;
  }
  
`

const ActionTable = styled.div`
  //width: 0;
  position: absolute;
  top: 40px;
  left: 0;
  border: 1px solid #cacaca;
  width: 320px;
  //transition: 0.2s;
  opacity: 0;
  border-radius: 8px;
  height: 0;
  z-index: 100;
  background-color: #171717;
  display: flex;
  flex-direction: column;
  //border: 1px solid #cacaca;
  
  h2{
    padding: 10px 0;
    text-transform: uppercase;
  }
  
  .button-list{
    display: flex;
    flex-direction: column;
    //flex-grow: 2;
    gap: 10px;
    padding: 10px 20px;
    overflow: scroll;
  }
  
  .button-item{
    //flex-grow: 2;
  }

  .button-item label{
    display: flex;
    justify-content: space-between;
    font-size: 16px;
    cursor: pointer;
  }
  
  .input-list{
    padding-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .input-item{
    padding: 0 10px;
    display: flex;
    justify-content: space-between;
  }
  
  .confirm-btn{
    width: fit-content;
    padding: 8px 16px;
    background-color: cadetblue;
    margin-right: 10px;
    text-align: right;
    justify-self: end;
  }
  
  span{
    text-align: left;
  }
`

const FilterDiv = styled.div`
  display: flex;
  margin-top: 20px;
  gap: 40px;
  align-items: center;
  
  .sort-div select{
    padding: 5px 10px;
    border-radius: 8px;
    border: 1px solid #acacac;
  }
`

const FilterForm = ({check}: {check: 'tv'|'movie'}) => {

    const [searchText, setSearchText] = useState('');
    const [show, setShow] = useState(false);
    const tableRef = useRef(null);
    const [action, setAction] = useState<'certification' | 'release_date' | 'vote_average' | 'vote_count' | 'with_origin_country' | 'with_companies' | 'with_people' | 'with_runtime' | 'with_genres' | 'with_keywords' | 'with_status' | ''>('');
    const dispatch = useDispatch();
    const selectedFilter = useSelector(selectFilter);

    useEffect(() => {
        window.addEventListener('click', () => {
            setShow(false)
        });

        return () => {
            window.removeEventListener('click', () => {
                setShow(false)
            });
        }
    }, []);

    useEffect(()=>{
        if(!show){
            setAction('')
        }
    }, [show])

    return (
        <>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                    <h1>{check==='movie'?'Phim Điện Ảnh':'Phim Truyền Hình'}</h1>
                    {check==='movie'?(
                        <div className="type-item" style={{borderImage: 'linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%) 1'}}>
                            <p>Movie</p>
                        </div>
                    ):(
                        <div className="type-item" style={{borderImage: 'linear-gradient(to right, darkblue, darkorchid) 1'}}>
                            <p>tv</p>
                        </div>
                    )}
                </div>
                {check==='movie'?(
                    <div className='type-check' style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <p onClick={()=>dispatch(pickOne({
                            head: 'movie',
                            body: 'type',
                            value: 'all'
                        }))}>Tất Cả</p>
                        <p onClick={()=>dispatch(pickOne({
                            head: 'movie',
                            body: 'type',
                            value: 'now_playing'
                        }))}>Đang Chiếu Rạp</p>
                        <p onClick={()=>dispatch(pickOne({
                            head: 'movie',
                            body: 'type',
                            value: 'popular'
                        }))}>Phổ Biến</p>
                        <p onClick={()=>dispatch(pickOne({
                            head: 'movie',
                            body: 'type',
                            value: 'top_rated'
                        }))}>Được Đánh Giá Cao</p>
                        <p onClick={()=>dispatch(pickOne({
                            head: 'movie',
                            body: 'type',
                            value: 'upcoming'
                        }))}>Sắp Ra Mắt</p>
                    </div>
                ):(
                    <div className='type-check' style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                        <p onClick={()=>dispatch(pickOne({
                            head: 'tv',
                            body: 'type',
                            value: 'all'
                        }))}>Tất Cả</p>
                        <p onClick={()=>dispatch(pickOne({
                            head: 'tv',
                            body: 'type',
                            value: 'airing_today'
                        }))}>Tập Mới Hôm Nay</p>
                        <p onClick={()=>dispatch(pickOne({
                            head: 'tv',
                            body: 'type',
                            value: 'on_the_air'
                        }))}>Đang Phát Sóng</p>
                        <p onClick={()=>dispatch(pickOne({
                            head: 'tv',
                            body: 'type',
                            value: 'popular'
                        }))}>Phổ Biến</p>
                        <p onClick={()=>dispatch(pickOne({
                            head: 'tv',
                            body: 'type',
                            value: 'top_rated'
                        }))}>Được Đánh Giá Cao</p>
                    </div>
                )}
                <div className='search-text'>
                    <input type="text" placeholder='Nhập Tiêu Đề ...' value={searchText} onChange={(e)=>setSearchText(e.target.value)}/>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50" fill='#acacac'>
                        <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
                    </svg>
                </div>
                {selectedFilter[check].type==='all'&&(
                    <FilterDiv>
                        <FilterList>
                            <button style={{border: show?'1px dotted #acacac':'1px solid #cacaca', backgroundColor: show?'#000':'#171717'}}>
                                <p onClick={(e)=>{
                                    e.stopPropagation();
                                    setShow(prev=>!prev);
                                }}><i className="fa-solid fa-sliders"></i>
                                    Tuỳ chọn</p>
                                <FilterTable onWheel={(e)=>e.stopPropagation()} ref={tableRef} onClick={(e)=>e.stopPropagation()} style={{visibility: show?'visible':'hidden', maxHeight: show?'220px':'0', opacity: show?'1':'0'}}>
                                    <p onClick={()=>setAction('certification')}>Phân Loại<i className="fa-solid fa-chevron-right"></i></p>
                                    {check==='tv'&&(
                                        <p onClick={()=>setAction('with_status')}>Trạng Thái<i className="fa-solid fa-chevron-right"></i></p>
                                    )}
                                    <p onClick={()=>setAction('release_date')}>Ngày Ra Mắt<i className="fa-solid fa-chevron-right"></i></p>
                                    <p onClick={()=>setAction('vote_average')}>Điểm Đánh Giá<i className="fa-solid fa-chevron-right"></i></p>
                                    <p onClick={()=>setAction('vote_count')}>Lượt Đánh Giá<i className="fa-solid fa-chevron-right"></i></p>
                                    <p onClick={()=>setAction('with_origin_country')}>Nước Sản Xuất<i className="fa-solid fa-chevron-right"></i></p>
                                    <p onClick={()=>setAction('with_companies')}>Công Ty Sản Xuất<i className="fa-solid fa-chevron-right"></i></p>
                                    {check==='movie'&&(
                                        <p onClick={()=>setAction('with_people')}>Đạo Diễn & Diễn Viên<i className="fa-solid fa-chevron-right"></i></p>
                                    )}
                                    <p onClick={()=>setAction('with_runtime')}>Thời Lượng<i className="fa-solid fa-chevron-right"></i></p>
                                    <p onClick={()=>setAction('with_genres')}>Thể Loại<i className="fa-solid fa-chevron-right"></i></p>
                                    <p onClick={()=>setAction('with_keywords')}>Từ Khoá<i className="fa-solid fa-chevron-right"></i></p>
                                </FilterTable>
                                <ActionTable onClick={(e)=>e.stopPropagation()} style={{height: action?'220px':'0', visibility: show&&action?'visible':'hidden', opacity: show?'1':'0'}}>
                                    <ActionSwitch type={action} content={check}></ActionSwitch>
                                </ActionTable>
                            </button>
                        </FilterList>
                        <div className="sort-div">
                            <select name="sort" value={selectedFilter[check].sorting} onChange={(e)=>dispatch(pickOne({
                                head: check,
                                body: 'sorting',
                                value: e.target.value
                            }))}>
                                <option value="popularity.asc">Độ Phổ Biến (Tăng Dần)</option>
                                <option value="popularity.desc">Độ Phổ Biến (Giảm Dần)</option>
                                <option value="title.asc">Tiêu Đề (A-Z)</option>
                                <option value="title.desc">Tiêu Đề (Z-A)</option>
                                <option value="vote_average.asc">Điểm Trung Bình (Tăng Dần)</option>
                                <option value="vote_average.desc">Điểm Trung Bình (Giảm Dần)</option>
                                <option value="vote_count.asc">Số Lượng Vote (Tăng Dần)</option>
                                <option value="vote_count.desc">Số Lượng Vote (Giảm Dần)</option>
                            </select>
                        </div>
                    </FilterDiv>
                )}
            </>
    );
};

export default FilterForm;