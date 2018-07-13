import update from "immutability-helper";
import * as React from "react";
import { DragDropContext } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";

import Image from "./Image";
import { ContainerWrapper } from "./styles";
import SkyScraper from "./SkyScraper";

@DragDropContext(HTML5Backend)
export default class Container extends React.Component {
  static async getInitialProps() {
    const response = await fetch("http://localhost:3000/api/images");
    const { data: images } = await response.json();
    return { images };
  }

  static getDerivedStateFromProps(props, state) {
    if (props.socket && !state.subscribe)
      return { subscribe: true, images: props.images };
    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      firstLoadDone: false,
      subscribe: false,
      subscribed: false,
      animation: true,
      images: [],
      newImages: [
        // ============= TEST NEW IMAGES =================
        {
          id: -999,
          src:
            "https://images.unsplash.com/photo-1530894649581-58df9294379f?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&ixid=eyJhcHBfaWQiOjF9&s=2a7fc04d47f9adc067e817801a32fd4f"
        },
        {
          id: -1000,
          src:
            "https://images.unsplash.com/photo-1531074619134-42c90edc718b?ixlib=rb-0.3.5&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=800&h=600&fit=crop&ixid=eyJhcHBfaWQiOjF9&s=57825536998d5ba68f9384cfa1b0a068"
        }
      ],
      didDrop: false
    };
  }

  doneDrop = () => {
    this.setState({
      didDrop: true
    });
  };

  componentDidMount() {
    this.subscribe();
  }

  componentDidUpdate(prevProps, prevState) {
    this.subscribe();

    if (prevState !== this.state && this.state.didDrop) {
      this.setState({
        didDrop: false
      });
      this.props.socket.emit("images.change", this.state.images);
    }
  }

  subscribe = () => {
    if (this.state.subscribe && !this.state.subscribed) {
      this.props.socket.on("images", this.handleNewImages);
      this.setState({ subscribed: true });
    }
  };

  componentWillUnmount() {
    this.props.socket.off("images", this.handleNewImages);
  }

  handleNewImages = ({ images, type }) => {
    const { firstLoadDone } = this.state;
    if (!firstLoadDone || type === "UPDATE") {
      this.setState(() => ({
        images,
        firstLoadDone: true
      }));
    } else {
      this.setState(() => ({
        newImages: images,
        animation: true
      }));
    }
  };

  doneAnimation = () => {
    const { newImages, images } = this.state;
    this.setState({
      animation: false,
      newImages: [],
      images: newImages.concat(images)
    });
  };

  subscribe = () => {
    if (this.state.subscribe && !this.state.subscribed) {
      this.props.socket.on("images", this.handleNewImages);
      this.setState({ subscribed: true });
    }
  };

  render() {
    const { images, animation, newImages } = this.state;

    return (
      <React.Fragment>
        {animation ? (
          <SkyScraper doneAnimation={this.doneAnimation} images={newImages} />
        ) : null}
        <ContainerWrapper>
          {images.length ? (
            images.map((image, i) => (
              <Image
                doneDrop={this.doneDrop}
                key={image.id}
                index={i}
                id={image.id}
                src={image.src}
                moveImage={this.moveImage}
              />
            ))
          ) : (
            <h1>Loading...</h1>
          )}
        </ContainerWrapper>
      </React.Fragment>
    );
  }

  moveImage = (dragIndex, hoverIndex) => {
    const { images } = this.state;
    const dragImage = images[dragIndex];

    this.setState(
      update(this.state, {
        images: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragImage]]
        }
      })
    );
  };
}
