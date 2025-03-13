import axios from 'axios';
import { API_BASE_URL } from './config';

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

export const refreshAuthToken = () => {
  const token = localStorage.getItem('token');
  
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api2.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    api3.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
    delete api2.defaults.headers.common['Authorization'];
    delete api3.defaults.headers.common['Authorization'];
  }
};

export { api, api2, api3 };