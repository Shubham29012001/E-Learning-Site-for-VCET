const express = require("express");
const router = express.Router();
const multer = require("multer");
const teacherController = require("../controllers/teacher");
const Auth = require("../middleware/is-auth");

const ImagefileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toDateString() + "-" + file.originalname);
  },
});

const imageMulter = multer({ storage: ImagefileStorage });
const multipleupload = imageMulter.fields([{ name: 'zip' }, { name: 'image' },]);

router.post(
  "/creator/create-course",
  multipleupload,
  teacherController.uploadCourse
);
router.post("/creater/homepage", Auth, teacherController.teacherHome);
router.post("/course/delete", Auth, teacherController.deleteCourse);
router.post("/course/edit", Auth, teacherController.editCourse);
router.put(
  "/course/Update",
  multipleupload,
  teacherController.updateCourse
);
router.post("/watchedByuser", teacherController.watchedByUsers);
router.post("/course/:courseId", teacherController.courseStats);

module.exports = router;
