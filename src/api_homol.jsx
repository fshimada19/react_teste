import axios from "axios";

const api = axios.create({
  baseURL: "http://35.199.102.170/",
  headers: { 'Content-Type': 'application/json'
  },
});

export default api;