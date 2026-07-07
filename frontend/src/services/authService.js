// import { login as mockLogin, register as mockRegister, getMe as mockGetMe } from './mockApi.js';

// export const authService = {
//   login: (email, password) => mockLogin(email, password),
//   register: (name, email, password) => mockRegister(name, email, password),
//   getMe: () => mockGetMe(),
// };


import api from './api.js';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    console.log(res.data);
    return res.data.data; // { token, user }
  },
  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    return res.data.data;
  },
  getMe: async () => {
    const res = await api.get('/auth/me');
    return res.data.data; // user object
  },
};