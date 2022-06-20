const Course = require("../model/courses");
const mongoose = require("mongoose");
const PlaylistSummary = require("youtube-playlist-summary");
const exec = require("child_process").exec;
const api_key = require("../config/config");

exports.uploadCourse = (req, res, next) => {
  const imageurl = req.files.image[0].path;
  const zipurl = req.files.zip[0].path;
  const userId = req.body._id;
  const url = req.body.url;
  const {
    title,
    category,
    name,
    willLearn,
    discription,
    discriptionLong,
    requirement,
  } = req.body;

  const course = new Course({
    title: title,
    category: category,
    imageurl: imageurl,
    zipurl: zipurl,
    name: name,
    willLearn: willLearn,
    discription: discription,
    discriptionLong: discriptionLong,
    requirement: requirement,
    rating: 0,
    creator: userId,
    YoutubeVideo: url,
    Duration: title,
  });

  let videoContent = [];

  const config = {
    GOOGLE_API_KEY: api_key.youtubeAPI, // require
    PLAYLIST_ITEM_KEY: [
      "publishedAt",
      "title",
      "description",
      "videoId",
      "videoUrl",
    ], // option
  };
  let items = [];
  const ps = new PlaylistSummary(config);
  const PLAY_LIST_ID = url;

  ps.getPlaylistItems(PLAY_LIST_ID)
    .then((video) => {
      items = video.items;
      items.forEach((video) => {
        let videoContentContainer = {
          videotitle: null,
          videoUrl: null,
          usersWatched: [],
        };

        videoContentContainer.videoUrl = video.videoUrl;
        videoContentContainer.videotitle = video.title;
        videoContent.push(videoContentContainer);
      });
      course.videoContent = videoContent;
    })
    .catch((err) => {
      console.log(err);
    });

  var child;
  let VideoDuration = "videoduration";
  var Y = "Duration: ";
  var string = "";
  let command = "ypd " + url;
  child = exec(command, (error, stdout, stderr) => {
    VideoDuration = stdout.slice(stdout.indexOf(Y) + Y.length);
    string = VideoDuration.replace(/^\s+|\s+$/g, "");
    console.log("Duration is " + string);
    course.Duration = string;
    course.save().then((result) => {
      res
        .status(201)
        .json({ message: "Course created successfully", newCourse: result });
    });
  });
};

exports.watchedByUsers = (req, res, next) => {
  const userId = req.body.userId;
  const videoId = req.body.videoId;
  const courseId = req.body.courseId;
  Course.findById({ _id: courseId })
    .then((course) => {
      course.videoContent.every((video) => {
        if (video._id == videoId) {
          if (!video.usersWatched.includes(userId)) {
            video.usersWatched.push(userId);
          }
          console.log("matched found");
          return false;
        }
        return true;
      });
      course.save();
      console.log(course.videoContent);
      res.status(200).json({ message: "ok" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.teacherHome = (req, res, next) => {
  userId = req.body.userId;
  Course.find({ creator: userId })
    .then((course) => {
      res.status(200).json({ data: course });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.deleteCourse = (req, res, next) => {
  const courseId = req.body.courseId;

  Course.findByIdAndRemove({ _id: courseId })
    .then((course) => {
      res.status(200).json({ message: "course deleted successfully" });
    })
    .catch((err) => {
      console.log(err);
    });
};

// editing course
exports.editCourse = (req, res, next) => {
  const courseId = req.body.courseId;

  Course.findOne({ _id: courseId })
    .then((course) => {
      res.status(200).json({ course });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.updateCourse = (req, res, next) => {
  const courseId = req.body.courseId;
  const title = req.body.title;
  const url = req.body.url;
  const category = req.body.category;
  const imageurl = req.files.image[0].path;
  const zipurl = req.files.zip[0].path;
  const name = req.body.name;
  const willLearn = req.body.willLearn;
  const discription = req.body.discription;
  const discriptionLong = req.body.discriptionLong;
  const requirement = req.body.requirement;
  //const userId=req.body._id;
  let videoContent = [];

  Course.findById({ _id: courseId }).then((course) => {
    course.title = title;
    course.category = category;
    course.imageurl = imageurl;
    course.name = name;
    course.willLearn = willLearn;
    course.discription = discription;
    course.discriptionLong = discriptionLong;
    course.requirement = requirement;
    course.zipurl = zipurl;
    course.url = url;
    const config = {
      GOOGLE_API_KEY: api_key.youtubeAPI, // require
      PLAYLIST_ITEM_KEY: [
        "publishedAt",
        "title",
        "description",
        "videoId",
        "videoUrl",
      ], // option
    };
    let items = [];
    const ps = new PlaylistSummary(config);
    const PLAY_LIST_ID = url;

    ps.getPlaylistItems(PLAY_LIST_ID)
      .then((video) => {
        items = video.items;
        items.forEach((video) => {
          let videoContentContainer = {
            videotitle: null,
            videoUrl: null,
            usersWatched: [],
          };

          videoContentContainer.videoUrl = video.videoUrl;
          videoContentContainer.videotitle = video.title;
          videoContent.push(videoContentContainer);
        });

        course.videoContent = videoContent;
      })
      .catch((err) => {
        console.log(err);
      });

    var child;
    let VideoDuration = "videoduration";
    var Y = "Duration: ";
    var string = "";
    let command = "ypd " + url;
    child = exec(command, (error, stdout, stderr) => {
      VideoDuration = stdout.slice(stdout.indexOf(Y) + Y.length);
      string = VideoDuration.replace(/^\s+|\s+$/g, "");
      console.log("Duration is " + string);
      course.Duration = string;
      course.save();
      res.status(201).json({ message: "Course editted successfully" });
    });
  });
};

exports.courseStats = (req, res, next) => {
  const User = require("../model/user");
  const courseId = req.params.courseId;

  Course.findById({ _id: courseId })
    .then((course) => {
      let Users = [];
      let tableInformation = course.ongoingInformation;
      let ongoingInformation = course.videoContent[0].usersWatched.length;

      course.courseCompleted.map((userid) => {
        Users.push(userid);
      });

      let userInformation = [];
      let completedUsers = course.courseCompleted.length;

      let statsInformation = [ongoingInformation, completedUsers];
      console.log(statsInformation);
      res.status(200).json({ data: { statsInformation, tableInformation } });
    })
    .catch((err) => {
      console.log(err);
    });
};
