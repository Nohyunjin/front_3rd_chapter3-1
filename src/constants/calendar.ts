// 달력 관련 상수
export const WEEK_DAYS = ['일', '월', '화', '수', '목', '금', '토'] as const;

// 이벤트 카테고리
export const CATEGORIES = ['업무', '개인', '가족', '기타'] as const;
export type Category = (typeof CATEGORIES)[number];

// 알림 설정 옵션
export const NOTIFICATION_OPTIONS = [
  { value: 1, label: '1분 전' },
  { value: 10, label: '10분 전' },
  { value: 60, label: '1시간 전' },
  { value: 120, label: '2시간 전' },
  { value: 1440, label: '1일 전' },
] as const;

// 반복 유형
export const REPEAT_TYPES = {
  NONE: 'none',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  YEARLY: 'yearly',
} as const;

export type RepeatType = (typeof REPEAT_TYPES)[keyof typeof REPEAT_TYPES];
