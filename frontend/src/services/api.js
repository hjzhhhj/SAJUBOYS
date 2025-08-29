import axios from 'axios'

const API_BASE_URL = 'http://localhost:3001/api'

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request 인터셉터: 토큰을 자동으로 헤더에 추가
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem('user')
    if (user) {
      try {
        const userData = JSON.parse(user)
        if (userData.accessToken) {
          config.headers.Authorization = `Bearer ${userData.accessToken}`
        }
      } catch (error) {
        console.error('Error parsing user data:', error)
        localStorage.removeItem('user')
      }
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response 인터셉터: 에러 처리
api.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    if (error.response?.status === 401) {
      // 토큰이 만료되었거나 유효하지 않은 경우
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  signup: async (data) => {
    const response = await api.post('/auth/signup', data)
    return response.data
  },

  login: async (data) => {
    try {
      const response = await api.post('/auth/login', data)
      return { success: true, data: response.data }
    } catch (error) {
      if (error.response?.data?.message) {
        return { success: false, message: error.response.data.message }
      }
      return { success: false, message: '서버 연결에 실패했습니다' }
    }
  },
}

// Saju API
export const sajuAPI = {
  calculate: async (data) => {
    const response = await api.post('/saju/calculate', data)
    return response.data
  },

  getSavedResults: async () => {
    const response = await api.get('/saju/saved')
    return response.data
  },

  getSajuById: async (id) => {
    const response = await api.get(`/saju/${id}`)
    return response.data
  },
}

export default api