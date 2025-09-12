import axios from "axios";

const API_BASE_URL = "http://localhost:3001/api";

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request 인터셉터: 토큰을 자동으로 헤더에 추가
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        if (userData.accessToken) {
          config.headers.Authorization = `Bearer ${userData.accessToken}`;
        }
      } catch {
        localStorage.removeItem("user");
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터: 에러 처리
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 로그인 API 호출 시에는 401 에러여도 리다이렉트하지 않음 => 해결됐당!
    const isLoginRequest = error.config?.url?.includes("/auth/login");

    if (error.response?.status === 401 && !isLoginRequest) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  signup: async (data) => {
    const response = await api.post("/auth/signup", data);
    return response.data;
  },

  login: async (data) => {
    try {
      const response = await api.post("/auth/login", data);
      // response.data가 이미 {success, message, data} 구조를 가지고 있음
      // data 내부에 user와 accessToken이 있음
      return { 
        success: true, 
        data: response.data.data,  // 중첩된 data를 펼침
        message: response.data.message 
      };
    } catch (error) {
      // 디버깅용 로그
      console.log("Login error response:", error.response?.data);

      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "서버 연결에 실패했습니다";
      return { success: false, message: errorMessage };
    }
  },
};

// Saju API
export const sajuAPI = {
  calculate: async (data) => {
    const response = await api.post("/saju/calculate", data);
    return response.data;
  },

  getSavedResults: async () => {
    const response = await api.get("/saju/saved");
    return response.data;
  },

  getSajuById: async (id) => {
    const response = await api.get(`/saju/${id}`);
    return response.data;
  },
};

export default api;
