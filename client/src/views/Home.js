import React, { Component } from "react";
import { Container, Row, Col, ListGroup, ListGroupItem } from 'reactstrap';
import { Link, Router } from "react-router-dom";

export default class Home extends Component {

  render() {
    const WIDTH = document.documentElement.clientWidth;
    return (
      <div _ngcontent-grr-c0="" class="container-fluid">
        <div _ngcontent-grr-c1=""  >
          <div className="row mx-5 my-5">

            <div className="col-12 center my-5">
              <h1 _ngcontent-grr-c1="" style={{ color: "#000" }}>PRATIAN FACIAL RECOGNITION<span
                _ngcontent-grr-c1="" id="version">v1.0</span><span _ngcontent-grr-c1=""
                  id="blinking">_</span></h1>
              <div className="row" style={{ marginTop: 30 }}>
                <div className="col-7" style={{ justifyContent: 'flex-end', display: "flex" }}>
                  <img id="register" style={{ height: 200, width: 200 }} src={"https://hackernoon.com/hn-images/1*Da2AbqNvq58WsO-zGibwXw.png"} alt="Register" />
                </div>
                <div className="col-5" style={{ alignItems: 'center', display: "flex" }}>
                  <h3 _ngcontent-grr-c1="" style={{ color: "#000" }}>New User...?
                  <span _ngcontent-grr-c1="" id="blinking">   </span>
                    <Link to="/new" style={{ fontSize: 20, color: "darkBlue", textDecoration: "underline" }}>register here...</Link>
                  </h3>
                </div>
              </div>

            </div>

          </div>
          <div _ngcontent-grr-c1="" class="container cb">
            <div _ngcontent-grr-c1="" class="row">

              <div _ngcontent-grr-c1="" class="col-6 dashboard-badges">
                <Link to={{
                  pathname: '/Attendance/check-in',
                  state: {
                    button: "CHECK-IN"
                  }
                }}>
                  <div style={{ backgroundColor: "rgba(66, 185, 255, 0.43)" }} _ngcontent-grr-c1="" class="badge-content" tabindex="0">
                    <div _ngcontent-grr-c1="" class="badge-logo">
                      {/* <i _ngcontent-grr-c1="" class="fa fa-3x fa-code icon-color"></i> */}
                      <img id="pratian" style={{ alignSelf: "center", height: 40 }} src={"https://icon-library.net/images/check-in-check-out-icon/check-in-check-out-icon-18.jpg"} alt="https://pratian.com" />
                    </div>
                    <div _ngcontent-grr-c1="" class="badge-header"><span _ngcontent-grr-c1="">CHECK-IN</span></div>
                    <div _ngcontent-grr-c1="" class="badge-desc">
                      {/* <p _ngcontent-grr-c1="">Get verified and continue to your place.</p> */}
                    </div>
                  </div>
                </Link>
              </div>
              <div _ngcontent-grr-c1="" class="col-6 dashboard-badges">
                <Link to={{
                  pathname: '/Attendance/check-out',
                  state: {
                    button: "CHECK-OUT"
                  }
                }}>
                  <div style={{ backgroundColor: "rgba(66, 185, 255, 0.43)" }} _ngcontent-grr-c1="" class="badge-content" routerlink="/Attendance" tabindex="0">
                    <div _ngcontent-grr-c1="" class="badge-logo">
                      <img id="pratian" style={{ alignSelf: "center", height: 40 }} src={"https://icon-library.net/images/check-in-check-out-icon/check-in-check-out-icon-19.jpg"} alt="https://pratian.com" />
                    </div>
                    <div _ngcontent-grr-c1="" class="badge-header"><span _ngcontent-grr-c1="">CHECK-OUT</span></div>
                    <div _ngcontent-grr-c1="" class="badge-desc">
                      {/* <p _ngcontent-grr-c1="">Get verified and continue to your place.</p> */}
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div >
    );
  }
}
