import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import Webcam from "react-webcam";
import ModifiedAlert from '../components/alert'
import {
  loadModels,
  getFullFaceDescription,
  createMatcher,
  isFaceDetectionModelLoaded
} from "../api/face";
import DrawBox from "../components/drawBox";
import { JSON_PROFILE } from "../common/profile";

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import { Link, Redirect, BrowserRouter, Route } from "react-router-dom";
import PropTypes from 'prop-types';

const MySwal = withReactContent(Swal)

const WIDTH = 420;
const HEIGHT = 420;
const inputSize = 160;

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

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
      isFaceDetectionEnabled: true,
      mode: null,
      isFaceDetected: false,
      CurrentImage: null,
      redirect: false
    };
  }

  static contextTypes = {
    router: PropTypes.object
  }

  renderRedirect = () => (
    this.context.router.history.push(`/`)
  )

  swtSuccessAlert(SuccessTitle, SuccessMsg) {
    MySwal.fire({
      icon: 'success',
      title: SuccessTitle,
      text: SuccessMsg,
    })
  }
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

  componentWillMount() {
    loadModels();
    this.setInputDevice();
    this.matcher();
  }

  setInputDevice = () => {
    navigator.mediaDevices.enumerateDevices().then(async devices => {
      let inputDevice = await devices.filter(
        device => device.kind === "videoinput"
      );
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

  matcher = async () => {
    const faceMatcher = await createMatcher(JSON_PROFILE.table);
    this.setState({ faceMatcher });
  };

  postCall = async () => {
    const location = await fetch("https://ipapi.co/json/").then((res) => res.json());
    const name = this.state.userName;
    const options = {
      method: "POST",
      headers,
      body: JSON.stringify({
        emailId: name,
        name: name,
        location: location.city,
        entryType: this.state.mode,
        ipAdd: 'N.A.',
        Remarks: 'On-Time',
        timezone:location.timezone
      })
    };

    // const response = await fetch("/api/postData", options);
    const response = await fetch('/api/postData', options)
      .then(res => res.json())
      .catch(err => err.json())
    console.log(response);
    if (response.status === 200) {
      if (this.state.mode === 'CHECK-IN') {
        this.speakMsg(`Welcome ${name}, ! . ! . ! . ! . Have a nice day`)
        this.swtSuccessAlert(`${this.state.mode} Successfull`, `${name} ! you have been checked-in Successfully`)
      }
      else if (this.state.mode === 'CHECK-OUT') {
        this.speakMsg(`Thank you ${name}, ! . ! . ! . !. Thankyou for comming`)
        this.swtSuccessAlert(`${this.state.mode} Successfull`, `${name} ! you have been checked-out Successfully`)
      }
      // this.speakMsg(`Welcome ${name}.. ${this.state.mode} Successfull.. Have a nice day!`)
      // this.swtSuccessAlert(`${this.state.mode} Successfull`, `${name} ! you ${this.state.mode} Successfull`)

      this.renderRedirect();
    } else if (response.status === 500 || response.status === 400) {
      this.swtErrorAlert('Server Error...!', 'Bad Request Sent...!')
      this.renderRedirect();
    }
    else {
      this.swtErrorAlert('User Not Found', 'Kindly Register to Proceed...!')
      this.renderRedirect();
      //alert(`User Not Found. Kindly Register to Proceed...!`)
    }
  }
  handleClick = () => {
    this.setState({
      mode: this.props.location.state.button
    })
    this.postCall();

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
    fetch("/api", options).then(res => res.json())
      .catch(error => console.log(error));;
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
    this.setState({ CurrentImage: this.webcam.current.getScreenshot() });
    if (!!this.webcam.current) {
      await getFullFaceDescription(
        this.state.CurrentImage,
        inputSize
      ).then(fullDesc => this.setState({ fullDesc }));
    }
  };



  getStudentName = async (name) => {
    if (name && name != '' && name != 'unknown') {
      this.setState({ isFaceDetectionEnabled: false })
      this.setState({
        userName: name,
        isFaceDetected: true,
      })
    }
  }

  render() {
    const { fullDesc, faceMatcher, facingMode } = this.state;
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
      <div>
        <div className="row my-4">
          <div className="col-4 offset-4 ">
            <div className="card center mt-4 shadow">
              <div
                className="Camera card-body"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center"
                }}
              >
                <div
                  style={{
                    width: WIDTH,
                    height: HEIGHT
                  }}
                  className="my-2"

                >
                  <div style={{ position: "relative", width: WIDTH }}>

                    {this.state.isFaceDetected ?
                      <div><img id="user" style={{ alignSelf: "center", height: 300 }} src={"https://franchiseinsider.in/wp-content/uploads/2019/05/check.gif"} alt="https://pratian.com" />
                        {clearInterval(this.interval)}</div> :
                      !!videoConstraints ? (
                        <div style={{ position: "absolute" }}>
                          <Webcam
                            audio={false}
                            width={WIDTH}
                            height={HEIGHT}
                            ref={this.webcam}
                            screenshotFormat="image/jpeg"
                            className="shadow-lg"

                            videoConstraints={videoConstraints}
                          />
                        </div>
                      ) : null}
                    {!!fullDesc ? (
                      this.state.isFaceDetectionEnabled && <DrawBox
                        fullDesc={fullDesc}
                        faceMatcher={faceMatcher}
                        imageWidth={WIDTH}
                        boxColor={"blue"}
                        getStudentNameHandler={this.getStudentName}

                      />
                    ) : null}
                  </div>
                </div>
                {this.state.isFaceDetected ?
                  <div className="center my-2">
                    <button style={{ textTransform: "uppercase" }} className="btn btn-primary btn-lg mx-3" onClick={this.handleClick}>{this.props.match.params.buttonName}</button>
                  </div>
                  :
                  <div className="center my-2">
                    <button style={{ textTransform: "uppercase" }} className="disabled btn btn-primary btn-lg mx-3">{this.props.location.state.button}</button>
                  </div>}

              </div>

            </div>

          </div>


        </div>
        {/* <div id="carouselExampleIndicators" className="carousel slide" data-ride="carousel">
       <ol className="carousel-indicators">
         <li data-target="#carouselExampleIndicators" data-slide-to="0" class="active"></li>
         <li data-target="#carouselExampleIndicators" data-slide-to="1"></li>
         <li data-target="#carouselExampleIndicators" data-slide-to="2"></li>
       </ol>
       <div className="carousel-inner">
         <div className="carousel-item active">
                   <span>quote 1</span>
         </div>
         <div className="carousel-item">
         <span>quote 2  </span>
         </div>
         <div className="carousel-item">
         <span>quote 3</span>
         </div>
       </div>
       <a className="carousel-control-prev" href="#carouselExampleIndicators" role="button" data-slide="prev">
         <span className="carousel-control-prev-icon" aria-hidden="true"></span>
         <span className="sr-only">Previous</span>
       </a>
       <a className="carousel-control-next" href="#carouselExampleIndicators" role="button" data-slide="next">
         <span className="carousel-control-next-icon" aria-hidden="true"></span>
         <span className="sr-only">Next</span>
       </a>
     </div> */}
      </div>
    );
  }
}

export default withRouter(NewCam);
