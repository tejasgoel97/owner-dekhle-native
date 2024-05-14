import axios from 'axios';

const api = axios.create({
  baseURL: 'https://owner-dekhle-backend-agent-c18ebeb001ca.herokuapp.com/api', // Replace with your actual API URL
  // baseURL: 'http://192.168.1.5:5000/api', // Replace with your actual API URL
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
