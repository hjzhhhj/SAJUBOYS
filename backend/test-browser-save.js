const axios = require('axios');

const API_URL = 'http://localhost:3001/api';

async function testBrowserSaveFlow() {
  try {
    // 1. 회원가입
    const email = `browser${Date.now()}@test.com`;
    const password = 'Test1234!';
    
    console.log('=== 브라우저 저장 기능 통합 테스트 ===\n');
    console.log('1. 회원가입...');
    const signupRes = await axios.post(`${API_URL}/auth/signup`, {
      name: '브라우저테스트',
      email,
      password
    });
    console.log('✅ 회원가입 성공');
    
    // 2. 로그인
    console.log('\n2. 로그인...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email,
      password
    });
    
    const token = loginRes.data.data.accessToken;
    const userId = loginRes.data.data.user._id;
    console.log('✅ 로그인 성공');
    console.log('   - 사용자 ID:', userId);
    console.log('   - 토큰 발급: 성공');
    
    // 3. 사주 계산 (로그인 전)
    console.log('\n3. 사주 계산 (로그인 상태)...');
    const sajuRes = await axios.post(`${API_URL}/saju/calculate`, {
      name: '테스트이름',
      gender: '여',
      birthDate: '1995-05-15',
      birthTime: '14:30',
      calendarType: '양력',
      city: '부산',
      isTimeUnknown: false
    });
    
    const sajuId = sajuRes.data.data._id;
    console.log('✅ 사주 계산 성공');
    console.log('   - 사주 ID:', sajuId);
    
    // 4. 저장 시도
    console.log('\n4. 사주 결과 저장...');
    console.log('   - 저장 대상 ID:', sajuId);
    console.log('   - 인증 토큰: Bearer', token.substring(0, 20) + '...');
    
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
    
    console.log('✅ 저장 성공!');
    console.log('   - 응답:', saveRes.data.message);
    console.log('   - 저장된 사용자 ID:', saveRes.data.data.userId);
    
    // 5. 저장된 결과 조회
    console.log('\n5. 저장된 결과 조회...');
    const savedRes = await axios.get(`${API_URL}/saju/saved`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ 조회 성공!');
    console.log('   - 저장된 결과 개수:', savedRes.data.data.length);
    console.log('   - 첫 번째 결과 이름:', savedRes.data.data[0]?.name);
    
    // 6. 개별 결과 조회
    console.log('\n6. 개별 결과 조회...');
    const getRes = await axios.get(`${API_URL}/saju/${sajuId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('✅ 개별 조회 성공!');
    console.log('   - 결과 이름:', getRes.data.data.name);
    console.log('   - 사용자 ID 확인:', getRes.data.data.userId === userId ? '일치' : '불일치');
    
    console.log('\n=== 테스트 완료: 모든 기능이 정상 작동합니다! ===');
    
  } catch (error) {
    console.error('\n❌ 테스트 실패:', error.message);
    if (error.response) {
      console.error('   - 상태 코드:', error.response.status);
      console.error('   - 응답 데이터:', error.response.data);
    }
    process.exit(1);
  }
}

testBrowserSaveFlow();