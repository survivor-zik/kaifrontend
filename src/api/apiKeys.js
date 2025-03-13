import { api3 } from './interceptor';
export const apiKeysAPI = {
  getAllKeys: async () => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };
    
    const response = await api3.get('/api/keys', { headers });
    return response.data;
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