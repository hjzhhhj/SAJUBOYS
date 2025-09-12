import axios from 'axios';
import { API_BASE_URL } from '../constants';

/**
 * Axios 인스턴스 생성 및 인터셉터 설정
 */
class ApiClient {
  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request 인터셉터
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response 인터셉터
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          this.handleUnauthorized(error);
        }
        return Promise.reject(error);
      }
    );
  }

  getToken() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        return userData.accessToken;
      } catch {
        localStorage.removeItem('user');
      }
    }
    return null;
  }

  handleUnauthorized(error) {
    const isLoginRequest = error.config?.url?.includes('/auth/login');
    if (!isLoginRequest) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  }

  // HTTP 메서드 래퍼
  async get(url, config) {
    const response = await this.client.get(url, config);
    return response.data;
  }

  async post(url, data, config) {
    const response = await this.client.post(url, data, config);
    return response.data;
  }

  async put(url, data, config) {
    const response = await this.client.put(url, data, config);
    return response.data;
  }

  async delete(url, config) {
    const response = await this.client.delete(url, config);
    return response.data;
  }
}

export default new ApiClient();