import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || 'http://40.122.42.30:8085', // 🔁 Replace with your base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
