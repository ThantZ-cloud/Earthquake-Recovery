import axios from 'axios';

// In development, requests go through Vite proxy (/api → localhost:3001)
// In production on Vercel, /api routes are handled by Vercel serverless functions
const api = axios.create();

export default api;
