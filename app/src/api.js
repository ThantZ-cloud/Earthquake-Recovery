import axios from 'axios';

// In development, requests go through Vite proxy (/api → localhost:3001)
// In production, VITE_API_URL points to the Railway backend
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export default api;
