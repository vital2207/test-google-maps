import React from "react";
import Point from "../Point/Point";
function PointList({ points, onDeleletePoint, onMovePoint }) {
  return (
    <div className="point-list">
      {points &&
        points.map((point, i) => (
          <Point
            key={point.id}
            name={point.name}
            id={point.id}
            index={i}
            onDelete={onDeleletePoint}
            onMove={onMovePoint}
          />
        ))}
    </div>
  );
}

export default PointList;
