import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import axios from 'axios';
import { CurrentUser } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const api = axios.create({
  baseURL: 'http://localhost:8080/api', // Din backend-URL
});

// Lägg till token i Authorization-headern
api.interceptors.request.use((config) => {
  const user = localStorage.getItem('user') as unknown as CurrentUser;
  if (user) {
    config.headers['Authorization'] = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
