import styled, { keyframes } from "styled-components";
import { pure } from "recompose";

export const Img = pure(styled.img`
  width: 300px;
  margin: 5px;
  height: 200px;
  cursor: pointer;
`);

const fallOffSky = keyframes`
  from {
    transform: translateY(-2000px)
  }

  to {
    transform: translateY(100px);
  }
`;

export const SkyScraperWrapper = styled.div`
  top: 0;
  right: 0;
  transform: translateY(100px);
  left: 0;
  display: flex;
  z-index: -999;
  flex-wrap: wrap;
  justify-content: center;
  width: 100vw;
  position: fixed;

  animation: ${fallOffSky} 5s ease-in;
`;

export const ContainerWrapper = styled.div`
  margin-top: 500px;
  width: 100vw;
  justify-content: space-around;
  display: flex;
  flex-wrap: wrap;
`;
