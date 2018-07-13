import * as React from "react";
import styled from "styled-components";
import { A } from "../A";

const BannerWrapper = styled.div`
  font-size: 1.5rem;
  text-align: center;
  margin-top: 50px;

  a {
    color: blue;
  }

  @media (min-width: 48rem) {
    font-size: 2rem;
  }
`;

export default function Banner() {
  return (
    <BannerWrapper>
      Made by{" "}
      <A target="_blank" href="https://namnguyen.design">
        Nam Nguyen
      </A>
    </BannerWrapper>
  );
}
