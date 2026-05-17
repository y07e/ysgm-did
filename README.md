# 학교 전자칠판 DID 시스템 (School Electronic Board DID System)

> 안드로이드 기반 전자칠판에 공지사항, 시간표, 급식 정보를 실시간으로 표시하는 오픈소스 웹 시스템

---

## 주요 기능 (Features)

| 기능 | 설명 |
|------|------|
| 📢 공지사항 슬라이드쇼 | 학교 공지를 전 교실에 실시간 동시 표시 |
| 📋 학급 게시판 | 담임교사가 자신의 반에만 공지 게시 |
| 📅 시간표 | 학급별 시간표 실시간 수정 및 즉시 반영 |
| 🍱 나이스 급식 자동 연동 | 학교 급식 정보 자동 표시 |
| 🕐 학급별 급식 시간 알림 | 반마다 다른 급식 시간 카운트다운 |
| 🚨 긴급 공지 | 특정 학년/반 또는 전교에 즉시 표시 |
| 👨‍🏫 담임 교사 권한 | 담임별 학급 게시판 독립 관리 |
| ⚙️ 수업 시간 설정 | 학교 맞춤 수업·쉬는 시간 설정 |

---

## 시스템 구조 (Architecture)

```
[관리자/담임 PC] ──→ Firebase Firestore ──→ [각 교실 전자칠판 Chrome]
     관리자 페이지                               표시 페이지
   (admin/index.html)                       (display/index.html)
```

- **백엔드 서버 불필요** — Firebase 무료 플랜으로 운영 가능
- **실시간 반영** — 저장 즉시 모든 교실에 적용
- **Chrome 브라우저** — 전자칠판 기본 설치 브라우저 그대로 사용

---

## 빠른 시작 (Quick Start)

### 1. Firebase 프로젝트 생성
1. [firebase.google.com](https://firebase.google.com) → Google 계정 로그인
2. **프로젝트 추가** → 이름 입력 → 생성
3. **Firestore Database** → 데이터베이스 만들기 → **테스트 모드**
4. **Authentication** → Sign-in method → **Google** → 사용 설정

### 2. config.js 수정
```javascript
// config.js 상단의 firebase 항목을 Firebase 콘솔 > 프로젝트 설정 > 내 앱에서 복사
firebase: {
  apiKey: "실제_API_키",
  authDomain: "프로젝트.firebaseapp.com",
  // ... 나머지 항목
}
```

학교 정보도 함께 수정:
```javascript
schoolName: '○○중학교',
neis: {
  schoolCode: '학교코드',  // open.neis.go.kr 에서 검색
  officeCode: '교육청코드'  // 예: Q10(경남), B10(서울)
},
gradeClasses: { '1': 8, '2': 8, '3': 9 }  // 학년별 반 수
```

### 3. Firebase Hosting 배포 (나이스 급식 연동 필수)
```bash
npm install -g firebase-tools
firebase login
cd school-did
firebase init hosting   # public 폴더: . (현재 디렉터리)
firebase deploy
```

### 4. 각 교실 전자칠판 설정
배포 후 받은 URL을 각 교실 Chrome에서 열기:
```
https://your-project.web.app/display/?grade=1&class=1
https://your-project.web.app/display/?grade=1&class=2
...
```
→ **F11** 전체화면 적용

---

## 전자칠판 자동 시작 설정 (Android Auto-Start)

안드로이드 기반 전자칠판에서 전원을 켜면 자동으로 표시 페이지가 열리게 하려면:

### 방법 A — Chrome 시작 페이지 설정 (권장)
1. 전자칠판 Chrome 실행
2. 오른쪽 상단 **⋮** → **설정** → **시작 시**
3. **특정 페이지 열기** 선택
4. 해당 교실 URL 입력 (예: `https://your-project.web.app/display/?grade=1&class=3`)
5. Chrome을 기본 브라우저로 설정

### 방법 B — Android 부팅 시 자동 실행
1. 전자칠판 설정 → **앱** → **Chrome**
2. **자동 시작** 또는 **부팅 시 실행** 활성화 (전자칠판 제조사마다 다름)
3. 또는 서드파티 키오스크 앱 활용 (예: *Fully Kiosk Browser*)

### 방법 C — 전자칠판 내장 DID 모드
일부 전자칠판(삼성, LG, 기타)은 자체 **DID/키오스크 모드** 탑재:
- 제조사 설정 메뉴 → **콘텐츠 재생** → URL 입력

---

## 폴더 구조 (Project Structure)

```
school-did/
├── config.js           # 🔧 학교 설정 (여기만 수정하면 됨)
├── index.html          # 메인 페이지 (교실별 URL 목록)
├── display/
│   └── index.html      # 전자칠판 표시 화면
├── admin/
│   └── index.html      # 관리자/담임 페이지
├── firestore.rules     # Firestore 보안 규칙
└── firebase.json       # Firebase Hosting 설정
```

---

## 역할 구분 (Roles)

| 역할 | 권한 |
|------|------|
| **관리자** | 모든 기능 (공지, 시간표, 긴급공지, 설정, 교사 관리) |
| **담임교사** | 자신의 학급 게시판만 관리 |

관리자 페이지 → **교사 관리** 탭에서 교사 이메일 등록 후 역할 지정.

---

## 나이스 학교 코드 조회

[https://open.neis.go.kr/hub/schoolInfo](https://open.neis.go.kr/hub/schoolInfo) 에서 학교명 검색  
또는 아래 URL로 직접 조회:
```
https://open.neis.go.kr/hub/schoolInfo?Type=json&SCHUL_NM=학교이름
```

---

## 라이선스 (License)

MIT License — 자유롭게 사용, 수정, 배포 가능합니다.  
학교 현장에서 유용하게 활용되길 바랍니다. 🏫

---

## 제작 (Made by)

경남 양산여자중학교  
기여·개선 제안은 Issues 또는 Pull Request로 환영합니다.
