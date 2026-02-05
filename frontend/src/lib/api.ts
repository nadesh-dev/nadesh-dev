import axios from 'axios';
import { useAuthStore } from '../store/authStore';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (email: string, password: string, username: string, displayName?: string) =>
    api.post('/auth/register', { email, password, username, displayName }),
  
  me: () => api.get('/auth/me'),
};

export const tracksApi = {
  getAll: (limit = 50, offset = 0) =>
    api.get(`/tracks?limit=${limit}&offset=${offset}`),
  
  getPopular: (limit = 20) =>
    api.get(`/tracks/popular?limit=${limit}`),
  
  getById: (id: number) =>
    api.get(`/tracks/${id}`),
  
  play: (id: number) =>
    api.post(`/tracks/${id}/play`),
};

export const playlistsApi = {
  getMyPlaylists: () =>
    api.get('/playlists/my-playlists'),
  
  getById: (id: number) =>
    api.get(`/playlists/${id}`),
  
  create: (name: string, description?: string, isPublic = false) =>
    api.post('/playlists', { name, description, isPublic }),
  
  update: (id: number, data: { name?: string; description?: string; isPublic?: boolean }) =>
    api.put(`/playlists/${id}`, data),
  
  delete: (id: number) =>
    api.delete(`/playlists/${id}`),
  
  addTrack: (id: number, trackId: number) =>
    api.post(`/playlists/${id}/tracks`, { trackId }),
  
  removeTrack: (id: number, trackId: number) =>
    api.delete(`/playlists/${id}/tracks/${trackId}`),
};

export const artistsApi = {
  getAll: (limit = 50, offset = 0) =>
    api.get(`/artists?limit=${limit}&offset=${offset}`),
  
  getById: (id: number) =>
    api.get(`/artists/${id}`),
};

export const albumsApi = {
  getAll: (limit = 50, offset = 0) =>
    api.get(`/albums?limit=${limit}&offset=${offset}`),
  
  getById: (id: number) =>
    api.get(`/albums/${id}`),
};

export const searchApi = {
  search: (query: string, type: 'all' | 'tracks' | 'artists' | 'albums' = 'all') =>
    api.get(`/search?q=${encodeURIComponent(query)}&type=${type}`),
};

export const userApi = {
  getFavorites: () =>
    api.get('/users/favorites'),
  
  addFavorite: (trackId: number) =>
    api.post(`/users/favorites/${trackId}`),
  
  removeFavorite: (trackId: number) =>
    api.delete(`/users/favorites/${trackId}`),
  
  getHistory: (limit = 50) =>
    api.get(`/users/history?limit=${limit}`),
};

export default api;
