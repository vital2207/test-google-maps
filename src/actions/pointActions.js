import { ADD_POINT, DELETE_POINT } from "./types";
export function addPoint(pointObj) {
  const placeName = pointObj.name;
  const placeId = pointObj.id;
  const placeObj = {
    placeName,
    placeId
  };

  return {
    type: ADD_POINT,
    payload: placeObj
  };
}
export function deletePoint(id) {
  return {
    type: DELETE_POINT,
    payload: id
  };
}
