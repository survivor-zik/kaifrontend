import axios from 'axios';
import { API_BASE_URL } from './config';
import { api3 } from './interceptor';
export const apiKeysAPI = {
  getAllKeys: async () => {
    try {
      const response = await api3.get('/api-keys');
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  createKey: async (name) => {
    try {
      const response = await api3.post('/api-keys', { name });
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
  deleteKey: async (keyId) => {
    try {
      const response = await api3.delete(`/api-keys/${keyId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};