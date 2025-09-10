const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function testJWT() {
  try {
    // 1. 회원가입
    const email = `test${Date.now()}@test.com`;
    const password = 'Test1234!';
    
    console.log('1. 회원가입 테스트...');
    const signupRes = await axios.post(`${API_URL}/auth/signup`, {
      name: '테스트',
      email,
      password
    });
    console.log('회원가입 성공:', signupRes.data.success);
    
    // 2. 로그인
    console.log('\n2. 로그인 테스트...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    const token = loginRes.data.data.accessToken;
    console.log('토큰 발급:', token ? '성공' : '실패');
    console.log('토큰 첫 50자:', token.substring(0, 50) + '...');
    
    // 3. 사주 계산
    console.log('\n3. 사주 계산...');
    const sajuRes = await axios.post(`${API_URL}/saju/calculate`, {
      name: '홍길동',
      gender: '남',
      birthDate: '1990-01-01',
      birthTime: '12:00',
      calendarType: '양력',
      city: '서울',
      isTimeUnknown: false
    });
    
    const sajuId = sajuRes.data.data._id;
    console.log('사주 ID:', sajuId);
    
    // 4. 저장 시도 (토큰 포함)
    console.log('\n4. 저장 테스트 (토큰 포함)...');
    console.log('Authorization 헤더:', `Bearer ${token.substring(0, 30)}...`);
    
    try {
      const saveRes = await axios.post(
        `${API_URL}/saju/${sajuId}/save`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log('저장 성공:', saveRes.data);
    } catch (error) {
      console.log('저장 실패:', error.response?.status, error.response?.data);
      console.log('전체 에러:', error.message);
    }
    
    // 5. 저장된 결과 조회
    console.log('\n5. 저장된 결과 조회...');
    try {
      const savedRes = await axios.get(`${API_URL}/saju/saved`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('조회 성공, 결과 개수:', savedRes.data.data?.length);
    } catch (error) {
      console.log('조회 실패:', error.response?.status, error.response?.data);
    }
    
  } catch (error) {
    console.error('테스트 실패:', error.message);
    if (error.response) {
      console.error('응답 상태:', error.response.status);
      console.error('응답 데이터:', error.response.data);
    }
  }
}

console.log('=== JWT 인증 테스트 시작 ===\n');
testJWT();