import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '',
  timeout: 10000,
});

// Auto-attach token on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('lf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authApi = {
  login:    (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
};

export const leadsApi = {
  getAll:       (params) => api.get('/api/leads', { params }),
  getStats:     ()       => api.get('/api/leads/stats'),
  create:       (data)   => api.post('/api/leads', data),
  updateStatus: (id, data) => api.put(`/api/leads/${id}`, data),
  delete:       (id)     => api.delete(`/api/leads/${id}`),
};

export default api;
