import React, { Component } from "react";

const style = {
  width: "90vw",
  height: "75vh",
  marginRight: "10px"
};

class GoogleMap extends Component {
  constructor(props) {
    super(props);
    this.mapRef = React.createRef();
  }

  componentDidMount() {
    this.initMap();
  }
  render() {
    return <div ref={this.mapRef} style={style} />;
  }

  initMap = () => {
    const { lat, lng } = this.props.settings;
    const place = { lat, lng };

    const map = new window.google.maps.Map(this.mapRef.current, {
      zoom: 4,
      center: place
    });

    const polyline = new window.google.maps.Polyline({
      strokeColor: "#FF0000",
      strokeWeight: 2,
      map
    });
    window.map = map;
    window.polyline = polyline;
  };
}
export default GoogleMap;
