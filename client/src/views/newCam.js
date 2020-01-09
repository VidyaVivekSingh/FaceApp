import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Webcam from "react-webcam";
import {
  loadModels,
  getFullFaceDescription,
  createMatcher,
  isFaceDetectionModelLoaded
} from "../api/face";
import DrawBox from "../components/drawBox";
import { JSON_PROFILE } from "../common/profile";
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';

import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)



const WIDTH = 420;
const HEIGHT = 420;
const inputSize = 512;

const INIT_STATE = {
  url: null,
  imageURL: null,
  fullDesc: null,
  imageDimension: null,
  error: null,
  loading: false
};

class NewCam extends Component {
  constructor(props) {
    super(props);
    this.webcam = React.createRef();
    this.state = {
      ...INIT_STATE,
      noOfPhotos: 0,
      faceArr: [],
      userName: "",
      showDescriptors: false,
      faceMatcher: null,
      facingMode: null,
      isModelLoaded: !!isFaceDetectionModelLoaded(),
      btnClass: "btn btn-primary btn-lg"
    };
  }

  componentWillMount = async () => {
    await loadModels();
    this.setInputDevice();
    this.matcher();
  }

  setInputDevice = () => {
    navigator.getUserMedia = (navigator.getUserMedia || navigator.webKitGetUserMedia || navigator.moxGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);

    navigator.mediaDevices.enumerateDevices().then(async devices => {
      let inputDevice = await devices.filter(
        device => device.kind === "videoinput"
      );
      // var facingMode = "user"; // Can be 'user' or 'environment' to access back or front camera (NEAT!)
      // var constraints = {
      //   audio: false,
      //   video: {
      //     facingMode: facingMode
      //   }
      // };
      // navigator.mediaDevices.getUserMedia(constraints).then(function success(stream) {
      //   let inputDevice = stream;


      if (inputDevice.length < 2) {
        await this.setState({
          facingMode: "user"
        });
      } else {
        await this.setState({
          facingMode: { exact: "environment" }
        });
      }
      this.startCapture();
    });
  };
  disableCapture = () => {
    document.getElementById("captureBtn").disabled = true;
  }

  getStudentName = (name) => {
    // console.log(`${name}`);
    document.getElementById("captureBtn").disabled = false;
  }

  matcher = async () => {
    const faceMatcher = await createMatcher(JSON_PROFILE.table);
    this.setState({ faceMatcher });
  };

  swtErrorAlert(errorTitle, errorMsg) {
    MySwal.fire({
      icon: 'error',
      title: errorTitle,
      text: errorMsg,
    })
  }

  speakMsg(msg) {
    if ('speechSynthesis' in window) {
      // Synthesis support. Make your web apps talk!
      const message = new SpeechSynthesisUtterance();
      var timer = setInterval(function () {
        var voices = window.speechSynthesis.getVoices();
        if (voices.length !== 0) {
          message.voice = voices.filter(function (voice) {
            return voice.name == "Google हिन्दी"
          })[0]; // Note: some voices don't support altering params                
          message.text = msg;
          speechSynthesis.speak(message);
          clearInterval(timer);
        }
      }, 200);
    }
  }

  handleButtonClick = async () => {
    if (!this.state.fullDesc) {
      alert("Camera has no access to recognise your face...!")
    }
    else {

      if (this.state.fullDesc.length != 0 && (!!this.state.fullDesc)) {
        console.log(this.state.fullDesc);
        this.setState(
          {
            faceArr: this.state.faceArr.concat(
              new Float32Array(this.state.fullDesc[0]._descriptor)
            ),
            noOfPhotos: this.state.noOfPhotos + 1
          },
          () => {
            //console.log(this.state.faceArr.length);
            //console.log(this.state.faceArr);
          }
        );
      }
      else {
        this.speakMsg('Face Not Detected');
        this.swtErrorAlert('Face Not Detected!', 'Please Make sure your face will be within Camera');
        console.log("error");
      }
    }

  };

  handleClearClick = async () => {
    this.setState({ noOfPhotos: 0, faceArr: [] }, () => {
      //console.log("Cleared");
      //console.log(this.state.faceArr.length);
      //console.log(this.state.faceArr);
    });
  };

  submitFormHandler = event => {
    this.setState(
      {
        userName: event.target.value
      },
      () => {
        //console.log(this.state.userName);
      }
    );
  };

  handleDoneClick = async () => {
    this.setState({ loading: true, btnClass: "disabled btn btn-primary btn-lg" })
    if (this.state.noOfPhotos >= 10) { this.swtErrorAlert('Number of photos exceeded limit.', 'Please make sure that number of photos should not exceed max limit (10)'); }
    else {

      var key = this.state.userName;
      //var val = this.state.toBeSent;
      var nme = this.state.userName;
      var descrptrs = this.state.faceArr;
      var val = {};
      val["name"] = nme;
      val["descriptors"] = descrptrs;
      var obj = {};
      obj[key] = val;
      this.setState(obj);
      //console.log(obj);
      this.sendData(obj);
    }
  };

  sendData = async obj => {
    let data = obj;
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(data)
    };
    await fetch("/api", options).then(res => res.json())
      .catch(error => console.log(error));;
    this.setState({ loading: false })
    //console.log(options.body);
  };

  startCapture = () => {
    this.interval = setInterval(() => {
      this.capture();
    }, 1500);
  };

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  capture = async () => {
    if (!!this.webcam.current) {
      await getFullFaceDescription(
        this.webcam.current.getScreenshot(),
        inputSize
      ).then(fullDesc => this.setState({ fullDesc }));
    }
  };

  render() {
    const { fullDesc, faceMatcher, facingMode, btnClass } = this.state;
    let videoConstraints = null;
    let camera = "";
    if (!!facingMode) {
      videoConstraints = {
        width: WIDTH,
        height: HEIGHT,
        facingMode: facingMode
      };
      if (facingMode === "user") {
        camera = "Front";
      } else {
        camera = "Back";
      }
    }

    return (
      <div className="container-fluid">
        <div className="row" id="headerInfo">
          <div className="col-12 my-2">
            <div className="row my-2" style={{ alignItems: "center", justifyContent: "center" }}>
              <div className="col-3">
                <h4>Instructions To Follow</h4>
              </div>

              <div className="col-5">
                <div className="row" style={{ alignItems: "center", justifyContent: "center" }}>
                  {/* <div className="col" style={{}}> */}
                  <h4>Camera : {camera}</h4>
                  {/* </div> */}
                  {/* <div className="col" style={{}}> */}
                  {/* <img id="captureBtn" style={{ maxWidth: WIDTH / 8 }} src={require("../img/Capture.png")} alt="imageURL" /> */}
                  {/* </div> */}
                </div>
              </div>

              <div className="col-4" style={{ alignItems: "center", justifyContent: "center" }}>
                <h4>User Registration</h4>
              </div>
            </div>
          </div>
        </div>

        <div className="row my-4 newRegistration">
          <div className="col-3">
            <div className="row">
              <div className="Instruction" style={{ paddingLeft: 40 }}>
                <ListGroup className="card shadow" style={{ textAlign: 'left' }}>
                  <ListGroupItem className='listItem'>1. Stand in Front of Camera</ListGroupItem>
                  <ListGroupItem className='listItem'>2. Capture 2-4 images</ListGroupItem>
                  <ListGroupItem className='listItem'>3. Enter your Email Address</ListGroupItem>
                  <ListGroupItem className='listItem'>4. Click on Submit</ListGroupItem>
                  <ListGroupItem className='listItem'>5. Wait for the confirmation screen</ListGroupItem>
                  <ListGroupItem className='listItem'>6. Click on Reset to start fresh</ListGroupItem>
                </ListGroup>
              </div>
            </div>
          </div>

          <div className="col-9">
            <div className="row">
              <div className="col-7">
                <div className="Camera card shadow mx-2" style={{ alignItems: "center" }}>
                  <div
                    className="mx-0 my-4 center"
                    style={{
                      width: WIDTH,
                      height: HEIGHT
                    }}
                  >
                    <div style={{ position: "absolute", width: WIDTH }}>
                      {!!videoConstraints ? (
                        <div style={{ position: "absolute" }}>
                          <Webcam
                            audio={false}
                            width={WIDTH}
                            height={HEIGHT}
                            ref={this.webcam}
                            screenshotFormat="image/jpeg"
                            videoConstraints={videoConstraints}
                            className="shadow-lg"
                            style={{}}
                          />
                        </div>
                      ) : null}
                      {!!fullDesc ? (
                        <DrawBox
                          fullDesc={fullDesc}
                          faceMatcher={faceMatcher}
                          imageWidth={WIDTH}
                          boxColor={"blue"}
                          getStudentNameHandler={this.getStudentName}
                          disableCapture={this.disableCapture}

                        />
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4 card center shadow mx-2">
                <div className="row center my-2" style={{ justifyContent: 'center' }}>
                  <div className="col-12 center my-2">
                    USER DATA
                    </div>
                  <hr />
                  <form>
                    <div className="form-group">
                      <input
                        type="email"
                        name="username"
                        className="form-control"
                        id="exampleFormControlInput2"
                        placeholder="Email : name@example.com"
                        value={this.state.userName}
                        onChange={this.submitFormHandler}
                      />
                    </div>
                  </form>
                </div>
                <div className="row center">
                  <div className="my-2 col-12 center" >
                    {this.state.fullDesc ?
                      <button id="captureBtn" className="btn btn-primary btn-lg" onClick={this.handleButtonClick}>Start Capture</button> :
                      <button id="captureBtn" className="disabled btn btn-primary btn-lg">Start Capture</button>}
                  </div>
                  <div className="my-2 col-12 center">
                    <h4>{this.state.noOfPhotos}/07 <small className="text-muted">Photos Captured</small> </h4>
                  </div>
                </div>
                <hr />
                <div className="row center">
                  {this.state.noOfPhotos >= 7 ? <div className="col">
                    <button disabled={this.state.loading} className={btnClass} onClick={this.handleDoneClick}>Submit</button>
                  </div> : <div className="col">
                      <button className="disabled btn btn-success btn-lg">Submit</button>
                    </div>}
                  <div className="col">
                    <button className="btn btn-info btn-lg" onClick={this.handleClearClick}>Reset <i className="fa fa-spinner"></i></button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withRouter(NewCam);
