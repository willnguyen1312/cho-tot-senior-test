import styled from "styled-components";

export const Wrapper = styled.div`
  display: grid;
  min-height: 100vh;
  max-width: 100vw;
  grid-template-rows: 1fr auto;
  -webkit-overflow-scrolling: touch;
`;

export const Footer = styled.footer`
  max-width: 100vw;
  grid-row: 2 / 3;
`;
