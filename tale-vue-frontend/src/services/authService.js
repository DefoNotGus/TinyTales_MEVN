import api from './api';

export const register = async (userData) => {
  const res = await api.post('/users/signup', userData);
  return res.data;
};

export const login = async (credentials) => {
  const res = await api.post('/users/login', credentials);
  localStorage.setItem('token', res.data.token); // assuming your backend sends token
  return res.data;
};

export const logout = () => {
  localStorage.removeItem('token');
};
