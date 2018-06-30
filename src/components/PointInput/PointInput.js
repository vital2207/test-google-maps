import React, { Component } from "react";
import PointList from "../PointList/PointList";
import update from "immutability-helper";
import "./style.css";
class PointInput extends Component {
  constructor(props) {
    super(props);
    this.pointInput = React.createRef();
  }
  state = {
    point: "",
    points: [],
    markers: []
  };
  componentDidMount() {
    this.initAutocomplete();
  }
  render() {
    return (
      <div>
        <input
          className="autocomplete"
          ref={this.pointInput}
          placeholder="Введите адрес"
          type="text"
          name="point"
          value={this.state.point}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onKeyPress={this.onKeyPress}

          //   value={this.state.value}
        />
        <PointList
          points={this.state.points}
          onDeleletePoint={this.deletePoint}
          onMovePoint={this.movePoint}
        />
      </div>
    );
  }
  initAutocomplete = () => {
    const autocomplete = new window.google.maps.places.Autocomplete(
      this.pointInput.current,
      { types: ["geocode"] }
    );

    autocomplete.addListener("place_changed", () => {
      const { points } = this.state;
      const place = autocomplete.getPlace();
      for (let i = 0; i < points.length; i++) {
        if (points[i].id === place.id) return;
      }
      if (!place.geometry) return;
      this.addPoint(autocomplete.getPlace());
      this.addMarker(autocomplete.getPlace());
    });
  };
  onBlur = e => {
    this.setState({
      [e.target.name]: ""
    });
  };
  onChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };
  onKeyPress = e => {
    if (e.key === "Enter") {
      console.log("1");
      this.setState({
        [e.target.name]: ""
      });
    }
  };
  addPoint = ({ name, id }) => {
    const place = {
      name,
      id
    };
    this.setState({
      points: [...this.state.points, place]
    });
  };
  addMarker = ({ geometry, id, name }) => {
    const latLng = geometry.location;
    const placeId = id;
    const placeLat = geometry.location.lat();
    const placeLng = geometry.location.lng();
    const placeName = name;

    const marker = new window.google.maps.Marker({
      id: placeId,
      index: placeId,
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

    this.setState({
      markers: [...this.state.markers, marker]
    });

    window.map.setCenter(new window.google.maps.LatLng(placeLat, placeLng));
    window.map.setZoom(13);
    console.log(this.state.markers);
    window.polyline.getPath().setAt(this.state.markers.length - 1, latLng);

    marker.addListener("click", () => {
      infoWindow.setContent(marker.title);
      infoWindow.open(window.map, marker);
    });
    marker.addListener("dragstart", () => infoWindow.close());
    marker.addListener("dragend", () => this.updatePos(marker));
    console.log(marker.id);
  };
  updatePos = marker => {
    const { markers, points } = this.state;
    const latLngs = window.polyline.getPath().getArray();

    for (let i = 0; i < markers.length; i++) {
      if (markers[i].position !== latLngs[i]) {
        latLngs[i] = markers[i].position;
        window.polyline.getPath().setAt(i, latLngs[i]);
      }
    }

    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: marker.position }, results => {
      marker.title = results.length === 0 ? "" : results[0].formatted_address;
      const index = points.findIndex(point => point.id === marker.index);

      this.setState(
        update(this.state, {
          points: { [index]: { name: { $set: marker.title } } }
        })
      );
    });
  };
  deletePoint = id => {
    this.setState({
      points: this.state.points.filter(point => point.id !== id)
    });
    this.deleteMarker(id);
  };
  deleteMarker(id) {
    const { markers } = this.state;
    for (let i = 0; i < markers.length; i++) {
      if (markers[i].id === id) {
        markers[i].setMap(null);
        markers.splice(i, 1);
        window.polyline.getPath().removeAt(i);
      }
    }
    this.setState({
      markers: this.state.markers.filter(marker => marker.id !== id)
    });
  }
  movePoint = (dragIndex, hoverIndex) => {
    const { points } = this.state;
    const dragCard = points[dragIndex];
    console.log("drag card", dragCard);
    this.setState(
      update(this.state, {
        points: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]]
        }
      })
    );
  };
}

export default PointInput;
