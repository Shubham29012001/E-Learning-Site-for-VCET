import React, { Component } from "react";
import "./CSS/CoursePage.css";
import { NavLink, Redirect } from "react-router-dom";
import CourseDesc from "./CourseDesc";
import CourseVideo from "./CourseVideo";
import axios from "../../../ApiServices/axiosUrl";
import VideoList from "./VideoList";
import Layout from "../../Layout/Layout";
import parse from "html-react-parser";
import ProgressBar from "react-bootstrap/ProgressBar";
import AuthServices from "../../../ApiServices/auth.service";
import Rating from "./Rating";

class CoursePage extends Component {
  state = {
    CourseId: this.props.match.params.Courseid,
    CourseType: this.props.match.params.Course,
    VideoURL: null,
    CoursesInfo: null,
    VideoInfo: null,
    Videotitle: null,
    loading: true,
    token: localStorage.getItem("user"),
    redirect: null,
    CurrentVideo: [],
    playing: false,
    PlayButton: "fa fa-play-circle",
    progress: 0,
    index: 0,
    WatchedVideoCount: 0,
    bookmark: false,
    video0: true,
    video1: false,
    video2: false,
    video3: false,
    video4: false,
    videoCount: 0,
    Message: "",
    video0Completed: false,
    video1Completed: false,
    video2Completed: false,
    video3Completed: false,
    video4Completed: false,
    video0Duration: "0",
    video1Duration: "0",
    video2Duration: "0",
    video3Duration: "0",
    video4Duration: "0",
    Duration: null,
    Resources: null,
    module: false,
    courseMessage: null,
    ongoingMessage: null,
  };

  componentDidMount() {
    AuthServices.FetchCourses(this.state.CourseType, this.state.CourseId)
      .then((response) => {
        // console.log("CoursePage Response", response);

        this.setState({
          videoCount: response.data.course.videoContent.length,
          CoursesInfo: response.data.course,
          CurrentVideo: response.data.course.videoContent,
          Resources: response.data.course.zipurl,
          loading: false,
        });

        let count = 0;
        for (let j in response.data.course.videoContent) {
          for (let i in response.data.course.videoContent[j].usersWatched) {
            if (
              localStorage.getItem("userId") ===
              response.data.course.videoContent[j].usersWatched[i]
            ) {
              this.setState({ ["video" + j + "Completed"]: true });
              count += 1;

              break;
            }
          }
        }

        let progress =
          (count / this.state.CoursesInfo.videoContent.length) * 100;
        this.setState({ WatchedVideoCount: count, progress: progress });

        if (this.state.progress === 100) {
          AuthServices.CourseCompleted(
            this.state.CourseId,
            localStorage.getItem("userId")
          )
            .then((courseCompleted) => {
              this.setState({
                courseMessage: courseCompleted.data.courseMessage,
              });
              console.log(this.state.courseMessage);
            })
            .catch((error) => {
              console.log(error.Message);
            });

          AuthServices.Certificate(
            this.state.CoursesInfo.title,
            localStorage.getItem("userName")
          )
            .then((response) => {
              this.setState({
                Message: response.data.message,
                module: response.data.module,
              });
            })
            .catch((error) => {
              console.log(error.message);
            });
        }
      })
      .catch((error) => {
        console.log(error.response);

        if (error.response.status === 500) {
          localStorage.clear();
          this.setState({ redirect: "/login" });
        }
      });
  }

  VideochangeHandler = (event, video, index, playing) => {
    let VideoNumber = "video" + index;
    this.setState({ CurrentVideo: video });
    this.setState({ index: index });

    // this.setState({[VideoNumber]:!this.state[VideoNumber]})

    for (let i = 0; i < 5; i++) {
      if (i === index) {
        this.setState({ [VideoNumber]: true });
      } else {
        this.setState({ ["video" + i]: false });
      }
    }

    if (playing) {
      this.setState({ playing: true });
    } else {
      this.setState({ playing: false });
    }
  };

  videoCompleted = (index) => {
    if (!this.state["video" + index + "Completed"]) {
      this.setState((prevState) => ({
        WatchedVideoCount: prevState.WatchedVideoCount + 1,
      }));

      const form = {};
      form["courseId"] = this.state.CourseId;
      form["userId"] = localStorage.getItem("userId");
      form["videoId"] = this.state.CoursesInfo.videoContent[index]._id;
      // console.log(form["videoId"]);
      AuthServices.OngoingInformation(
        this.state.CourseId,
        localStorage.getItem("userId"),
        this.state.progress,
        localStorage.getItem("userName"),
        localStorage.getItem("email")
      )
        .then((ongoingInformation) => {
          this.setState({
            ongoingMessage: ongoingInformation.data.ongoingInformation,
          });
          console.log(this.state.ongoingMessage);
        })
        .catch((error) => {
          console.log(error.Message);
        });

      axios
        .post("/watchedByuser", form)

        .then((response) => {
          console.log("Video information sent Response", response);
        })

        .catch((error) => {
          console.log(error.response);
          if (error.response.data.message === "jwt malformed")
            if (error.response.status === 500)
              this.setState({ redirect: "/login" });
        });
    }

    let progress =
      (this.state.WatchedVideoCount /
        this.state.CoursesInfo.videoContent.length) *
      100;
    this.setState({ progress: progress });

    this.setState({ ["video" + index + "Completed"]: true });

    if (!this.state["video" + index + "Completed"]) {
      AuthServices.OngoingInformation(
        this.state.CourseId,
        localStorage.getItem("userId"),
        this.state.progress,
        localStorage.getItem("userName"),
        localStorage.getItem("email")
      )
        .then((ongoingInformation) => {
          this.setState({
            ongoingMessage: ongoingInformation.data.ongoingInformation,
          });
          console.log(this.state.ongoingMessage);
        })
        .catch((error) => {
          console.log(error.Message);
        });
    }
  };

  videoDuration = (duration, index) => {
    this.setState({ ["video" + index + "Duration"]: duration });
  };

  render() {
    if (this.state.redirect) return <Redirect to={this.state.redirect} />;

    let title = null;
    let short_description = null;
    let teacher = null;
    let createdAt = null;
    let VideoUrl = null;
    let rating = null;
    let bookmark = false;
    let ratingtimesUpdated = null;
    let requirement = null;
    let longDescription = null;
    let willLearn = null;
    let videourl = null;
    let CurrentVideo = "";
    let playButton = "";
    let playingVideo = false;
    let completed = false;
    let VideoURL = null;
    let progressbar = null;
    let Videotitle = [];
    let videoCount = null;
    let CoursesInfo = null;
    let Duration = null;
    let Resources = null;
    let Message = "";
    let module = false;
    let courseMessage = "";

    if (this.state.loading === false) {
      title = this.state.CoursesInfo.title;
      short_description = this.state.CoursesInfo.discription;
      teacher = this.state.CoursesInfo.name;
      createdAt = this.state.CoursesInfo.createdAt;
      VideoURL = this.state.CoursesInfo.videoContent.videoUrl;
      createdAt = createdAt.split("T")[0];
      rating = this.state.CoursesInfo.rating.ratingFinal;
      requirement = parse(this.state.CoursesInfo.requirement);
      longDescription = parse(this.state.CoursesInfo.discriptionLong);
      willLearn = parse(this.state.CoursesInfo.willLearn);
      ratingtimesUpdated = this.state.CoursesInfo.rating.timesUpdated;
      videourl = this.state.CoursesInfo.videoContent.slice(0);
      CurrentVideo = this.state.CurrentVideo;
      bookmark = this.state.CoursesInfo.bookmark.includes(
        localStorage.getItem("userId")
      );
      Videotitle = this.state.CurrentVideo.videotitle;
      videoCount = this.state.CoursesInfo.videoContent.length;
      Duration = this.state.CoursesInfo.Duration;
      Resources = this.state.CoursesInfo.zipurl;
      CoursesInfo = this.state.CoursesInfo;
      Message = this.state.Message;
      module = this.state.module;

      if (rating === 0) rating = 1;

      VideoUrl = videourl.map((video, index) => {
        let VideoNumber = "video" + index;

        if (this.state[VideoNumber]) {
          playButton = "VideoSelected";
          playingVideo = true;
        } else {
          playButton = "VideoNotSelected";
          playingVideo = false;
        }

        if (this.state["video" + index + "Completed"]) {
          completed = "VideoCompleted";
        } else if (!this.state["video" + index + "Completed"]) {
          completed = false;
        }
        return (
          <VideoList
            key={index}
            video={video}
            changed={(event) =>
              this.VideochangeHandler(event, video, index, playingVideo)
            }
            playButton={playButton}
            completed={completed}
            title={
              CoursesInfo.videoContent[index].videotitle.length > 60
                ? CoursesInfo.videoContent[index].videotitle.slice(0, 60)
                : CoursesInfo.videoContent[index].videotitle
            }
            Duration={this.state["video" + index + "Duration"]}
          />
        );
      });
    }

    if (this.state.progress === 100) {
      progressbar = <p>{Message}</p>;
    } else {
      progressbar = (
        <>
          <p>
            You have Completed <b>{this.state.progress.toPrecision(2)}% </b> of
            your course!
          </p>
          <ProgressBar variant="success" now={this.state.progress} />
        </>
      );
    }

    return (
      <Layout>
        <div className="coursePage">
          <div className="container">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb">
                <li className="breadcrumb-item">
                  <NavLink to="/home">Home</NavLink>
                </li>

                <li className="breadcrumb-item">
                  <NavLink to={`/Home/${this.state.CourseType}`}>
                    {this.state.CourseType}
                  </NavLink>
                </li>

                <li className="breadcrumb-item">
                  <NavLink
                    to={`/course/${this.state.CourseType}/${this.state.CourseId}`}
                    activeStyle={{ textDecoration: "underline" }}
                  >
                    {title}
                    {VideoURL}
                  </NavLink>
                </li>
              </ol>
            </nav>

            <div className="Main-Section">
              <div className="Description-main">
                <CourseDesc
                  title={title}
                  short_description={short_description}
                  teacher={teacher}
                  createdat={createdAt}
                  CourseId={this.state.CourseId}
                  rating={parseInt(rating)}
                  ratingtimesUpdated={ratingtimesUpdated}
                  CourseType={this.state.CourseType}
                  bookmark={bookmark}
                  Duration={Duration}
                  Resources={Resources}
                />
              </div>

              <div className="Course-Video">
                <CourseVideo
                  playing={this.state.playing}
                  videoUrl={CurrentVideo}
                  index={this.state.index}
                  videoCompleted={this.videoCompleted}
                  videoDuration={this.videoDuration}
                />
              </div>
            </div>

            <div className="Breakpoint"></div>

            <div className="Section2">
              <div className="section2part1">
                <div className="Small-nav-section">
                  <p>About</p>
                  {/* <p>Instructor</p>
                            <p>About</p> */}
                </div>

                <div className="flex-col-requirement">
                  <h1>What will you learn from this course?</h1>
                  <p>{willLearn}</p>
                </div>

                <div className="flex-col-requirement">
                  <h1>Requirement of this Course</h1>
                  <p>{requirement}</p>
                </div>

                <div className="flex-col-requirement">
                  <h1>Descripton</h1>
                  <p>{longDescription}</p>
                </div>

                <div className="flex-col-requirement"></div>
              </div>

              <div style={{ marginBottom: "100px" }} className="videolist">
                {VideoUrl}
              </div>

              <div className="flex-center">
                <div>
                  <h1>Rate the Course Here</h1>
                  <Rating
                    rating={rating}
                    edit={true}
                    specialrating={true}
                    CourseId={this.state.CourseId}
                  />
                </div>
              </div>

              <div className="flex-center">
                <div className="progressBar">{progressbar}</div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }
}

export default CoursePage;
