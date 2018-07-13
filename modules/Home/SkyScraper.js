import * as React from "react";
import { Img, SkyScraperWrapper } from "./styles";

export default class SkyScraper extends React.Component {
  componentDidMount() {
    setTimeout(() => {
      this.props.doneAnimation();
    }, 5000);
  }

  render() {
    const { images } = this.props;
    return (
      <SkyScraperWrapper>
        {images.map(({ src, id }) => <Img key={id} src={src} />)}
      </SkyScraperWrapper>
    );
  }
}
