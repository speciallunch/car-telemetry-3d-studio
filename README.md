# Car Telemetry 3D Studio

실시간 자동차 텔레메트리 데이터를 3D로 시각화하는 웹 애플리케이션입니다.

## 📋 프로젝트 개요

자동차 센서 데이터를 실시간으로 수집하고 3D 환경에서 시각화하는 플랫폼입니다.
pnpm 모노레포 구조로 프론트엔드, 백엔드, 데이터베이스 패키지를 통합 관리합니다.

---

## 🏗️ 기술 스택

### Frontend

- **Next.js 16** + **React 19** - 프론트엔드 프레임워크
- **TailwindCSS 4** - 스타일링
- **TypeScript** - 타입 안정성

### Backend

- **NestJS 11** - Node.js 백엔드 프레임워크
- **Prisma 5** - ORM 및 데이터베이스 관리
- **PostgreSQL 16** - 관계형 데이터베이스

### DevOps & Infrastructure

- **Docker** & **Docker Compose** - 컨테이너화 및 오케스트레이션
- **Nginx** - 리버스 프록시
- **pnpm 9** - 패키지 매니저 (모노레포)

---

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
│   └── db/               # Prisma 스키마 및 공유 DB 패키지 (@ct/db)
│       ├── prisma/
│       │   ├── schema.prisma
│       │   └── seed.ts
│       ├── src/
│       │   └── index.ts
│       └── package.json
├── nginx/
│   └── nginx.conf        # Nginx 리버스 프록시 설정
├── .env                  # 로컬 환경 변수 (Git 미포함)
├── .env.example          # 환경 변수 템플릿 (Git 포함)
├── docker-compose.yml    # Docker Compose 설정
├── pnpm-workspace.yaml   # pnpm 워크스페이스 설정
└── package.json          # 루트 package.json (공통 스크립트)
```

---

## 🚀 시작하기

### 사전 요구사항

- **Node.js** 20 이상
- **pnpm** 9 이상 (`npm install -g pnpm@9`)
- **Docker** & **Docker Compose**

---

### ▶️ Docker로 전체 서비스 실행 (권장)

#### 1. 환경 변수 파일 생성

```bash
cp .env.example .env
```

> `.env`는 로컬 개발용입니다. Docker Compose 실행 시 API 컨테이너의 `DATABASE_URL`은
> `docker-compose.yml`의 `environment` 설정이 우선 적용됩니다 (`@postgres` 호스트명 사용).

#### 2. 전체 빌드 및 실행

```bash
docker-compose up --build
```

#### 3. 접속 주소

| 서비스                 | URL                   |
| ---------------------- | --------------------- |
| Web (Frontend)         | http://localhost/     |
| API (Backend)          | http://localhost/app  |
| pgAdmin                | http://localhost:5050 |
| PostgreSQL (직접 접속) | localhost:5432        |

> pgAdmin 로그인: `master@local.com` / `123`

---

### 💻 로컬 개발 모드 (Docker 없이)

#### 1. 의존성 설치

```bash
pnpm install
```

#### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일의 `DATABASE_URL`은 로컬에서 직접 접속하는 주소를 사용합니다:

```env
DATABASE_URL="postgresql://telemetry:telemetry_pw@127.0.0.1:5432/telemetry_db"
```

> ⚠️ `localhost` 대신 `127.0.0.1`을 사용하세요. Docker Desktop WSL 환경에서
> `localhost`는 IPv6(`::1`)로 해석될 수 있어 인증 오류가 발생할 수 있습니다.

#### 3. DB 마이그레이션 및 시드

```bash
# Prisma 클라이언트 생성
pnpm db:generate

# 마이그레이션 적용
pnpm db:migrate

# (선택) 시드 데이터 삽입
pnpm db:seed
```

#### 4. 개발 서버 실행

```bash
# 터미널 1: API 서버 (http://localhost:3000)
cd apps/api
pnpm start:dev

# 터미널 2: Web 서버 (http://localhost:3001)
cd apps/web
pnpm dev
```

---

## 🗄️ 데이터베이스

### Prisma 스키마 (`packages/db/prisma/schema.prisma`)

```prisma
generator client {
  provider      = "prisma-client-js"
  binaryTargets = ["native", "debian-openssl-1.1.x", "debian-openssl-3.0.x", "linux-musl", "linux-musl-openssl-3.0.x"]
}
```

`binaryTargets`를 명시하여 Windows 로컬 환경과 Linux(Debian/Alpine) Docker 컨테이너 모두에서
올바른 Prisma 엔진 바이너리가 사용됩니다.

### 공통 DB 스크립트 (루트에서 실행)

```bash
pnpm db:generate   # Prisma 클라이언트 생성
pnpm db:migrate    # 마이그레이션 생성 및 적용
pnpm db:seed       # 시드 데이터 삽입
pnpm db:studio     # Prisma Studio 실행 (GUI)
```

---

## 🐳 Docker 서비스 구성

### 서비스 목록

| 서비스   | 컨테이너 이름          | 호스트 포트 | 컨테이너 포트 | 설명          |
| -------- | ---------------------- | ----------- | ------------- | ------------- |
| nginx    | car-telemetry-nginx    | 80          | 80            | 리버스 프록시 |
| web      | car-telemetry-web      | 3000        | 3000          | Next.js 앱    |
| api      | car-telemetry-api      | 3001        | 3000          | NestJS 앱     |
| postgres | car-telemetry-postgres | 5432        | 5432          | PostgreSQL DB |
| pgadmin  | car-telemetry-pgadmin  | 5050        | 80            | DB 관리 도구  |

### Nginx 라우팅

| 경로   | 대상                         |
| ------ | ---------------------------- |
| `/`    | Next.js Web App (`web:3000`) |
| `/app` | NestJS API (`api:3000`)      |

### API ↔ DB 연결 구조

Docker 네트워크 내부에서 `api` 컨테이너는 `postgres` 서비스 이름으로 DB에 접근합니다.
`docker-compose.yml`의 `environment` 섹션에서 `.env`의 `DATABASE_URL`을 오버라이드합니다:

```yaml
# docker-compose.yml
api:
  env_file: .env
  environment:
    - DATABASE_URL=postgresql://telemetry:telemetry_pw@postgres:5432/telemetry_db
```

---

## 📦 모노레포 구조

**pnpm workspace** 기반 모노레포입니다:

| 패키지   | 경로          | 설명                          |
| -------- | ------------- | ----------------------------- |
| `@ct/db` | `packages/db` | 공유 Prisma 클라이언트 패키지 |
| `api`    | `apps/api`    | NestJS 백엔드 (`@ct/db` 의존) |
| `web`    | `apps/web`    | Next.js 프론트엔드            |

---

## 🔑 환경 변수

`.env.example`을 복사하여 `.env`를 생성하세요:

```env
# 로컬 개발용 DB 연결 (Docker Desktop 환경에서는 127.0.0.1 사용 권장)
DATABASE_URL="postgresql://telemetry:telemetry_pw@127.0.0.1:5432/telemetry_db"

NODE_ENV="development"

API_PORT=3000
API_HOST=localhost

NEXT_PUBLIC_API_URL="http://localhost/app"
```

> **주의:** `.env` 파일은 `.gitignore`에 포함되어 있어 Git에 커밋되지 않습니다.
> `.env.example`만 Git에 포함됩니다.

---

## �️ 트러블슈팅

### Prisma: `libssl.so.1.1: cannot open shared object file`

`apps/api/Dockerfile`의 `base` 스테이지에서 `openssl`을 설치합니다:

```dockerfile
FROM node:20-slim AS base
RUN apt-get update && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
```

`node:20-slim`(Debian 12 Bookworm)에는 Prisma가 요구하는 `openssl`이 기본 포함되지 않아 명시적으로 설치해야 합니다.

### Prisma: `Can't reach database server at localhost:5432` (컨테이너 내부)

Docker 컨테이너 내부에서 `localhost`는 컨테이너 자신을 가리킵니다.
`docker-compose.yml`에서 API의 `DATABASE_URL`을 서비스 이름(`postgres`)으로 오버라이드해야 합니다:

```yaml
environment:
  - DATABASE_URL=postgresql://telemetry:telemetry_pw@postgres:5432/telemetry_db
```

### Prisma: Authentication failed (로컬 `pnpm db:migrate`)

Docker Desktop WSL 환경에서 `localhost`가 IPv6(`::1`)로 해석될 경우 인증에 실패할 수 있습니다.
`.env`의 `DATABASE_URL` 호스트를 `127.0.0.1`로 변경하세요:

```env
DATABASE_URL="postgresql://telemetry:telemetry_pw@127.0.0.1:5432/telemetry_db"
```

### Docker 빌드 캐시 문제

```bash
docker-compose down
docker-compose up --build
```

### pnpm workspace 의존성 문제

```bash
pnpm install
```

### TypeScript에서 `process` 찾을 수 없음

```bash
pnpm --filter @ct/db add -D @types/node
```
