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
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    const user = JSON.parse(storedUser) as CurrentUser;
    config.headers['Authorization'] = `Bearer ${user.token}`;
  }
  return config;
});

export default api;
