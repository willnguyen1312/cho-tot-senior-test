import App, { Container } from "next/app";
import React from "react";
import io from "socket.io-client";
import "isomorphic-unfetch";

import styled from "styled-components";

const Wrapper = styled.div`
  display: grid;
  height: 100vh;
  width: 100vw;
  grid-template-rows: 1fr auto;
  -webkit-overflow-scrolling: touch;
`;

const Footer = styled.footer`
  width: 100vw;
  grid-row: 2 / 3;
`;

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

const A = styled.a.attrs({
  rel: "noopener noreferrer",
  target: "_blank"
})`
  color: #000;
  text-decoration: none;
`;

function Banner() {
  return (
    <BannerWrapper>
      Made by{" "}
      <A target="_blank" href="https://namnguyen.design">
        Nam Nguyen
      </A>
    </BannerWrapper>
  );
}

class MyApp extends App {
  static async getInitialProps({ Component, ctx }) {
    let pageProps = {};

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return { pageProps };
  }

  state = {
    socket: null
  };

  componentDidMount() {
    // connect to WS server and listen event
    const socket = io("http://localhost:3000/");
    this.setState({ socket });
  }

  // close socket connection
  componentWillUnmount() {
    this.state.socket.close();
  }

  render() {
    const { Component, pageProps } = this.props;
    return (
      <Container>
        <Wrapper>
          <Component {...pageProps} socket={this.state.socket} />
          <Footer>
            <Banner />
          </Footer>
        </Wrapper>
      </Container>
    );
  }
}

export default MyApp;
