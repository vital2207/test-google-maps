import { ADD_MARKER, DELETE_MARKER } from "./types";

const markers = [];

export function addMarker(pointObj) {
  const latLng = pointObj.geometry.location;
  const placeId = pointObj.id;
  const placeLat = pointObj.geometry.location.lat();
  const placeLng = pointObj.geometry.location.lng();
  const placeName = pointObj.name;
  const payload = {
    placeLat,
    placeLng,
    placeId
  };
  const marker = new window.google.maps.Marker({
    id: placeId,
    position: latLng,
    draggable: true,
    map: window.map,
    animation: window.google.maps.Animation.DROP,
    title: placeName
  });
  const infoWindow = new window.google.maps.InfoWindow({
    content: `<div>${marker.title}</div>`,
    maxWidth: 200
  });
  marker.addListener("click", () => {
    infoWindow.setContent(marker.title);
    infoWindow.open(window.map, marker);
  });
  marker.addListener("dragstart", () => infoWindow.close());
  marker.addListener("dragend", () => updatePos(marker));
  markers.push(marker);
  console.log(markers[0].position.lat());
  window.map.setCenter(new window.google.maps.LatLng(placeLat, placeLng));
  window.map.setZoom(13);

  window.polyline.getPath().setAt(markers.length - 1, latLng);
  return {
    type: ADD_MARKER,
    payload
  };
}
export function updatePos(marker) {
  const latLngs = window.polyline.getPath().getArray();

  for (let i = 0; i < markers.length; i++) {
    if (markers[i].position !== latLngs[i]) {
      latLngs[i] = markers[i].position;
      window.polyline.getPath().setAt(i, latLngs[i]);
      console.log(markers[i].position);
      console.log(latLngs[i].lat());
    }
  }
  const geocoder = new window.google.maps.Geocoder();
  geocoder.geocode({ location: marker.position }, results => {
    marker.title = results.length === 0 ? "" : results[0].formatted_address;
  });
}
export function deleteMarker(id) {
  for (let i = 0; i < markers.length; i++) {
    if (markers[i].id === id) {
      markers[i].setMap(null);
      markers.splice(i, 1);
      window.polyline.getPath().removeAt(i);
    }
  }

  return {
    type: DELETE_MARKER,
    payload: id
  };
}
