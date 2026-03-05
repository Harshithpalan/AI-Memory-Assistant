import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload', formData);
};

export const uploadNote = async (content, title) => {
  return api.post('/note', { content, title });
};

export const queryAI = async (question) => {
  return api.post('/query', { question });
};

export const getStats = async () => {
  return api.get('/stats');
};

export const getDailySummary = async () => {
  return api.get('/summary/daily');
};

export const getTimeline = async () => {
  return api.get('/timeline');
};

export const getReminders = async () => {
  return api.get('/reminders');
};

export default api;
