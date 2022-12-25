import React, { Component } from "react";
import "./CSS/CourseDesc.css";
import { Link } from "react-router-dom";
import Rating from "./Rating";
import AuthServices from "../../../ApiServices/auth.service";
import Url from "../../../ApiServices/BackendUrl";

class CourseDesc extends Component {
  state = {
    bookmarked: this.props.bookmark,
    CourseId: this.props.CourseId,
    count: 0,
    URL: "https://e-learning-site-for-vcet.onrender.com/",
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    //console.log("state of course desc=",prevState.bookmarked,"props",nextProps.bookmark);

    if (nextProps.bookmark !== prevState.bookmarked && prevState.count === 0) {
      console.log("changing state");
      return {
        bookmarked: nextProps.bookmark,
        count: 7,
      };
    } else return null;
  }

  bookmark = () => {
    let user = localStorage.getItem("userId");

    const fd = new FormData();
    const form = {};

    fd.append("_userID", user);
    fd.append("_id", this.state.CourseId);
    form["_userID"] = user;
    form["_id"] = this.state.CourseId;

    AuthServices.BookMark(this.state.CourseId, this.props.CourseType, form)
      .then((response) => {
        console.log("BookMarked", response);
        //this.setState({bookmarked:true})
        this.setState((prevState) => ({
          bookmarked: !prevState.bookmarked,
          count: 7,
        }));
        console.log(this.state.bookmarked);
      })
      .catch((error) => {
        console.log(error.response);
      });
  };

  render() {
    let classArray = [""];

    if (this.state.bookmarked) {
      classArray = ["bookmarked-color", "fa fa-bookmark"];
    } else {
      classArray = ["fa fa-bookmark-o"];
    }

    return (
      <div className="">
        <p className="Course-title-main">{this.props.title}</p>

        <div className="Course-Rating-section">
          <p>{this.props.rating}</p>
          <div className="RatingStars">
            <Rating
              rating={this.props.rating}
              edit={false}
              specialrating={true}
              CourseId={this.props.CourseId}
            />
          </div>

          <p className="ratingtimesUpdated">
            {" "}
            ( {this.props.ratingtimesUpdated} ratings )
          </p>
          <p className="Duration">Duration - ({this.props.Duration})</p>
        </div>

        <div className="break1"></div>

        <div className="Short-Description">
          <p>{this.props.short_description}</p>
        </div>

        <div className="break2"></div>

        <div className="Course-Teacher-bookmark">
          <div className="Course-teacher-name">
            <p>Created at {this.props.createdat}</p>
            <h2>By {this.props.teacher}</h2>

            <Link
              to={`/chat/?room=${this.state.CourseId}&CourseName=${
                this.props.title
              }&UserName=${localStorage.getItem(
                "userName"
              )}&userId=${localStorage.getItem("userId")}`}
            >
              <h4 className="Course_live_classes">Join Live discussion</h4>
            </Link>
          </div>

          <div className="flex-row">
            <div className="play-btn">
              <a
                href="https://ide.judge0.com/"
                target="_blank"
                rel="noreferrer"
              >
                <i class="fa fa-code" aria-hidden="true"></i>
                <p>Compiler</p>
              </a>
            </div>

            <div className="play-btn">
              <a
                href={this.state.URL + this.props.Resources}
                target="_blank"
                rel="noreferrer"
              >
                <i class="fa fa-download" aria-hidden="true"></i>
                <p>Resources</p>
              </a>
            </div>

            <div className="Bookmarkbtn">
              <i
                onClick={this.bookmark}
                className={classArray.join(" ")}
                aria-hidden="true"
              ></i>
              <p>BookMark</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CourseDesc;
