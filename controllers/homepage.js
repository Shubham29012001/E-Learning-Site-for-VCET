const Course = require("../model/courses");
const User = require("../model/user");

exports.allCourses = (req, res) => {
  Course.find()
    .then((course) => {
      res.status(200).json({ course: course });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.fetchCourses = (req, res, next) => {
  const category = req.params.course;
  // console.log(category)

  if (category == "all" || category == "") {
    Course.find()
      .then((courses) => {
        // console.log(courses);
        res.status(200).json({ course: courses });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).json({ message: "error occured" });
      });
  } else {
    Course.find({ category: category })
      .then((courses) => {
        //console.log(courses);
        res.status(200).json({ course: courses });
      })
      .catch((err) => {
        console.log(err);
      });
  }
};
