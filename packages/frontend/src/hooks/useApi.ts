import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const useApi = () => {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const t = localStorage.getItem('token');
    setToken(t);
  }, []);

  const client = axios.create({
    baseURL: API_URL,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  const get = (url: string) => client.get(url);
  const post = (url: string, data?: any) => client.post(url, data);
  const put = (url: string, data?: any) => client.put(url, data);
  const delete_ = (url: string) => client.delete(url);

  return { get, post, put, delete: delete_ };
};
