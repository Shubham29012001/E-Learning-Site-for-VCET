const Course = require("../model/courses");
const User = require("../model/user");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.CoursePage = (req, res, next) => {
  const courseName = req.params.courseName;
  const courseId = req.params.courseId;

  Course.findOne({ _id: courseId })
    .then((course) => {
      res.status(200).json({ course: course });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.Bookmark = (req, res, next) => {
  const courseId = req.params.courseId;
  const courseName = req.params.courseName;
  const userId = req.body._userID;

  User.findById({ _id: userId })
    .then((user) => {
      if (!user.Bookmark.includes(courseId)) {
        user.Bookmark.push(courseId);
        console.log("added to bookamrk fro user");
      } else {
        user.Bookmark.splice(user.Bookmark.indexOf(courseId), 1);
        console.log("removed from user bookmark");
      }
      user.save().then((result) => {
        Course.findById({ _id: courseId })
          .then((course) => {
            if (!course.bookmark.includes(userId)) {
              course.bookmark.push(userId);
              console.log("bookmarked --- course");
            } else {
              course.bookmark.splice(course.bookmark.indexOf(userId), 1);
            }
            course.save();
            console.log(user);
          })
          .catch((err) => {
            console.log(err);
          });
      });

      console.log(user);
      res.status(202).json({ message: "successfully bookmarked" });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.ShowBookmark = (req, res, next) => {
  const userId = req.params.userId;
  console.log(userId);

  User.findById({ _id: userId })
    .populate("Bookmark")
    .exec()
    .then((course) => {
      console.log(course);
      res.json({ course: course });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.unbookmark = (req, res, next) => {
  const userId = req.body.userId;
  const courseId = req.body.id;

  User.findById({ _id: userId })
    .then((user) => {
      user.Bookmark.splice(user.Bookmark.indexOf(courseId), 1);
      user.save();
      res.status(200).json({ message: "successfully unbookmarked" });
    })
    .catch((err) => {
      console.log(err);
    });

  Course.findById({ _id: courseId })
    .then((course) => {
      course.bookmark.splice(course.bookmark.indexOf(userId), 1);
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.rating = (req, res, next) => {
  const courseId = req.body.courseId;
  const new_Rating = req.body.rating;

  Course.findById({ _id: courseId })
    .then((course) => {
      const total_rating = course.rating.ratingSum + new_Rating;
      const times_updated = course.rating.timesUpdated + 1;
      course.rating.timesUpdated += 1;
      course.rating.ratingSum += new_Rating;
      course.rating.ratingFinal = total_rating / times_updated;

      course.save();
      console.log(course);
      res.status(200).json({ course: course });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.ongoingInformation = (req, res) => {
  const userId = req.params.userid;
  const progress = req.params.progress;
  const userName = req.params.username;
  const email = req.params.email;
  const courseId = req.params.courseid;

  Course.findById({ _id: courseId })
    .then((course) => {
      let output = false;
      course.ongoingInformation.forEach((data) => {
        if (data.userid == userId) {
          data.progress = progress;
          console.log(data);
          course.save();
          output = true;
        }
      });

      if (output == false) {
        let ongoingArray = {
          userid: null,
          progress: null,
          username: null,
          email: null,
        };

        ongoingArray.userid = userId;
        ongoingArray.progress = progress;
        ongoingArray.username = userName;
        ongoingArray.email = email;
        let items = [];
        items.push(ongoingArray);
        console.log(ongoingArray);
        course.ongoingInformation.push(ongoingArray);
        course.save();
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.courseCompleted = (req, res, next) => {
  const userId = req.params.userId;
  const courseId = req.params.courseId;

  User.findById({ _id: userId })
    .then((user) => {
      if (!user.courses.includes(courseId)) {
        user.courses.push(courseId);
        console.log("Added Course Completion to User Collection");

        user.save().then((result) => {
          Course.findById({ _id: courseId })
            .then((course) => {
              if (!course.courseCompleted.includes(userId)) {
                course.courseCompleted.push(userId);
                console.log("Added Course Completion to Courses Collection");
                course.save();
              }
            })
            .catch((err) => {
              console.log(err);
            });
        });
        res.status(202).json({ courseMessage: "User Completed Course" });
      }
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.certificate = (req, res, next) => {
  const courseId = req.params.courseName;
  const userId = req.params.userName;
  const { validationResult } = require("express-validator/check");
  const api_key = require("../config/config");
  const fs = require("fs");
  const sgMail = require("@sendgrid/mail");

  const certificate = new PDFDocument({
    layout: "landscape",
    size: "A4",
  });

  function jumpLine(certificate, lines) {
    for (let index = 0; index < lines; index++) {
      certificate.moveDown();
    }
  }

  certificate.pipe(fs.createWriteStream("certificate.pdf"));

  certificate
    .rect(0, 0, certificate.page.width, certificate.page.height)
    .fill("#fff");

  certificate.fontSize(10);

  // Margin
  const distanceMargin = 18;

  certificate
    .fillAndStroke("#0e8cc3")
    .lineWidth(20)
    .lineJoin("round")
    .rect(
      distanceMargin,
      distanceMargin,
      certificate.page.width - distanceMargin * 2,
      certificate.page.height - distanceMargin * 2
    )
    .stroke();

  // Header
  const maxWidth = 140;
  const maxHeight = 70;

  certificate.image(
    "images/winners.png",
    certificate.page.width / 2 - maxWidth / 2,
    60,
    {
      fit: [maxWidth, maxHeight],
      align: "center",
    }
  );

  jumpLine(certificate, 5);

  certificate
    .font("fonts/NotoSansJP-Light.otf")
    .fontSize(10)
    .fill("#021c27")
    .text("Super Course for Awesomes", {
      align: "center",
    });

  jumpLine(certificate, 2);

  // Content
  certificate
    .font("fonts/NotoSansJP-Regular.otf")
    .fontSize(16)
    .fill("#021c27")
    .text("CERTIFICATE OF COMPLETION", {
      align: "center",
    });

  jumpLine(certificate, 1);

  certificate
    .font("fonts/NotoSansJP-Light.otf")
    .fontSize(10)
    .fill("#021c27")
    .text("Present to", {
      align: "center",
    });

  jumpLine(certificate, 2);

  certificate
    .font("fonts/NotoSansJP-Bold.otf")
    .fontSize(24)
    .fill("#021c27")
    .text(userId, {
      align: "center",
    });

  jumpLine(certificate, 1);

  certificate
    .font("fonts/NotoSansJP-Light.otf")
    .fontSize(10)
    .fill("#021c27")
    .text("Successfully completed the course " + courseId, {
      align: "center",
    });

  jumpLine(certificate, 7);

  certificate.lineWidth(1);

  // Signatures
  const lineSize = 174;
  const signatureHeight = 390;

  certificate.fillAndStroke("#021c27");
  certificate.strokeOpacity(0.2);

  const startLine1 = 128;
  const endLine1 = 128 + lineSize;
  certificate
    .moveTo(startLine1, signatureHeight)
    .lineTo(endLine1, signatureHeight)
    .stroke();

  const startLine2 = endLine1 + 32;
  const endLine2 = startLine2 + lineSize;
  certificate
    .moveTo(startLine2, signatureHeight)
    .lineTo(endLine2, signatureHeight)
    .stroke();

  const startLine3 = endLine2 + 32;
  const endLine3 = startLine3 + lineSize;
  certificate
    .moveTo(startLine3, signatureHeight)
    .lineTo(endLine3, signatureHeight)
    .stroke();

  certificate
    .font("fonts/NotoSansJP-Bold.otf")
    .fontSize(10)
    .fill("#021c27")
    .text("Dr. Ashish Vanmali", startLine1, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center",
    });

  certificate
    .font("fonts/NotoSansJP-Light.otf")
    .fontSize(10)
    .fill("#021c27")
    .text("Head of Department", startLine1, signatureHeight + 25, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center",
    });

  certificate
    .font("fonts/NotoSansJP-Bold.otf")
    .fontSize(10)
    .fill("#021c27")
    .text(userId, startLine2, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center",
    });

  certificate
    .font("fonts/NotoSansJP-Light.otf")
    .fontSize(10)
    .fill("#021c27")
    .text("Student", startLine2, signatureHeight + 25, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center",
    });

  certificate
    .font("fonts/NotoSansJP-Bold.otf")
    .fontSize(10)
    .fill("#021c27")
    .text("Dr. Harish Vankudre", startLine3, signatureHeight + 10, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center",
    });

  certificate
    .font("fonts/NotoSansJP-Light.otf")
    .fontSize(10)
    .fill("#021c27")
    .text("Principal", startLine3, signatureHeight + 25, {
      columns: 1,
      columnGap: 0,
      height: 40,
      width: lineSize,
      align: "center",
    });

  jumpLine(certificate, 4);

  certificate.end();

  sgMail.setApiKey(api_key.Sendgrid);

  const directory = path.join(__dirname, "../");
  pathToAttachment = `${directory}/certificate.pdf`;

  attachment = fs.readFileSync(pathToAttachment).toString("base64");

  const msg = {
    to: localStorage.getItem("email"),
    from: "doghunter451@gmail.com",
    subject: "Certificate Mailed",
    html: ` '<p>Congratulations</p>
    <br>
    <p>You have completed the course. Course certificate has been attached below</p>'`,
    attachments: [
      {
        content: attachment,
        filename: "certificate.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  sgMail.send(msg).catch((err) => {
    console.log(err);
  });

  res.status(200).json({
    message: "Congrats, Your Certificate has Been Mailed",
    module: true,
  });
};
