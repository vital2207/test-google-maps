import React, { Component } from "react";
import { findDOMNode } from "react-dom";
import { DragSource, DropTarget } from "react-dnd";
import "./style.css";
const style = {
  border: "1px dashed gray",
  margin: "10px",
  padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "white",
  cursor: "move",
  position: "relative",
  display: "flex",
  justifyContent: "space-between"
};

class Point extends Component {
  render() {
    const {
      name,
      id,
      onDelete,
      connectDragSource,
      connectDropTarget,
      isDragging
    } = this.props;
    const opacity = isDragging ? 0 : 1;
    return connectDragSource(
      connectDropTarget(
        <div style={{ ...style, opacity }}>
          {name}
          <button className="point-btn" onClick={() => onDelete(id)}>
            &times;
          </button>
        </div>
      )
    );
  }
}

const pointSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index
    };
  }
};

const collect = (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
});

const pointTarget = {
  hover(props, monitor, component) {
    if (!component) return null;

    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    if (dragIndex === hoverIndex) {
      return;
    }

    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    const clientOffset = monitor.getClientOffset();

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
    props.onMove(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex;
  }
};

const collectDrop = connect => ({
  connectDropTarget: connect.dropTarget()
});
Point = DragSource("point", pointSource, collect)(Point);
Point = DropTarget("point", pointTarget, collectDrop)(Point);
export default Point;
