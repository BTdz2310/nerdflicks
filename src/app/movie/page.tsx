'use client'
import React, {useEffect, useRef, useState} from 'react';
import styled from "styled-components";

const StyledComponent = styled.div`
  width: 100vw;
  height: 1000px;
  padding-top: 100px;
  background-color: #050c0f;
  
  p{
    margin: 0;
  }
`

const StyledContainer = styled.div`
  max-width: 1200px;
  margin: auto;
  
  h1{
    margin-top: 40px;
    font-size: 72px;
  }
  
  .search-text{
    position: relative;
  }
  
  .search-text input{
    background-color: #171717;
    border: 1px solid #acacac;
    border-radius: 8px;
    width: 100%;
    height: 36px;
    margin-top: 40px;
    padding-left: 50px;
  }

  .search-text input:focus{
    outline: none;
  }
  
  .search-text svg{
    position: absolute;
    bottom: 5.5px;
    left: 16px;
  }
`

const FilterList = styled.div`
  
    margin-top: 20px;
  
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
  width: 240px;
  background-color: #171717;
  border-radius: 8px;
  border: 1px solid #cacaca;
  padding: 10px 4px;
  overflow: scroll;
  transition: 0.2s;
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
  width: 240px;
  transition: 0.2s;
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
    flex-grow: 2;
    padding: 10px 20px;
    
  }
  
  .button-item{
    flex-grow: 2;
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
`

const ActionSwitch = (type: string) => {
    switch (type){
        case 'certification':
            return (
                <>
                    <h2>Phân Loại</h2>
                    <div className="button-list">
                        <div className="button-item">
                            <label><span>Không</span>
                                <input type="checkbox"/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>G</span>
                                <input type="checkbox"/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>PG</span>
                                <input type="checkbox"/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>PG-13</span>
                                <input type="checkbox"/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>R</span>
                                <input type="checkbox"/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>NC-17</span>
                                <input type="checkbox"/>
                            </label>
                        </div>
                    </div>
                </>
            )
        case 'release_date':
            return (
                <>
                    <h2>Ngày Sản Xuất</h2>
                    <div className="input-list">
                        <div className="input-item">
                            <label>Bắt Đầu Từ</label>
                            <input type='date'/>
                        </div>
                        <div className="input-item">
                            <label>Kết Thúc Đến</label>
                            <input type='date'/>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'end'}}>
                            <button className='confirm-btn'>Xác Nhận</button>
                        </div>
                    </div>
                </>
            )
        case 'vote_average':
            return (
                <>
                    <h2>Điểm Đánh Giá</h2>
                    <div className="input-list">
                        <div className="input-item">
                            <label>Lớn Hơn</label>
                            <input type='number' step='0.01' style={{width: '80px'}}/>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'end'}}>
                            <button className='confirm-btn'>Xác Nhận</button>
                        </div>
                        {/*<div className="input-item">*/}
                        {/*    <label>Thấp Hơn</label>*/}
                        {/*    <input type='number' step='0.01' style={{width: '80px'}}/>*/}
                        {/*</div>*/}
                    </div>
                </>
            )
        case 'vote_count':
            return (
                <>
                    <h2>Lượt Đánh Giá</h2>
                    <div className="input-list">
                        <div className="input-item">
                            <label>Lớn Hơn</label>
                            <input type='number' step='1' style={{width: '80px'}}/>
                        </div>
                        <div style={{display: 'flex', justifyContent: 'end'}}>
                            <button className='confirm-btn'>Xác Nhận</button>
                        </div>
                        {/*<div className="input-item">*/}
                        {/*    <label>Thấp Hơn</label>*/}
                        {/*    <input type='number' step='0.01' style={{width: '80px'}}/>*/}
                        {/*</div>*/}
                    </div>
                </>
            )
        default:
            return <></>
    }
}

const Page = () => {

    const [searchText, setSearchText] = useState('');
    const [show, setShow] = useState(false);
    const tableRef = useRef(null);
    const [action, setAction] = useState('');

    useEffect(() => {
        if(tableRef.current){
            tableRef.current.addEventListener('wheel', (e:React.ChangeEvent<HTMLInputElement>)=>e.stopPropagation());
            return () => {
                tableRef.current.removeEventListener('wheel', (e:React.ChangeEvent<HTMLInputElement>)=>e.stopPropagation());
            };
        }
    }, []);

    useEffect(() => {
        window.addEventListener('click', () => setShow(false));

        return () => {
            window.removeEventListener('click', () => setShow(false));
        }
    }, []);

    useEffect(()=>{
        if(!show){
            setAction('')
        }
    }, [show])

    return (
        <StyledComponent>
            <StyledContainer>
                <h1>Phim Điện Ảnh</h1>
                <div className='search-text'>
                    <input type="text" value={searchText} onChange={(e)=>setSearchText(e.target.value)}/>
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50" fill='#acacac'>
                        <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
                    </svg>
                </div>
                <FilterList>
                    <button style={{border: show?'1px dotted #acacac':'1px solid #cacaca', backgroundColor: show?'#000':'#171717'}}>
                        <p onClick={(e)=>{
                            e.stopPropagation();
                            setShow(prev=>!prev);
                        }}><i className="fa-solid fa-sliders"></i>
                            Tuỳ chọn</p>
                        <FilterTable ref={tableRef} onClick={(e)=>e.stopPropagation()} style={{visibility: show?'visible':'hidden', maxHeight: show?'210px':'0', opacity: show?'1':'0'}}>
                            <p onClick={()=>setAction('certification')}>Phân Loại<i className="fa-solid fa-chevron-right"></i></p>
                            <p onClick={()=>setAction('release_date')}>Ngày Sản Xuất<i className="fa-solid fa-chevron-right"></i></p>
                            <p onClick={()=>setAction('vote_average')}>Điểm Đánh Giá<i className="fa-solid fa-chevron-right"></i></p>
                            <p onClick={()=>setAction('vote_count')}>Lượt Đánh Giá<i className="fa-solid fa-chevron-right"></i></p>
                            <p>Ngôn Ngữ<i className="fa-solid fa-chevron-right"></i></p>
                            <p>Nước Sản Xuất<i className="fa-solid fa-chevron-right"></i></p>
                            <p>Công Ty Sản Xuất<i className="fa-solid fa-chevron-right"></i></p>
                            <p>Diễn Viên Tham Gia<i className="fa-solid fa-chevron-right"></i></p>
                            <p>Đội Ngũ Tham Gia<i className="fa-solid fa-chevron-right"></i></p>
                            <p>Thời Lượng<i className="fa-solid fa-chevron-right"></i></p>
                            <p>Từ Khoá<i className="fa-solid fa-chevron-right"></i></p>
                        </FilterTable>
                        <ActionTable onClick={(e)=>e.stopPropagation()} style={{height: action?'210px':'0', visibility: show&&action?'visible':'hidden', opacity: show?'1':'0'}}>
                            {ActionSwitch(action)}
                        </ActionTable>
                    </button>
                </FilterList>
            </StyledContainer>
        </StyledComponent>
    );
};

export default Page;