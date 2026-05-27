import axios from 'axios';

const api = axios.create({
  baseURL: 'http://10.65.2.86:8000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('agrirent_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally — clear token and redirect to login
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('agrirent_token');
      localStorage.removeItem('agrirent_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
