// Example from React DnD example with some tweak - http://react-dnd.github.io/react-dnd/examples-sortable-simple.html

import * as React from "react";
import {
  ConnectDragSource,
  ConnectDropTarget,
  DragSource,
  DragSourceConnector,
  DragSourceMonitor,
  DropTarget,
  DropTargetConnector,
  DropTargetMonitor
} from "react-dnd";
import { findDOMNode } from "react-dom";

import ItemTypes from "./ItemTypes";
import { Img } from "./styles";

const style = {
  backgroundColor: "white",
  border: "1px dashed gray",
  cursor: "move",
  margin: "15px 10px",
  padding: "0.5rem 1rem"
};

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const cardTarget = {
  hover(props, monitor, component) {
    if (!component) {
      return null;
    }
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return;
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }

    // Time to actually perform the action
    props.moveImage(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

class Image extends React.Component {
  componentDidUpdate() {
    if (this.props.didDrop) {
      this.props.doneDrop();
    }
  }
  render() {
    const {
      src,
      isDragging,
      connectDragSource,
      connectDropTarget
    } = this.props;
    const opacity = isDragging ? 0 : 1;

    return (
      connectDragSource &&
      connectDropTarget &&
      connectDragSource(
        connectDropTarget(
          <div style={{ ...style, opacity }}>
            <Img src={src} />
          </div>
        )
      )
    );
  }
}

export default DropTarget(ItemTypes.IMAGE, cardTarget, connect => ({
  connectDropTarget: connect.dropTarget()
}))(
  DragSource(ItemTypes.IMAGE, cardSource, (connect, monitor) => ({
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    didDrop: monitor.didDrop()
  }))(Image)
);
