import axios from "axios";

const api = axios.create({
  baseURL: "https://raefel.onrender.com/api"
});

export default api;