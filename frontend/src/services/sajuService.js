import apiClient from './apiClient';

/**
 * 사주 관련 API 서비스
 */
class SajuService {
  /**
   * 사주 계산
   */
  async calculate(data) {
    return await apiClient.post('/saju/calculate', data);
  }

  /**
   * 저장된 사주 목록 조회
   */
  async getSavedResults() {
    return await apiClient.get('/saju/saved');
  }

  /**
   * 특정 사주 조회
   */
  async getSajuById(id) {
    return await apiClient.get(`/saju/${id}`);
  }

  /**
   * 사주 저장
   */
  async saveSaju(sajuId) {
    return await apiClient.post(`/saju/${sajuId}/save`, {});
  }

  /**
   * 사주 삭제
   */
  async deleteSaju(sajuId) {
    return await apiClient.delete(`/saju/${sajuId}`);
  }

  /**
   * 주소 검색
   */
  async searchAddress(query) {
    return await apiClient.get(`/saju/search-address?query=${encodeURIComponent(query)}`);
  }
}

export default new SajuService();