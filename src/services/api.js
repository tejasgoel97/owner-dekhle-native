import axios from 'axios';

const api = axios.create({
  baseURL: 'http://192.168.1.5:5000/api', // Replace with your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
