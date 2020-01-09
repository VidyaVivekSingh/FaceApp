import React, { Component } from "react";
import { Route, Router } from "react-router-dom";
import createHistory from "history/createBrowserHistory";
import FaceRecognition from "./views/faceRecognition";
import CameraFaceDetect from "./views/cameraFaceDetect";
import NewCam from "./views/newCam";
import Home from "./views/Home";
import Header from "./components/Header";
import "./App.css";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import "font-awesome/css/font-awesome.min.css";
import AttendanceManagement from "./views/AttendanceManagement";

class App extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
  }

  render() {
    return (
      <div className="App">
        <Router history={createHistory({ basename: process.env.PUBLIC_URL })}>
          <div className="route">
            <Header />
            <Route exact path="/" component={Home} />
            <Route exact path="/photo" component={FaceRecognition} />
            <Route exact path="/camera" component={CameraFaceDetect} />
            <Route exact path="/new" component={NewCam} />
            <Route exact path="/Attendance/:buttonName" render={AttendanceManagement} />
            {/* <Route exact path="/Attendance/:buttonName" render={props => (<AttendanceManagement {...props} />)} /> */}
          </div>
        </Router>
      </div>
    );
  }
}

export default App;
