import apiClient from './apiClient';

/**
 * 인증 관련 API 서비스
 */
class AuthService {
  /**
   * 회원가입
   */
  async signup(data) {
    try {
      return await apiClient.post('/auth/signup', data);
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 로그인
   */
  async login(data) {
    try {
      const response = await apiClient.post('/auth/login', data);
      return {
        success: true,
        data: response.data,
        message: response.message
      };
    } catch (error) {
      return this.handleError(error);
    }
  }

  /**
   * 에러 처리
   */
  handleError(error) {
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      '서버 연결에 실패했습니다';
    
    return {
      success: false,
      message: errorMessage
    };
  }
}

export default new AuthService();