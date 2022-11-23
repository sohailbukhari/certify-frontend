import axios from 'axios';
import { getAccessToken } from './storage';

const baseURL = import.meta.env.VITE_API_ENDPOINT;

const http = axios.create({ baseURL });

// attach access token to each request
http.interceptors.request.use((config) => {
  const access_token = getAccessToken();
  if (access_token) config.headers['Authorization'] = `Bearer ${access_token}`;
  return config;
});

export default http;
