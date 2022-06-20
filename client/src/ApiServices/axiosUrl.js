import axios from "axios";

const instance = axios.create({
  baseURL: "https://vcet-final-year-project.herokuapp.com/",
});

export default instance;
