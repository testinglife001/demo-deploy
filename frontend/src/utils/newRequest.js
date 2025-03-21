import axios from "axios";

const newRequest = axios.create({
//  baseURL: "http://localhost:8000/api",
// https://demo-deploy-api.vercel.app/
  baseURL: "https://demo-deploy-api.vercel.app/api",
  withCredentials: true,
});

export default newRequest;
