import axios from "axios";

const API = axios.create({
  baseURL: "https://server-rbdb.onrender.com",
  headers: { "Content-Type": "application/json" }
});

export default API;