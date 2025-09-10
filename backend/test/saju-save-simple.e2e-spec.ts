import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Saju Save Feature - Simple Test (e2e)', () => {
  let app: INestApplication;
  let authToken: string;
  let testEmail: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();

    // 테스트용 계정 생성 및 로그인
    testEmail = `test${Date.now()}@test.com`;

    // 회원가입
    await request(app.getHttpServer()).post('/api/auth/signup').send({
      name: '테스트유저',
      email: testEmail,
      password: 'Test1234!',
    });

    // 로그인하여 토큰 받기
    const loginResponse = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({
        email: testEmail,
        password: 'Test1234!',
      });

    authToken = loginResponse.body.data.accessToken;
    console.log('Auth token obtained:', authToken ? 'Yes' : 'No');
  });

  afterAll(async () => {
    await app.close();
  });

  it('전체 저장 플로우 테스트', async () => {
    console.log('\n=== 저장 기능 통합 테스트 시작 ===\n');

    // 1. 비로그인 상태로 사주 계산
    console.log('1. 비로그인 상태로 사주 계산...');
    const calculateResponse = await request(app.getHttpServer())
      .post('/api/saju/calculate')
      .send({
        name: '홍길동',
        gender: '남',
        birthDate: '1990-01-01',
        birthTime: '12:00',
        calendarType: '양력',
        city: '서울',
        isTimeUnknown: false,
      })
      .expect(201);

    expect(calculateResponse.body.success).toBe(true);
    expect(calculateResponse.body.data._id).toBeDefined();

    const sajuId = calculateResponse.body.data._id;
    console.log(`✓ 사주 계산 완료 (ID: ${sajuId})`);

    // 2. 인증 없이 저장 시도 (실패해야 함)
    console.log('\n2. 인증 없이 저장 시도...');
    await request(app.getHttpServer())
      .post(`/api/saju/${sajuId}/save`)
      .send({})
      .expect(401);
    console.log('✓ 인증 없이는 저장 실패 (예상대로)');

    // 3. 인증 있이 저장 시도 (성공해야 함)
    console.log('\n3. 인증 토큰으로 저장 시도...');
    const saveResponse = await request(app.getHttpServer())
      .post(`/api/saju/${sajuId}/save`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({})
      .expect(201);

    expect(saveResponse.body.success).toBe(true);
    expect(saveResponse.body.message).toBe('사주 결과가 저장되었습니다');
    console.log('✓ 저장 성공!');

    // 4. 저장된 결과 조회
    console.log('\n4. 저장된 결과 조회...');
    const savedResponse = await request(app.getHttpServer())
      .get('/api/saju/saved')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(savedResponse.body.success).toBe(true);
    expect(Array.isArray(savedResponse.body.data)).toBe(true);
    expect(savedResponse.body.data.length).toBeGreaterThan(0);
    console.log(`✓ 저장된 결과 ${savedResponse.body.data.length}개 확인`);

    // 5. 특정 결과 조회
    console.log('\n5. 특정 결과 조회...');
    const getByIdResponse = await request(app.getHttpServer())
      .get(`/api/saju/${sajuId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(getByIdResponse.body.success).toBe(true);
    expect(getByIdResponse.body.data._id).toBe(sajuId);
    console.log('✓ 특정 결과 조회 성공');

    // 6. 결과 삭제
    console.log('\n6. 결과 삭제...');
    const deleteResponse = await request(app.getHttpServer())
      .delete(`/api/saju/${sajuId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200);

    expect(deleteResponse.body.success).toBe(true);
    expect(deleteResponse.body.message).toBe('사주 결과가 삭제되었습니다');
    console.log('✓ 삭제 성공');

    console.log('\n=== 모든 테스트 통과! ===\n');
  });

  it('일괄 저장 테스트', async () => {
    console.log('\n=== 일괄 저장 테스트 시작 ===\n');

    const sajuIds: string[] = [];

    // 여러 개의 사주 계산
    for (let i = 0; i < 3; i++) {
      const response = await request(app.getHttpServer())
        .post('/api/saju/calculate')
        .send({
          name: `테스트${i}`,
          gender: i % 2 === 0 ? '남' : '여',
          birthDate: `199${i}-0${i + 1}-01`,
          birthTime: `${10 + i}:00`,
          calendarType: '양력',
          city: '서울',
          isTimeUnknown: false,
        })
        .expect(201);

      sajuIds.push(response.body.data._id);
      console.log(`✓ 사주 ${i + 1} 계산 완료`);
    }

    // 일괄 저장
    console.log('\n일괄 저장 실행...');
    const bulkSaveResponse = await request(app.getHttpServer())
      .post('/api/saju/bulk-save')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ sajuIds })
      .expect(201);

    expect(bulkSaveResponse.body.success).toBe(true);
    expect(bulkSaveResponse.body.data.modifiedCount).toBeGreaterThan(0);
    console.log(
      `✓ ${bulkSaveResponse.body.data.modifiedCount}개 일괄 저장 완료`,
    );

    console.log('\n=== 일괄 저장 테스트 완료! ===\n');
  });
});
