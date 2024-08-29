import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://learn.codeit.kr/api/avatar-service',
  withCredentials: true,
});


instance.interceptors.response.use(res => res, async (error) => {
  const originalRequest = error.config;
  const response = error.response; // 가로 챈 리스폰스
  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;
    return instance(originalRequest);
  }
  return Promise.reject(error);
});

export default instance;