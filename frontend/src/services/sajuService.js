import apiClient from './apiClient';

class SajuService {
  async calculate(data) {
    return await apiClient.post('/saju/calculate', data);
  }

  async getSavedResults() {
    return await apiClient.get('/saju/saved');
  }

  async getSajuById(id) {
    return await apiClient.get(`/saju/${id}`);
  }

  async saveSaju(sajuId) {
    return await apiClient.post(`/saju/${sajuId}/save`, {});
  }

  async deleteSaju(sajuId) {
    return await apiClient.delete(`/saju/${sajuId}`);
  }

  async searchAddress(query) {
    return await apiClient.get(`/saju/search-address?query=${encodeURIComponent(query)}`);
  }
}

export default new SajuService();