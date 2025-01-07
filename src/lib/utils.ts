import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { keycloak } from './keycloakConfig';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// const api = axios.create({
//   baseURL: 'http://localhost:8080/api', // Din backend-URL
//   // baseURL: 'http://127.0.0.1:63354/api', // Din backend-URL
// });

const api = axios.create({
  baseURL: 'https://apigateway.app.cloud.cbh.kth.se/api', // Din backend-URL
});

// Lägg till token i Authorization-headern
// api.interceptors.request.use((config) => {
//   const storedUser = localStorage.getItem('user');
//   if (storedUser) {
//     const user = JSON.parse(storedUser) as CurrentUser;
//     config.headers['Authorization'] = `Bearer ${user.token}`;
//   }
//   return config;
// });

api.interceptors.request.use((config) => {
  if (keycloak.authenticated) {
    const token = keycloak.token;
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
