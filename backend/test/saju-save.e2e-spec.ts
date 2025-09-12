import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { JwtService } from '@nestjs/jwt';

describe('SajuController - Save Feature (e2e)', () => {
  let app: INestApplication;
  let jwtService: JwtService;
  let authToken: string;
  let sajuResultId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    jwtService = moduleFixture.get<JwtService>(JwtService);
  });

  afterAll(async () => {
    await app.close();
  });

  describe('저장 기능 통합 테스트', () => {
    it('1. 회원가입', async () => {
      const signupData = {
        name: '테스트유저',
        email: `test${Date.now()}@test.com`,
        password: 'Test1234!',
      };

      const response = await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send(signupData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(signupData.email);
    });

    it('2. 로그인 및 토큰 발급', async () => {
      const loginData = {
        email: `test${Date.now()}@test.com`,
        password: 'Test1234!',
      };

      // 먼저 회원가입
      await request(app.getHttpServer())
        .post('/api/auth/signup')
        .send({
          name: '테스트유저2',
          ...loginData,
        });

      // 로그인
      const response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send(loginData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.accessToken).toBeDefined();
      expect(response.body.data.user).toBeDefined();

      authToken = response.body.data.accessToken;
    });

    it('3. 사주 계산 (로그인 상태)', async () => {
      const sajuData = {
        name: '홍길동',
        gender: '남',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        calendarType: '양력',
        city: '서울',
        isTimeUnknown: false,
      };

      const response = await request(app.getHttpServer())
        .post('/api/saju/calculate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(sajuData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBeDefined();
      expect(response.body.data.fourPillars).toBeDefined();

      sajuResultId = response.body.data._id;
    });

    it('4. 사주 계산 (비로그인 상태)', async () => {
      const sajuData = {
        name: '김철수',
        gender: '남',
        birthDate: '1985-05-05',
        birthTime: '09:30',
        calendarType: '양력',
        city: '부산',
        isTimeUnknown: false,
      };

      const response = await request(app.getHttpServer())
        .post('/api/saju/calculate')
        .send(sajuData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBeDefined();

      sajuResultId = response.body.data._id;
    });

    it('5. 결과 저장 (POST /api/saju/:id/save)', async () => {
      // 먼저 비로그인 상태로 사주 계산
      const sajuData = {
        name: '이영희',
        gender: '여',
        birthDate: '1995-03-15',
        birthTime: '14:20',
        calendarType: '양력',
        city: '대전',
        isTimeUnknown: false,
      };

      const calcResponse = await request(app.getHttpServer())
        .post('/api/saju/calculate')
        .send(sajuData)
        .expect(201);

      const tempSajuId = calcResponse.body.data._id;

      // 저장 시도 (인증 없이)
      await request(app.getHttpServer())
        .post(`/api/saju/${tempSajuId}/save`)
        .expect(401);

      // 저장 시도 (인증 있이)
      const saveResponse = await request(app.getHttpServer())
        .post(`/api/saju/${tempSajuId}/save`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(201);

      expect(saveResponse.body.success).toBe(true);
      expect(saveResponse.body.message).toBe('사주 결과가 저장되었습니다');
    });

    it('6. 저장된 결과 조회', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/saju/saved')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });

    it('7. 최근 결과 조회', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/saju/recent?limit=5')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('8. 일괄 저장', async () => {
      // 여러 개의 사주 계산
      const sajuIds: string[] = [];

      for (let i = 0; i < 3; i++) {
        const response = await request(app.getHttpServer())
          .post('/api/saju/calculate')
          .send({
            name: `테스트${i}`,
            gender: '남',
            birthDate: `199${i}-01-01`,
            birthTime: '12:00',
            calendarType: '양력',
            city: '서울',
            isTimeUnknown: false,
          })
          .expect(201);

        sajuIds.push(response.body.data._id);
      }

      // 일괄 저장
      const bulkSaveResponse = await request(app.getHttpServer())
        .post('/api/saju/bulk-save')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ sajuIds })
        .expect(201);

      expect(bulkSaveResponse.body.success).toBe(true);
      expect(bulkSaveResponse.body.data.modifiedCount).toBeGreaterThan(0);
    });

    it('9. 결과 삭제', async () => {
      // 먼저 사주 계산
      const calcResponse = await request(app.getHttpServer())
        .post('/api/saju/calculate')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          name: '삭제테스트',
          gender: '남',
          birthDate: '2000-01-01',
          birthTime: '00:00',
          calendarType: '양력',
          city: '서울',
          isTimeUnknown: false,
        })
        .expect(201);

      const deleteId = calcResponse.body.data._id;

      // 삭제
      const deleteResponse = await request(app.getHttpServer())
        .delete(`/api/saju/${deleteId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(deleteResponse.body.success).toBe(true);
      expect(deleteResponse.body.message).toBe('사주 결과가 삭제되었습니다');
    });
  });

  describe('오류 케이스 테스트', () => {
    it('유효하지 않은 토큰으로 저장 시도', async () => {
      await request(app.getHttpServer())
        .post(`/api/saju/${sajuResultId}/save`)
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);
    });

    it('존재하지 않는 결과 저장 시도', async () => {
      const fakeId = '507f1f77bcf86cd799439011';

      const response = await request(app.getHttpServer())
        .post(`/api/saju/${fakeId}/save`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({})
        .expect(500); // 또는 적절한 에러 코드

      expect(response.body.success).toBeFalsy();
    });
  });
});
