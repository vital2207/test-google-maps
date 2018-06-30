import React, { Component } from "react";
import "./App.css";
import GoogleMap from "./components/map/GoogleMap";
import PointsPanel from "./components/PointsPanel/PointsPanel";
import { DragDropContextProvider } from "react-dnd";
import HTML5Backend from "react-dnd-html5-backend";
const initSettings = {
  lat: -25.344,
  lng: 131.036
};
class App extends Component {
  render() {
    return (
      <div className="App">
        <h1>Тестовое задание FunBox: редактор маршрутов</h1>
        <DragDropContextProvider backend={HTML5Backend}>
          <div className="app-container">
            <PointsPanel />
            <GoogleMap settings={initSettings} />
          </div>
        </DragDropContextProvider>
      </div>
    );
  }
}

export default App;
