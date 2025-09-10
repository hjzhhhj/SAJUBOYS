import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { ValidationPipe } from '@nestjs/common';

describe('Saju Load E2E Tests', () => {
  let app: INestApplication;
  let authToken: string;
  let userId: string;
  let savedSajuId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    // 테스트용 사용자 생성 및 로그인
    const testEmail = `test${Date.now()}@example.com`;
    const signupResponse = await request(app.getHttpServer())
      .post('/api/auth/signup')
      .send({
        email: testEmail,
        password: 'TestPassword123!',
        name: '테스트사용자'
      });

    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'TestPassword123!'
      });

    authToken = loginResponse.body.data.accessToken;
    userId = loginResponse.body.data.user._id;

    // 테스트용 사주 계산 및 저장
    const sajuResponse = await request(app.getHttpServer())
      .post('/api/saju/calculate')
      .set('Authorization', `Bearer ${authToken}`)
      .send({
        name: '테스트사용자',
        gender: '남',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        calendarType: '양력',
        isTimeUnknown: false,
        city: '서울',
        coordinates: {
          lat: 37.5665,
          lng: 126.9780
        }
      });

    savedSajuId = sajuResponse.body.data._id;

    // 사주 결과 저장
    await request(app.getHttpServer())
      .post(`/api/saju/${savedSajuId}/save`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(201);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /api/saju/saved', () => {
    it('인증된 사용자의 저장된 사주 목록을 반환해야 함', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/saju/saved')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('저장된 사주 결과를 가져왔습니다');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      
      const savedResult = response.body.data[0];
      expect(savedResult).toHaveProperty('_id');
      expect(savedResult).toHaveProperty('name');
      expect(savedResult).toHaveProperty('birthDate');
      expect(savedResult).toHaveProperty('fourPillars');
      expect(savedResult).toHaveProperty('interpretation');
    });

    it('인증되지 않은 요청은 401 에러를 반환해야 함', async () => {
      await request(app.getHttpServer())
        .get('/api/saju/saved')
        .expect(401);
    });

    it('잘못된 토큰으로 요청시 401 에러를 반환해야 함', async () => {
      await request(app.getHttpServer())
        .get('/api/saju/saved')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });
  });

  describe('GET /api/saju/:id', () => {
    it('특정 사주 결과를 ID로 조회할 수 있어야 함', async () => {
      const response = await request(app.getHttpServer())
        .get(`/api/saju/${savedSajuId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('사주 결과를 가져왔습니다');
      expect(response.body.data).toHaveProperty('_id', savedSajuId);
      expect(response.body.data).toHaveProperty('name', '테스트사용자');
      expect(response.body.data).toHaveProperty('fourPillars');
      expect(response.body.data.fourPillars).toHaveProperty('year');
      expect(response.body.data.fourPillars).toHaveProperty('month');
      expect(response.body.data.fourPillars).toHaveProperty('day');
      expect(response.body.data.fourPillars).toHaveProperty('time');
    });

    it('존재하지 않는 ID로 조회시 null을 반환해야 함', async () => {
      const fakeId = '507f1f77bcf86cd799439011';
      const response = await request(app.getHttpServer())
        .get(`/api/saju/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.data).toBeNull();
    });

    it('잘못된 형식의 ID로 조회시 500 에러를 반환해야 함', async () => {
      await request(app.getHttpServer())
        .get('/api/saju/invalid-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(500);
    });

    it('인증되지 않은 사용자는 사주를 조회할 수 없어야 함', async () => {
      await request(app.getHttpServer())
        .get(`/api/saju/${savedSajuId}`)
        .expect(401);
    });
  });

  describe('POST /api/saju/bulk-save', () => {
    it('여러 사주 결과를 한번에 저장할 수 있어야 함', async () => {
      // 추가 사주 계산
      const sajuResponse1 = await request(app.getHttpServer())
        .post('/api/saju/calculate')
        .send({
          name: '테스트2',
          gender: '여',
          birthDate: '1995-05-05',
          birthTime: '14:00',
          calendarType: '양력',
          isTimeUnknown: false,
          city: '부산'
        });

      const sajuResponse2 = await request(app.getHttpServer())
        .post('/api/saju/calculate')
        .send({
          name: '테스트3',
          gender: '남',
          birthDate: '2000-10-10',
          birthTime: '08:00',
          calendarType: '양력',
          isTimeUnknown: false,
          city: '대구'
        });

      const sajuIds = [
        sajuResponse1.body.data._id,
        sajuResponse2.body.data._id
      ];

      const response = await request(app.getHttpServer())
        .post('/api/saju/bulk-save')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sajuIds })
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('개의 사주 결과가 저장되었습니다');
      expect(response.body.data.modifiedCount).toBe(2);
    });
  });

  describe('DELETE /api/saju/:id', () => {
    it('저장된 사주를 삭제할 수 있어야 함', async () => {
      // 삭제할 사주 생성
      const sajuResponse = await request(app.getHttpServer())
        .post('/api/saju/calculate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '삭제테스트',
          gender: '남',
          birthDate: '1985-03-15',
          birthTime: '10:00',
          calendarType: '양력',
          isTimeUnknown: false,
          city: '인천'
        });

      const deleteId = sajuResponse.body.data._id;

      // 저장
      await request(app.getHttpServer())
        .post(`/api/saju/${deleteId}/save`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(201);

      // 삭제
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/api/saju/${deleteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe('사주 결과가 삭제되었습니다');

      // 삭제 확인
      const checkResponse = await request(app.getHttpServer())
        .get(`/api/saju/${deleteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(checkResponse.body.data).toBeNull();
    });

    it('다른 사용자의 사주는 삭제할 수 없어야 함', async () => {
      // 다른 사용자 생성
      const otherUserResponse = await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          email: `other${Date.now()}@example.com`,
          password: 'OtherPassword123!',
          name: '다른사용자'
        });

      const otherLoginResponse = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({
          email: otherUserResponse.body.data.user.email,
          password: 'OtherPassword123!'
        });

      const otherToken = otherLoginResponse.body.data.accessToken;

      // 다른 사용자가 내 사주 삭제 시도
      await request(app.getHttpServer())
        .delete(`/api/saju/${savedSajuId}`)
        .set('Authorization', `Bearer ${otherToken}`)
        .expect(200); // 삭제 시도는 성공하지만 실제로 삭제되지 않음

      // 원본 사용자가 확인
      const checkResponse = await request(app.getHttpServer())
        .get(`/api/saju/${savedSajuId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(checkResponse.body.data).not.toBeNull();
      expect(checkResponse.body.data._id).toBe(savedSajuId);
    });
  });

  describe('GET /api/saju/recent', () => {
    it('최근 계산한 사주 결과를 가져올 수 있어야 함', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/saju/recent?limit=3')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('최근 사주 결과를 가져왔습니다');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeLessThanOrEqual(3);
    });

    it('인증되지 않은 사용자도 최근 결과를 볼 수 있어야 함', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/saju/recent')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });
  });
});