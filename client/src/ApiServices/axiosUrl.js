import axios from "axios";

const instance = axios.create({
  baseURL: "https://e-learning-site-for-vcet.onrender.com/",
});

export default instance;
