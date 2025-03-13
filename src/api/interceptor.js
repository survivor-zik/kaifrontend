import axios from 'axios';
import { API_BASE_URL } from './config';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' }
});

const api2 = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
});

const api3 = axios.create({
  baseURL: API_BASE_URL,
});

const handleLogout = () => {
    toast.error("Authentication Required!");
    setTimeout(() => {
        localStorage.removeItem('token');
        window.location.href = '/login'; 
    }, 2000);
};

const addAuthInterceptor = (axiosInstance, useBearer = false) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      if (useBearer) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        } else {
          console.warn("No token found in localStorage!");
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        console.error("Axios Error Response:", error.response); 

        if (error.response.status === 401) {
          console.log("Detected 401 Unauthorized, triggering logout...");

          if (error.response.data?.detail === "Could not validate credentials") {
            handleLogout();
          }
        }
      } else {
        console.error("Network error or no response from server:", error);
      }
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(api);  
addAuthInterceptor(api2); 
addAuthInterceptor(api3, true); 

export { api, api2, api3 };
