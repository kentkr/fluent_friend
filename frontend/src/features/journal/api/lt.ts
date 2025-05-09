import axios from "axios";
import { ACCESS_TOKEN } from "../../../constants";

// TODO: where should this file be in relation to frontend/src/api

const lt = axios.create({
  baseURL: import.meta.env.VITE_LT_URL,
  headers: {
    common: {
      'Accept': 'application/json',
      // removing this causes cors error - passing an obj into a post request caused it
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    }
  }
})

// TODO: this caused a cors issue (was probably above tho). We may need something like it for security 
//lt.interceptors.request.use(
//  (config) => {
//    const token = localStorage.getItem(ACCESS_TOKEN);
//    if (token) {
//      config.headers.Authorization = `Bearer ${token}`;
//    }
//    return config;
//  },
//  (error) => {
//    return Promise.reject(error);
//  }
//);

export default lt
