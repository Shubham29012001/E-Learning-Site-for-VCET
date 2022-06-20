import axios from "./axiosUrl";

class AuthServices {
  register(data) {
    return axios.post("/signup", data);
  }

  otp(data) {
    return axios.post("/signup/otp", data);
  }

  otpResend(data) {
    return axios.post("/signup/otp-resend", data);
  }

  login(data) {
    console.log(data);
    return axios.post("/login", data);
  }

  VerifyEmail(data) {
    return axios.post("/signup/resetOtp", data);
  }

  VerifyOtp(data) {
    return axios.post("/signup/checkOtp", data);
  }

  ResetPassword(data) {
    return axios.post("/signup/reset-password", data);
  }

  logout() {
    localStorage.clear();
  }

  getCurrentUser() {
    return localStorage.getItem("user");
  }

  getAdminStatus() {
    return localStorage.getItem("isAdmin");
  }

  getUserName() {
    let userName = localStorage.getItem("userName");
    if (userName != null)
      userName = userName.charAt(0).toUpperCase() + userName.slice(1);
    return userName;
  }

  Google_login(data) {
    return axios.post("/google_login", data);
  }

  AllCourses() {
    return axios.get("/home/allCourses");
  }

  HomepageCourse(CourseLink) {
    return axios.get(`/home/${CourseLink}`);
  }

  PreferenceCourse(CourseLink, data) {
    return axios.post(`/home/${CourseLink}`, data, {
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("user") +
          " " +
          localStorage.getItem("ref_token"),
      },
    });
  }

  UpdatedCourse(data) {
    return axios.put("course/Update", data);
  }

  bookmarkCourses(userName, userId) {
    return axios.get(`/users/${userName}/${userId}`, {
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("user") +
          " " +
          localStorage.getItem("ref_token"),
      },
    });
  }

  DeleteBookmark(data) {
    return axios.post("/unbookmark", data, {
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("user") +
          " " +
          localStorage.getItem("ref_token"),
      },
    });
  }

  BookMark(CourseId, CourseName, data) {
    return axios.post(`/home/${CourseId}/${CourseName}`, data, {
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("user") +
          " " +
          localStorage.getItem("ref_token"),
      },
    });
  }

  FetchCourses(CourseName, CourseId) {
    return axios.get(`/course/${CourseName}/${CourseId}`, {
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("user") +
          " " +
          localStorage.getItem("ref_token"),
      },
    });
  }

  CourseCompleted(courseId, userId) {
    return axios.post(`/courses/${courseId}/${userId}`);
  }

  OngoingInformation(courseid, userid, progress, username, email) {
    return axios.post(
      `/courses/${courseid}/${userid}/${progress}/${username}/${email}`
    );
  }

  Certificate(courseName, userName) {
    return axios.post(`/certificate/${courseName}/${userName}`);
  }

  getCourseStats(courseId) {
    return axios.post(`/course/${courseId}`);
  }

  Rating(data) {
    return axios.put("/Rating", data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user"),
      },
    });
  }

  TeacherHomePage(data) {
    return axios.post("/creater/homepage", data, {
      headers: {
        Authorization:
          "Bearer " +
          localStorage.getItem("user") +
          " " +
          localStorage.getItem("ref_token"),
      },
    });
  }

  courseDetails(courseId) {
    return axios.post(`/course/${courseId}`);
  }

  TeacherCourseDelete(data) {
    return axios.post("/course/delete", data, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("user"),
      },
    });
  }
}

export default new AuthServices();
