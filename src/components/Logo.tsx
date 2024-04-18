import React from 'react';
import styled from "styled-components";

const StyledContainer = styled.div`
  
  z-index: 50;

  @keyframes animate{
    100%{
      height: 100%;
    }
  }

  .logo_container{
    height: 36px;
    width: 21px;
    background: inherit;
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .logo__left{
    position: absolute;
    height: 0;
    width: 7px;
    background-color: red;
    left: 0;
    bottom: 0;
    animation: animate 0.5s linear forwards;
    animation-delay: 0s;
  }

  .logo__center{
    position: absolute;
    height: 0;
    width: 7px;
    transform: skew(20deg);
    background-color: red;
    box-shadow: -10px -10px 30px black;
    top: 0;
    left: 0;
    transform-origin: left top;
    z-index: 10;
    animation: animate 0.5s linear forwards;
    animation-delay: 0.5s;
  }

  .logo__right{
    position: absolute;
    height: 0;
    width: 7px;
    background-color: red;
    bottom: 0;
    right: 0;
    animation: animate 0.5s linear forwards;
    animation-delay: 1s;
  }
`

const Logo = () => {
    return (
        <StyledContainer>
            <div className="logo_container">
                <div className="logo__left"></div>
                <div className="logo__center"></div>
                <div className="logo__right"></div>
            </div>
        </StyledContainer>
    );
};

export default Logo;