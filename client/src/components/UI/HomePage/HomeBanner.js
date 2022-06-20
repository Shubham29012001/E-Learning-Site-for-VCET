import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./CSS/HomeBanner.css";

class HomepageBanner extends Component {
  render() {
    let text = null;
    let Banner = null;

    if (this.props.img === null) {
      text = (
        <div className="Teacher-banner">
          <p className="Teacher-text">
            Share Your Knowledge
            <br />
            With The World!
          </p>

          <Link to="teacher">
            {" "}
            <button className="createCourse">Create New Course</button>
          </Link>
        </div>
      );
    }

    return (
      <>
        {Banner}
        {text}
      </>
    );
  }
}

export default HomepageBanner;
