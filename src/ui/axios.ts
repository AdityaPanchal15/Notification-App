import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL, // 🔁 Replace with your base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
