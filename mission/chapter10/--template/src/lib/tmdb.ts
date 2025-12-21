import axios from 'axios';

export const tmdb = axios.create({
  baseURL: 'https://api.themoviedb.org/3',
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`,
    Accept: 'application/json',
  },
});

export const poster = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/w342${path}` : '';

export const backdrop = (path: string | null) =>
  path ? `https://image.tmdb.org/t/p/w1280${path}` : '';

