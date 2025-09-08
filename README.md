# 🔮 SAJUBOYS - 사주팔자 운세 서비스

> **당신의 운명을 읽어드립니다** - AI 기반 사주팔자 분석 플랫폼

[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)](https://reactjs.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.0-E0234E?logo=nestjs)](https://nestjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript)](https://www.typescriptlang.org/)

## 📖 프로젝트 소개

SAJUBOYS는 전통 사주명리학을 현대적으로 재해석한 웹 기반 운세 서비스입니다. 정확한 천문학적 계산과 전통 명리학 이론을 결합하여 개인 맞춤형 운세 분석을 제공합니다.

### ✨ 핵심 기능

- 🎯 **정밀 사주 계산** - 절기 기반 정확한 사주팔자 계산
- 📊 **종합 운세 분석** - 성격, 직업, 연애, 재물, 건강 등 다각도 해석
- 📈 **시각화 데이터** - 오행 분포도 및 대운 차트 제공
- 🔐 **개인정보 보호** - JWT 기반 안전한 인증 시스템
- 📱 **반응형 디자인** - 모바일/데스크톱 최적화 UI

## 🚀 Quick Start

### Prerequisites

- Node.js 18.0 이상
- MongoDB 6.0 이상
- npm 또는 yarn

### Installation

```bash
# 저장소 클론
git clone https://github.com/hjzhhhj/sajuboys.git
cd sajuboys

# 백엔드 설정
cd backend
npm install
cp .env.example .env  # 환경변수 설정

# 프론트엔드 설정
cd ../frontend
npm install
```

### Environment Setup

백엔드 `.env` 파일 설정:

```env
MONGODB_URI=mongodb://localhost:27017/sajuboys
JWT_SECRET=your-secure-secret-key-here
JWT_EXPIRES_IN=7d
PORT=3001
NODE_ENV=development
```

### Running the Application

```bash
# 백엔드 서버 실행 (터미널 1)
cd backend
npm run start:dev

# 프론트엔드 서버 실행 (터미널 2)
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Docs: http://localhost:3001/api-docs

## 🏗️ Architecture

### Tech Stack

#### Frontend

- **Framework**: React 19 + Vite
- **Routing**: React Router v6
- **Styling**: Styled Components
- **State Management**: Context API
- **HTTP Client**: Axios
- **UI Components**: Custom Components + React DatePicker

#### Backend

- **Framework**: NestJS 10
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT + Passport
- **Security**: bcrypt, helmet, cors
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI

### Project Structure

```
sajuboys/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/          # 페이지 컴포넌트
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── SignupPage.jsx
│   │   │   ├── SajuInputPage.jsx
│   │   │   └── ResultPage.jsx
│   │   ├── context/        # 전역 상태 관리
│   │   │   └── AuthContext.jsx
│   │   ├── services/       # API 통신
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── backend/
    ├── src/
    │   ├── auth/           # 인증 모듈
    │   │   ├── auth.controller.ts
    │   │   ├── auth.service.ts
    │   │   ├── auth.module.ts
    │   │   ├── jwt.strategy.ts
    │   │   └── dto/
    │   ├── saju/           # 사주 계산 모듈
    │   │   ├── saju.controller.ts
    │   │   ├── saju.service.ts
    │   │   ├── saju.module.ts
    │   │   ├── schemas/
    │   │   ├── dto/
    │   │   └── utils/     # 계산 로직
    │   │       ├── sajuCalculator.ts
    │   │       ├── interpretations.ts
    │   │       └── elements.ts
    │   ├── app.module.ts
    │   └── main.ts
    └── package.json
```

## 📡 API Documentation

### Authentication Endpoints

| Method | Endpoint            | Description    |
| ------ | ------------------- | -------------- |
| POST   | `/api/auth/signup`  | 회원가입       |
| POST   | `/api/auth/login`   | 로그인         |
| POST   | `/api/auth/logout`  | 로그아웃       |
| GET    | `/api/auth/profile` | 프로필 조회 🔒 |

### Saju Endpoints

| Method | Endpoint              | Description         |
| ------ | --------------------- | ------------------- |
| POST   | `/api/saju/calculate` | 사주 계산           |
| GET    | `/api/saju/saved`     | 저장된 사주 목록 🔒 |
| GET    | `/api/saju/:id`       | 특정 사주 조회 🔒   |
| DELETE | `/api/saju/:id`       | 사주 삭제 🔒        |

🔒 = 인증 필요

### Request/Response Examples

#### 사주 계산 요청

```json
POST /api/saju/calculate
{
  "name": "홍길동",
  "gender": "male",
  "birthDate": "1990-01-01",
  "birthTime": "14:30",
  "birthPlace": "서울",
  "isLunar": false
}
```

#### 응답 예시

```json
{
  "fourPillars": {
    "year": { "heavenly": "경", "earthly": "오" },
    "month": { "heavenly": "무", "earthly": "자" },
    "day": { "heavenly": "갑", "earthly": "인" },
    "hour": { "heavenly": "신", "earthly": "미" }
  },
  "elements": {
    "wood": 2,
    "fire": 1,
    "earth": 3,
    "metal": 1,
    "water": 1
  },
  "interpretation": {
    "personality": "...",
    "career": "...",
    "love": "...",
    "wealth": "...",
    "health": "..."
  }
}
```

## 🧪 Testing

```bash
# 백엔드 테스트
cd backend
npm run test        # 유닛 테스트
npm run test:e2e    # E2E 테스트
npm run test:cov    # 커버리지 리포트

# 프론트엔드 테스트
cd frontend
npm run test        # 컴포넌트 테스트
```

## 📦 Deployment

### Production Build

```bash
# 백엔드 빌드
cd backend
npm run build
npm run start:prod

# 프론트엔드 빌드
cd frontend
npm run build
npm run preview
```

### Docker Deployment

```bash
# Docker Compose로 전체 스택 실행
docker-compose up -d

# 개별 서비스 빌드
docker build -t sajuboys-backend ./backend
docker build -t sajuboys-frontend ./frontend
```

## 🔧 Configuration

### MongoDB Indexes

```javascript
// 권장 인덱스 설정
db.users.createIndex({ email: 1 }, { unique: true });
db.sajus.createIndex({ userId: 1, createdAt: -1 });
```

### Nginx Configuration (Production)

```nginx
server {
    listen 80;
    server_name sajuboys.com;

    location / {
        root /var/www/sajuboys/frontend;
        try_files $uri /index.html;
    }

    location /api {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Commit Convention

- `feat:` 새로운 기능 추가
- `fix:` 버그 수정
- `docs:` 문서 수정
- `style:` 코드 포맷팅
- `refactor:` 코드 리팩토링
- `test:` 테스트 코드
- `chore:` 빌드 업무 수정

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Backend Development**: NestJS, MongoDB, JWT Authentication
- **Frontend Development**: React, Styled Components, UX Design
- **Saju Algorithm**: 천문학적 계산, 명리학 해석 로직

## 📞 Contact

- Email: jhj090120@gmail.com
- Issues: [GitHub Issues](https://github.com/hjzhhhj/sajuboys/issues)
