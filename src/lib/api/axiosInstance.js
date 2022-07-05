import axios from 'axios';
export const BASE_URL = 'https://fptest.fieldpower.com:81'

const Instance = axios.create({
  baseURL: 'https://fptest.fieldpower.com:81',
});

// Response interceptor for API calls

// Instance.interceptors.response.use((response) => {
//   return response
// }, async function (error) {
//   const originalRequest = error.config;
//   if (error.response.status === 401 && !originalRequest._retry) {
//     originalRequest._retry = true;
//     const access_token = await refreshAccessToken();
//     axios.defaults.headers.common['Authorization'] = 'Bearer ' + access_token;
//     return Instance(originalRequest);
//   }
//   return Promise.reject(error);
// });

export default Instance;
