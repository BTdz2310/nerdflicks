'use client'
import React, {useEffect, useState} from 'react';
import PostHead, {formatDateTime} from "@/components/PostHead";
import useSWR from "swr";
import {fetcher, formatCreatedUtc, shortenString} from "@/utils/utils";
import ReactLoading from "react-loading";
import {nowPlayingMovie} from "@/components/type/typeSome";
import {Link} from "next-view-transitions";
import {genreById} from "@/components/GenreIcon";
import AddTo from "@/components/AddTo";
import PostList from "@/components/PostList";
import ErrorPage from 'next/error'
import styled from "styled-components";
import '@/styles/forum.css'

const StyledContainer = styled.div`
  display: flex;
  margin-top: 40px;
  //padding-bottom: 100px;
`

const StyledLeft = styled.div`
  width: 20%;
  padding: 20px;
  
  p{
    padding: 20px 0;
    cursor: pointer;
  }
  
  p:hover{
    text-decoration: underline;
  }
`

const StyledRight = styled.div`
  width: 80%;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 40px;
  
  h2{
    font-size: 40px;
    text-transform: uppercase;
  }
  
  h3{
    font-size: 28px;
    color: rgb(253, 57, 195);
  }
  
  .__updated-post--group{
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  
`

interface updateI{
    title?: string,
    content?: string,
    list_review?: Array<nowPlayingMovie>,
    tags?: Array<string>,
    updated_at: number
}

const Page = ({params}: {params: {id: string}}) => {

    const [updateTime, setUpdateTime] = useState('');

    const { data, error,isLoading } = useSWR(`https://nerdflicks-backend.vercel.app/api/post/${params.id}`, fetcher,
        {
            revalidateIfStale: true,
            revalidateOnFocus: true,
            revalidateOnReconnect: true
        })

    useEffect(() => {
        if(data&&data.post&&data.post.updated_at.length){
            setUpdateTime(Object.keys(formatData(data.post.updated_at)).sort((a, b)=> {
                if (Number(a)>Number(b)) {
                    return -1;
                }
                return 0;
            })[0])
        }
    }, [data]);

    if(isLoading) return (<div className='__loading-container'><ReactLoading type={'spinningBubbles'} color={'white'} height={50} width={50}/></div>)

    const formatData = (data: Array<updateI>) => {
        const dataMap: {
            [id: string]: updateI
        } = {}

        for(let i=0; i<data.length; i++){
            dataMap[data[i].updated_at.toString()] = data[i]
        }

        return dataMap;
    }

    return (
        <>

            {data.post?(
                <div className='main__container'>
                    <div className='main__content'>
                        <PostHead id={params.id}/>
                        {data&&data.post.updated_at.length?<StyledContainer>
                            {/*{console.log(data.post.updated_at)}*/}
                            {/*{console.log(updateTime)}*/}
                            <StyledLeft>
                                {data && Object.keys(formatData(data.post.updated_at)).sort((a, b)=> {
                                    if (Number(a)>Number(b)) {
                                        return -1;
                                    }
                                    return 0;
                                }).map((change: string) => (
                                    <p style={{color: updateTime.toString() === change.toString() ? 'rgb(253, 57, 195)' : 'white'}}
                                       key={change} onClick={()=>setUpdateTime(change)}>{formatDateTime(Number(change))}</p>
                                ))}
                            </StyledLeft>
                            <StyledRight>
                                <h2>Nhật Ký Chỉnh Sửa</h2>
                                {formatData(data.post.updated_at)[updateTime]&&formatData(data.post.updated_at)[updateTime].title&&(<div className="__updated-post--group">
                                    <h3>Tiêu Đề</h3>
                                    <p className="__updated-post--head">{formatData(data.post.updated_at)[updateTime] && formatData(data.post.updated_at)[updateTime].title}</p>
                                </div>)}
                                {formatData(data.post.updated_at)[updateTime]&&formatData(data.post.updated_at)[updateTime].content&&(<div className="__updated-post--group">
                                    <h3>Tiêu Đề</h3>
                                    <p className="__updated-post--head">{formatData(data.post.updated_at)[updateTime] && formatData(data.post.updated_at)[updateTime].content}</p>
                                </div>)}
                                {formatData(data.post.updated_at)[updateTime]&&formatData(data.post.updated_at)[updateTime].list_review!==undefined&&(<div className="__updated-post--group">
                                    <h3>Danh Sách Phim</h3>
                                    <PostList data={formatData(data.post.updated_at)[updateTime].list_review}/>
                                </div>)}
                                {formatData(data.post.updated_at)[updateTime]&&formatData(data.post.updated_at)[updateTime].tags!==undefined&&(<div className="__updated-post--group">
                                    <h3>Danh Sách Tag</h3>

                                    {(formatData(data.post.updated_at)[updateTime].tags||[]).length===0?(
                                        <p>Không Có Tag Nào Được Đính Kèm</p>
                                    ):(
                                    <div className="__post--tag-list">
                                        {(formatData(data.post.updated_at)[updateTime].tags||[]).map((tag: string)=>(<p key={tag}>{tag}</p>))}
                                    </div>)}

                                </div>)}

                            </StyledRight>
                        </StyledContainer>:<p>Không Có Lịch Sử Chỉnh Sửa</p>}
                    </div>
                </div>
            ):<ErrorPage statusCode={404}/>}
        </>
    );
};

export default Page;