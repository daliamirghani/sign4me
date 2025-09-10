import axios from "axios";

const api = axios.create({
  baseURL: "https://sign-language-practice-tool.onrender.com/auth", 
  withCredentials: true 
});

export default api;