import axios from 'axios';
import { API_BASE_URL } from './config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

const api2 = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
});

const api3 = axios.create({
  baseURL: API_BASE_URL,
});

const handleLogout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login'; 
};


const addAuthInterceptor = (axiosInstance, useBearer = false) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      if (useBearer) {
        const token = localStorage.getItem('token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        handleLogout();
      }
      return Promise.reject(error);
    }
  );
};

addAuthInterceptor(api);  
addAuthInterceptor(api2); 
addAuthInterceptor(api3, true); 

export { api, api2, api3 };
