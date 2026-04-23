import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '',
});

export const getWaifus  = (params = {}) => api.get('/api/waifus', { params }).then((r) => r.data);
export const getWaifu   = (id)          => api.get(`/api/waifus/${id}`).then((r) => r.data);
export const createWaifu = (data)       => api.post('/api/waifus', data).then((r) => r.data);

// Mise à jour image par URL (JSON)
export const updateWaifuImageUrl = (id, image_url) =>
  api.patch(`/api/waifus/${id}/image`, { image_url }).then((r) => r.data);

// Upload image fichier (multipart)
export const uploadWaifuImage = (id, file) => {
  const form = new FormData();
  form.append('image', file);
  return api.post(`/api/waifus/${id}/image`, form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then((r) => r.data);
};

//hello

export default api;
