'use client'
import React, {useState} from 'react';
import styled from "styled-components";
import FilterDisplay from "@/components/FilterDisplay";
import FilterForm from "@/components/FilterForm";

const StyledComponent = styled.div`
  width: 100vw;
  min-height: 100vh;
  padding-top: 100px;
  background-color: #050c0f;
  
  p{
    margin: 0;
  }
`

const StyledContainer = styled.div`

  .type-check{
    margin-top: 40px;
  }
  
  .type-check p{
    padding: 10px 20px;
    border-radius: 12px;
    border: 1px solid #cacaca;
    cursor: pointer;
  }

  .type-item{
    width: fit-content;
    padding: 4px 8px;
    border-width: 2px;
    border-style: solid;
    border-image: linear-gradient(90deg, rgba(131,58,180,1) 0%, rgba(253,29,29,1) 50%, rgba(252,176,69,1) 100%) 1;
    margin-top: 40px;
  }

  .type-item p{
    font-size: 72px;
    width: fit-content;
    text-transform: uppercase;
    background: -webkit-linear-gradient(#eeaeca, #94bbe9);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
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
    margin-top: 20px;
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

const Page = () => {

    const [searchText, setSearchText] = useState('')

    return (
        <StyledComponent>
            <StyledContainer className='main__content'>
                <FilterForm check='movie' searchText={searchText} setSearchText={setSearchText}></FilterForm>
                <FilterDisplay type='movie' searchText={searchText}></FilterDisplay>
            </StyledContainer>
        </StyledComponent>
    );
};

export default Page;