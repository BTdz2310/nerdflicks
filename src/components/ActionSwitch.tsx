import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {pickArray, pickObject, pickOne, selectFilter} from "@/store/features/filterSlice/filterSlice";
import useDebounce from "@/utils/useDebounce";
import {isoCF, movieGenre, options} from "@/utils/utils";

interface fetchFilter{
    name: string,
    id: number
}

const checkType = {
    'with_companies': 'company',
    'with_people': 'person',
    'certification': '',
    'release_date': '',
    'vote_average': '',
    'vote_count': '',
    'with_origin_country': '',
    'with_runtime': '',
    'with_genres': '',
    'with_keywords': 'keyword',
    'with_status': '',
    '': ''
}

export const statusDisplay:{
    [id: string]: string
} = {
    '0': 'Sắp Trở Lại',
    '1': 'Đang Lên Kế Hoạch',
    '2': 'Đang Sản Xuất',
    '3': 'Đã Kết Thúc',
    '4': 'Bị Huỷ',
    '5': 'Chiếu Thử',
}

const ActionSwitch = ({content, type}: {type: 'certification' | 'release_date' | 'vote_average' | 'vote_count' | 'with_origin_country' | 'with_companies' | 'with_people' | 'with_runtime' | 'with_genres'| 'with_status' | 'with_keywords' | '', content: 'tv' | 'movie'}) => {

    const selectedFilter = useSelector(selectFilter);
    const dispatch = useDispatch();
    const [searchISO, setSearchISO] = useState('');
    const [searchFetch, setSearchFetch] = useState('');
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState([]);

    const debounce = useDebounce(searchFetch, 200);

    useEffect(()=>{
        if(debounce){
            const loadKeyword = async () => {

                setLoading(true);

                const response = await fetch(`https://api.themoviedb.org/3/search/${checkType[type]}?query=${encodeURI(debounce)}&include_adult=false&language=en-US&page=1`, options);
                const json = await response.json();
                console.log(json)
                setData(json.results);

                setLoading(false);
            }

            loadKeyword();
        }
    }, [debounce])

    useEffect(() => {
        setSearchISO('')
        setSearchFetch('')
        setData([])
    }, [type]);

    console.log(selectedFilter)

    switch (type){
        case 'certification':
            return (
                <>
                    <h2>Phân Loại</h2>
                    <div className="button-list" onWheel={(e)=>e.stopPropagation()}>
                        <div className="button-item">
                            <label><span>Không</span>
                                <input type="radio" checked={selectedFilter[content].certification === 'NR'} onChange={()=>dispatch(pickOne({
                                    head: content,
                                    body: type,
                                    value: 'NR'
                                }))}/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>G</span>
                                <input type="radio" checked={selectedFilter[content].certification === 'G'} onChange={()=>dispatch(pickOne({
                                    head: content,
                                    body: type,
                                    value: 'G'
                                }))}/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>PG</span>
                                <input type="radio" checked={selectedFilter[content].certification === 'PG'} onChange={()=>dispatch(pickOne({
                                    head: content,
                                    body: type,
                                    value: 'PG'
                                }))}/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>PG-13</span>
                                <input type="radio" checked={selectedFilter[content].certification === 'PG-13'} onChange={()=>dispatch(pickOne({
                                    head: content,
                                    body: type,
                                    value: 'PG-13'
                                }))}/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>R</span>
                                <input type="radio" checked={selectedFilter[content].certification === 'R'} onChange={()=>dispatch(pickOne({
                                    head: content,
                                    body: type,
                                    value: 'R'
                                }))}/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>NC-17</span>
                                <input type="radio" checked={selectedFilter[content].certification === 'NC-17'} onChange={()=>dispatch(pickOne({
                                    head: content,
                                    body: type,
                                    value: 'NC-17'
                                }))}/>
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
                            <input type='date' value={selectedFilter[content].release_date1} onChange={(e)=>dispatch(pickOne({
                                head: content,
                                body: 'release_date1',
                                value: e.target.value
                            }))}/>
                        </div>
                        <div className="input-item">
                            <label>Kết Thúc Đến</label>
                            <input type='date' value={selectedFilter[content].release_date2} onChange={(e)=>dispatch(pickOne({
                                head: content,
                                body: 'release_date2',
                                value: e.target.value
                            }))}/>
                        </div>
                        {/*<div style={{display: 'flex', justifyContent: 'end'}}>*/}
                        {/*    <button className='confirm-btn'>Xác Nhận</button>*/}
                        {/*</div>*/}
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
                            <input type='number' step='0.01' style={{width: '80px'}} value={selectedFilter[content].vote_average} onChange={(e)=>dispatch(pickOne({
                                head: content,
                                body: 'vote_average',
                                value: e.target.value
                            }))}/>
                        </div>
                        {/*<div style={{display: 'flex', justifyContent: 'end'}}>*/}
                        {/*    <button className='confirm-btn'>Xác Nhận</button>*/}
                        {/*</div>*/}
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
                            <input type='number' step='1' style={{width: '80px'}} value={selectedFilter[content].vote_count} onChange={(e)=>dispatch(pickOne({
                                head: content,
                                body: 'vote_count',
                                value: e.target.value
                            }))}/>
                        </div>
                        {/*<div style={{display: 'flex', justifyContent: 'end'}}>*/}
                        {/*    <button className='confirm-btn'>Xác Nhận</button>*/}
                        {/*</div>*/}
                        {/*<div className="input-item">*/}
                        {/*    <label>Thấp Hơn</label>*/}
                        {/*    <input type='number' step='0.01' style={{width: '80px'}}/>*/}
                        {/*</div>*/}
                    </div>
                </>
            )
        case 'with_origin_country':
            return (
                <>
                    <h2>Nước Sản Xuất</h2>
                    <input style={{width: '80%', margin: '0 auto'}} type="text" value={searchISO} onChange={(e)=>setSearchISO(e.target.value)} onKeyUp={(e)=>e.preventDefault()}/>
                    <div className="button-list" onWheel={(e)=>e.stopPropagation()}>
                        {isoCF.filter((iso)=>iso.native_name.toLowerCase().includes(searchISO.toLowerCase())).map((iso)=>(
                            <div key={iso.iso_3166_1} className="button-item">
                                <label><span className={`fi fi-${iso.iso_3166_1.toLowerCase()}`}></span><span>{iso.native_name}</span>
                                    <input type="radio" checked={selectedFilter[content].with_origin_country === iso.iso_3166_1.toLowerCase()} onChange={()=>dispatch(pickOne({
                                        head: content,
                                        body: type,
                                        value: iso.iso_3166_1.toLowerCase()
                                    }))}/>
                                </label>
                            </div>
                        ))}
                    </div>
                </>
            )
        case 'with_companies':
            return (
                <>
                    <h2>Công Ty Sản Xuất</h2>
                    <input style={{width: '80%', margin: '0 auto'}} type="text" value={searchFetch} onChange={(e)=>setSearchFetch(e.target.value)} onKeyUp={(e)=>e.preventDefault()}/>
                    {(searchFetch&&data.length>0)&&(
                        <div className='button-list' onWheel={(e)=>e.stopPropagation()}>
                            {data.map((ele: fetchFilter)=>(
                                <div key={ele.id} className="button-item">
                                    <label><span>{`• ${ele.name}`}</span>
                                        <input type="checkbox" checked={Object.keys(selectedFilter[content].with_companies).includes(ele.id.toString())} onChange={()=>dispatch(pickObject({
                                            head: content,
                                            body: type,
                                            value: ele.name,
                                            key: ele.id.toString()
                                        }))}/>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )
        case 'with_people':
            return (
                <>
                    <h2>Đạo Diễn & Diễn Viên</h2>
                    <input style={{width: '80%', margin: '0 auto'}} type="text" value={searchFetch} onChange={(e)=>setSearchFetch(e.target.value)} onKeyUp={(e)=>e.preventDefault()}/>
                    {(searchFetch&&data.length>0)&&(
                        <div className='button-list' onWheel={(e)=>e.stopPropagation()}>
                            {data.map((ele: fetchFilter)=>(
                                <div key={ele.id} className="button-item">
                                    <label><span>{`• ${ele.name}`}</span>
                                        <input type="checkbox" checked={Object.keys(selectedFilter['movie'].with_people).includes(ele.id.toString())} onChange={()=>dispatch(pickObject({
                                            head: content,
                                            body: type,
                                            value: ele.name,
                                            key: ele.id.toString()
                                        }))}/>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )
        case 'with_runtime':
            return (
                <>
                    <h2>Thời Lượng</h2>
                    <div className="input-list">
                        <div className="input-item">
                            <label>Ngắn Hơn (phút)</label>
                            <input type='number' step='1' style={{width: '80px'}} value={selectedFilter[content].with_runtime1} onChange={(e)=>dispatch(pickOne({
                                head: content,
                                body: 'with_runtime1',
                                value: e.target.value
                            }))}/>
                        </div>
                        <div className="input-item">
                            <label>Dài Hơn (phút)</label>
                            <input type='number' step='1' style={{width: '80px'}} value={selectedFilter[content].with_runtime2} onChange={(e)=>dispatch(pickOne({
                                head: content,
                                body: 'with_runtime2',
                                value: e.target.value
                            }))}/>
                        </div>
                        {/*<div style={{display: 'flex', justifyContent: 'end'}}>*/}
                        {/*    <button className='confirm-btn'>Xác Nhận</button>*/}
                        {/*</div>*/}
                    </div>
                </>
            )
        case 'with_keywords':
            return (
                <>
                    <h2>Từ Khoá</h2>
                    <input style={{width: '80%', margin: '0 auto'}} type="text" value={searchFetch} onChange={(e)=>setSearchFetch(e.target.value)} onKeyUp={(e)=>e.preventDefault()}/>
                    {(searchFetch&&data.length>0)&&(
                        <div className='button-list' onWheel={(e)=>e.stopPropagation()}>
                            {data.map((ele: fetchFilter)=>(
                                <div key={ele.id} className="button-item">
                                    <label><span>{`• ${ele.name}`}</span>
                                        <input type="checkbox" checked={Object.keys(selectedFilter[content].with_keywords).includes(ele.id.toString())} onChange={()=>dispatch(pickObject({
                                            head: content,
                                            body: type,
                                            value: ele.name,
                                            key: ele.id.toString()
                                        }))}/>
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )
        case 'with_status':
            return (
                <>
                    <h2>Phân Loại</h2>
                    <div className="button-list" onWheel={(e)=>e.stopPropagation()}>
                        <div className="button-item">
                            <label><span>{statusDisplay['0']}</span>
                                <input type="checkbox" checked={selectedFilter['tv'].with_status.includes('0')} onChange={()=>dispatch(pickArray({
                                    head: content,
                                    body: type,
                                    value: '0'
                                }))}/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>{statusDisplay['1']}</span>
                                <input type="checkbox" checked={selectedFilter['tv'].with_status.includes('1')} onChange={()=>dispatch(pickArray({
                                    head: content,
                                    body: type,
                                    value: '1'
                                }))}/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>{statusDisplay['2']}</span>
                                <input type="checkbox" checked={selectedFilter['tv'].with_status.includes('2')} onChange={()=>dispatch(pickArray({
                                    head: content,
                                    body: type,
                                    value: '2'
                                }))}/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>{statusDisplay['3']}</span>
                                <input type="checkbox" checked={selectedFilter['tv'].with_status.includes('3')} onChange={()=>dispatch(pickArray({
                                    head: content,
                                    body: type,
                                    value: '3'
                                }))}/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>{statusDisplay['4']}</span>
                                <input type="checkbox" checked={selectedFilter['tv'].with_status.includes('4')} onChange={()=>dispatch(pickArray({
                                    head: content,
                                    body: type,
                                    value: '4'
                                }))}/>
                            </label>
                        </div>
                        <div className="button-item">
                            <label><span>{statusDisplay['5']}</span>
                                <input type="checkbox" checked={selectedFilter['tv'].with_status.includes('5')} onChange={()=>dispatch(pickArray({
                                    head: content,
                                    body: type,
                                    value: '5'
                                }))}/>
                            </label>
                        </div>
                    </div>
                </>
            )
        case 'with_genres':
            return (
                <>
                    <h2>Thể Loại</h2>
                    <div className="button-list" onWheel={(e)=>e.stopPropagation()}>
                        {movieGenre.map((mv)=>(
                            <div key={mv.id} className="button-item">
                                <label><span>{mv.name}</span>
                                    <input type="checkbox" checked={Object.keys(selectedFilter[content].with_genres).includes(mv.id.toString())} onChange={()=>dispatch(pickObject({
                                        head: content,
                                        body: type,
                                        value: mv.name,
                                        key: mv.id.toString()
                                    }))}/>
                                </label>
                            </div>
                        ))}
                    </div>
                </>
            )
        default:
            return <></>
    }
}

export default ActionSwitch;