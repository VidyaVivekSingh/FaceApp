import React, { Component } from "react";
import { Link } from "react-router-dom";
import HeaderModified from "../views/exp"

const WIDTH = 420;
const HEIGHT = 420;
const inputSize = 512;


{/*<Link to="/photo">STATIC FACE DETECTION</Link>
          <Link to="/camera">RECOGNITION</Link>*/}
{/* <Link to="/Attendance">ATTENDANCE MANAGEMENT</Link> */ }
class Header extends Component {
  render() {
    return (
      <header>
        <nav class="navbar navbar-expand-lg navbar-light bg-light fixed-top" style={{ background: 'linear-gradient(to left, rgb(65, 73, 96) 40%, rgba(65, 73, 96, 0.63) 60%, rgb(255, 255, 255) 85%)' }}>
          <a class="mx-4 navbar-brand" href="/">
            <img id="pratian" style={{ alignSelf: "center", height: 40 }} src={require("../img/pratian.png")} alt="https://pratian.com" />
          </a>
        </nav>
      </header>
    );
  }
}

export default Header;
