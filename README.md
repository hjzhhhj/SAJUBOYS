# SAJUBOYS

사주팔자 분석 웹 애플리케이션입니다. 전체적인 사주는 사주명리학 기반으로 해석하고, 총운은 AI 기반으로 해석합니다.

## 프로젝트 개요

사용자의 생년월일시 정보를 입력받아 사주팔자를 계산하고, AI를 활용하여 상세한 사주 해석을 제공하는 풀스택 웹 애플리케이션입니다.

## 주요 기능

- 사용자 인증 (회원가입/로그인)
- 생년월일시 기반 사주팔자 계산
- AI 기반 사주 해석 및 분석
- 사주 결과 저장 및 관리
- 저장된 사주 조회 및 히스토리 관리

## 기술 스택

### Frontend
- **React 19.1.1** - UI 라이브러리
- **Vite** - 빌드 도구
- **React Router DOM** - 라우팅
- **styled-components** - CSS-in-JS 스타일링
- **framer-motion** - 애니메이션
- **recharts** - 차트 시각화
- **axios** - HTTP 클라이언트

### Backend
- **NestJS** - Node.js 프레임워크
- **MongoDB** with **Mongoose** - 데이터베이스
- **JWT** - 인증
- **Passport.js** - 인증 미들웨어
- **bcryptjs** - 비밀번호 암호화
- **Google Generative AI** - AI 분석
- **OpenAI API** - AI 분석

## 프로젝트 구조

```
四柱八字/
├── frontend/               # React 프론트엔드
│   ├── src/
│   │   ├── pages/         # 페이지 컴포넌트
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── SajuInput.jsx
│   │   │   ├── SajuResult.jsx
│   │   │   └── SavedSaju.jsx
│   │   ├── components/    # 재사용 가능한 컴포넌트
│   │   ├── context/       # React Context (Auth, Saju)
│   │   ├── services/      # API 서비스
│   │   └── constants/     # 상수 정의
│   └── package.json
│
└── backend/               # NestJS 백엔드
    ├── src/
    │   ├── auth/          # 인증 모듈
    │   ├── saju/          # 사주 계산 및 분석 모듈
    │   │   ├── dto/
    │   │   ├── schemas/
    │   │   └── utils/
    │   ├── common/        # 공통 모듈
    │   └── config/        # 설정
    └── package.json
```

## 설치 및 실행

### 사전 요구사항

- Node.js 18 이상
- MongoDB 8.x
- npm 또는 yarn

### Backend 설정

1. backend 디렉토리로 이동
```bash
cd backend
```

2. 의존성 설치
```bash
npm install
```

3. 환경 변수 설정
`.env` 파일을 생성하고 다음 내용을 입력:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
GOOGLE_API_KEY=your_google_api_key
OPENAI_API_KEY=your_openai_api_key
```

4. 서버 실행
```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run start:prod
```

Backend는 기본적으로 `http://localhost:3000`에서 실행됩니다.

### Frontend 설정

1. frontend 디렉토리로 이동
```bash
cd frontend
```

2. 의존성 설치
```bash
npm install
```

3. 개발 서버 실행
```bash
npm run dev
```

4. 프로덕션 빌드
```bash
npm run build
npm run preview
```

Frontend는 기본적으로 `http://localhost:5173`에서 실행됩니다.

## API 문서

### 인증 엔드포인트

- `POST /auth/signup` - 회원가입
- `POST /auth/login` - 로그인
- `GET /auth/profile` - 사용자 프로필 조회

### 사주 엔드포인트

- `POST /saju/calculate` - 사주 계산
- `POST /saju/analyze` - 사주 분석
- `GET /saju/saved` - 저장된 사주 목록 조회
- `POST /saju/save` - 사주 저장
- `DELETE /saju/:id` - 사주 삭제

## 개발 스크립트

### Backend
```bash
npm run start:dev      # 개발 모드 (watch mode)
npm run build          # 프로덕션 빌드
npm run lint           # 코드 린팅
npm run format         # 코드 포맷팅
```

### Frontend
```bash
npm run dev            # 개발 서버 실행
npm run build          # 프로덕션 빌드
npm run preview        # 빌드 미리보기
npm run lint           # 코드 린팅
```

## 브랜치 전략

- `main` - 프로덕션 브랜치
- `heejin` - 개발 브랜치

## 기여

이 프로젝트는 개인 프로젝트입니다.

## 라이센스

Private - UNLICENSED

## 주의사항

- AI API 키는 반드시 환경 변수로 관리하세요
- MongoDB 연결 정보는 절대 커밋하지 마세요
- `.env` 파일은 `.gitignore`에 포함되어 있습니다