# Car Telemetry 3D Studio

실시간 자동차 텔레메트리 데이터를 3D로 시각화하는 웹 애플리케이션입니다.

## 📋 프로젝트 개요

이 프로젝트는 자동차의 센서 데이터를 실시간으로 수집하고 3D 환경에서 시각화하는 플랫폼입니다. 모노레포 구조로 설계되어 프론트엔드, 백엔드, 데이터베이스가 통합 관리됩니다.

## 🏗️ 기술 스택

### Frontend
- **Next.js 16** - React 기반 프레임워크
- **TypeScript** - 타입 안정성
- **TailwindCSS** - 스타일링

### Backend
- **NestJS** - Node.js 백엔드 프레임워크
- **Prisma** - ORM 및 데이터베이스 관리
- **PostgreSQL** - 관계형 데이터베이스

### DevOps & Infrastructure
- **Docker** - 컨테이너화
- **Docker Compose** - 다중 컨테이너 오케스트레이션
- **Nginx** - 리버스 프록시
- **pnpm** - 패키지 매니저 (모노레포)

## 📁 프로젝트 구조

```
car-telemetry-3d-studio/
├── apps/
│   ├── api/              # NestJS 백엔드 API
│   │   ├── src/
│   │   ├── Dockerfile
│   │   └── package.json
│   └── web/              # Next.js 프론트엔드
│       ├── src/
│       ├── Dockerfile
│       └── package.json
├── packages/
│   └── db/               # Prisma 스키마 및 공유 DB 패키지
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── seed.ts
│       ├── src/
│       │   └── index.ts
│       └── package.json
├── nginx/
│   └── nginx.conf        # Nginx 리버스 프록시 설정
├── docker-compose.yml    # Docker Compose 설정
├── pnpm-workspace.yaml   # pnpm 워크스페이스 설정
└── package.json          # 루트 package.json
```

## 🚀 시작하기

### 사전 요구사항

- **Node.js** 20 이상
- **pnpm** 9 이상
- **Docker** & **Docker Compose**

### 설치 및 실행

#### 1. 의존성 설치

```bash
pnpm install
```

#### 2. Prisma 클라이언트 생성 및 DB 패키지 빌드

```bash
# Prisma 클라이언트 생성
pnpm --filter @ct/db prisma:generate

# @ct/db 패키지 빌드
pnpm --filter @ct/db build
```

#### 3. Docker로 전체 서비스 실행

```bash
docker-compose up --build
```

서비스가 시작되면 다음 주소로 접속할 수 있습니다:

- **Web (Frontend)**: http://localhost/
- **API (Backend)**: http://localhost/app
- **PostgreSQL**: localhost:5432
- **pgAdmin**: http://localhost:5050

### 개발 모드 실행

Docker 없이 로컬에서 개발하려면:

```bash
# 터미널 1: API 서버
cd apps/api
pnpm start:dev

# 터미널 2: Web 서버
cd apps/web
pnpm dev
```

## 🗄️ 데이터베이스

### 데이터베이스 마이그레이션

```bash
# 마이그레이션 생성 및 적용
pnpm db:migrate

# Prisma Studio 실행 (데이터베이스 GUI)
pnpm db:studio

# 시드 데이터 삽입
pnpm db:seed
```

### 환경 변수 설정

#### 🔑 `.env.example`이란?

`.env.example`은 프로젝트에 필요한 환경 변수의 **템플릿 파일**입니다.

**목적:**
1. 다른 개발자가 어떤 환경 변수가 필요한지 알 수 있음
2. Git에 올릴 수 있는 예시 파일 (실제 비밀번호나 키는 포함하지 않음)
3. 새 환경에서 프로젝트를 설정할 때 참고 문서 역할

**사용 방법:**

1. **최초 설정 시** - `.env.example`을 복사해서 `.env` 파일 생성:
   ```bash
   # Windows (Git Bash)
   cp .env.example .env
   
   # 또는 수동으로 복사
   ```

2. **`.env` 파일 수정** - 필요한 경우 실제 값으로 변경:
   ```env
   # .env 파일 (Git에 올리지 않음!)
   DATABASE_URL="postgresql://telemetry:telemetry_pw@localhost:5432/telemetry_db"
   NODE_ENV="development"
   # ... 기타 설정
   ```

3. **`.env` vs `.env.example` 차이:**
   - `.env.example`: Git에 커밋 ✅ (예시/템플릿)
   - `.env`: Git에 커밋 ❌ (실제 비밀 정보 포함, `.gitignore`에 포함됨)

> **참고:** Docker Compose를 사용하는 경우 환경 변수는 `docker-compose.yml`에 이미 설정되어 있어 별도의 `.env` 파일이 필요하지 않을 수 있습니다. 로컬 개발 환경에서만 필요합니다.

## 🐳 Docker 서비스 구성

### 서비스 목록

| 서비스 | 컨테이너 이름 | 포트 | 설명 |
|--------|---------------|------|------|
| nginx | car-telemetry-nginx | 80 | 리버스 프록시 |
| web | car-telemetry-web | 3000 (내부) | Next.js 앱 |
| api | car-telemetry-api | 3000 (내부) | NestJS 앱 |
| postgres | car-telemetry-postgres | 5432 | PostgreSQL DB |
| pgadmin | car-telemetry-pgadmin | 5050 | DB 관리 도구 |

### 라우팅

Nginx가 다음과 같이 요청을 라우팅합니다:

- `/` → Next.js Web App
- `/app` → NestJS API

## 📦 모노레포 구조

이 프로젝트는 **pnpm workspace**를 사용하는 모노레포입니다:

- `@ct/db`: 공유 데이터베이스 패키지 (Prisma Client 포함)
- `api`: NestJS 백엔드
- `web`: Next.js 프론트엔드

### 패키지 간 의존성

```
apps/api → depends on → @ct/db
apps/web → (향후 @ct/db 사용 가능)
```

## 📝 Week 1 완료 사항

### ✅ 인프라 설정
- [x] pnpm 모노레포 구조 설정
- [x] Docker 및 Docker Compose 설정
- [x] Nginx 리버스 프록시 구성

### ✅ 백엔드 (NestJS)
- [x] NestJS 프로젝트 초기화
- [x] Prisma ORM 통합
- [x] PostgreSQL 데이터베이스 연결
- [x] Prisma Service 구현
- [x] Docker 이미지 빌드 최적화

### ✅ 프론트엔드 (Next.js)
- [x] Next.js 16 프로젝트 초기화
- [x] TailwindCSS 설정
- [x] Docker 이미지 빌드 최적화

### ✅ 데이터베이스
- [x] Prisma 스키마 설계 (Vehicle 모델)
- [x] 마이그레이션 설정
- [x] 시드 데이터 생성
- [x] @ct/db 공유 패키지 생성

## 🛠️ 트러블슈팅

### TypeScript에서 `process` 찾을 수 없음

`packages/db`에 `@types/node`를 추가하세요:

```bash
pnpm --filter @ct/db add -D @types/node
```

### Docker 빌드 시 모듈을 찾을 수 없음

Docker 이미지를 완전히 재빌드하세요:

```bash
docker-compose down
docker-compose up --build
```

### pnpm workspace 의존성 문제

루트에서 다시 설치:

```bash
pnpm install
```


