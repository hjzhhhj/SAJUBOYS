# 사주팔자 (SAJUBOYS)

사주팔자 계산 및 해석 웹 애플리케이션

## 주요 기능

### 인증 시스템
- JWT 기반 로그인/회원가입
- bcrypt를 사용한 비밀번호 암호화
- 토큰 기반 인증 및 세션 관리

### 사주 계산 엔진
- 천간/지지 계산
- 대운/세운 계산
- 절기 기반 월 계산
- 오행 분포 분석

### 사주 해석 시스템
- 일간 기반 성격 분석
- 직업 적성 분석
- 연애/결혼운 해석
- 재물운 분석
- 건강운 해석
- 연도별 운세 제공

### UI/UX
- 반응형 디자인
- 직관적인 입력 폼
- 시각적인 결과 표시
- 오행 분포 차트
- 대운 표시

## 기술 스택

### Frontend
- React 19
- Vite
- React Router
- Styled Components
- React DatePicker
- Axios

### Backend
- NestJS
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- TypeScript

## 설치 및 실행

### 필수 요구사항
- Node.js 18+
- MongoDB

### Backend 설정

```bash
cd backend
npm install

# 환경 변수 설정 (.env 파일)
# MONGODB_URI=mongodb://localhost:27017/sajuboys
# JWT_SECRET=your-secret-key
# PORT=3001

# 개발 서버 실행
npm run start:dev

# 프로덕션 빌드
npm run build
npm run start:prod
```

### Frontend 설정

```bash
cd frontend
npm install

# 개발 서버 실행
npm run dev

# 프로덕션 빌드
npm run build
```

## API 엔드포인트

### 인증
- `POST /api/auth/signup` - 회원가입
- `POST /api/auth/login` - 로그인

### 사주
- `POST /api/saju/calculate` - 사주 계산
- `GET /api/saju/saved` - 저장된 사주 목록 (인증 필요)
- `GET /api/saju/:id` - 특정 사주 조회 (인증 필요)

## 프로젝트 구조

```
.
├── frontend/               # React 프론트엔드
│   ├── src/
│   │   ├── pages/         # 페이지 컴포넌트
│   │   ├── context/       # Context API
│   │   ├── services/      # API 서비스
│   │   └── main.jsx       # 엔트리 포인트
│   └── package.json
│
└── backend/               # NestJS 백엔드
    ├── src/
    │   ├── auth/          # 인증 모듈
    │   ├── saju/          # 사주 모듈
    │   │   ├── utils/     # 계산/해석 유틸리티
    │   │   ├── schemas/   # MongoDB 스키마
    │   │   └── dto/       # DTO 정의
    │   └── main.ts        # 엔트리 포인트
    └── package.json
```

## 구현 완료 기능

✅ 프론트엔드 UI 구조
- 로그인/회원가입 페이지
- 사주 입력 페이지
- 결과 표시 페이지

✅ 백엔드 API
- JWT 인증 시스템
- 사주 계산 로직
- 데이터베이스 연동

✅ 사주 계산 엔진
- 천간/지지 계산
- 대운/세운 계산
- 절기 변환
- 오행 분석

✅ 사주 해석
- 성격 분석
- 직업 적성
- 연애/결혼운
- 재물운
- 건강운

## 테스트

### 회원가입 테스트
1. `/signup` 페이지에서 회원가입
2. 이름, 이메일, 비밀번호 입력
3. 회원가입 완료 후 로그인 페이지로 이동

### 로그인 테스트
1. `/login` 페이지에서 로그인
2. 등록된 이메일과 비밀번호로 로그인
3. 로그인 성공 시 사주 입력 페이지로 이동

### 사주 계산 테스트
1. 이름, 성별, 생년월일시, 출생지 입력
2. "사주팔자 확인하기" 버튼 클릭
3. 결과 페이지에서 사주 팔자 및 해석 확인

## 라이선스

MIT License
