// ============================================================
// 학교 설정 파일 (School Configuration)
// 이 파일의 값을 학교에 맞게 변경하세요.
// Edit this file to match your school's configuration.
// ============================================================

const SCHOOL_CONFIG = {

  // 학교 기본 정보
  schoolName: '양산여자중학교',

  // 학교 로고 (선택) — 이미지 URL을 입력하면 자동 표시, 없으면 학교명 첫 글자로 배지 생성
  // 절대 경로 권장 (/logo.png) — 모든 하위 페이지에서 동일하게 작동
  schoolLogo: '/logo.png',

  // 학급 배지 옆에 표시될 부제목 (빈 문자열이면 표시 안 함)
  boardTitle: '오늘의 정보',

  // Firebase 설정 — Firebase 콘솔 > 프로젝트 설정 > 내 앱에서 발급
  firebase: {
    apiKey:            "AIzaSyArpKO-h-NdC6nQVG1aQtPTQCnNG7oiwiY",
    authDomain:        "ysgm-did.firebaseapp.com",
    projectId:         "ysgm-did",
    storageBucket:     "ysgm-did.firebasestorage.app",
    messagingSenderId: "311731688898",
    appId:             "1:311731688898:web:e9e2f876657b6ff9c7325b"
  },

  // 나이스 급식 API (https://open.neis.go.kr)
  neis: {
    schoolCode: '9151051',   // 양산여자중학교
    officeCode: 'S10'        // 교육청 코드
  },

  // 학년별 반 수 { '학년': 반수 }
  gradeClasses: {
    '1': 9,
    '2': 9,
    '3': 11
  },

  // 기본 수업 시간표 (관리자 설정에서 변경 가능)
  defaultPeriods: [
    { period: 1, start: '08:40', end: '09:25' },
    { period: 2, start: '09:35', end: '10:20' },
    { period: 3, start: '10:30', end: '11:15' },
    { period: 4, start: '11:25', end: '12:10' },
    { period: 5, start: '13:00', end: '13:45' },
    { period: 6, start: '13:55', end: '14:40' },
    { period: 7, start: '14:50', end: '15:35' },
    { period: 8, start: '15:45', end: '16:30' },
    { period: 9, start: '16:40', end: '17:25' }
  ],

  // 기본 점심 시간 (학급별 개별 설정 없을 때 사용)
  defaultLunch: { start: '12:10', end: '13:00' },

  // 초기 관리자 이메일 목록 (Firebase 콘솔에서 Google 로그인 이메일 확인)
  // 이 목록의 이메일은 teachers 컬렉션 등록 없이 자동으로 관리자 권한 부여
  adminEmails: [
    'y07eda@gmail.com',
  ],

  // 관리자 자동 가입 초대 코드
  // 본인이 신뢰하는 사람에게만 알려주세요. Google 로그인 후 이 코드를 입력하면
  // 자동으로 teachers 컬렉션에 관리자(role:admin)로 등록됩니다.
  // (한 번 등록되면 이후 로그인 시 코드 불필요)
  adminInviteCode: 'ysgm-admin-2026',

  // 예시 교실 (개발·테스트용 기본값) — 1학년 9반
  example: { grade: '1', class: '9' }
};
